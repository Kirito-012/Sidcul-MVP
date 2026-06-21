import { prisma } from "@/lib/prisma";
import DirectoryCard from "@/components/DirectoryCard";

export const metadata = {
  title: "SIDCUL IT Park Directory — IT Companies in Dehradun",
};

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const companies = await prisma.directoryCompany.findMany({
    orderBy: { name: "asc" },
  });

  const needle = q?.trim().toLowerCase();
  const filtered = needle
    ? companies.filter(
        (c) =>
          c.name.toLowerCase().includes(needle) ||
          (c.category ?? "").toLowerCase().includes(needle) ||
          (c.address ?? "").toLowerCase().includes(needle),
      )
    : companies;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-brand">
        Industry Directory
      </p>
      <h1 className="font-display text-3xl font-bold text-ink">
        SIDCUL IT Park directory
      </h1>
      <p className="mt-1 text-sm text-muted">
        {filtered.length} IT / technology{" "}
        {filtered.length === 1 ? "company" : "companies"} in the SIDCUL IT Park,
        Sahastradhara Road, Dehradun.
      </p>

      <form method="get" className="card mt-6 flex gap-3 p-4">
        <input
          name="q"
          defaultValue={q ?? ""}
          className="input"
          placeholder="Search company, category or address…"
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {filtered.length === 0 ? (
        <div className="card mt-8 p-12 text-center text-muted">
          No companies found.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <DirectoryCard key={c.id} company={c} />
          ))}
        </div>
      )}
    </div>
  );
}
