import Link from "next/link";
import type { Job, CompanyProfile } from "@prisma/client";
import { JOB_TYPE_LABELS } from "@/lib/constants";

type JobWithCompany = Job & { company: CompanyProfile };

export default function JobCard({ job }: { job: JobWithCompany }) {
  const closed = job.status !== "OPEN";
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="card flex flex-col gap-3 p-5 transition hover:border-brand/50 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold leading-snug text-ink">{job.title}</h3>
          <p className="text-sm text-muted">
            {job.company.companyName}
            {job.company.verified && (
              <span className="ml-1 text-brand" title="Verified company">
                ✓
              </span>
            )}
          </p>
        </div>
        {closed && (
          <span className="badge bg-slate-100 text-slate-500">Closed</span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="badge bg-brand-50 text-brand-600">
          {JOB_TYPE_LABELS[job.jobType] ?? job.jobType}
        </span>
        {job.sector && (
          <span className="badge bg-slate-100 text-ink-700">{job.sector}</span>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between text-sm text-muted">
        <span>📍 {job.location}</span>
        {job.salary && <span className="font-medium text-ink">{job.salary}</span>}
      </div>
    </Link>
  );
}
