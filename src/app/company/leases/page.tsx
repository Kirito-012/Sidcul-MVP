import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { LEASE_STATUS_LABELS } from "@/lib/constants";
import { cancelLeaseRequestAction } from "@/lib/actions/equipment-actions";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  ACCEPTED: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
  CANCELLED: "bg-slate-100 text-slate-500",
};

export default async function MyLeaseRequestsPage() {
  const session = await requireRole("COMPANY");

  const company = await prisma.companyProfile.findUnique({
    where: { userId: session.userId },
  });

  if (!company) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-10">
        <p className="text-muted">Company profile not found.</p>
      </div>
    );
  }

  const leaseRequests = await prisma.leaseRequest.findMany({
    where: { requesterId: company.id },
    include: { equipment: { include: { company: true } } },
    orderBy: { createdAt: "desc" },
  });

  const dateFmt = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">My lease requests</h1>
          <p className="mt-1 text-sm text-muted">
            Track the status of equipment you&apos;ve requested to lease.
          </p>
        </div>
        <Link href="/equipment" className="btn btn-primary">
          Browse equipment
        </Link>
      </div>

      {leaseRequests.length === 0 ? (
        <div className="card mt-8 p-10 text-center">
          <p className="text-muted">You haven&apos;t requested any equipment yet.</p>
          <Link href="/equipment" className="btn btn-outline mt-4">
            Find equipment to lease
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {leaseRequests.map((req) => (
            <div
              key={req.id}
              className="card flex flex-wrap items-center justify-between gap-3 p-4"
            >
              <div>
                <Link
                  href={`/equipment/${req.equipmentId}`}
                  className="font-semibold text-ink hover:text-brand"
                >
                  {req.equipment.name}
                </Link>
                <p className="text-sm text-muted">
                  {req.equipment.company.companyName} ·{" "}
                  {dateFmt.format(req.startDate)} → {dateFmt.format(req.endDate)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`badge ${STATUS_STYLES[req.status] ?? "bg-slate-100 text-slate-600"}`}
                >
                  {LEASE_STATUS_LABELS[req.status] ?? req.status}
                </span>
                {req.status === "PENDING" && (
                  <form action={cancelLeaseRequestAction}>
                    <input type="hidden" name="leaseRequestId" value={req.id} />
                    <button type="submit" className="btn btn-ghost btn-sm">
                      Cancel
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
