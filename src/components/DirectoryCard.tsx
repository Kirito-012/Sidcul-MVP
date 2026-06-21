import Link from "next/link";
import type { DirectoryCompany } from "@prisma/client";

export default function DirectoryCard({
  company,
}: {
  company: DirectoryCompany;
}) {
  return (
    <Link
      href={`/directory/${company.slug}`}
      className="card group flex cursor-pointer flex-col gap-3 p-5 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display font-semibold leading-snug text-ink group-hover:text-brand">
          {company.name}
        </h3>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand">
          <BuildingIcon className="h-5 w-5" />
        </span>
      </div>
      {company.category && (
        <span className="badge w-fit bg-slate-100 text-ink-700">
          {company.category}
        </span>
      )}
      {company.address && (
        <p className="flex items-start gap-1 text-sm text-muted">
          <PinIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="line-clamp-2">{company.address}</span>
        </p>
      )}
      <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-brand">
        View details
        <ArrowIcon className="h-3.5 w-3.5" />
      </span>
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

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8 7.5h2M14 7.5h2M8 11.5h2M14 11.5h2M8 15.5h2M14 15.5h2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
