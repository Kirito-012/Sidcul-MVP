import { prisma } from "@/lib/prisma";
import EquipmentCard from "@/components/EquipmentCard";
import { EQUIPMENT_CATEGORIES } from "@/lib/constants";

type Search = { q?: string; category?: string };

export default async function EquipmentPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { q, category } = await searchParams;

  // Only show listed equipment from verified companies.
  const items = await prisma.equipment.findMany({
    where: {
      status: "LISTED",
      company: { verified: true },
      ...(category ? { category } : {}),
    },
    include: { company: true },
    orderBy: { createdAt: "desc" },
  });

  // Case-insensitive text search.
  const needle = q?.trim().toLowerCase();
  const filtered = needle
    ? items.filter(
        (item) =>
          item.name.toLowerCase().includes(needle) ||
          item.description.toLowerCase().includes(needle) ||
          item.company.companyName.toLowerCase().includes(needle),
      )
    : items;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-brand">
        SIDCUL Haridwar
      </p>
      <h1 className="font-display text-3xl font-bold text-ink">
        Equipment available for lease
      </h1>
      <p className="mt-1 text-sm text-muted">
        {filtered.length} {filtered.length === 1 ? "listing" : "listings"} from verified
        SIDCUL manufacturers.
      </p>

      {/* Filters (plain GET form, no JS needed) */}
      <form
        method="get"
        className="card mt-6 grid gap-3 p-4 sm:grid-cols-[1fr_auto_auto]"
      >
        <input
          name="q"
          defaultValue={q ?? ""}
          className="input"
          placeholder="Search equipment, spec or company…"
        />
        <select name="category" defaultValue={category ?? ""} className="select">
          <option value="">All categories</option>
          {EQUIPMENT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">
          Filter
        </button>
      </form>

      {filtered.length === 0 ? (
        <div className="card mt-8 p-12 text-center text-muted">
          No equipment matches your search. Try clearing the filters.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <EquipmentCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
