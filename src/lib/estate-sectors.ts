// Master Plan 2025: Physical plot sectors inside the SIDCUL Integrated Industrial Estate (IIE),
// BHEL, Haridwar, Uttarakhand (Total 1,695 Acres).
//
// Sector numbers and boundaries match the official IIE SIDCUL Revised Master Plan - 2025:
// - Sector 1A, 1B (Gateway, Commercial, CETP & Utilities)
// - Sector 2, 3, 3A, 4 (Western Industrial & Engineering Corridor)
// - Sector 5, 5A (South Industrial, Chemicals, Plastics)
// - Sector 6A (Pharma Major Hub & Commercial: Akums, Themis, Cello, Pentagon Mall)
// - Sector 6B (Northern Industrial Corridor below 70m Green Belt)
// - Sector 7 (Mega Industrial Campus: Havells, Wipro, ITC, HUL, Anchor Electricals)
// - Sector 8A, 8B, 8C (Automotive, Packaging, Mahindra & Mahindra)
// - Sector 9 (Residential: Deep Ganga Apartments & Institutional)
// - Sector 10 (Hero MotoCorp Mega Anchor Plant & Ancillaries)
// - Sector 11 (Administrative Hub, District Court & IIDC)
// - Sector 12 (Eastern Industrial Zone bordering Rawli Rao)

export type EstateSectorDef = {
  id: string;
  label: string;
  shortLabel: string;
  type: string;
  tagline: string;
  prominentTenants: string[];
  row?: number;
  col?: number;
};

export const OTHER_SECTOR_ID = "other";

export const ESTATE_SECTOR_DEFS: EstateSectorDef[] = [
  {
    id: "6A",
    label: "Sector 6A",
    shortLabel: "6A",
    type: "Pharma & Commercial Hub",
    tagline: "The premier pharmaceutical formulation & retail corridor of Haridwar",
    prominentTenants: ["Akums Drugs", "Themis Medicare", "Cello Houseware", "VLCC", "Pentagon Mall", "Hotel Radisson"],
    row: 1,
    col: 2,
  },
  {
    id: "7",
    label: "Sector 7",
    shortLabel: "7",
    type: "Mega Industrial Hub",
    tagline: "Flagship industrial giants in electricals, FMCG, and heavy manufacturing",
    prominentTenants: ["Havells India", "Wipro Limited", "ITC Limited", "Hindustan Unilever", "Anchor Electricals", "Kirby"],
    row: 1,
    col: 3,
  },
  {
    id: "10",
    label: "Sector 10",
    shortLabel: "10",
    type: "Automotive Mega Campus",
    tagline: "Hero MotoCorp anchor manufacturing facility and dedicated ancillaries park",
    prominentTenants: ["Hero MotoCorp (Plot 3)", "Rockman", "Metalman", "Napino", "Autofit", "AG Industries", "Satyam"],
    row: 1,
    col: 4,
  },
  {
    id: "6B",
    label: "Sector 6B",
    shortLabel: "6B",
    type: "Northern Industrial Corridor",
    tagline: "Heavy manufacturing and engineering plots bordering the 70m green belt",
    prominentTenants: ["Agrawal Drugs", "Devot Pharma", "Jeneka Healthcare", "La Grande Herbs", "Pfizer"],
    row: 1,
    col: 1,
  },
  {
    id: "3",
    label: "Sector 3",
    shortLabel: "3",
    type: "Central-West Industrial",
    tagline: "Diverse engineering, electrical switchgear, and packaging cluster",
    prominentTenants: ["Aludecor", "Creative Ind.", "GLS Industries", "Sunrise Containers"],
    row: 2,
    col: 1,
  },
  {
    id: "3A",
    label: "Sector 3A",
    shortLabel: "3A",
    type: "Precision Engineering",
    tagline: "Specialized metal fabrication and tool manufacturing units",
    prominentTenants: ["Auto Component Units", "Engineering Fabrication"],
    row: 2,
    col: 2,
  },
  {
    id: "5",
    label: "Sector 5",
    shortLabel: "5",
    type: "Chemicals & Consumer Goods",
    tagline: "Chemical formulation, polymer, and consumer goods manufacturing zone",
    prominentTenants: ["Akme Biotec", "Matins Health Care", "Inodaya Pharma", "Gautam Polymer"],
    row: 2,
    col: 3,
  },
  {
    id: "5A",
    label: "Sector 5A",
    shortLabel: "5A",
    type: "Light Engineering",
    tagline: "Ancillary support and processing facilities near the Rawli Rao buffer",
    prominentTenants: ["Ancillary Processing Units", "Utilities Support"],
    row: 2,
    col: 4,
  },
  {
    id: "8A",
    label: "Sector 8A",
    shortLabel: "8A",
    type: "Automotive & Engineering",
    tagline: "Commercial vehicle engineering and precision equipment zone",
    prominentTenants: ["Mahindra & Mahindra", "Automat Irrigation", "SBL Industries", "Hamilton"],
    row: 3,
    col: 1,
  },
  {
    id: "8B",
    label: "Sector 8B",
    shortLabel: "8B",
    type: "Electrical & Packaging",
    tagline: "Electrical components, automated packaging, and polymer production",
    prominentTenants: ["Montage", "Victora Auto", "EON Electrical", "Amcore"],
    row: 3,
    col: 2,
  },
  {
    id: "8C",
    label: "Sector 8C",
    shortLabel: "8C",
    type: "Industrial Expansion",
    tagline: "Medium-scale industrial plants and logistical depots",
    prominentTenants: ["Logistics Depots", "Allotted Industrial Plots"],
    row: 3,
    col: 3,
  },
  {
    id: "4",
    label: "Sector 4",
    shortLabel: "4",
    type: "Auto Components",
    tagline: "Tier-2 auto parts and machining suppliers for OEM manufacturers",
    prominentTenants: ["Auto Component Cluster", "Machining & Castings"],
    row: 3,
    col: 4,
  },
  {
    id: "9",
    label: "Sector 9",
    shortLabel: "9",
    type: "Residential & Institutional",
    tagline: "Township housing, Deep Ganga Apartments, healthcare, and educational hubs",
    prominentTenants: ["Deep Ganga Apartments", "Hospital", "Commercial Complex"],
    row: 4,
    col: 1,
  },
  {
    id: "1A",
    label: "Sector 1A",
    shortLabel: "1A",
    type: "Western Gateway & Utilities",
    tagline: "Primary gateway plots near Bahadrabad bypass road & administrative services",
    prominentTenants: ["Sub-station 220KV", "Commercial Land", "Entry Gate Terminal"],
    row: 4,
    col: 2,
  },
  {
    id: "1B",
    label: "Sector 1B",
    shortLabel: "1B",
    type: "CETP & Support Infrastructure",
    tagline: "Central Effluent Treatment Plant (CETP), truck parking, and emergency services",
    prominentTenants: ["Common Effluent Treatment Plant (CETP)", "Truck Terminal", "Fire Station"],
    row: 4,
    col: 3,
  },
  {
    id: "2",
    label: "Sector 2",
    shortLabel: "2",
    type: "Western Industrial Plots",
    tagline: "Manufacturing, electrical components, and warehouse logistics",
    prominentTenants: ["Logistics Warehousing", "Light Manufacturing"],
    row: 4,
    col: 4,
  },
  {
    id: "11",
    label: "Sector 11",
    shortLabel: "11",
    type: "Administrative & District Court",
    tagline: "Government administrative zone, District Court, and Roshnabad interface",
    prominentTenants: ["District Court Complex", "SIDCUL Administrative Wing", "BHEL Staff Quarters Border"],
    row: 5,
    col: 1,
  },
  {
    id: "12",
    label: "Sector 12",
    shortLabel: "12",
    type: "Eastern Industrial Corridor",
    tagline: "Eastern terminal industrial sector bordering the Rawli Rao river causeway",
    prominentTenants: ["Eastern Allotted Plots", "Rawli Rao Causeway Interface"],
    row: 5,
    col: 2,
  },
];

export function detectEstateSector(
  address: string | null,
  name?: string | null,
): string | null {
  const combined = `${address ?? ""} ${name ?? ""}`.toLowerCase();

  // Anchor tenant known matching
  if (combined.includes("hero moto") || combined.includes("hero honda") || combined.includes("rockman")) {
    return "10";
  }
  if (combined.includes("deep ganga")) {
    return "9";
  }
  if (combined.includes("pentagon mall") || combined.includes("radisson")) {
    return "6A";
  }
  if (
    combined.includes("havells") ||
    combined.includes("wipro") ||
    combined.includes("itc limited") ||
    combined.includes("hindustan unilever")
  ) {
    return "7";
  }
  if (combined.includes("mahindra & mahindra") || combined.includes("mahindra and mahindra")) {
    return "8A";
  }

  if (!address) return null;
  const addr = address.toLowerCase();

  // 1. Explicit regex: 'Sec-6A', 'Sector 6A', 'Sector-6B', 'Sec 10', 'Sector 8A'
  const m1 = addr.match(/sec(?:t?o?r)?[\s.-]*(\d{1,2})\s*([a-c])?\b/i);
  if (m1) {
    const num = m1[1];
    const letter = m1[2] ? m1[2].toUpperCase() : "";
    return `${num}${letter}`;
  }

  // 2. Plot notation: '54,55/6A, IIE', '25/5, iie', '13/6B'
  const m2 = addr.match(/[\/,](\d{1,2})\s*([a-c])?\s*,\s*(?:iie|sidcul)/i);
  if (m2) {
    const num = m2[1];
    const letter = m2[2] ? m2[2].toUpperCase() : "";
    return `${num}${letter}`;
  }

  // 3. 'Plot No. 13/6B'
  const m3 = addr.match(/plot[^\n,]*\/(\d{1,2})\s*([a-c])?\b/i);
  if (m3) {
    const num = m3[1];
    const letter = m3[2] ? m3[2].toUpperCase() : "";
    return `${num}${letter}`;
  }

  // 4. Sector IIDC -> Sector 11
  if (addr.includes("iidc")) {
    return "11";
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
    const detected = detectEstateSector(c.address, c.name);
    const sectorId = detected && knownIds.has(detected) ? detected : OTHER_SECTOR_ID;
    const list = map.get(sectorId) ?? [];
    list.push({ name: c.name, slug: c.slug, category: c.category });
    map.set(sectorId, list);
  }

  return map;
}
