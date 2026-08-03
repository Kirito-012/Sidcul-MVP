import Link from "next/link";
import Image from "next/image";
import type { DirectoryCompany } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { DIRECTORY_CATEGORIES } from "@/lib/constants";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const POPULAR_SEARCHES = [
  { label: "Pharmaceuticals", q: "Pharmaceuticals" },
  { label: "IT & Software", q: "Software Companies" },
  { label: "Akums", q: "Akums" },
  { label: "Themis Medicare", q: "Themis" },
];

export default async function Home() {
  const session = await getSession();

  const [directoryTotal, categoryGroups, companies, allNames, openJobs] =
    await Promise.all([
      prisma.directoryCompany.count(),
      prisma.directoryCompany.groupBy({
        by: ["category"],
        _count: { _all: true },
      }),
      prisma.directoryCompany.findMany({ orderBy: { name: "asc" }, take: 18 }),
      prisma.directoryCompany.findMany({ select: { name: true } }),
      prisma.job.count({ where: { status: "OPEN" } }),
    ]);

  const categoryCountMap = new Map(
    categoryGroups.map((g) => [g.category ?? "", g._count._all]),
  );
  const distinctCategoryCount = categoryGroups.filter((g) => g.category).length;
  const availableLetters = new Set(
    allNames.map((n) => n.name.trim().charAt(0).toUpperCase()),
  );

  return (
    <div>
      {/* ============== SEARCH HERO ============== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-ink to-ink-700 text-white">
        <div
          className="bg-blueprint pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            maskImage:
              "radial-gradient(115% 80% at 50% 0%, #000 35%, transparent 88%)",
            WebkitMaskImage:
              "radial-gradient(115% 80% at 50% 0%, #000 35%, transparent 88%)",
          }}
        />

        <CornerFrame className="mx-auto max-w-3xl px-6 py-16 text-center sm:px-5 sm:py-20">
          <p className="label-tag mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-accent">
            <span className="relative grid h-2 w-2 place-items-center">
              <span className="spm-live absolute inset-0 rounded-full bg-accent" />
              <span className="h-2 w-2 rounded-full bg-accent" />
            </span>
            Estate Reg. No. UK-SIDCUL-HW
          </p>

          <h1 className="mx-auto mt-6 max-w-2xl font-display text-[1.7rem] font-bold leading-[1.2] sm:mt-5 sm:text-5xl sm:leading-[1.1]">
            Find companies in the SIDCUL{" "}
            <span className="bg-gradient-to-r from-accent to-emerald-300 bg-clip-text text-transparent">
              Haridwar
            </span>{" "}
            estate
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-[0.95rem] leading-relaxed text-slate-300 sm:mt-4 sm:text-[1.05rem]">
            Search manufacturers, pharma majors and IT firms across the
            estate — who they are, where they&apos;re based, and what they
            do.
          </p>

          {/* Search — the primary CTA */}
          <form
            method="get"
            action="/directory"
            role="search"
            className="mx-auto mt-8 flex max-w-xl flex-col gap-2 rounded-2xl border border-white/15 bg-white/[0.06] p-2 backdrop-blur-sm sm:mt-7 sm:flex-row sm:items-center"
          >
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                name="q"
                aria-label="Search companies by name, category or location"
                placeholder="Search ‘Pharma’, ‘Akums’, ‘IT Park’…"
                className="w-full rounded-xl border-0 bg-transparent py-2.5 pl-11 pr-3 text-[0.95rem] text-white outline-none placeholder:text-slate-400"
              />
            </div>
            <button type="submit" className="btn btn-primary sm:px-6">
              <SearchIcon className="h-4 w-4" />
              Search
            </button>
          </form>

          {/* Popular search shortcuts — desktop only; kept off mobile to reduce clutter */}
          <div className="mx-auto mt-4 hidden max-w-xl flex-wrap items-center justify-center gap-2 sm:flex">
            <span className="label-tag text-slate-400">Popular</span>
            {POPULAR_SEARCHES.map((p) => (
              <Link
                key={p.label}
                href={`/directory?q=${encodeURIComponent(p.q)}`}
                className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-xs font-medium text-slate-200 transition-colors duration-200 hover:border-accent/50 hover:bg-accent/10 hover:text-white"
              >
                {p.label}
              </Link>
            ))}
          </div>

          {/* Coverage line — desktop only; the sector grid below already covers this on mobile */}
          <p className="label-tag mt-6 !hidden text-slate-400 sm:!inline-flex">
            {`${directoryTotal} companies · ${distinctCategoryCount} sectors · SIDCUL, Haridwar`}
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:mt-7 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
            <Link href="/directory" className="btn btn-primary w-full sm:w-auto">
              Browse the directory
              <ArrowIcon />
            </Link>
            {!session && (
              <>
                {/* Mobile: lightweight text link to reduce visual weight */}
                <Link
                  href="/register"
                  className="text-sm font-medium text-slate-300 underline underline-offset-4 transition-colors hover:text-white sm:hidden"
                >
                  List your company
                </Link>
                {/* Desktop: full outline button */}
                <Link
                  href="/register"
                  className="btn btn-outline !hidden border-white/20 bg-transparent text-white hover:border-white/40 hover:bg-white/10 hover:text-white sm:!inline-flex"
                >
                  List your company
                </Link>
              </>
            )}
          </div>
        </CornerFrame>

        {/* Trust marquee */}
        <div className="spm-marquee relative border-t border-white/10 bg-white/[0.02] py-3">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />
          <div className="flex w-max">
            <Marquee />
            <Marquee />
          </div>
        </div>
      </section>

      {/* ============== BROWSE BY SECTOR ============== */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:py-16">
          <SectionHead
            eyebrow="Browse by sector"
            title="Companies by industry"
            right={`${distinctCategoryCount} active · ${DIRECTORY_CATEGORIES.length} total`}
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {DIRECTORY_CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat.dbCategory}
                label={cat.label}
                dbCategory={cat.dbCategory}
                count={categoryCountMap.get(cat.dbCategory) ?? 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============== COMPANY INDEX ============== */}
      {companies.length > 0 && (
        <section className="border-t border-line bg-canvas">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:py-16">
            <SectionHead
              eyebrow="Full index"
              title="All companies"
              right="Sorted A–Z"
            />

            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <span className="label-tag mr-1 text-muted">Jump to</span>
              {ALPHABET.map((letter) => {
                const has = availableLetters.has(letter);
                if (!has) {
                  return (
                    <span
                      key={letter}
                      className="grid h-7 w-7 place-items-center rounded-md text-xs font-semibold text-line"
                    >
                      {letter}
                    </span>
                  );
                }
                return (
                  <Link
                    key={letter}
                    href={`/directory?letter=${letter}`}
                    className="grid h-7 w-7 place-items-center rounded-md text-xs font-semibold text-ink-700 transition-colors duration-200 hover:bg-brand-50 hover:text-brand"
                  >
                    {letter}
                  </Link>
                );
              })}
            </div>

            <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
              {companies.map((company) => (
                <CompanyRow key={company.id} company={company} />
              ))}
            </div>

            <div className="mt-7 text-center">
              <Link href="/directory" className="btn btn-outline">
                View all {directoryTotal} companies
                <ArrowIcon small />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ============== ESTATE BANNER IMAGE ============== */}
      <section className="relative overflow-hidden border-t border-line">
        <div className="relative h-[200px] w-full">
          <Image
            src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1600&q=80&auto=format&fit=crop"
            alt="Manufacturing units in the SIDCUL industrial estate"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-5 pb-5">
            <p className="label-tag text-accent">On the ground</p>
            <p className="mt-1 font-display text-lg font-semibold text-white sm:text-xl">
              550+ manufacturing units across the estate.
            </p>
          </div>
        </div>
      </section>

      {/* ============== TRUST STRIP ============== */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:grid-cols-3">
          <TrustItem
            Icon={ShieldIcon}
            title="Verified listings"
            body="Checked against the SIDCUL estate registry before publishing."
          />
          <TrustItem
            Icon={DocIcon}
            title="Official sources"
            body="Compiled from SIDCUL Manufacturers Association and IDBF records."
          />
          <TrustItem
            Icon={ClockIcon}
            title="Kept current"
            body="New companies and sectors added as records are verified."
          />
        </div>
      </section>

      {/* ============== JOBS STRIP ============== */}
      {openJobs > 0 && (
        <section className="border-b border-line bg-canvas">
          <Link
            href="/jobs"
            className="group mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 transition-colors duration-200 hover:bg-white"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-ink">
              <span className="spm-live h-2 w-2 shrink-0 rounded-full bg-accent" />
              Companies are also hiring —{" "}
              <span className="font-semibold">
                {openJobs} open {openJobs === 1 ? "role" : "roles"}
              </span>
            </span>
            <span className="label-tag inline-flex shrink-0 items-center gap-1 text-brand group-hover:text-brand-600">
              Browse jobs <ArrowIcon small />
            </span>
          </Link>
        </section>
      )}

      {/* ============== CTA ============== */}
      <section className="relative overflow-hidden border-t-2 border-ink bg-ink text-white">
        <div
          className="bg-blueprint pointer-events-none absolute inset-0 opacity-[0.10]"
          style={{
            maskImage: "radial-gradient(100% 100% at 80% 50%, #000, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(100% 100% at 80% 50%, #000, transparent 75%)",
          }}
        />
        <div className="pointer-events-none absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-accent/20 blur-[90px]" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-16 sm:flex-row sm:items-center sm:py-20">
          <div>
            <p className="label-tag inline-flex items-center gap-2 text-accent">
              <span className="spm-live h-2 w-2 rounded-full bg-accent" />
              Now onboarding
            </p>
            <h2 className="mt-3 max-w-xl font-display text-3xl font-bold leading-tight sm:text-4xl">
              Is your company part of the SIDCUL estate?
            </h2>
            <p className="mt-3 max-w-md text-slate-300">
              Get listed in the directory so local talent and other
              businesses can find you — and post open roles directly, with
              no recruiter fees.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/register" className="btn btn-primary">
              Add your company
              <ArrowIcon />
            </Link>
            <Link
              href="/directory"
              className="btn btn-outline border-white/20 bg-transparent text-white hover:border-white/40 hover:bg-white/10 hover:text-white"
            >
              Browse the directory
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ----------------------------- Building blocks ----------------------------- */

function SectionHead({
  eyebrow,
  title,
  right,
}: {
  eyebrow: string;
  title: string;
  right?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4 border-b-2 border-ink pb-3">
      <div>
        <p className="label-tag mb-1.5 text-brand">{eyebrow}</p>
        <h2 className="font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">
          {title}
        </h2>
      </div>
      {right && (
        <p className="label-tag hidden shrink-0 text-muted sm:block">{right}</p>
      )}
    </div>
  );
}

function CategoryCard({
  label,
  dbCategory,
  count,
}: {
  label: string;
  dbCategory: string;
  count: number;
}) {
  const empty = count === 0;
  return (
    <Link
      href={`/directory?q=${encodeURIComponent(dbCategory)}`}
      className={`group flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-4 transition-colors duration-200 ${
        empty
          ? "border-dashed border-line bg-canvas"
          : "border-line bg-white hover:border-brand/40 hover:bg-brand-50/40"
      }`}
    >
      <span className="min-w-0">
        <span
          className={`block truncate text-sm font-semibold ${
            empty ? "text-muted" : "text-ink group-hover:text-brand"
          }`}
        >
          {label}
        </span>
        <span className="mt-0.5 block text-xs text-muted">
          {empty ? "Coming soon" : `${count} ${count === 1 ? "company" : "companies"}`}
        </span>
      </span>
      <span
        className={`shrink-0 transition-colors duration-200 ${
          empty ? "text-line" : "text-line group-hover:text-brand"
        }`}
      >
        <ArrowIcon small />
      </span>
    </Link>
  );
}

function initials(name: string) {
  const words = name.trim().split(/\s+/);
  return ((words[0]?.[0] ?? "") + (words[1]?.[0] ?? "")).toUpperCase();
}

function CompanyRow({ company }: { company: DirectoryCompany }) {
  return (
    <Link
      href={`/directory/${company.slug}`}
      className="group flex cursor-pointer items-center gap-3 bg-white px-4 py-3 transition-colors duration-200 hover:bg-brand-50/50"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand to-brand-700 text-[0.65rem] font-bold text-white ring-1 ring-inset ring-white/20">
        {initials(company.name)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-ink group-hover:text-brand">
          {company.name}
        </span>
        <span className="block truncate text-xs text-muted">
          {company.category ?? company.address ?? "—"}
        </span>
      </span>
      <span className="shrink-0 text-line transition-colors duration-200 group-hover:text-brand">
        <ArrowIcon small />
      </span>
    </Link>
  );
}

function TrustItem({
  Icon,
  title,
  body,
}: {
  Icon: (p: { className?: string }) => React.ReactElement;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand ring-1 ring-inset ring-brand/10">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted">{body}</p>
      </div>
    </div>
  );
}

function Marquee() {
  const items = [
    "Pharmaceuticals",
    "IT & Software",
    "Electricals",
    "Automobiles",
    "Auto Components",
    "FMCG",
    "Plastic Mould",
    "Printing & Packaging",
  ];
  return (
    <div className="spm-marquee-track flex shrink-0 items-center gap-8 px-4">
      {items.map((t, i) => (
        <span
          key={i}
          className="flex items-center gap-8 whitespace-nowrap text-sm font-medium text-slate-400"
        >
          {t}
          <span className="text-accent/60">/</span>
        </span>
      ))}
    </div>
  );
}

function CornerFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <Bracket className="left-3 top-3" rotate={0} />
      <Bracket className="right-3 top-3" rotate={90} />
      <Bracket className="bottom-3 left-3" rotate={270} />
      <Bracket className="bottom-3 right-3" rotate={180} />
      {children}
    </div>
  );
}

function Bracket({ className, rotate }: { className: string; rotate: number }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`absolute h-5 w-5 text-white/30 ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden="true"
    >
      <path d="M1 1H8M1 1V8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/* --------------------------------- Icons --------------------------------- */

function ArrowIcon({ small }: { small?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={small ? "h-3.5 w-3.5 shrink-0" : "h-4 w-4"}
      aria-hidden="true"
    >
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

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 20l-3.2-3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3l7 2.5v5.5c0 4.5-3 8-7 9.5-4-1.5-7-5-7-9.5V5.5L12 3z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M8.7 12.2l2.2 2.2 4.2-4.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DocIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 3.5h8l4 4V20a.5.5 0 01-.5.5h-11A.5.5 0 016 20V3.5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M14 3.5V8h4M9 12h6M9 15.5h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
