import Link from "next/link";
import Image from "next/image";
import type { DirectoryCompany } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { DIRECTORY_CATEGORIES } from "@/lib/constants";
import {
  ESTATE_SECTOR_DEFS,
  OTHER_SECTOR_ID,
  groupCompaniesByEstateSector,
} from "@/lib/estate-sectors";
import EstateMap from "@/components/EstateMap";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const POPULAR_SEARCHES = [
  { label: "Pharmaceuticals", q: "Pharmaceuticals" },
  { label: "IT & Software", q: "Software Companies" },
  { label: "Akums", q: "Akums" },
  { label: "Themis Medicare", q: "Themis" },
];

export default async function Home() {
  const [directoryTotal, categoryGroups, companies, allForMap, openJobs] =
    await Promise.all([
      prisma.directoryCompany.count(),
      prisma.directoryCompany.groupBy({
        by: ["category"],
        _count: { _all: true },
      }),
      prisma.directoryCompany.findMany({ orderBy: { name: "asc" }, take: 18 }),
      prisma.directoryCompany.findMany({
        select: { name: true, slug: true, address: true, category: true },
      }),
      prisma.job.count({ where: { status: "OPEN" } }),
    ]);

  const categoryCountMap = new Map(
    categoryGroups.map((g) => [g.category ?? "", g._count._all]),
  );
  const distinctCategoryCount = categoryGroups.filter((g) => g.category).length;
  const availableLetters = new Set(
    allForMap.map((n) => n.name.trim().charAt(0).toUpperCase()),
  );

  const sectorGroups = groupCompaniesByEstateSector(allForMap);
  const estateSectors = ESTATE_SECTOR_DEFS.map((def) => ({
    ...def,
    companies: sectorGroups.get(def.id) ?? [],
  }));
  const otherCompanies = sectorGroups.get(OTHER_SECTOR_ID) ?? [];

  const heroStats: [number, string][] = [
    [directoryTotal, "Companies"],
    [distinctCategoryCount, "Sectors"],
    [openJobs, openJobs === 1 ? "Open role" : "Open roles"],
  ];

  return (
    <div>
      {/* ============== HERO ============== */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="pointer-events-none absolute inset-0">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Har_Ki_Pauri_and_Clock_Tower_of_Haridwar.jpg/1920px-Har_Ki_Pauri_and_Clock_Tower_of_Haridwar.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-[0.55]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/58 via-ink-950/80 to-ink-950" />
          <div className="absolute left-1/2 top-[-12%] h-[460px] w-[min(900px,95vw)] -translate-x-1/2 rounded-full bg-brand/20 blur-[150px]" />
        </div>

        <div className="relative mx-auto max-w-3xl px-5 py-24 text-center sm:py-32">
          <p className="label-tag mx-auto inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-slate-300">
            <span className="relative grid h-2 w-2 place-items-center">
              <span className="spm-live absolute inset-0 rounded-full bg-brand" />
              <span className="h-2 w-2 rounded-full bg-brand" />
            </span>
            SIDCUL Manufacturers Association
          </p>

          <h1 className="mx-auto mt-7 max-w-2xl font-display text-[2rem] font-bold leading-[1.12] sm:text-[3.35rem]">
            Every company in the{" "}
            <span className="text-brand">Haridwar</span> industrial estate,
            in one place
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-[1rem] leading-relaxed text-slate-300 sm:text-[1.08rem]">
            Search {directoryTotal}{" "}
            verified manufacturers, pharma majors and IT firms — who they
            are, where they&apos;re based, and what they make.
          </p>

          {/* Search — the primary CTA */}
          <form
            method="get"
            action="/directory"
            role="search"
            className="mx-auto mt-9 flex max-w-xl items-center gap-2 rounded-2xl border border-white/12 bg-white/[0.06] p-2 shadow-2xl shadow-black/40 backdrop-blur"
          >
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                name="q"
                aria-label="Search companies by name, category or location"
                placeholder="Search ‘Pharma’, ‘Akums’, ‘IT Park’…"
                className="w-full border-0 bg-transparent py-2.5 pl-11 pr-3 text-[0.95rem] text-white outline-none placeholder:text-slate-400"
              />
            </div>
            <button type="submit" className="btn btn-brand shrink-0 sm:px-6">
              <SearchIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>

          <div className="mx-auto mt-4 flex max-w-xl flex-wrap items-center justify-center gap-2">
            <span className="label-tag text-slate-500">Popular</span>
            {POPULAR_SEARCHES.map((p) => (
              <Link
                key={p.label}
                href={`/directory?q=${encodeURIComponent(p.q)}`}
                className="rounded-full border border-white/12 bg-white/[0.03] px-3 py-1 text-xs font-medium text-slate-300 transition-colors duration-200 hover:border-brand/60 hover:bg-brand/10 hover:text-white"
              >
                {p.label}
              </Link>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-0">
            <dl className="flex items-center divide-x divide-white/12">
              {heroStats.map(([n, l]) => (
                <div key={l} className="px-6 sm:px-8">
                  <dt className="font-display text-2xl font-bold text-white sm:text-3xl">
                    {n}
                  </dt>
                  <dd className="label-tag mt-1 text-slate-400">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Trust marquee */}
        <div className="spm-marquee relative border-t border-white/10 py-3.5">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink-950 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink-950 to-transparent" />
          <div className="flex w-max">
            <Marquee />
            <Marquee />
          </div>
        </div>
      </section>

      {/* ============== ESTATE MAP ============== */}
      <section className="border-t border-line bg-canvas">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:py-16">
          <SectionHead
            eyebrow="Explore the estate"
            title="Find companies by location"
            right="Interactive map"
          />
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Click a sector to see which registered companies are based
            there.
          </p>

          <div className="mt-6">
            <EstateMap sectors={estateSectors} otherCompanies={otherCompanies} />
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

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {companies.map((company) => (
                <CompanyCard key={company.id} company={company} />
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
        <div className="relative h-[240px] w-full sm:h-[300px]">
          <Image
            src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1600&q=80&auto=format&fit=crop"
            alt="Manufacturing and warehousing units in the SIDCUL industrial estate"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/35 to-ink-950/10" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-5 pb-6">
            <p className="label-tag text-brand">On the ground</p>
            <p className="mt-1.5 max-w-md font-display text-xl font-bold leading-snug text-white sm:text-2xl">
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
              <span className="spm-live h-2 w-2 shrink-0 rounded-full bg-brand" />
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
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="pointer-events-none absolute inset-0">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Haridwar_from_Mansa_Devi_road.jpg/1280px-Haridwar_from_Mansa_Devi_road.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-right opacity-[0.18]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/90 to-ink-950/55" />
          <div className="absolute -right-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-brand/25 blur-[110px]" />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-5 py-20 sm:flex-row sm:items-center">
          <div>
            <p className="label-tag inline-flex items-center gap-2 text-brand">
              <span className="spm-live h-2 w-2 rounded-full bg-brand" />
              Now onboarding
            </p>
            <h2 className="mt-4 max-w-xl font-display text-3xl font-bold leading-tight sm:text-[2.5rem]">
              Is your company part of the SIDCUL estate?
            </h2>
            <p className="mt-4 max-w-md text-slate-300">
              Get listed in the directory so local talent and other
              businesses can find you — and post open roles directly, with
              no recruiter fees.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/register" className="btn btn-brand">
              Add your company
              <ArrowIcon />
            </Link>
            <Link
              href="/directory"
              className="btn btn-outline border-white/20 bg-transparent text-white hover:border-white/50 hover:bg-white/10"
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
    <div className="rule flex items-end justify-between gap-4 pb-4">
      <div>
        <p className="label-tag mb-2 text-brand">{eyebrow}</p>
        <h2 className="font-display text-2xl font-bold leading-tight text-ink sm:text-[1.9rem]">
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

function CompanyCard({ company }: { company: DirectoryCompany }) {
  return (
    <Link
      href={`/directory/${company.slug}`}
      className="group flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-[0_18px_40px_-28px_rgba(27,26,31,0.35)]"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ink text-[0.65rem] font-bold text-white">
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
    "Fire & Safety",
  ];
  return (
    <div className="spm-marquee-track flex shrink-0 items-center gap-8 px-4">
      {items.map((t, i) => (
        <span
          key={i}
          className="flex items-center gap-8 whitespace-nowrap text-sm font-medium text-slate-400"
        >
          {t}
          <span className="text-brand/50">/</span>
        </span>
      ))}
    </div>
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
