// SIDCUL Integrated Industrial Estate (IIE), BHEL, Haridwar, Uttarakhand
// Master Plan 2025 - Cartographic Geometry & Sector Polygons
//
// Accurately recreated from the official Master Plan Document:
// "REVISED / UPDATED MASTER PLAN - 2025, OF IIE, SIIDCUL AT B.H.E.L. HARIDWAR"
// (State Infrastructure & Industrial Development Corporation of Uttarakhand Ltd.)
//
// The estate shape is an irregular quadrilateral tilted ~25° NW-SE
// - Northwestern boundary: Raja Ji National Park & Shivalik foothills (green belt)
// - Southeastern boundary: Rawli Rao drainage/river corridor
// - Western tip: Sector 1A/1B gateway (Bahadrabad Bypass)
// - Eastern extent: Sectors 7, 12, 8C on the broader eastern edge

export type EstateShape = {
  id: string;
  name: string;
  shortLabel: string;
  category: "industrial" | "anchor" | "residential" | "commercial" | "administrative" | "utility";
  d: string;
  cx: number;
  cy: number;
  labelOffset?: { x: number; y: number };
  accentColor?: string;
};

export type MapLandmark = {
  id: string;
  name: string;
  sectorId: string;
  x: number;
  y: number;
  type: "major_factory" | "mall" | "institution" | "utility";
};

// Canvas dimensions - wider to accommodate the tilted layout
export const ESTATE_MAP_WIDTH = 1100;
export const ESTATE_MAP_HEIGHT = 620;

// ─────────────────────────────────────────────────────────
// ESTATE OUTER BOUNDARY (the irregular quadrilateral)
// The estate runs NW→SE with a ~25° tilt
// ─────────────────────────────────────────────────────────
export const ESTATE_OUTER_BOUNDARY =
  "M 68 340 L 90 295 L 130 230 L 175 168 L 230 116 L 310 72 L 420 42 L 540 28 L 660 30 L 780 48 L 880 78 L 960 120 L 1020 168 L 1050 220 L 1060 280 L 1055 340 L 1038 400 L 1005 452 L 960 495 L 895 530 L 810 554 L 700 568 L 580 572 L 460 564 L 350 545 L 250 515 L 170 478 L 110 432 L 78 380 Z";

// ─────────────────────────────────────────────────────────
// SECTOR POLYGONS - placed to match the physical estate plan
// ─────────────────────────────────────────────────────────
export const ESTATE_SHAPES: EstateShape[] = [
  // ── Sector 1A: Southwest Gateway & Commercial ──
  {
    id: "1A",
    name: "Sector 1A",
    shortLabel: "1A",
    category: "commercial",
    d: "M 78 380 L 110 432 L 170 478 L 200 460 L 172 400 L 130 348 L 95 340 Z",
    cx: 138,
    cy: 412,
    accentColor: "#eab308",
  },
  // ── Sector 1B: CETP & Utilities (west-southwest) ──
  {
    id: "1B",
    name: "Sector 1B",
    shortLabel: "1B",
    category: "utility",
    d: "M 95 340 L 130 348 L 172 400 L 200 460 L 250 515 L 300 500 L 250 435 L 208 370 L 175 312 L 130 290 Z",
    cx: 192,
    cy: 400,
    accentColor: "#0891b2",
  },
  // ── Sector 2: Western Industrial Plots ──
  {
    id: "2",
    name: "Sector 2",
    shortLabel: "2",
    category: "industrial",
    d: "M 130 230 L 175 168 L 230 150 L 225 210 L 205 268 L 175 312 L 130 290 Z",
    cx: 180,
    cy: 238,
    accentColor: "#7c3aed",
  },
  // ── Sector 3: Central-West Industrial Hub ──
  {
    id: "3",
    name: "Sector 3",
    shortLabel: "3",
    category: "industrial",
    d: "M 230 150 L 330 110 L 370 168 L 340 228 L 280 262 L 225 210 Z",
    cx: 296,
    cy: 190,
    accentColor: "#059669",
  },
  // ── Sector 3A: Precision Engineering ──
  {
    id: "3A",
    name: "Sector 3A",
    shortLabel: "3A",
    category: "industrial",
    d: "M 225 210 L 280 262 L 340 228 L 365 280 L 310 322 L 250 310 L 205 268 Z",
    cx: 282,
    cy: 268,
    accentColor: "#10b981",
  },
  // ── Sector 6B: Northern Industrial Corridor ──
  {
    id: "6B",
    name: "Sector 6B",
    shortLabel: "6B",
    category: "industrial",
    d: "M 330 110 L 465 68 L 510 128 L 445 168 L 370 168 Z",
    cx: 425,
    cy: 128,
    accentColor: "#d97706",
  },
  // ── Sector 6A: Premier Pharma & Commercial Hub ──
  {
    id: "6A",
    name: "Sector 6A",
    shortLabel: "6A",
    category: "commercial",
    d: "M 370 168 L 445 168 L 510 128 L 530 185 L 490 248 L 420 268 L 365 280 L 340 228 Z",
    cx: 435,
    cy: 215,
    accentColor: "#be185d",
  },
  // ── Sector 10: Hero MotoCorp Mega Campus ──
  {
    id: "10",
    name: "Sector 10",
    shortLabel: "10",
    category: "anchor",
    d: "M 465 68 L 600 42 L 700 55 L 720 120 L 650 160 L 560 165 L 510 128 Z",
    cx: 600,
    cy: 108,
    accentColor: "#0f766e",
  },
  // ── Sector 9: Residential (Deep Ganga & Institutional) ──
  {
    id: "9",
    name: "Sector 9",
    shortLabel: "9",
    category: "residential",
    d: "M 510 128 L 560 165 L 650 160 L 625 225 L 560 250 L 530 185 Z",
    cx: 575,
    cy: 188,
    accentColor: "#e11d48",
  },
  // ── Sector 7: Mega Industrial Campus (Havells, Wipro, ITC, HUL) ──
  {
    id: "7",
    name: "Sector 7",
    shortLabel: "7",
    category: "anchor",
    d: "M 700 55 L 810 72 L 900 105 L 955 152 L 920 225 L 850 265 L 760 240 L 720 190 L 720 120 Z",
    cx: 815,
    cy: 165,
    accentColor: "#4338ca",
  },
  // ── Sector 4: Auto Component Clusters ──
  {
    id: "4",
    name: "Sector 4",
    shortLabel: "4",
    category: "industrial",
    d: "M 205 268 L 250 310 L 310 322 L 375 395 L 310 430 L 250 435 L 208 370 L 175 312 Z",
    cx: 275,
    cy: 360,
    accentColor: "#2563eb",
  },
  // ── Sector 5: Chemicals & Consumer Goods ──
  {
    id: "5",
    name: "Sector 5",
    shortLabel: "5",
    category: "industrial",
    d: "M 365 280 L 420 268 L 490 248 L 560 250 L 545 325 L 480 370 L 410 385 L 375 395 L 310 322 Z",
    cx: 430,
    cy: 325,
    accentColor: "#0284c7",
  },
  // ── Sector 5A: Light Engineering & Buffer ──
  {
    id: "5A",
    name: "Sector 5A",
    shortLabel: "5A",
    category: "industrial",
    d: "M 310 430 L 375 395 L 410 385 L 480 370 L 480 435 L 420 468 L 350 472 L 300 500 Z",
    cx: 395,
    cy: 435,
    accentColor: "#0369a1",
  },
  // ── Sector 8A: Automotive & Precision Equipment (M&M) ──
  {
    id: "8A",
    name: "Sector 8A",
    shortLabel: "8A",
    category: "industrial",
    d: "M 560 250 L 625 225 L 720 190 L 760 240 L 730 310 L 660 345 L 590 348 L 545 325 Z",
    cx: 650,
    cy: 286,
    accentColor: "#b45309",
  },
  // ── Sector 8B: Electrical, Packaging & Polymers ──
  {
    id: "8B",
    name: "Sector 8B",
    shortLabel: "8B",
    category: "industrial",
    d: "M 760 240 L 850 265 L 920 225 L 950 290 L 925 355 L 860 385 L 790 375 L 730 310 Z",
    cx: 845,
    cy: 310,
    accentColor: "#c2410c",
  },
  // ── Sector 8C: Industrial Expansion (Far East) ──
  {
    id: "8C",
    name: "Sector 8C",
    shortLabel: "8C",
    category: "industrial",
    d: "M 950 290 L 1020 268 L 1050 320 L 1055 375 L 1025 420 L 975 440 L 925 430 L 925 355 Z",
    cx: 995,
    cy: 365,
    accentColor: "#ea580c",
  },
  // ── Sector 11: Administrative Hub & District Court ──
  {
    id: "11",
    name: "Sector 11",
    shortLabel: "11",
    category: "administrative",
    d: "M 590 348 L 660 345 L 730 310 L 790 375 L 860 385 L 925 430 L 895 478 L 810 505 L 700 510 L 600 492 L 480 435 L 480 370 Z",
    cx: 710,
    cy: 430,
    accentColor: "#854d0e",
  },
  // ── Sector 12: Eastern Industrial Corridor ──
  {
    id: "12",
    name: "Sector 12",
    shortLabel: "12",
    category: "industrial",
    d: "M 1020 268 L 1060 280 L 1055 340 L 1038 400 L 1005 452 L 960 495 L 895 478 L 925 430 L 975 440 L 1025 420 L 1055 375 L 1050 320 Z",
    cx: 1000,
    cy: 400,
    accentColor: "#ca8a04",
  },
];

// ─────────────────────────────────────────────────────────
// MAJOR LANDMARKS positioned on the map
// ─────────────────────────────────────────────────────────
export const MAP_LANDMARKS: MapLandmark[] = [
  {
    id: "hero",
    name: "Hero MotoCorp Ltd",
    sectorId: "10",
    x: 600,
    y: 98,
    type: "major_factory",
  },
  {
    id: "havells",
    name: "Havells & Wipro",
    sectorId: "7",
    x: 820,
    y: 145,
    type: "major_factory",
  },
  {
    id: "itc",
    name: "ITC Limited & HUL",
    sectorId: "7",
    x: 870,
    y: 195,
    type: "major_factory",
  },
  {
    id: "akums",
    name: "Akums Pharma",
    sectorId: "6A",
    x: 410,
    y: 205,
    type: "major_factory",
  },
  {
    id: "pentagon",
    name: "Pentagon Mall",
    sectorId: "6A",
    x: 470,
    y: 238,
    type: "mall",
  },
  {
    id: "deepganga",
    name: "Deep Ganga Apts",
    sectorId: "9",
    x: 575,
    y: 178,
    type: "institution",
  },
  {
    id: "mahindra",
    name: "Mahindra & Mahindra",
    sectorId: "8A",
    x: 665,
    y: 278,
    type: "major_factory",
  },
  {
    id: "court",
    name: "District Court",
    sectorId: "11",
    x: 740,
    y: 450,
    type: "institution",
  },
  {
    id: "cetp",
    name: "CETP Plant",
    sectorId: "1B",
    x: 195,
    y: 390,
    type: "utility",
  },
];

// ─────────────────────────────────────────────────────────
// GREEN BELT (70m wide, along the NW Shivalik foothills boundary)
// ─────────────────────────────────────────────────────────
export const GREEN_BELT_PATH =
  "M 60 350 L 82 295 L 120 228 L 165 162 L 222 108 L 305 65 L 415 36 L 535 22 L 655 24 L 775 42 L 875 72 L 955 112 L 1015 162 L 1048 215 L 1058 275 L 1065 280 L 1060 280 L 1050 220 L 1020 168 L 960 120 L 880 78 L 780 48 L 660 30 L 540 28 L 420 42 L 310 72 L 230 116 L 175 168 L 130 230 L 90 295 L 68 340 Z";

// ─────────────────────────────────────────────────────────
// RAWLI RAO RIVERBED (along the SE boundary)
// ─────────────────────────────────────────────────────────
export const RAWLI_RAO_PATH =
  "M 68 355 L 82 395 L 115 445 L 175 490 L 255 525 L 355 552 L 465 570 L 585 578 L 705 574 L 815 558 L 900 535 L 965 500 L 1010 458 L 1042 408 L 1060 350 L 1068 345 L 1062 410 L 1048 455 L 1015 498 L 970 535 L 910 560 L 825 580 L 715 592 L 590 596 L 470 588 L 360 570 L 260 542 L 178 508 L 118 462 L 82 410 L 62 368 Z";

// ─────────────────────────────────────────────────────────
// PRIMARY ROAD NETWORK (60m spine road + arterial connectors)
// ─────────────────────────────────────────────────────────
export const ROAD_PATHS = [
  // Main east-west spine road
  "M 95 340 L 130 290 L 175 312 L 205 268 L 225 210 L 280 262 L 310 322 L 365 280 L 420 268 L 490 248 L 545 325 L 590 348 L 660 345 L 730 310 L 790 375 L 860 385 L 925 355 L 950 290 L 1020 268",
  // Northern boundary road
  "M 230 150 L 330 110 L 465 68 L 600 42 L 700 55 L 810 72 L 900 105 L 955 152",
  // Central north-south connector (between Sec 10/9 and Sec 5/8A)
  "M 560 165 L 560 250 L 545 325",
  // Western connector (Sec 2 → Sec 1B)
  "M 175 168 L 175 312",
  // Eastern connector (Sec 7 down through 8B, 11)
  "M 720 120 L 720 190 L 760 240 L 730 310 L 790 375 L 860 385 L 925 430",
  // South connector through Sec 5A
  "M 310 430 L 375 395 L 480 370 L 480 435",
];
