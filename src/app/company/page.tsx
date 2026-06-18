import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { JOB_TYPE_LABELS } from "@/lib/constants";
import { setJobStatusAction } from "@/lib/actions/job-actions";

export default async function CompanyDashboard() {
  const session = await requireRole("COMPANY");

  const company = await prisma.companyProfile.findUnique({
    where: { userId: session.userId },
    include: {
      jobs: {
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { applications: true } } },
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">{company.companyName}</h1>
          <p className="mt-1 text-sm text-muted">
            {company.sector ? `${company.sector} · ` : ""}
            {company.location ?? "SIDCUL, Haridwar"}
          </p>
        </div>
        {company.verified ? (
          <Link href="/company/jobs/new" className="btn btn-primary">
            + Post a job
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
            before it can post jobs. You&apos;ll be able to post as soon as
            you&apos;re approved.
          </p>
        </div>
      )}

      {company.verified && (
        <>
          <h2 className="mt-8 text-lg font-semibold text-ink">
            Your job postings
          </h2>

          {company.jobs.length === 0 ? (
            <div className="card mt-4 p-10 text-center">
              <p className="text-muted">You haven&apos;t posted any jobs yet.</p>
              <Link href="/company/jobs/new" className="btn btn-primary mt-4">
                Post your first job
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {company.jobs.map((job) => (
                <div
                  key={job.id}
                  className="card flex flex-wrap items-center justify-between gap-3 p-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-ink">
                        {job.title}
                      </span>
                      {job.status !== "OPEN" && (
                        <span className="badge bg-slate-100 text-slate-500">
                          Closed
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted">
                      {JOB_TYPE_LABELS[job.jobType] ?? job.jobType} ·{" "}
                      {job.location}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/company/jobs/${job.id}`}
                      className="btn btn-outline btn-sm"
                    >
                      {job._count.applications} applicant
                      {job._count.applications === 1 ? "" : "s"}
                    </Link>
                    <form action={setJobStatusAction}>
                      <input type="hidden" name="jobId" value={job.id} />
                      <input
                        type="hidden"
                        name="status"
                        value={job.status === "OPEN" ? "CLOSED" : "OPEN"}
                      />
                      <button type="submit" className="btn btn-ghost btn-sm">
                        {job.status === "OPEN" ? "Close" : "Reopen"}
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
