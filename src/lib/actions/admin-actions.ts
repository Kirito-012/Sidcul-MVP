"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

/** Admin verifies / un-verifies a company. Used directly as a <form> action. */
export async function setCompanyVerifiedAction(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");
  const companyId = String(formData.get("companyId") ?? "");
  const verified = String(formData.get("verified") ?? "") === "true";
  if (!companyId) return;

  await prisma.companyProfile.update({
    where: { id: companyId },
    data: { verified },
  });
  revalidatePath("/admin");
  revalidatePath("/jobs");
}
