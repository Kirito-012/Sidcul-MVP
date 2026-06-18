"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import type { ActionState } from "@/lib/constants";
import { JOB_TYPE_LABELS } from "@/lib/constants";

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function createJobAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireRole("COMPANY");
  const company = await prisma.companyProfile.findUnique({
    where: { userId: session.userId },
  });
  if (!company) return { error: "Company profile not found." };
  if (!company.verified) {
    return {
      error: "Your company must be verified by an admin before posting jobs.",
    };
  }

  const title = str(formData, "title");
  const description = str(formData, "description");
  const location = str(formData, "location");
  const jobType = str(formData, "jobType");
  const salary = str(formData, "salary");

  if (!title) return { error: "Job title is required." };
  if (!description) return { error: "Job description is required." };
  if (!location) return { error: "Location is required." };
  if (!JOB_TYPE_LABELS[jobType]) return { error: "Choose a valid job type." };

  await prisma.job.create({
    data: {
      companyId: company.id,
      title,
      description,
      location,
      jobType,
      sector: company.sector,
      salary: salary || null,
      status: "OPEN",
    },
  });

  revalidatePath("/company");
  revalidatePath("/jobs");
  redirect("/company");
}

/** Toggle a job between OPEN and CLOSED. Used directly as a <form> action. */
export async function setJobStatusAction(formData: FormData): Promise<void> {
  const session = await requireRole("COMPANY");
  const jobId = str(formData, "jobId");
  const status = str(formData, "status") === "OPEN" ? "OPEN" : "CLOSED";

  const company = await prisma.companyProfile.findUnique({
    where: { userId: session.userId },
  });
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!company || !job || job.companyId !== company.id) return;

  await prisma.job.update({ where: { id: jobId }, data: { status } });
  revalidatePath("/company");
  revalidatePath("/jobs");
}

/** Student applies to a job. Used with useActionState. */
export async function applyAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireRole("STUDENT");
  const jobId = str(formData, "jobId");
  const coverNote = str(formData, "coverNote") || null;
  if (!jobId) return { error: "Missing job." };

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job || job.status !== "OPEN") {
    return { error: "This job is no longer open for applications." };
  }

  try {
    await prisma.application.create({
      data: { jobId, applicantId: session.userId, coverNote },
    });
  } catch {
    return { error: "You have already applied to this job." };
  }

  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/student");
  return { success: true };
}

/** Company updates an applicant's status. Used directly as a <form> action. */
export async function updateApplicationStatusAction(
  formData: FormData,
): Promise<void> {
  const session = await requireRole("COMPANY");
  const applicationId = str(formData, "applicationId");
  const status = str(formData, "status");
  const allowed = ["APPLIED", "REVIEWED", "SHORTLISTED", "REJECTED"];
  if (!allowed.includes(status)) return;

  const company = await prisma.companyProfile.findUnique({
    where: { userId: session.userId },
  });
  if (!company) return;

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { job: true },
  });
  if (!application || application.job.companyId !== company.id) return;

  await prisma.application.update({
    where: { id: applicationId },
    data: { status },
  });
  revalidatePath(`/company/jobs/${application.jobId}`);
}
