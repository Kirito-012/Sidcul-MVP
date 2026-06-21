import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { SECTORS } from "@/lib/constants";
import JobCard from "@/components/JobCard";
import DirectoryCard from "@/components/DirectoryCard";

export default async function Home() {
  const session = await getSession();

  const [openJobs, verifiedCompanies, featured, directory, openSectors, directoryTotal] =
    await Promise.all([
      prisma.job.count({ where: { status: "OPEN" } }),
      prisma.companyProfile.count({ where: { verified: true } }),
      prisma.job.findMany({
        where: { status: "OPEN", company: { verified: true } },
        include: { company: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      prisma.directoryCompany.findMany({ orderBy: { name: "asc" }, take: 6 }),
      prisma.job.findMany({
        where: { status: "OPEN", company: { verified: true } },
        select: { sector: true },
      }),
      prisma.directoryCompany.count(),
    ]);

  const sectorCount = new Map<string, number>();
  for (const j of openSectors) {
    if (j.sector) sectorCount.set(j.sector, (sectorCount.get(j.sector) ?? 0) + 1);
  }

  return (
    <div>
      {/* ============== HERO ============== */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div
          className="bg-blueprint pointer-events-none absolute inset-0 opacity-[0.11]"
          style={{
            maskImage:
              "radial-gradient(115% 80% at 25% 0%, #000 35%, transparent 88%)",
            WebkitMaskImage:
              "radial-gradient(115% 80% at 25% 0%, #000 35%, transparent 88%)",
          }}
        />
        <div className="pointer-events-none absolute -right-28 -top-28 h-[28rem] w-[28rem] rounded-full bg-brand/30 blur-[100px]" />
        <div className="pointer-events-none absolute -left-32 bottom-[-6rem] h-80 w-80 rounded-full bg-accent/20 blur-[90px]" />

        <CornerFrame className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
            {/* Left column */}
            <div>
              <p className="label-tag inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-accent">
                <span className="relative grid h-2 w-2 place-items-center">
                  <span className="spm-live absolute inset-0 rounded-full bg-accent" />
                  <span className="h-2 w-2 rounded-full bg-accent" />
                </span>
                Estate Reg. No. UK-SIDCUL-HW
              </p>

              <h1 className="mt-6 max-w-2xl font-display text-4xl font-bold leading-[1.06] sm:text-[3.5rem]">
                Manufacturing jobs in the SIDCUL{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-accent to-emerald-300 bg-clip-text text-transparent">
                    Haridwar
                  </span>
                  <svg
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                    className="absolute -bottom-1.5 left-0 h-2.5 w-full text-accent"
                    aria-hidden="true"
                  >
                    <path
                      d="M0 6 Q 25 2, 50 6 T 100 6"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                    />
                  </svg>
                </span>{" "}
                industrial estate.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
                Verified manufacturers post openings. Local talent applies
                directly — no recruiters, no middlemen. From shift operators to
                QA chemists.
              </p>

              {/* Search — the marketplace CTA */}
              <form
                method="get"
                action="/jobs"
                role="search"
                className="mt-8 flex flex-col gap-2 rounded-2xl border border-white/15 bg-white/[0.06] p-2 backdrop-blur-sm sm:flex-row sm:items-center"
              >
                <div className="relative flex-1">
                  <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    name="q"
                    aria-label="Search jobs by title, skill or company"
                    placeholder="Search ‘fitter’, ‘QA chemist’, ‘packaging’…"
                    className="w-full rounded-xl border-0 bg-transparent py-2.5 pl-11 pr-3 text-[0.95rem] text-white outline-none placeholder:text-slate-400"
                  />
                </div>
                <button type="submit" className="btn btn-primary sm:px-6">
                  <SearchIcon className="h-4 w-4" />
                  Search jobs
                </button>
              </form>

              {/* Sector quick-chips */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="label-tag text-slate-400">Sectors</span>
                {SECTORS.map((s) => (
                  <Link
                    key={s}
                    href={`/jobs?sector=${encodeURIComponent(s)}`}
                    className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-xs font-medium text-slate-200 transition-colors hover:border-accent/50 hover:bg-accent/10 hover:text-white"
                  >
                    {s}
                  </Link>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/jobs" className="btn btn-primary">
                  Browse open jobs
                  <ArrowIcon />
                </Link>
                {!session && (
                  <Link
                    href="/register"
                    className="btn btn-outline border-white/20 bg-transparent text-white hover:border-white/40 hover:bg-white/10 hover:text-white"
                  >
                    Post a job / Sign up
                  </Link>
                )}
              </div>
            </div>

            {/* Live status board */}
            <div className="spm-float">
              <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.7)] backdrop-blur-sm">
                {/* terminal header */}
                <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                  <span className="label-tag ml-2 text-slate-400">
                    network_spec.live
                  </span>
                </div>

                <div className="space-y-5 p-5 font-mono">
                  <SpecBar
                    value={String(openJobs)}
                    label="Open positions"
                    pct={82}
                  />
                  <SpecBar
                    value={String(verifiedCompanies)}
                    label="Verified companies"
                    pct={64}
                  />
                  <SpecBar value="550+" label="Units in the estate" pct={95} />
                  <SpecBar
                    value={String(SECTORS.length)}
                    label="Industrial sectors"
                    pct={48}
                  />

                  <div className="flex items-center justify-between border-t border-dashed border-white/15 pt-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="spm-live h-1.5 w-1.5 rounded-full bg-accent" />
                      Live · synced from estate registry
                    </span>
                    <span>HW · UK</span>
                  </div>
                </div>
              </div>
            </div>
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

      {/* ============== STATS RIBBON ============== */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-line sm:grid-cols-4">
          <RibbonStat value={String(openJobs)} label="Open positions" />
          <RibbonStat value={String(verifiedCompanies)} label="Verified employers" />
          <RibbonStat value="550+" label="Units in estate" />
          <RibbonStat value={String(directoryTotal)} label="IT directory firms" />
        </div>
      </section>

      {/* ============== FEATURED JOBS ============== */}
      {featured.length > 0 && (
        <section className="border-t border-line bg-white">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
            <div className="mb-6 flex items-center justify-between border-b-2 border-ink pb-3">
              <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                Latest openings
              </h2>
              <Link
                href="/jobs"
                className="label-tag inline-flex items-center gap-1 text-brand hover:text-brand-600"
              >
                View all <ArrowIcon small />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============== IT DIRECTORY ============== */}
      {directory.length > 0 && (
        <section className="border-t border-line bg-canvas">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b-2 border-ink pb-3">
              <div>
                <p className="label-tag mb-1 text-brand">Industry Directory</p>
                <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                  IT companies in the SIDCUL IT Park
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Technology firms based in the SIDCUL IT Park, Sahastradhara
                  Road, Dehradun.
                </p>
              </div>
              <Link
                href="/directory"
                className="label-tag inline-flex items-center gap-1 text-brand hover:text-brand-600"
              >
                View full directory <ArrowIcon small />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {directory.map((company, i) => (
                <DirectoryCard key={company.id} company={company} index={i + 1} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============== VALUE PROPS ============== */}
      <section className="border-t border-line bg-canvas">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
          <SectionHead
            eyebrow="Why SIDCUL Careers"
            title="Built for the industrial belt"
            right="§ 01 — 03"
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <FeatureCard
              index="01"
              title="Direct hiring"
              body="Plant HR teams hire nearby ITI graduates, diploma holders and operators directly — cutting expensive third-party recruiters."
              Icon={HandshakeIcon}
            />
            <FeatureCard
              index="02"
              title="Shift & seasonal roles"
              body="Solve peak-season labour spikes with shift-basis and seasonal postings, alongside full-time technical positions."
              Icon={ClockIcon}
            />
            <FeatureCard
              index="03"
              title="Verified companies only"
              body="Every employer is a verified manufacturer in the SIDCUL estate, so students apply with confidence."
              Icon={ShieldIcon}
            />
          </div>
        </div>
      </section>

      {/* ============== HOW IT WORKS ============== */}
      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
          <SectionHead
            eyebrow="The pipeline"
            title="From registration to roster in three steps"
            right="Workflow"
          />
          <div className="relative mt-10 grid gap-8 md:grid-cols-3">
            {/* connector line */}
            <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-line to-transparent md:block" />
            <Step
              n="1"
              title="Register & verify"
              body="Manufacturers sign up and get verified against the SIDCUL estate registry."
              Icon={UserPlusIcon}
            />
            <Step
              n="2"
              title="Post or apply"
              body="Employers post roles; local candidates search and apply directly — zero middlemen."
              Icon={DocIcon}
            />
            <Step
              n="3"
              title="Hire locally"
              body="Shortlist, review applications and onboard talent from the surrounding belt."
              Icon={BriefcaseIcon}
            />
          </div>
        </div>
      </section>

      {/* ============== SECTORS ============== */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <SectionHead
          eyebrow="Explore by sector"
          title="Hiring across the SIDCUL estate"
          right={`${SECTORS.length} sectors`}
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SECTORS.map((s, i) => (
            <SectorCard
              key={s}
              name={s}
              count={sectorCount.get(s) ?? 0}
              Icon={SECTOR_ICONS[i % SECTOR_ICONS.length]}
            />
          ))}
        </div>
      </section>

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
              Hiring in the SIDCUL estate?
            </h2>
            <p className="mt-3 max-w-md text-slate-300">
              Join verified manufacturers already posting roles directly to
              local talent — no recruiter fees, ever.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/register" className="btn btn-primary">
              Get verified &amp; post a job
              <ArrowIcon />
            </Link>
            <Link
              href="/jobs"
              className="btn btn-outline border-white/20 bg-transparent text-white hover:border-white/40 hover:bg-white/10 hover:text-white"
            >
              I&apos;m looking for work
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

function RibbonStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-5 py-7 text-center sm:py-8">
      <p className="font-display text-3xl font-bold text-ink sm:text-4xl">
        {value}
      </p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted">
        {label}
      </p>
    </div>
  );
}

function FeatureCard({
  index,
  title,
  body,
  Icon,
}: {
  index: string;
  title: string;
  body: string;
  Icon: (p: { className?: string }) => React.ReactElement;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-[0_1px_2px_rgba(11,37,64,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_28px_55px_-24px_rgba(3,105,161,0.4)]">
      <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-brand to-accent transition-transform duration-500 group-hover:scale-x-100" />
      <div className="flex items-center justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand ring-1 ring-inset ring-brand/10 transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
          <Icon className="h-6 w-6" />
        </span>
        <span className="font-mono text-sm font-semibold text-line transition-colors group-hover:text-brand">
          {index}
        </span>
      </div>
      <h3 className="mt-5 font-display text-lg font-semibold text-ink">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}

function Step({
  n,
  title,
  body,
  Icon,
}: {
  n: string;
  title: string;
  body: string;
  Icon: (p: { className?: string }) => React.ReactElement;
}) {
  return (
    <div className="relative text-center">
      <div className="relative mx-auto grid h-14 w-14 place-items-center rounded-2xl border-2 border-ink bg-white text-ink shadow-[0_8px_20px_-10px_rgba(11,37,64,0.5)]">
        <Icon className="h-6 w-6" />
        <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-accent font-mono text-xs font-bold text-white">
          {n}
        </span>
      </div>
      <h3 className="mt-5 font-display text-lg font-semibold text-ink">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted">
        {body}
      </p>
    </div>
  );
}

function SectorCard({
  name,
  count,
  Icon,
}: {
  name: string;
  count: number;
  Icon: (p: { className?: string }) => React.ReactElement;
}) {
  return (
    <Link
      href={`/jobs?sector=${encodeURIComponent(name)}`}
      className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_22px_44px_-22px_rgba(3,105,161,0.4)]"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-ink to-ink-700 text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
        <Icon className="h-6 w-6" />
      </span>
      <span className="min-w-0">
        <span className="block truncate font-display font-semibold text-ink group-hover:text-brand">
          {name}
        </span>
        <span className="text-xs font-medium text-muted">
          {count} open {count === 1 ? "role" : "roles"}
        </span>
      </span>
      <ArrowIcon small />
    </Link>
  );
}

function SpecBar({
  value,
  label,
  pct,
}: {
  value: string;
  label: string;
  pct: number;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs uppercase tracking-wider text-slate-400">
          {label}
        </span>
        <span className="text-lg font-semibold text-white">{value}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="spm-bar relative h-full rounded-full bg-gradient-to-r from-brand to-accent"
          style={{ width: `${pct}%` }}
        >
          <span className="spm-sheen absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
      </div>
    </div>
  );
}

function Marquee() {
  const items = [
    "Pharmaceuticals",
    "FMCG & Packaging",
    "Electrical & Auto",
    "Allied Services",
    "ITI & Diploma",
    "Shift Operators",
    "QA & Lab",
    "Maintenance",
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

function HandshakeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 13l3-3 4 3 2-2 6 5M21 11l-3 3-2-1.5M8 10L5 7l-2 2v5l3 3M16 14l3 3 2-2V9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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

function UserPlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 19a5.5 5.5 0 0111 0M17 8v5M14.5 10.5h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
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

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3.5" y="7.5" width="17" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 7.5V6a2 2 0 012-2h2a2 2 0 012 2v1.5M3.5 12.5h17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FlaskIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M9.5 3.5v5.2L5 17a2 2 0 001.8 3h10.4A2 2 0 0019 17l-4.5-8.3V3.5M8 3.5h8M7.5 14h9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BoxIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 3l8 4.2v9.6L12 21l-8-4.2V7.2L12 3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M4 7.4l8 4.1 8-4.1M12 11.5V21" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function BoltIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M13 3L5 13h6l-1 8 8-10h-6l1-8z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function WrenchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M14.5 6a3.8 3.8 0 00-5 4.7L4 16.2 6.8 19l5.5-5.5A3.8 3.8 0 0017 8l-2.2 2.2-1.8-1.8L15.2 6.2A3.8 3.8 0 0014.5 6z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

const SECTOR_ICONS = [FlaskIcon, BoxIcon, BoltIcon, WrenchIcon];
