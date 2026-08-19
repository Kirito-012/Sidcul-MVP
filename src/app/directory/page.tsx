import Link from "next/link";
import type { DirectoryCompany } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { DIRECTORY_CATEGORIES } from "@/lib/constants";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const metadata = {
  title: "Business Directory — SIDCUL Hub",
};

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; letter?: string }>;
}) {
  const { q, letter } = await searchParams;

  const companies = await prisma.directoryCompany.findMany({
    orderBy: { name: "asc" },
  });
  const total = companies.length;

  const categoryCounts = new Map<string, number>();
  for (const c of companies) {
    if (!c.category) continue;
    categoryCounts.set(c.category, (categoryCounts.get(c.category) ?? 0) + 1);
  }

  const activeLetter = letter?.trim().toUpperCase().slice(0, 1) || null;
  const needle = q?.trim().toLowerCase();
  const activeCategory = DIRECTORY_CATEGORIES.find(
    (cat) => needle === cat.dbCategory.toLowerCase(),
  );

  const filtered = companies.filter((c) => {
    if (activeLetter && !c.name.trim().toUpperCase().startsWith(activeLetter)) {
      return false;
    }
    if (needle) {
      return (
        c.name.toLowerCase().includes(needle) ||
        (c.category ?? "").toLowerCase().includes(needle) ||
        (c.address ?? "").toLowerCase().includes(needle)
      );
    }
    return true;
  });
  const isFiltered = Boolean(needle || activeLetter);

  const availableLetters = new Set(
    companies.map((c) => c.name.trim().charAt(0).toUpperCase()),
  );

  return (
    <div>
      {/* Slim functional header — not a marketing hero */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:py-10">
          <p className="label-tag text-brand">Industry Directory</p>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
            SIDCUL business directory
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted sm:text-[0.95rem]">
            A curated registry of {total} manufacturers and IT firms across
            the SIDCUL Haridwar industrial estate.
          </p>

          <form
            method="get"
            role="search"
            className="mt-6 flex flex-col gap-2 rounded-xl border border-line bg-canvas p-1.5 sm:flex-row sm:items-center"
          >
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted" />
              <input
                name="q"
                defaultValue={q ?? ""}
                aria-label="Search directory by company or address"
                placeholder="Search by company name, sector, or address…"
                className="w-full rounded-lg border-0 bg-transparent py-2.5 pl-10 pr-3 text-[0.95rem] text-ink outline-none placeholder:text-muted"
              />
            </div>
            {isFiltered && (
              <a href="/directory" className="btn btn-ghost btn-sm">
                Clear
              </a>
            )}
            <button type="submit" className="btn btn-primary btn-sm sm:px-6">
              <SearchIcon className="h-4 w-4" />
              Search
            </button>
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-10 lg:grid lg:grid-cols-[260px_1fr] lg:items-start lg:gap-10">
        {/* ============== SIDEBAR: facets ============== */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="label-tag mb-3 text-muted">Browse by sector</p>
            <nav className="flex flex-col gap-0.5">
              <FacetLink
                href="/directory"
                label="All companies"
                count={total}
                active={!isFiltered}
              />
              {DIRECTORY_CATEGORIES.map((cat) => {
                const count = categoryCounts.get(cat.dbCategory) ?? 0;
                const active =
                  !activeLetter && activeCategory?.dbCategory === cat.dbCategory;
                return (
                  <FacetLink
                    key={cat.dbCategory}
                    href={`/directory?q=${encodeURIComponent(cat.dbCategory)}`}
                    label={cat.label}
                    count={count}
                    active={active}
                    disabled={count === 0}
                  />
                );
              })}
            </nav>
          </div>

          <div className="mt-4 rounded-2xl border border-line bg-white p-4">
            <p className="label-tag mb-3 text-muted">Jump to letter</p>
            <div className="grid grid-cols-7 gap-1 lg:grid-cols-6">
              {ALPHABET.map((letterChar) => {
                const has = availableLetters.has(letterChar);
                const active = activeLetter === letterChar;
                if (!has) {
                  return (
                    <span
                      key={letterChar}
                      className="grid h-8 place-items-center rounded-md text-xs font-semibold text-line"
                    >
                      {letterChar}
                    </span>
                  );
                }
                return (
                  <a
                    key={letterChar}
                    href={`/directory?letter=${letterChar}`}
                    className={`grid h-8 cursor-pointer place-items-center rounded-md text-xs font-semibold transition-colors duration-200 ${
                      active
                        ? "bg-brand text-white"
                        : "text-ink-700 hover:bg-brand-50 hover:text-brand"
                    }`}
                  >
                    {letterChar}
                  </a>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ============== MAIN: results list ============== */}
        <main className="mt-8 lg:mt-0">
          <div className="flex items-center justify-between border-b-2 border-ink pb-3">
            <p className="label-tag text-muted">
              {isFiltered ? (
                <>
                  Showing <span className="text-ink">{filtered.length}</span> /{" "}
                  {total}
                </>
              ) : (
                <>
                  Index · <span className="text-ink">{total}</span> records
                </>
              )}
            </p>
            <p className="label-tag text-muted">Sorted A–Z</p>
          </div>

          {filtered.length === 0 ? (
            <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-line bg-white px-5 py-16 text-center shadow-sm">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand">
                <SearchIcon className="h-6 w-6" />
              </span>
              <p className="mt-4 font-display text-lg font-semibold text-ink">
                {needle
                  ? `No companies match "${q}"`
                  : `No companies start with "${activeLetter}"`}
              </p>
              <p className="mt-1 max-w-sm text-sm text-muted">
                Try a shorter or different term — for example a company name
                or locality.
              </p>
              <a href="/directory" className="btn btn-primary mt-5">
                View all {total} companies
              </a>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
              {filtered.map((c, i) => (
                <DirectoryListRow key={c.id} company={c} index={i + 1} />
              ))}
            </div>
          )}

          <p className="mt-6 text-xs text-muted">
            Listing data compiled from public business directories.
          </p>
        </main>
      </div>
    </div>
  );
}

function FacetLink({
  href,
  label,
  count,
  active,
  disabled,
}: {
  href: string;
  label: string;
  count: number;
  active?: boolean;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <span className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-line">
        {label}
        <span className="font-mono text-xs">0</span>
      </span>
    );
  }
  return (
    <a
      href={href}
      className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
        active
          ? "bg-brand text-white"
          : "text-ink-700 hover:bg-brand-50 hover:text-brand"
      }`}
    >
      <span className="truncate">{label}</span>
      <span
        className={`ml-2 shrink-0 font-mono text-xs ${active ? "text-white/80" : "text-muted"}`}
      >
        {count}
      </span>
    </a>
  );
}

function initialsOf(name: string) {
  const words = name.trim().split(/\s+/);
  return ((words[0]?.[0] ?? "") + (words[1]?.[0] ?? "")).toUpperCase();
}

function DirectoryListRow({
  company,
  index,
}: {
  company: DirectoryCompany;
  index: number;
}) {
  return (
    <Link
      href={`/directory/${company.slug}`}
      className="group flex cursor-pointer items-center gap-3 px-4 py-3.5 transition-colors duration-200 hover:bg-brand-50/40 sm:gap-4 sm:px-5"
    >
      <span className="hidden w-7 shrink-0 font-mono text-xs text-line sm:block">
        {String(index).padStart(2, "0")}
      </span>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand to-brand-700 text-[0.65rem] font-bold text-white ring-1 ring-inset ring-white/20">
        {initialsOf(company.name)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-[0.95rem] font-semibold text-ink group-hover:text-brand">
          {company.name}
        </span>
        {company.address && (
          <span className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted">
            <PinIcon className="h-3 w-3 shrink-0 text-brand/60" />
            <span className="truncate">{company.address}</span>
          </span>
        )}
      </span>
      {company.category && (
        <span className="hidden shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-brand-700 sm:inline-flex">
          {company.category}
        </span>
      )}
      <span className="shrink-0 text-line transition-colors duration-200 group-hover:text-brand">
        <ArrowIcon className="h-4 w-4" />
      </span>
    </Link>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M20 20l-3.2-3.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
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
