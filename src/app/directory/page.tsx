import { prisma } from "@/lib/prisma";
import DirectoryCard from "@/components/DirectoryCard";

export const metadata = {
  title: "SIDCUL Business Directory — Companies in the Haridwar Estate",
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

  const sectors = Array.from(
    new Set(
      companies
        .map((c) => c.category?.trim())
        .filter((c): c is string => Boolean(c)),
    ),
  ).sort();

  const activeLetter = letter?.trim().toUpperCase().slice(0, 1) || null;
  const needle = q?.trim().toLowerCase();
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
      {/* Header band */}
      <section className="relative overflow-hidden bg-ink text-white">
        {/* Engineering grid that fades toward the search bar */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage:
              "radial-gradient(120% 80% at 30% 0%, #000 35%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(120% 80% at 30% 0%, #000 35%, transparent 85%)",
          }}
        />
        {/* Ambient color glows */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-14 sm:pt-16">
          <p className="label-tag text-accent">
            <span className="inline-block h-2 w-2 bg-accent" />
            Industry Directory
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-[1.08] sm:text-5xl">
            SIDCUL business{" "}
            <span className="bg-gradient-to-r from-accent to-emerald-300 bg-clip-text text-transparent">
              directory
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-slate-300">
            A curated registry of {total}&nbsp;manufacturers and IT firms
            across the SIDCUL Haridwar estate and the IT Park, Dehradun —
            search, explore, and connect.
          </p>

          {/* Stat strip */}
          <dl className="mt-9 flex flex-wrap items-stretch gap-x-8 gap-y-5 border-t border-white/10 pt-6">
            <Stat value={String(total)} label="Companies listed" />
            <Divider />
            <Stat
              value={String(sectors.length || total)}
              label={sectors.length ? "Sectors covered" : "Active records"}
            />
            <Divider />
            <Stat value="Dehradun" label="Sahastradhara Road" />
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 pb-16">
        {/* Floating search — overlaps the band for depth */}
        <form
          method="get"
          role="search"
          className="relative z-10 -mt-9 flex flex-col gap-2 rounded-2xl border border-line bg-white p-2.5 shadow-[0_24px_60px_-24px_rgba(11,37,64,0.45)] ring-1 ring-black/[0.02] sm:flex-row sm:items-center"
        >
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <input
              name="q"
              defaultValue={q ?? ""}
              aria-label="Search directory by company or address"
              placeholder="Search by company name, sector, or address…"
              className="w-full rounded-lg border-0 bg-transparent py-3 pl-12 pr-3 text-[0.98rem] text-ink outline-none placeholder:text-muted"
            />
          </div>
          {isFiltered && (
            <a href="/directory" className="btn btn-ghost">
              Clear
            </a>
          )}
          <button type="submit" className="btn btn-primary sm:px-7">
            <SearchIcon className="h-4 w-4" />
            Search
          </button>
        </form>

        {/* Quick-filter sector chips */}
        {sectors.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="label-tag mr-1 text-muted">Browse</span>
            <a
              href="/directory"
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-200 ${
                !isFiltered
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-white text-ink-700 hover:border-brand hover:text-brand"
              }`}
            >
              All
            </a>
            {sectors.map((sector) => {
              const active = !activeLetter && needle === sector.toLowerCase();
              return (
                <a
                  key={sector}
                  href={`/directory?q=${encodeURIComponent(sector)}`}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-200 ${
                    active
                      ? "border-brand bg-brand text-white"
                      : "border-line bg-white text-ink-700 hover:border-brand hover:text-brand"
                  }`}
                >
                  {sector}
                </a>
              );
            })}
          </div>
        )}

        {/* A–Z jump strip */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <span className="label-tag mr-1 text-muted">Jump to</span>
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letterChar) => {
            const has = availableLetters.has(letterChar);
            const active = activeLetter === letterChar;
            if (!has) {
              return (
                <span
                  key={letterChar}
                  className="grid h-7 w-7 place-items-center rounded-md text-xs font-semibold text-line"
                >
                  {letterChar}
                </span>
              );
            }
            return (
              <a
                key={letterChar}
                href={`/directory?letter=${letterChar}`}
                className={`grid h-7 w-7 place-items-center rounded-md text-xs font-semibold transition-colors duration-200 ${
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

        {/* Registry header */}
        <div className="mt-10 flex items-center justify-between border-b-2 border-ink pb-3">
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
          <p className="label-tag hidden text-muted sm:block">Sorted A–Z</p>
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
              Try a shorter or different term — for example a company name or
              locality.
            </p>
            <a href="/directory" className="btn btn-primary mt-5">
              View all {total} companies
            </a>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c, i) => (
              <DirectoryCard key={c.id} company={c} index={i + 1} />
            ))}
          </div>
        )}

        <p className="mt-8 text-xs text-muted">
          Listing data compiled from public business directories.
        </p>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <dd className="font-display text-2xl font-bold leading-none text-white sm:text-3xl">
        {value}
      </dd>
      <dt className="mt-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">
        {label}
      </dt>
    </div>
  );
}

function Divider() {
  return <span className="hidden w-px self-stretch bg-white/10 sm:block" />;
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
