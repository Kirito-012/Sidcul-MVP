import Link from "next/link";
import type { DirectoryCompany } from "@prisma/client";

function initialsOf(name: string) {
  const words = name.trim().split(/\s+/);
  return ((words[0]?.[0] ?? "") + (words[1]?.[0] ?? "")).toUpperCase();
}

export default function DirectoryCard({
  company,
  index,
}: {
  company: DirectoryCompany;
  index: number;
}) {
  const channels = [
    company.phone && { key: "phone", label: "Phone", Icon: PhoneIcon },
    company.email && { key: "email", label: "Email", Icon: MailIcon },
    company.website && { key: "web", label: "Website", Icon: GlobeIcon },
  ].filter(Boolean) as { key: string; label: string; Icon: typeof PhoneIcon }[];

  return (
    <Link
      href={`/directory/${company.slug}`}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(11,37,64,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-[0_28px_55px_-22px_rgba(3,105,161,0.45)]"
    >
      {/* Gradient accent that wipes in on hover */}
      <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-brand via-brand-600 to-accent transition-transform duration-500 group-hover:scale-x-100" />
      {/* Soft corner glow on hover */}
      <span className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand/0 blur-2xl transition-colors duration-500 group-hover:bg-brand/10" />

      <div className="flex items-start justify-between">
        <span className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-brand to-brand-700 font-display text-base font-bold text-white shadow-[0_6px_14px_-6px_rgba(3,105,161,0.7)] ring-1 ring-inset ring-white/20">
          <span className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/15" />
          {initialsOf(company.name)}
        </span>
        <span className="font-mono text-xs font-semibold tabular-nums text-line transition-colors group-hover:text-muted">
          {String(index).padStart(2, "0")}
        </span>
      </div>

      {company.category && (
        <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-brand-700">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          {company.category}
        </span>
      )}

      <h3
        className={`${company.category ? "mt-2.5" : "mt-4"} line-clamp-2 font-display text-[1.05rem] font-semibold leading-snug text-ink transition-colors group-hover:text-brand`}
      >
        {company.name}
      </h3>

      {company.address && (
        <p className="mt-2 flex items-start gap-1.5 text-sm leading-relaxed text-muted">
          <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand/60" />
          <span className="line-clamp-2">{company.address}</span>
        </p>
      )}

      {channels.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {channels.map(({ key, label, Icon }) => (
            <span
              key={key}
              className="inline-flex items-center gap-1 rounded-md bg-canvas px-2 py-1 text-[0.7rem] font-medium text-muted ring-1 ring-inset ring-line"
            >
              <Icon className="h-3 w-3 text-brand/70" />
              {label}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between border-t border-line pt-4">
        <span className="label-tag text-brand">View record</span>
        <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-50 text-brand transition-all duration-300 group-hover:bg-brand group-hover:text-white group-hover:shadow-[0_8px_18px_-6px_rgba(3,105,161,0.6)]">
          <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
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

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M6.5 4h3l1.2 4-2 1.3a11 11 0 005 5l1.3-2 4 1.2v3a2 2 0 01-2.2 2A16 16 0 014.5 6.2 2 2 0 016.5 4z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 3.5c2.5 2.2 2.5 14.8 0 17M12 3.5c-2.5 2.2-2.5 14.8 0 17M3.5 12h17"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}
