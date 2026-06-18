import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import JobCard from "@/components/JobCard";

export default async function Home() {
  const session = await getSession();

  const [openJobs, verifiedCompanies, featured] = await Promise.all([
    prisma.job.count({ where: { status: "OPEN" } }),
    prisma.companyProfile.count({ where: { verified: true } }),
    prisma.job.findMany({
      where: { status: "OPEN", company: { verified: true } },
      include: { company: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand">
            Hyper-Local Job Portal
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            Manufacturing jobs in the{" "}
            <span className="text-brand">SIDCUL Haridwar</span> industrial
            estate.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-300">
            Verified manufacturers post openings. Local talent applies directly
            — no recruiters, no middlemen. From shift operators to QA chemists.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/jobs" className="btn btn-primary">
              Browse open jobs
            </Link>
            {!session && (
              <Link
                href="/register"
                className="btn btn-outline border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                Post a job / Sign up
              </Link>
            )}
          </div>

          <div className="mt-12 flex flex-wrap gap-x-12 gap-y-6">
            <Stat value={`${openJobs}`} label="Open positions" />
            <Stat value={`${verifiedCompanies}`} label="Verified companies" />
            <Stat value="550+" label="Units in the estate" />
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-2xl font-bold text-ink">
          Built for the industrial belt
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          <Feature
            title="Direct hiring"
            body="Plant HR teams hire nearby ITI graduates, diploma holders and operators directly — cutting expensive third-party recruiters."
          />
          <Feature
            title="Shift & seasonal roles"
            body="Solve peak-season labour spikes with shift-basis and seasonal postings, alongside full-time technical positions."
          />
          <Feature
            title="Verified companies only"
            body="Every employer is a verified manufacturer in the SIDCUL estate, so students apply with confidence."
          />
        </div>
      </section>

      {/* Featured jobs */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pb-20">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-ink">Latest openings</h2>
            <Link href="/jobs" className="text-sm font-semibold text-brand">
              View all →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="card p-6">
      <div className="mb-3 h-9 w-9 rounded-lg bg-brand-50 ring-1 ring-brand/20" />
      <h3 className="font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}
