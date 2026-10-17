import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { setEquipmentStatusAction } from "@/lib/actions/equipment-actions";
import { LEASE_STATUS_LABELS } from "@/lib/constants";
import LeaseRequestActions from "@/components/forms/LeaseRequestActions";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  ACCEPTED: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
  CANCELLED: "bg-slate-100 text-slate-500",
};

export default async function CompanyEquipmentDashboard({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab = tab === "requests" ? "requests" : "listings";
  const session = await requireRole("COMPANY");

  const company = await prisma.companyProfile.findUnique({
    where: { userId: session.userId },
    include: {
      equipment: {
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { leaseRequests: true } },
          leaseRequests: {
            orderBy: { createdAt: "desc" },
            include: { requester: true },
          },
        },
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

  const withRequests = company.equipment.filter((e) => e.leaseRequests.length > 0);
  const pendingCount = company.equipment.reduce(
    (n, e) => n + e.leaseRequests.filter((r) => r.status === "PENDING").length,
    0,
  );
  const dateFmt = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <Link href="/company" className="text-sm text-muted hover:text-brand">
        ← Back to dashboard
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Your equipments</h1>
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
        <nav
          aria-label="Equipment sections"
          className="mt-8 flex gap-1 border-b border-line"
        >
          <Link
            href="/company/equipment"
            aria-current={activeTab === "listings" ? "page" : undefined}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === "listings"
                ? "border-brand text-brand"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            Listings
          </Link>
          <Link
            href="/company/equipment?tab=requests"
            aria-current={activeTab === "requests" ? "page" : undefined}
            className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === "requests"
                ? "border-brand text-brand"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            Requests
            {pendingCount > 0 && (
              <span className="rounded-full bg-brand px-2 py-0.5 text-[0.65rem] font-bold leading-none text-white">
                {pendingCount}
              </span>
            )}
          </Link>
        </nav>
      )}

      {company.verified && activeTab === "requests" && (
        <div className="mt-6">
          {withRequests.length === 0 ? (
            <div className="card p-10 text-center text-muted">
              No lease requests yet. They&apos;ll appear here when other SIDCUL
              companies ask to lease your equipment.
            </div>
          ) : (
            <div className="space-y-8">
              {withRequests.map((item) => (
                <section key={item.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="text-lg font-semibold text-ink">{item.name}</h2>
                    <p className="text-sm text-muted">
                      {item.leaseRequests.length} request
                      {item.leaseRequests.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="mt-3 space-y-3">
                    {item.leaseRequests.map((req) => (
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
                              {dateFmt.format(req.startDate)} →{" "}
                              {dateFmt.format(req.endDate)}
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
                </section>
              ))}
            </div>
          )}
        </div>
      )}

      {company.verified && activeTab === "listings" && (
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
                      href="/company/equipment?tab=requests"
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
