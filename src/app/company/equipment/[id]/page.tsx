import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { LEASE_STATUS_LABELS } from "@/lib/constants";
import LeaseRequestActions from "@/components/forms/LeaseRequestActions";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  ACCEPTED: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
  CANCELLED: "bg-slate-100 text-slate-500",
};

export default async function EquipmentLeaseRequestsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireRole("COMPANY");

  const company = await prisma.companyProfile.findUnique({
    where: { userId: session.userId },
  });

  const equipment = await prisma.equipment.findUnique({
    where: { id },
    include: {
      leaseRequests: {
        orderBy: { createdAt: "desc" },
        include: { requester: true },
      },
    },
  });

  // Only the owning company may view lease requests.
  if (!equipment || !company || equipment.companyId !== company.id) notFound();

  const dateFmt = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <Link href="/company/equipment" className="text-sm text-muted hover:text-brand">
        ← Back to equipment
      </Link>

      <div className="mt-4">
        <h1 className="text-2xl font-bold text-ink">{equipment.name}</h1>
        <p className="mt-1 text-sm text-muted">
          {equipment.location} · {equipment.leaseRequests.length} request
          {equipment.leaseRequests.length === 1 ? "" : "s"}
        </p>
      </div>

      {equipment.leaseRequests.length === 0 ? (
        <div className="card mt-6 p-10 text-center text-muted">
          No lease requests yet. Share this listing with other SIDCUL companies.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {equipment.leaseRequests.map((req) => (
            <div key={req.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/companies/${req.requesterId}`}
                    className="font-semibold text-ink hover:text-brand hover:underline"
                  >
                    {req.requester.companyName}
                  </Link>
                  <p className="text-sm text-muted">
                    {dateFmt.format(req.startDate)} → {dateFmt.format(req.endDate)}
                  </p>
                </div>

                <span
                  className={`badge ${STATUS_STYLES[req.status] ?? "bg-slate-100 text-slate-600"}`}
                >
                  {LEASE_STATUS_LABELS[req.status] ?? req.status}
                </span>
              </div>

              {req.message && (
                <div className="mt-3 rounded-lg bg-canvas p-3 text-sm text-ink-700">
                  <span className="font-medium">Message: </span>
                  {req.message}
                </div>
              )}

              {req.status === "PENDING" && (
                <div className="mt-4 flex justify-end">
                  <LeaseRequestActions leaseRequestId={req.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
