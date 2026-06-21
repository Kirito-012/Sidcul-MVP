import Link from "next/link";
import type { Job, CompanyProfile } from "@prisma/client";
import { JOB_TYPE_LABELS } from "@/lib/constants";

type JobWithCompany = Job & { company: CompanyProfile };

export default function JobCard({ job }: { job: JobWithCompany }) {
  const closed = job.status !== "OPEN";
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="card group flex cursor-pointer flex-col gap-3 p-5 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display font-semibold leading-snug text-ink group-hover:text-brand">
            {job.title}
          </h3>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-muted">
            {job.company.companyName}
            {job.company.verified && (
              <VerifiedIcon className="h-4 w-4 text-accent" />
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
        <span className="flex items-center gap-1">
          <PinIcon className="h-4 w-4" />
          {job.location}
        </span>
        {job.salary && <span className="font-medium text-ink">{job.salary}</span>}
      </div>
    </Link>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 21s-6.5-5.6-6.5-11A6.5 6.5 0 1118.5 10c0 5.4-6.5 11-6.5 11z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function VerifiedIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      role="img"
      aria-label="Verified company"
    >
      <path
        d="M12 3l2.4 1.4 2.7-.2 1.1 2.5 2.3 1.5-.6 2.7.6 2.7-2.3 1.5-1.1 2.5-2.7-.2L12 19l-2.4-1.4-2.7.2-1.1-2.5-2.3-1.5.6-2.7-.6-2.7 2.3-1.5 1.1-2.5 2.7.2L12 3z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M8.5 12.2l2.3 2.3 4.7-4.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
