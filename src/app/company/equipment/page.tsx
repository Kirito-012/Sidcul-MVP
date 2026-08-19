import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { setEquipmentStatusAction } from "@/lib/actions/equipment-actions";

export default async function CompanyEquipmentDashboard() {
  const session = await requireRole("COMPANY");

  const company = await prisma.companyProfile.findUnique({
    where: { userId: session.userId },
    include: {
      equipment: {
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { leaseRequests: true } } },
      },
    },
  });

  if (!company) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-10">
        <p className="text-muted">Company profile not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <Link href="/company" className="text-sm text-muted hover:text-brand">
        ← Back to dashboard
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Equipment leasing</h1>
          <p className="mt-1 text-sm text-muted">
            List machinery and equipment other SIDCUL companies can lease.
          </p>
        </div>
        {company.verified ? (
          <Link href="/company/equipment/new" className="btn btn-primary">
            + List equipment
          </Link>
        ) : (
          <span className="badge bg-amber-100 text-amber-800">
            Pending verification
          </span>
        )}
      </div>

      {!company.verified && (
        <div className="card mt-6 border-amber-200 bg-amber-50 p-5">
          <h2 className="font-semibold text-amber-900">
            Your company is awaiting verification
          </h2>
          <p className="mt-1 text-sm text-amber-800">
            To keep the directory trustworthy, an admin reviews every company
            before it can list equipment. You&apos;ll be able to list as soon
            as you&apos;re approved.
          </p>
        </div>
      )}

      {company.verified && (
        <>
          <h2 className="mt-8 text-lg font-semibold text-ink">
            Your equipment listings
          </h2>

          {company.equipment.length === 0 ? (
            <div className="card mt-4 p-10 text-center">
              <p className="text-muted">You haven&apos;t listed any equipment yet.</p>
              <Link href="/company/equipment/new" className="btn btn-primary mt-4">
                List your first item
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {company.equipment.map((item) => (
                <div
                  key={item.id}
                  className="card flex flex-wrap items-center justify-between gap-3 p-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-ink">{item.name}</span>
                      {item.status !== "LISTED" && (
                        <span className="badge bg-slate-100 text-slate-500">
                          Unlisted
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted">
                      {item.category ?? "Uncategorized"} · {item.location}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/company/equipment/${item.id}`}
                      className="btn btn-outline btn-sm"
                    >
                      {item._count.leaseRequests} request
                      {item._count.leaseRequests === 1 ? "" : "s"}
                    </Link>
                    <form action={setEquipmentStatusAction}>
                      <input type="hidden" name="equipmentId" value={item.id} />
                      <input
                        type="hidden"
                        name="status"
                        value={item.status === "LISTED" ? "UNLISTED" : "LISTED"}
                      />
                      <button type="submit" className="btn btn-ghost btn-sm">
                        {item.status === "LISTED" ? "Unlist" : "Relist"}
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
