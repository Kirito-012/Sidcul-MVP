// Physical plot sectors inside the SIDCUL Integrated Industrial Estate (IIE),
// Haridwar — distinct from the *industry* categories in constants.ts
// (Pharmaceuticals, IT & Software, ...). A company's estate sector is derived
// from its stored street address (e.g. "Sec-6A", "Sector 8B"), so the
// grouping below reflects real records, not placeholder data. Sectors with
// no matching address are grouped into OTHER_SECTOR_ID.
//
// The grid position (row/col) is a schematic layout for the on-site map —
// SIDCUL doesn't publish a public GIS plot, so exact plot geometry isn't
// available; sector numbers and names themselves are real.
export type EstateSectorDef = {
  id: string;
  label: string;
  row: number;
  col: number;
};

export const OTHER_SECTOR_ID = "other";

export const ESTATE_SECTOR_DEFS: EstateSectorDef[] = [
  { id: "3", label: "Sector 3", row: 1, col: 1 },
  { id: "5", label: "Sector 5", row: 1, col: 2 },
  { id: "6A", label: "Sector 6A", row: 1, col: 3 },
  { id: "6B", label: "Sector 6B", row: 1, col: 4 },
  { id: "7", label: "Sector 7", row: 2, col: 1 },
  { id: "8A", label: "Sector 8A", row: 2, col: 2 },
  { id: "8B", label: "Sector 8B", row: 2, col: 3 },
];

export function detectEstateSector(address: string | null): string | null {
  if (!address) return null;
  const lower = address.toLowerCase();

  const compact = lower.replace(/[^a-z0-9]/g, "");
  const m1 = compact.match(/sec(?:t?o?r)?(\d{1,2})(a|b)?/);
  if (m1) return m1[2] ? `${m1[1]}${m1[2].toUpperCase()}` : m1[1];

  const tokens = lower.split(/[^a-z0-9]+/);
  for (const t of tokens) {
    const m2 = t.match(/^(\d{1,2})(a|b)$/);
    if (m2) return `${m2[1]}${m2[2].toUpperCase()}`;
  }
  return null;
}

export type EstateSectorCompany = {
  name: string;
  slug: string;
  category: string | null;
};

export function groupCompaniesByEstateSector<
  T extends { name: string; slug: string; category: string | null; address: string | null },
>(companies: T[]): Map<string, EstateSectorCompany[]> {
  const knownIds = new Set(ESTATE_SECTOR_DEFS.map((s) => s.id));
  const map = new Map<string, EstateSectorCompany[]>();

  for (const c of companies) {
    const detected = detectEstateSector(c.address);
    const sectorId = detected && knownIds.has(detected) ? detected : OTHER_SECTOR_ID;
    const list = map.get(sectorId) ?? [];
    list.push({ name: c.name, slug: c.slug, category: c.category });
    map.set(sectorId, list);
  }

  return map;
}
