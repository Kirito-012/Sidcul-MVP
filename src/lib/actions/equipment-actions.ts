"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import type { ActionState } from "@/lib/constants";
import { EQUIPMENT_CATEGORIES } from "@/lib/constants";

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function createEquipmentAction(
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
      error: "Your company must be verified by an admin before listing equipment.",
    };
  }

  const name = str(formData, "name");
  const description = str(formData, "description");
  const location = str(formData, "location");
  const category = str(formData, "category");
  const rate = str(formData, "rate");

  if (!name) return { error: "Equipment name is required." };
  if (!description) return { error: "Description is required." };
  if (!location) return { error: "Location is required." };
  if (category && !(EQUIPMENT_CATEGORIES as readonly string[]).includes(category)) {
    return { error: "Choose a valid category." };
  }

  await prisma.equipment.create({
    data: {
      companyId: company.id,
      name,
      description,
      location,
      category: category || null,
      rate: rate || null,
      status: "LISTED",
    },
  });

  revalidatePath("/company/equipment");
  revalidatePath("/equipment");
  redirect("/company/equipment");
}

/** Toggle equipment between LISTED and UNLISTED. Used directly as a <form> action. */
export async function setEquipmentStatusAction(formData: FormData): Promise<void> {
  const session = await requireRole("COMPANY");
  const equipmentId = str(formData, "equipmentId");
  const status = str(formData, "status") === "LISTED" ? "LISTED" : "UNLISTED";

  const company = await prisma.companyProfile.findUnique({
    where: { userId: session.userId },
  });
  const equipment = await prisma.equipment.findUnique({ where: { id: equipmentId } });
  if (!company || !equipment || equipment.companyId !== company.id) return;

  await prisma.equipment.update({ where: { id: equipmentId }, data: { status } });
  revalidatePath("/company/equipment");
  revalidatePath("/equipment");
}

/** A company requests to lease another company's equipment. Used with useActionState. */
export async function createLeaseRequestAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireRole("COMPANY");
  const company = await prisma.companyProfile.findUnique({
    where: { userId: session.userId },
  });
  if (!company) return { error: "Company profile not found." };
  if (!company.verified) {
    return { error: "Your company must be verified before requesting equipment." };
  }

  const equipmentId = str(formData, "equipmentId");
  const startStr = str(formData, "startDate");
  const endStr = str(formData, "endDate");
  const message = str(formData, "message") || null;
  if (!equipmentId) return { error: "Missing equipment." };

  const equipment = await prisma.equipment.findUnique({
    where: { id: equipmentId },
    include: { company: true },
  });
  if (!equipment || equipment.status !== "LISTED" || !equipment.company.verified) {
    return { error: "This equipment is no longer available for lease." };
  }
  if (equipment.companyId === company.id) {
    return { error: "You can't request to lease your own equipment." };
  }

  const startDate = new Date(startStr);
  const endDate = new Date(endStr);
  if (!startStr || !endStr || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return { error: "Choose a valid start and end date." };
  }
  if (endDate <= startDate) {
    return { error: "End date must be after the start date." };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (startDate < today) {
    return { error: "Start date can't be in the past." };
  }

  await prisma.leaseRequest.create({
    data: {
      equipmentId,
      requesterId: company.id,
      startDate,
      endDate,
      message,
      status: "PENDING",
    },
  });

  revalidatePath(`/equipment/${equipmentId}`);
  revalidatePath("/company/leases");
  return { success: true };
}

/**
 * The equipment owner accepts or rejects a pending lease request. Used with
 * useActionState so a date-overlap conflict on accept can be shown to the user.
 */
export async function updateLeaseRequestStatusAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireRole("COMPANY");
  const leaseRequestId = str(formData, "leaseRequestId");
  const status = str(formData, "status");
  if (status !== "ACCEPTED" && status !== "REJECTED") {
    return { error: "Invalid action." };
  }

  const company = await prisma.companyProfile.findUnique({
    where: { userId: session.userId },
  });
  if (!company) return { error: "Company profile not found." };

  const leaseRequest = await prisma.leaseRequest.findUnique({
    where: { id: leaseRequestId },
    include: { equipment: true },
  });
  if (!leaseRequest || leaseRequest.equipment.companyId !== company.id) {
    return { error: "Request not found." };
  }
  if (leaseRequest.status !== "PENDING") {
    return { error: "This request has already been handled." };
  }

  if (status === "ACCEPTED") {
    const conflict = await prisma.leaseRequest.findFirst({
      where: {
        equipmentId: leaseRequest.equipmentId,
        status: "ACCEPTED",
        id: { not: leaseRequest.id },
        startDate: { lt: leaseRequest.endDate },
        endDate: { gt: leaseRequest.startDate },
      },
    });
    if (conflict) {
      return {
        error: "These dates overlap with an already-accepted booking for this equipment.",
      };
    }
  }

  await prisma.leaseRequest.update({
    where: { id: leaseRequestId },
    data: { status },
  });

  revalidatePath(`/company/equipment/${leaseRequest.equipmentId}`);
  revalidatePath("/company/leases");
  return { success: true };
}

/** The requester cancels their own pending lease request. Used directly as a <form> action. */
export async function cancelLeaseRequestAction(formData: FormData): Promise<void> {
  const session = await requireRole("COMPANY");
  const leaseRequestId = str(formData, "leaseRequestId");

  const company = await prisma.companyProfile.findUnique({
    where: { userId: session.userId },
  });
  if (!company) return;

  const leaseRequest = await prisma.leaseRequest.findUnique({
    where: { id: leaseRequestId },
  });
  if (
    !leaseRequest ||
    leaseRequest.requesterId !== company.id ||
    leaseRequest.status !== "PENDING"
  ) {
    return;
  }

  await prisma.leaseRequest.update({
    where: { id: leaseRequestId },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/company/leases");
  revalidatePath(`/company/equipment/${leaseRequest.equipmentId}`);
}
