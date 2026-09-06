"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  createSession,
  destroySession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import { GST_RE, INDIAN_PHONE_RE, OTHER_SECTOR_VALUE, type ActionState, type Role } from "@/lib/constants";
import { uploadFileToCloudinary } from "@/lib/cloudinary";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function registerAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const role = str(formData, "role") as Role;
  const name = str(formData, "name");
  const email = str(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (role !== "STUDENT" && role !== "COMPANY") {
    return { error: "Please choose an account type." };
  }
  if (!name) return { error: "Name is required." };
  if (!EMAIL_RE.test(email)) return { error: "Enter a valid email address." };
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const companyName = str(formData, "companyName");
  const rawSector = str(formData, "sector");
  const sectorOther = str(formData, "sectorOther");
  const location = str(formData, "location");
  const phoneRaw = str(formData, "phone");
  const gstNumber = str(formData, "gstNumber").toUpperCase();
  const emDocument = formData.get("emDocument");

  let sector = rawSector;
  let phone: string | null = null;

  if (role === "COMPANY") {
    if (!companyName) return { error: "Company name is required." };

    if (rawSector === OTHER_SECTOR_VALUE) {
      if (!sectorOther) return { error: "Please describe your sector." };
      sector = sectorOther;
    }

    const phoneDigits = phoneRaw.replace(/[\s-]/g, "");
    if (!INDIAN_PHONE_RE.test(phoneDigits)) {
      return { error: "Enter a valid Indian mobile number (10 digits)." };
    }
    phone = `+91${phoneDigits.replace(/^(?:\+91|91|0)/, "")}`;

    if (gstNumber && !GST_RE.test(gstNumber)) {
      return { error: "Enter a valid 15-character GSTIN, or leave it blank." };
    }
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  // Upload the EM / Udyam document to Cloudinary before creating the account
  // so the URL can be stored on the profile in one write.
  let emDocumentUrl: string | null = null;
  if (role === "COMPANY" && emDocument instanceof File && emDocument.size > 0) {
    if (emDocument.size > 8 * 1024 * 1024) {
      return { error: "Document is too large (max 8 MB)." };
    }
    try {
      const uploaded = await uploadFileToCloudinary(emDocument, {
        folder: "sidcul/em-documents",
        kind: "auto",
      });
      emDocumentUrl = uploaded.url;
    } catch {
      return { error: "Could not upload the document. Please try again." };
    }
  }

  const passwordHash = await hashPassword(password);

  const user =
    role === "COMPANY"
      ? await prisma.user.create({
          data: {
            email,
            passwordHash,
            role: "COMPANY",
            name,
            companyProfile: {
              create: {
                companyName,
                sector: sector || null,
                location: location || null,
                phone,
                gstNumber: gstNumber || null,
                emDocumentUrl,
                verified: false,
              },
            },
          },
        })
      : await prisma.user.create({
          data: {
            email,
            passwordHash,
            role: "STUDENT",
            name,
            studentProfile: { create: { fullName: name } },
          },
        });

  await createSession({
    userId: user.id,
    role: user.role as Role,
    name: user.name,
    email: user.email,
  });

  redirect(role === "COMPANY" ? "/company" : "/jobs");
}

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = str(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Invalid email or password." };
  }

  await createSession({
    userId: user.id,
    role: user.role as Role,
    name: user.name,
    email: user.email,
  });

  redirect(
    user.role === "ADMIN"
      ? "/admin"
      : user.role === "COMPANY"
        ? "/company"
        : "/jobs",
  );
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}
