"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  createSession,
  destroySession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import type { ActionState, Role } from "@/lib/constants";

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
  const sector = str(formData, "sector");
  const location = str(formData, "location");
  if (role === "COMPANY" && !companyName) {
    return { error: "Company name is required." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
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
