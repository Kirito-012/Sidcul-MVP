"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { uploadFileToCloudinary } from "@/lib/cloudinary";
import { EMAIL_RE, INDIAN_PHONE_RE, type ActionState } from "@/lib/constants";

const MAX_IMAGE_BYTES = 6 * 1024 * 1024; // 6 MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_ABOUT_LENGTH = 2000;

/** Normalise a user-typed URL: add https:// if no scheme, else keep as-is. */
function normalizeWebsite(raw: string): string {
  if (!raw) return "";
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

/** Normalise an Indian mobile to +91XXXXXXXXXX. Returns "" if empty. */
function normalizeIndianPhone(raw: string): string | null {
  const digits = raw.replace(/[\s-]/g, "");
  if (!digits) return "";
  if (!INDIAN_PHONE_RE.test(digits)) return null;
  return `+91${digits.replace(/^(?:\+91|91|0)/, "")}`;
}

async function maybeUpload(
  formData: FormData,
  key: string,
): Promise<string | null | undefined> {
  const file = formData.get(key);
  // `undefined` → field not submitted, keep whatever is stored.
  if (!(file instanceof File) || file.size === 0) return undefined;
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Each image must be smaller than 6 MB.");
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Images must be JPG, PNG or WebP.");
  }
  const uploaded = await uploadFileToCloudinary(file, {
    folder: "sidcul/company-media",
    kind: "image",
  });
  return uploaded.url;
}

/**
 * Company dashboard: edit the public "About" blurb and upload / replace the
 * profile logo and up to two gallery images. Each media field is optional per
 * submission — only the files actually provided are re-uploaded; the rest keep
 * their stored value.
 */
export async function updateCompanyMediaAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireRole("COMPANY");
  const company = await prisma.companyProfile.findUnique({
    where: { userId: session.userId },
  });
  if (!company) return { error: "Company profile not found." };

  const about = String(formData.get("about") ?? "").trim();
  if (about.length > MAX_ABOUT_LENGTH) {
    return { error: `About must be ${MAX_ABOUT_LENGTH} characters or fewer.` };
  }

  const website = normalizeWebsite(String(formData.get("website") ?? "").trim());

  const whatsappNumber = normalizeIndianPhone(
    String(formData.get("whatsappNumber") ?? "").trim(),
  );
  if (whatsappNumber === null) {
    return { error: "Enter a valid Indian WhatsApp number (10 digits), or leave it blank." };
  }

  const contactEmail = String(formData.get("contactEmail") ?? "")
    .trim()
    .toLowerCase();
  if (contactEmail && !EMAIL_RE.test(contactEmail)) {
    return { error: "Enter a valid contact email, or leave it blank." };
  }

  const mapUrl = normalizeWebsite(String(formData.get("mapUrl") ?? "").trim());
  if (mapUrl && !/^https:\/\/(www\.)?(google\.[a-z.]+\/maps|maps\.google\.[a-z.]+|maps\.app\.goo\.gl|goo\.gl\/maps)/i.test(mapUrl)) {
    return {
      error: "Paste a Google Maps link (from Share → Copy link), or leave it blank.",
    };
  }

  let logoUrl: string | null | undefined;
  let galleryImage1Url: string | null | undefined;
  let galleryImage2Url: string | null | undefined;

  try {
    [logoUrl, galleryImage1Url, galleryImage2Url] = await Promise.all([
      maybeUpload(formData, "logo"),
      maybeUpload(formData, "gallery1"),
      maybeUpload(formData, "gallery2"),
    ]);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Upload failed." };
  }

  // Explicit "remove" checkboxes let a company clear an existing image.
  const clear = (key: string) => formData.get(key) === "on";

  await prisma.companyProfile.update({
    where: { id: company.id },
    data: {
      about: about || null,
      website: website || null,
      whatsappNumber: whatsappNumber || null,
      contactEmail: contactEmail || null,
      mapUrl: mapUrl || null,
      logoUrl: clear("removeLogo") ? null : logoUrl,
      galleryImage1Url: clear("removeGallery1") ? null : galleryImage1Url,
      galleryImage2Url: clear("removeGallery2") ? null : galleryImage2Url,
    },
  });

  revalidatePath("/company");
  if (company.directoryCompanyId) {
    const linked = await prisma.directoryCompany.findUnique({
      where: { id: company.directoryCompanyId },
      select: { slug: true },
    });
    if (linked) revalidatePath(`/directory/${linked.slug}`);
  }

  return { success: true };
}
