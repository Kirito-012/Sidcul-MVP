import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { JOB_TYPE_LABELS } from "@/lib/constants";
import { setJobStatusAction } from "@/lib/actions/job-actions";
import CompanyMediaForm from "@/components/forms/CompanyMediaForm";

export default async function CompanyDashboard() {
  const session = await requireRole("COMPANY");

  const company = await prisma.companyProfile.findUnique({
    where: { userId: session.userId },
    include: {
      directoryCompany: { select: { slug: true } },
      jobs: {
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { applications: true } } },
      },
    },
  });

  if (!company) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-10">
        <p className="text-muted">Company profile not found.</p>
      </div>
    );
  }

  const totalJobs = company.jobs.length;
  const openJobs = company.jobs.filter((j) => j.status === "OPEN").length;
  const totalApplicants = company.jobs.reduce(
    (sum, j) => sum + j._count.applications,
    0,
  );

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      {/* ============== HEADER ============== */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-display text-2xl font-bold text-ink">
              {company.companyName}
            </h1>
            {company.verified ? (
              <span className="badge bg-accent-50 text-accent-600">
                <CheckIcon className="h-3.5 w-3.5" />
                Verified
              </span>
            ) : (
              <span className="badge bg-amber-100 text-amber-800">
                Pending verification
              </span>
            )}
          </div>
          <p className="mt-1.5 text-sm text-muted">
            {company.sector ? `${company.sector} · ` : ""}
            {company.location ?? "SIDCUL, Haridwar"}
          </p>
        </div>
        {company.verified && (
          <Link href="/company/jobs/new" className="btn btn-primary">
            <PlusIcon className="h-4 w-4" />
            Post a job
          </Link>
        )}
      </div>

      {!company.verified && (
        <div className="card mt-6 flex items-start gap-3 border-amber-200 bg-amber-50 p-5">
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-700">
            <ClockIcon className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-semibold text-amber-900">
              Your company is awaiting verification
            </h2>
            <p className="mt-1 text-sm text-amber-800">
              To keep the directory trustworthy, an admin reviews every company
              before it can post jobs. You&apos;ll be able to post as soon as
              you&apos;re approved.
            </p>
          </div>
        </div>
      )}

      {/* ============== COMPANY MEDIA ============== */}
      <div className="mt-6">
        <CompanyMediaForm
          companyName={company.companyName}
          about={company.about}
          website={company.website}
          whatsappNumber={company.whatsappNumber}
          contactEmail={company.contactEmail}
          mapUrl={company.mapUrl}
          location={company.location}
          logoUrl={company.logoUrl}
          galleryImage1Url={company.galleryImage1Url}
          galleryImage2Url={company.galleryImage2Url}
          linkedSlug={company.directoryCompany?.slug ?? null}
        />
      </div>

      {company.verified && (
        <>
          {/* ============== STAT CARDS ============== */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <StatCard
              icon={<BriefcaseIcon className="h-5 w-5" />}
              label="Total postings"
              value={totalJobs}
            />
            <StatCard
              icon={<PulseIcon className="h-5 w-5" />}
              label="Open roles"
              value={openJobs}
              tone="accent"
            />
            <StatCard
              icon={<UsersIcon className="h-5 w-5" />}
              label="Total applicants"
              value={totalApplicants}
            />
          </div>

          {/* ============== JOB LIST ============== */}
          <div className="mt-8 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">Your job postings</h2>
            {totalJobs > 0 && (
              <span className="text-sm text-muted">
                {totalJobs} {totalJobs === 1 ? "posting" : "postings"}
              </span>
            )}
          </div>

          {company.jobs.length === 0 ? (
            <div className="card mt-4 flex flex-col items-center p-12 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand">
                <BriefcaseIcon className="h-6 w-6" />
              </span>
              <p className="mt-4 text-muted">You haven&apos;t posted any jobs yet.</p>
              <Link href="/company/jobs/new" className="btn btn-primary mt-4">
                <PlusIcon className="h-4 w-4" />
                Post your first job
              </Link>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
              {company.jobs.map((job) => (
                <div
                  key={job.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-canvas/60"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold text-ink">
                        {job.title}
                      </span>
                      <span
                        className={`badge shrink-0 ${
                          job.status === "OPEN"
                            ? "bg-accent-50 text-accent-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {job.status === "OPEN" ? "Open" : "Closed"}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted">
                      {JOB_TYPE_LABELS[job.jobType] ?? job.jobType} ·{" "}
                      {job.location}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Link
                      href={`/company/jobs/${job.id}`}
                      className="btn btn-outline btn-sm"
                    >
                      <UsersIcon className="h-3.5 w-3.5" />
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

function StatCard({
  icon,
  label,
  value,
  tone = "brand",
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone?: "brand" | "accent";
}) {
  return (
    <div className="card flex items-center gap-3.5 p-4">
      <span
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
          tone === "accent" ? "bg-accent-50 text-accent-600" : "bg-brand-50 text-brand"
        }`}
      >
        {icon}
      </span>
      <div>
        <p className="font-display text-2xl font-bold leading-none text-ink">
          {value}
        </p>
        <p className="mt-1 text-xs font-medium text-muted">{label}</p>
      </div>
    </div>
  );
}

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="7.5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 7.5V6a2 2 0 012-2h4a2 2 0 012 2v1.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M3 12.5h18" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}


function PlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 12.5l4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PulseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 12h4l2-6 4 12 2-6h6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M2.8 19c0-3.3 2.8-6 6.2-6s6.2 2.7 6.2 6M15.5 5.3a3.2 3.2 0 010 6.1M21.2 19c0-2.7-1.9-5-4.5-5.7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
