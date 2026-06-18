import { prisma } from "@/lib/prisma";
import JobCard from "@/components/JobCard";
import { JOB_TYPES, SECTORS } from "@/lib/constants";

type Search = { q?: string; type?: string; sector?: string };

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { q, type, sector } = await searchParams;

  // Only show open jobs from verified companies.
  const jobs = await prisma.job.findMany({
    where: {
      status: "OPEN",
      company: { verified: true },
      ...(type ? { jobType: type } : {}),
      ...(sector ? { sector } : {}),
    },
    include: { company: true },
    orderBy: { createdAt: "desc" },
  });

  // Case-insensitive text search (SQLite contains is case-sensitive).
  const needle = q?.trim().toLowerCase();
  const filtered = needle
    ? jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(needle) ||
          j.description.toLowerCase().includes(needle) ||
          j.company.companyName.toLowerCase().includes(needle),
      )
    : jobs;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-2xl font-bold text-ink">Open positions</h1>
      <p className="mt-1 text-sm text-muted">
        {filtered.length} {filtered.length === 1 ? "job" : "jobs"} from verified
        SIDCUL manufacturers.
      </p>

      {/* Filters (plain GET form, no JS needed) */}
      <form
        method="get"
        className="card mt-6 grid gap-3 p-4 sm:grid-cols-[1fr_auto_auto_auto]"
      >
        <input
          name="q"
          defaultValue={q ?? ""}
          className="input"
          placeholder="Search title, skill or company…"
        />
        <select name="type" defaultValue={type ?? ""} className="select">
          <option value="">All types</option>
          {JOB_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <select name="sector" defaultValue={sector ?? ""} className="select">
          <option value="">All sectors</option>
          {SECTORS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">
          Filter
        </button>
      </form>

      {filtered.length === 0 ? (
        <div className="card mt-8 p-10 text-center text-muted">
          No jobs match your search. Try clearing the filters.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
