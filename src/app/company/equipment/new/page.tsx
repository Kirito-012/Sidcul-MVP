import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import PostEquipmentForm from "@/components/forms/PostEquipmentForm";

export default async function NewEquipmentPage() {
  const session = await requireRole("COMPANY");
  const company = await prisma.companyProfile.findUnique({
    where: { userId: session.userId },
  });

  // Unverified companies cannot reach the listing form.
  if (!company?.verified) redirect("/company/equipment");

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <Link href="/company/equipment" className="text-sm text-muted hover:text-brand">
        ← Back to equipment
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-ink">List equipment for lease</h1>
      <p className="mt-1 text-sm text-muted">
        Listing as <span className="font-medium">{company.companyName}</span>.
      </p>

      <div className="card mt-6 p-6">
        <PostEquipmentForm />
      </div>
    </div>
  );
}
