import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import {
  APPLICATION_STATUS_LABELS,
  JOB_TYPE_LABELS,
} from "@/lib/constants";

const STATUS_STYLES: Record<string, string> = {
  APPLIED: "bg-slate-100 text-slate-600",
  REVIEWED: "bg-blue-50 text-blue-700",
  SHORTLISTED: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
};

export default async function StudentDashboard() {
  const session = await requireRole("STUDENT");

  const applications = await prisma.application.findMany({
    where: { applicantId: session.userId },
    include: {
      job: { include: { company: true } },
      resume: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">My applications</h1>
          <p className="mt-1 text-sm text-muted">
            Track the status of jobs you&apos;ve applied to.
          </p>
        </div>
        <Link href="/jobs" className="btn btn-primary">
          Browse more jobs
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="card mt-8 p-10 text-center">
          <p className="text-muted">You haven&apos;t applied to any jobs yet.</p>
          <Link href="/jobs" className="btn btn-outline mt-4">
            Find your first role
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="card flex flex-wrap items-center justify-between gap-3 p-4"
            >
              <div>
                <Link
                  href={`/jobs/${app.jobId}`}
                  className="font-semibold text-ink hover:text-brand"
                >
                  {app.job.title}
                </Link>
                <p className="text-sm text-muted">
                  {app.job.company.companyName} ·{" "}
                  {JOB_TYPE_LABELS[app.job.jobType] ?? app.job.jobType} ·{" "}
                  {app.job.location}
                </p>
                {app.resume && (
                  <a
                    href={`/resume/${app.resume.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-xs font-medium text-brand"
                  >
                    📄 Résumé attached — view
                  </a>
                )}
              </div>
              <span
                className={`badge ${STATUS_STYLES[app.status] ?? "bg-slate-100 text-slate-600"}`}
              >
                {APPLICATION_STATUS_LABELS[app.status] ?? app.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
