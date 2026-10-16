"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createSession, requireRole } from "@/lib/auth";
import { INDIAN_PHONE_RE, type ActionState } from "@/lib/constants";
import { uploadFileToCloudinary } from "@/lib/cloudinary";

const AADHAAR_MAX_BYTES = 1024 * 1024; // 1 MB

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

/** Job seeker updates their own profile. Used with useActionState. */
export async function updateProfileAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireRole("STUDENT");

  const fullName = str(formData, "fullName");
  const phoneRaw = str(formData, "phone");
  const education = str(formData, "education");
  const skills = str(formData, "skills");
  const location = str(formData, "location");
  const experience = str(formData, "experience");
  const about = str(formData, "about");

  if (!fullName) return { error: "Full name is required." };
  if (fullName.length > 100) return { error: "Name is too long." };
  if (about.length > 1000) return { error: "About must be under 1000 characters." };
  if (experience.length > 1000) return { error: "Experience must be under 1000 characters." };
  if (skills.length > 500) return { error: "Skills must be under 500 characters." };

  let phone: string | null = null;
  if (phoneRaw) {
    const digits = phoneRaw.replace(/[\s-]/g, "");
    if (!INDIAN_PHONE_RE.test(digits)) {
      return { error: "Enter a valid Indian mobile number (10 digits)." };
    }
    phone = `+91${digits.replace(/^(?:\+91|91|0)/, "")}`;
  }

  // Optional replacement Aadhaar PDF (front + back, max 1 MB).
  let aadhaarDocumentUrl: string | undefined;
  const file = formData.get("aadhaarDocument");
  if (file instanceof File && file.size > 0) {
    if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
      return { error: "Aadhaar must be a PDF file." };
    }
    if (file.size > AADHAAR_MAX_BYTES) {
      return { error: "Aadhaar PDF must be under 1 MB." };
    }
    try {
      aadhaarDocumentUrl = (
        await uploadFileToCloudinary(file, {
          folder: "sidcul/aadhaar-documents",
          kind: "auto",
        })
      ).url;
    } catch {
      return { error: "Could not upload your Aadhaar. Please try again." };
    }
  }

  const data = {
    fullName,
    phone,
    education: education || null,
    skills: skills || null,
    location: location || null,
    experience: experience || null,
    about: about || null,
  };

  await prisma.$transaction([
    prisma.user.update({ where: { id: session.userId }, data: { name: fullName } }),
    prisma.studentProfile.upsert({
      where: { userId: session.userId },
      update: { ...data, ...(aadhaarDocumentUrl && { aadhaarDocumentUrl }) },
      create: { userId: session.userId, ...data, aadhaarDocumentUrl },
    }),
  ]);

  // The session cookie carries the display name; refresh it.
  await createSession({ ...session, name: fullName });

  revalidatePath("/student", "layout");
  return { success: true };
}
