import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import {
  APPLICATION_STATUSES,
  JOB_TYPE_LABELS,
} from "@/lib/constants";
import { updateApplicationStatusAction } from "@/lib/actions/job-actions";

export default async function JobApplicantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireRole("COMPANY");

  const company = await prisma.companyProfile.findUnique({
    where: { userId: session.userId },
  });

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      applications: {
        orderBy: { createdAt: "desc" },
        include: { applicant: { include: { studentProfile: true } } },
      },
    },
  });

  // Only the owning company may view applicants.
  if (!job || !company || job.companyId !== company.id) notFound();

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <Link href="/company" className="text-sm text-muted hover:text-brand">
        ← Back to dashboard
      </Link>

      <div className="mt-4">
        <h1 className="text-2xl font-bold text-ink">{job.title}</h1>
        <p className="mt-1 text-sm text-muted">
          {JOB_TYPE_LABELS[job.jobType] ?? job.jobType} · {job.location} ·{" "}
          {job.applications.length} applicant
          {job.applications.length === 1 ? "" : "s"}
        </p>
      </div>

      {job.applications.length === 0 ? (
        <div className="card mt-6 p-10 text-center text-muted">
          No applications yet. Share this role with local talent.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {job.applications.map((app) => {
            const profile = app.applicant.studentProfile;
            return (
              <div key={app.id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-ink">
                      {profile?.fullName ?? app.applicant.name}
                    </h3>
                    <p className="text-sm text-muted">
                      {app.applicant.email}
                      {profile?.phone ? ` · ${profile.phone}` : ""}
                    </p>
                  </div>

                  {/* Status update */}
                  <form
                    action={updateApplicationStatusAction}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="hidden"
                      name="applicationId"
                      value={app.id}
                    />
                    <select
                      name="status"
                      defaultValue={app.status}
                      className="select text-sm"
                      style={{ width: "auto" }}
                    >
                      {APPLICATION_STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="btn btn-outline btn-sm">
                      Update
                    </button>
                  </form>
                </div>

                {(profile?.education || profile?.skills) && (
                  <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    {profile?.education && (
                      <div>
                        <dt className="font-medium text-ink-700">Education</dt>
                        <dd className="text-muted">{profile.education}</dd>
                      </div>
                    )}
                    {profile?.skills && (
                      <div>
                        <dt className="font-medium text-ink-700">Skills</dt>
                        <dd className="text-muted">{profile.skills}</dd>
                      </div>
                    )}
                  </dl>
                )}

                {app.coverNote && (
                  <div className="mt-3 rounded-lg bg-canvas p-3 text-sm text-ink-700">
                    <span className="font-medium">Cover note: </span>
                    {app.coverNote}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
