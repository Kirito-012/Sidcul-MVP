import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import JobCard from "@/components/JobCard";
import DirectoryCard from "@/components/DirectoryCard";

export default async function Home() {
  const session = await getSession();

  const [openJobs, verifiedCompanies, featured, directory] = await Promise.all([
    prisma.job.count({ where: { status: "OPEN" } }),
    prisma.companyProfile.count({ where: { verified: true } }),
    prisma.job.findMany({
      where: { status: "OPEN", company: { verified: true } },
      include: { company: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.directoryCompany.findMany({
      orderBy: { name: "asc" },
      take: 6,
    }),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <CornerFrame className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div>
              <p className="label-tag text-accent">
                <span className="inline-block h-2 w-2 bg-accent" />
                Estate Reg. No. UK-SIDCUL-HW
              </p>
              <h1 className="mt-5 max-w-2xl font-display text-4xl font-bold leading-[1.08] sm:text-[3.4rem]">
                Manufacturing jobs in the SIDCUL{" "}
                <span className="relative inline-block">
                  Haridwar
                  <svg
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                    className="absolute -bottom-1 left-0 h-2.5 w-full text-accent"
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
                directly — no recruiters, no middlemen. From shift operators
                to QA chemists.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
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

            {/* Spec panel */}
            <div className="border border-white/15 bg-white/[0.03] p-5 font-mono">
              <p className="label-tag mb-4 text-slate-400">Network Spec</p>
              <SpecRow value={`${openJobs}`} label="Open positions" />
              <SpecRow value={`${verifiedCompanies}`} label="Verified companies" />
              <SpecRow value="550+" label="Units in the estate" last />
            </div>
          </div>
        </CornerFrame>
      </section>

      {/* Value props — numbered spec rows */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="flex items-baseline justify-between border-b-2 border-ink pb-3">
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            Built for the industrial belt
          </h2>
          <p className="label-tag hidden text-muted sm:inline">§ 01 — 03</p>
        </div>
        <div>
          <SpecFeature
            index="01"
            title="Direct hiring"
            body="Plant HR teams hire nearby ITI graduates, diploma holders and operators directly — cutting expensive third-party recruiters."
          />
          <SpecFeature
            index="02"
            title="Shift & seasonal roles"
            body="Solve peak-season labour spikes with shift-basis and seasonal postings, alongside full-time technical positions."
          />
          <SpecFeature
            index="03"
            title="Verified companies only"
            body="Every employer is a verified manufacturer in the SIDCUL estate, so students apply with confidence."
            last
          />
        </div>
      </section>

      {/* Featured jobs */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pb-20">
          <div className="mb-6 flex items-center justify-between border-b-2 border-ink pb-3">
            <h2 className="font-display text-2xl font-bold text-ink">
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
        </section>
      )}

      {/* IT company directory */}
      {directory.length > 0 && (
        <section className="border-t border-line bg-white">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b-2 border-ink pb-3">
              <div>
                <p className="label-tag mb-1 text-brand">
                  Industry Directory
                </p>
                <h2 className="font-display text-2xl font-bold text-ink">
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
              {directory.map((company) => (
                <DirectoryCard key={company.id} company={company} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-y-2 border-ink bg-brand-50">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:py-16">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="label-tag text-brand">Now onboarding</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
                Hiring in the SIDCUL estate?
              </h2>
              <p className="mt-2 max-w-md text-muted">
                Join verified manufacturers already posting roles directly to
                local talent — no recruiter fees.
              </p>
            </div>
            <Link href="/register" className="btn btn-primary shrink-0">
              Get verified & post a job
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>
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

function Bracket({
  className,
  rotate,
}: {
  className: string;
  rotate: number;
}) {
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

function SpecRow({
  value,
  label,
  last,
}: {
  value: string;
  label: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-baseline justify-between gap-3 py-3 ${
        last ? "" : "border-b border-dashed border-white/15"
      }`}
    >
      <span className="text-xs uppercase tracking-wider text-slate-400">
        {label}
      </span>
      <span className="text-xl font-semibold text-white">{value}</span>
    </div>
  );
}

function SpecFeature({
  index,
  title,
  body,
  last,
}: {
  index: string;
  title: string;
  body: string;
  last?: boolean;
}) {
  return (
    <div
      className={`grid gap-4 py-7 sm:grid-cols-[3.5rem_1fr_2fr] sm:items-baseline ${
        last ? "" : "border-b border-line"
      }`}
    >
      <span className="font-mono text-sm text-brand">{index}</span>
      <h3 className="font-display font-semibold text-ink">{title}</h3>
      <p className="text-sm leading-relaxed text-muted sm:max-w-md">{body}</p>
    </div>
  );
}

function ArrowIcon({ small }: { small?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={small ? "h-3.5 w-3.5" : "h-4 w-4"}
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
