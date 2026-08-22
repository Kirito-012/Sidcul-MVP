import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { JOB_TYPE_LABELS } from "@/lib/constants";
import ApplyForm from "@/components/forms/ApplyForm";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: { id },
    include: { company: true },
  });

  // Hide jobs from unverified companies entirely.
  if (!job || !job.company.verified) notFound();

  const session = await getSession();

  let alreadyApplied = false;
  if (session?.role === "STUDENT") {
    const existing = await prisma.application.findUnique({
      where: { jobId_applicantId: { jobId: job.id, applicantId: session.userId } },
    });
    alreadyApplied = Boolean(existing);
  }

  const closed = job.status !== "OPEN";

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <Link href="/jobs" className="text-sm text-muted hover:text-brand">
        ← Back to all jobs
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main */}
        <div>
          <div className="card p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-ink">{job.title}</h1>
                <p className="mt-1 text-muted">
                  {job.company.companyName}
                  {job.company.verified && (
                    <span className="ml-1 text-brand">✓ Verified</span>
                  )}
                </p>
              </div>
              {closed && (
                <span className="badge bg-slate-100 text-slate-500">Closed</span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="badge bg-brand-50 text-brand-600">
                {JOB_TYPE_LABELS[job.jobType] ?? job.jobType}
              </span>
              {job.sector && (
                <span className="badge bg-slate-100 text-ink-700">
                  {job.sector}
                </span>
              )}
              <span className="badge bg-slate-100 text-ink-700">
                📍 {job.location}
              </span>
              {job.salary && (
                <span className="badge bg-green-50 text-green-700">
                  {job.salary}
                </span>
              )}
            </div>

            <hr className="my-5 border-line" />

            <h2 className="font-semibold text-ink">Job description</h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed text-ink-700">
              {job.description}
            </p>
          </div>

          {job.company.about && (
            <div className="card mt-4 p-6">
              <h2 className="font-semibold text-ink">
                About {job.company.companyName}
              </h2>
              <p className="mt-2 leading-relaxed text-ink-700">
                {job.company.about}
              </p>
              {job.company.website && (
                <a
                  href={job.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm font-semibold text-brand"
                >
                  Visit website →
                </a>
              )}
            </div>
          )}
        </div>

        {/* Apply panel */}
        <aside>
          <div className="card sticky top-20 p-5">
            <h2 className="font-semibold text-ink">Apply for this role</h2>

            {closed ? (
              <p className="mt-3 text-sm text-muted">
                This position is closed and no longer accepting applications.
              </p>
            ) : !session ? (
              <div className="mt-3 space-y-3">
                <p className="text-sm text-muted">
                  Log in as a student to apply.
                </p>
                <Link href="/login" className="btn btn-primary w-full">
                  Log in to apply
                </Link>
                <Link href="/register" className="btn btn-outline w-full">
                  Create student account
                </Link>
              </div>
            ) : session.role !== "STUDENT" ? (
              <p className="mt-3 text-sm text-muted">
                Only student accounts can apply to jobs.
              </p>
            ) : alreadyApplied ? (
              <div className="mt-3 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                ✓ You&apos;ve already applied to this job.
              </div>
            ) : (
              <div className="mt-3">
                <ApplyForm jobId={job.id} />
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
