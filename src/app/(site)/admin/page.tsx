import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { setCompanyVerifiedAction } from "@/lib/actions/admin-actions";

export default async function AdminDashboard() {
  await requireRole("ADMIN");

  const companies = await prisma.companyProfile.findMany({
    orderBy: [{ verified: "asc" }, { createdAt: "desc" }],
    include: {
      user: true,
      _count: { select: { jobs: true } },
    },
  });

  const pending = companies.filter((c) => !c.verified).length;

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <h1 className="text-2xl font-bold text-ink">Company verification</h1>
      <p className="mt-1 text-sm text-muted">
        {pending} compan{pending === 1 ? "y" : "ies"} awaiting verification ·{" "}
        {companies.length} total. Verified companies can post jobs and appear in
        the public directory.
      </p>

      <div className="mt-6 space-y-3">
        {companies.map((company) => (
          <div
            key={company.id}
            className="card flex flex-wrap items-center justify-between gap-3 p-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-ink">
                  {company.companyName}
                </span>
                {company.verified ? (
                  <span className="badge bg-green-50 text-green-700">
                    ✓ Verified
                  </span>
                ) : (
                  <span className="badge bg-amber-100 text-amber-800">
                    Pending
                  </span>
                )}
              </div>
              <p className="text-sm text-muted">
                {company.sector ? `${company.sector} · ` : ""}
                {company.location ?? "—"} · {company.user.email} ·{" "}
                {company._count.jobs} job
                {company._count.jobs === 1 ? "" : "s"}
              </p>
            </div>

            <form action={setCompanyVerifiedAction}>
              <input type="hidden" name="companyId" value={company.id} />
              <input
                type="hidden"
                name="verified"
                value={company.verified ? "false" : "true"}
              />
              <button
                type="submit"
                className={`btn btn-sm ${
                  company.verified ? "btn-ghost" : "btn-primary"
                }`}
              >
                {company.verified ? "Revoke" : "Verify"}
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
