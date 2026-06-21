import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

function initialsOf(name: string) {
  const words = name.trim().split(/\s+/);
  return ((words[0]?.[0] ?? "") + (words[1]?.[0] ?? "")).toUpperCase();
}

export default async function DirectoryCompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const company = await prisma.directoryCompany.findUnique({ where: { slug } });
  if (!company) notFound();

  const website = company.website
    ? company.website.startsWith("http")
      ? company.website
      : `https://${company.website}`
    : null;

  return (
    <div>
      {/* Header band — mirrors the directory hero for continuity */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage:
              "radial-gradient(120% 90% at 20% 0%, #000 40%, transparent 90%)",
            WebkitMaskImage:
              "radial-gradient(120% 90% at 20% 0%, #000 40%, transparent 90%)",
          }}
        />
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand/30 blur-3xl" />

        <div className="relative mx-auto max-w-3xl px-5 pb-20 pt-10 sm:pt-12">
          <Link
            href="/directory"
            className="label-tag inline-flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
          >
            <ArrowIcon className="h-3.5 w-3.5 rotate-180" />
            Back to directory
          </Link>

          <div className="mt-6 flex items-start gap-4 sm:gap-5">
            <span className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand to-brand-700 font-display text-xl font-bold text-white shadow-[0_10px_24px_-8px_rgba(3,105,161,0.8)] ring-1 ring-inset ring-white/20 sm:h-20 sm:w-20 sm:text-2xl">
              <span className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/15" />
              {initialsOf(company.name)}
            </span>
            <div className="min-w-0">
              {company.category && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-accent ring-1 ring-inset ring-white/15">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {company.category}
                </span>
              )}
              <h1 className="mt-2 font-display text-2xl font-bold leading-tight sm:text-3xl">
                {company.name}
              </h1>
              <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-slate-300">
                <PinIcon className="h-4 w-4 shrink-0" />
                {company.area ?? "SIDCUL IT Park, Dehradun"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-5 pb-16">
        <div className="card relative z-10 -mt-10 overflow-hidden shadow-[0_24px_60px_-28px_rgba(11,37,64,0.4)]">
          {company.description && (
            <div className="border-b border-line p-6 sm:p-7">
              <p className="label-tag mb-2.5 text-muted">About</p>
              <p className="leading-relaxed text-ink-700">
                {company.description}
              </p>
            </div>
          )}

          {/* Spec fields */}
          <dl className="divide-y divide-line">
            {company.address && <Field label="Address">{company.address}</Field>}
            {company.pincode && <Field label="Pincode">{company.pincode}</Field>}
            {company.phone && (
              <Field label="Phone">
                <a
                  href={`tel:${company.phone}`}
                  className="text-brand hover:underline"
                >
                  {company.phone}
                </a>
              </Field>
            )}
            {company.email && (
              <Field label="Email">
                <a
                  href={`mailto:${company.email}`}
                  className="break-all text-brand hover:underline"
                >
                  {company.email}
                </a>
              </Field>
            )}
            {website && (
              <Field label="Website">
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-brand hover:underline"
                >
                  {company.website}
                </a>
              </Field>
            )}
          </dl>

          {/* Action footer */}
          {(company.phone || website) && (
            <div className="flex flex-col gap-2 border-t border-line bg-canvas p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted">
                Get in touch with{" "}
                <span className="font-semibold text-ink">{company.name}</span>
              </p>
              <div className="flex gap-2">
                {company.phone && (
                  <a href={`tel:${company.phone}`} className="btn btn-outline btn-sm">
                    <PhoneIcon className="h-4 w-4" />
                    Call
                  </a>
                )}
                {website && (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    <GlobeIcon className="h-4 w-4" />
                    Visit website
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <p className="mt-3 text-xs text-muted">
          Listing data compiled from public business directories.
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1 px-6 py-4 transition-colors hover:bg-canvas sm:grid-cols-[160px_1fr] sm:gap-4 sm:py-5">
      <dt className="label-tag pt-0.5 text-muted">{label}</dt>
      <dd className="text-ink-700">{children}</dd>
    </div>
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
