"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { EstateSectorDef, EstateSectorCompany } from "@/lib/estate-sectors";
import {
  ESTATE_MAP_HEIGHT,
  ESTATE_MAP_WIDTH,
  ESTATE_SHAPES,
  ESTATE_OUTER_BOUNDARY,
  MAP_LANDMARKS,
  GREEN_BELT_PATH,
  RAWLI_RAO_PATH,
  ROAD_PATHS,
} from "@/lib/estate-shapes";

type SectorWithCompanies = EstateSectorDef & { companies: EstateSectorCompany[] };

const OTHER_ID = "other";

const HARIDWAR_SECTOR_POLYGONS = [
  { id: "10", points: "362,20 360.5,22.5 363.5,75.5 362,85 364,88.5 365,105 367,109 366,124.5 376.5,286 373,296 374.5,316 377.5,322 373.5,333 376,339 377.5,354 390.5,357.5 482.5,359 488,354 496,360 650,364 663,360.5 664.5,358 664,167.5 615,85 608,82 513,72.5 370.5,19.5" },
  { id: "11", points: "642,113 640,116 641,120 668,164.5 670.5,572.5 675.5,574.5 796,552.5 869.5,532.5 872,525.5 878,523 889.5,513 890.5,506.5 887.5,503 866,498 861.5,494 859.5,489.5 859,474 861,451.5 858,427 844.5,405.5 833,380.5 811.5,365 796.5,351 787.5,339.5 777.5,331.5 771,318.5 762.5,311 761.5,307 757.5,304 752.5,280 739,245 738.5,217.5 746,199 764.5,167 761,160.5 759.5,144.5 744,140 738.5,135.5 725.5,133 719.5,126 645.5,112" },
  { id: "12", points: "875,551.5 867,546.5 857,546 802.5,557 677.5,578.5 665,584.5 663.5,587 664,690 667.5,697 671.5,699 691,699.5 728,692 729.5,683.5 722.5,669 729.5,661.5 736.5,663 755.5,659 764.5,661 777,658.5 785,653.5 810,649 819,644 826.5,647 834,642 851,641 868.5,620.5 881.5,588.5 880.5,569" },
  { id: "1A", points: "662,585 657,583 518,609.5 516.5,612 517.5,624 513.5,650 516,659 509.5,709 513,717.5 514,727 526.5,729 657.5,733.5 667,732.5 669.5,729 670,702.5 662.5,689" },
  { id: "1B", points: "511.5,726.5 512.5,718 509,709 515.5,659 513,652 517,624 514.5,611 508.5,610.5 420.5,627 408,634.5 394,637 386.5,642 386.5,656.5 457.5,725 461.5,726.5 508,728" },
  { id: "2", points: "282.5,601 283.5,605 330,647.5 333,648.5 337.5,647.5 340,644.5 341.5,634 354.5,620 367,628.5 374.5,625 409,618.5 418.5,622 475,611.5 479,610 480.5,607.5 478.5,602 369.5,496 366.5,495 362.5,496 297.5,561 296.5,568.5 302,576" },
  { id: "3", points: "174.5,313.5 108,382.5 107,389.5 128.5,411.5 187,459.5 188.5,462.5 186.5,467.5 190,472 230,504 244,520 289.5,563 294.5,563.5 361,497 362,490 232,363 228,357 207,337.5 206,333.5 201.5,329 196,327.5 186.5,318.5 185,314" },
  { id: "3A", points: "185,307.5 186,312.5 190,314.5 203,327.5 206.5,333.5 226,348 230.5,344.5 229,339.5 230,337.5 240,337 252,331 321,332.5 328.5,330 333,332 370,332 373.5,330.5 376.5,323 374,316 373,298 366.5,292.5 334,293.5 326,296.5 316,293.5 267.5,292.5 258,296.5 252.5,297 246,295 228.5,278 225.5,277 211,279.5" },
  { id: "4", points: "51.5,193 48,198 19,268 20,272 29.5,283 15,298 14,302 25,314 30,315.5 65.5,350 60,358 61,362.5 71,369.5 76.5,368.5 86,382 90.5,382.5 96.5,380.5 101,384 105.5,384 175.5,312 176.5,307.5 59,193" },
  { id: "5", points: "97.5,129 57,181.5 54.5,188.5 177,306.5 183.5,307 204.5,286.5 212,277 212,269.5 216.5,261 217.5,233.5 110.5,129.5" },
  { id: "5A", points: "275,17.5 271,26 269.5,76.5 273,80.5 277.5,82.5 358,83.5 361.5,82 363,75.5 360,23 358.5,20.5 354.5,19 284,16" },
  { id: "6A", points: "103,120.5 102,124.5 103.5,127 110,128.5 218,232.5 217,261.5 212.5,269.5 214,277 220,278 227.5,276.5 246,294.5 252.5,296.5 259.5,295.5 266.5,292 316,293 325.5,295.5 334,293 364.5,291.5 370,293.5 373.5,292 375.5,288 365,116.5 366.5,109 364.5,105 363.5,88.5 361.5,85 358.5,84 276,83 269,77.5 270.5,25 273,21 271.5,16.5 267,15.5 263,17 255.5,14 250.5,16.5 228.5,16 224.5,18 221,79.5 139.5,78.5" },
  { id: "6B", points: "241.5,336.5 235,344.5 230,346.5 230,353.5 299,420.5 311,430 315,429 370.5,371.5 371.5,364 376.5,356.5 375,336.5 370,332.5 332,332.5 327.5,330.5 322,333 252,331.5" },
  { id: "7", points: "338,408 317,429.5 315.5,432.5 316.5,436.5 394.5,512.5 404,512.5 427.5,490 427.5,480.5 353.5,408" },
  { id: "8A", points: "402,516 403,520.5 492.5,607.5 591,589.5 594,585.5 592,578 592.5,571.5 595.5,566 592.5,558.5 594,506 584.5,492.5 431,489 423,494.5" },
  { id: "8B", points: "346,401 347.5,405.5 353,407 429.5,482 429.5,485 432,488 580.5,491 585.5,492 590.5,500.5 594.5,502.5 599.5,499.5 605,491.5 655,492.5 660.5,494.5 665,491 663.5,485.5 665,481.5 664,431.5 660.5,430 629.5,430 606,407.5 600.5,404.5 600.5,397.5 594.5,389 594.5,366.5 592,363.5 494.5,360.5 488,356.5 482,360 390.5,358 380,356.5 375,360.5 378,367" },
  { id: "8C", points: "663,363 660,362 654.5,364.5 599.5,363 596,364.5 595,389 600.5,396 601,403 627.5,428.5 660.5,429.5 664,428 665,376 663.5,373.5 664.5,365.5" },
  { id: "9", points: "604,493 594.5,506.5 593,558 596,566 593,571.5 592.5,578 595.5,587 600,588.5 662,576.5 664.5,573 664,496.5 654,493" },
] as const;

function initialsOf(name: string) {
  const words = name.trim().split(/\s+/);
  return ((words[0]?.[0] ?? "") + (words[1]?.[0] ?? "")).toUpperCase();
}

export default function EstateMap({
  sectors,
  otherCompanies,
}: {
  sectors: SectorWithCompanies[];
  otherCompanies: EstateSectorCompany[];
}) {
  // Find sector with highest registered company count
  const busiest = useMemo(() => {
    const sorted = [...sectors].sort((a, b) => b.companies.length - a.companies.length);
    return sorted[0] ?? null;
  }, [sectors]);

  const [selected, setSelected] = useState<string>(busiest?.id ?? "6A");
  const [hovered, setHovered] = useState<string | null>(null);
  const [showLandmarks, setShowLandmarks] = useState<boolean>(true);
  const [showRoads, setShowRoads] = useState<boolean>(true);
  const [companySearch, setCompanySearch] = useState<string>("");

  const selectedSectorDef = sectors.find((s) => s.id === selected);

  const labelFor = (id: string) => {
    if (id === OTHER_ID) return "Other Registered Units";
    const sec = sectors.find((s) => s.id === id);
    return sec?.label ?? `Sector ${id}`;
  };

  const companiesFor = (id: string) => {
    if (id === OTHER_ID) return otherCompanies;
    return sectors.find((s) => s.id === id)?.companies ?? [];
  };

  const activeCompanies = useMemo(() => {
    const list = companiesFor(selected);
    if (!companySearch.trim()) return list;
    const q = companySearch.toLowerCase();
    return list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.category && c.category.toLowerCase().includes(q)),
    );
  }, [selected, companySearch, sectors, otherCompanies]);

  const activeSectorShape = ESTATE_SHAPES.find((s) => s.id === selected);

  // Sector fill styling in modern architectural cartography
  function fillFor(id: string) {
    if (id === selected) return "#c1121f"; // Brand active accent
    if (id === hovered) return "#fef3c7"; // Warm highlight
    // Categorical subtle paper tones
    const shape = ESTATE_SHAPES.find((s) => s.id === id);
    if (shape?.category === "anchor") return "#e8edf2"; // Industrial anchor tone
    if (shape?.category === "commercial") return "#fbf0f4"; // Commercial/Pharma rose tint
    if (shape?.category === "residential") return "#fcf5ee"; // Residential warm tint
    if (shape?.category === "administrative") return "#fef9ee"; // Admin tone
    return "#f3f0ea"; // Standard industrial plots
  }

  function strokeFor(id: string) {
    if (id === selected) return "#7f0b14";
    if (id === hovered) return "#b45309";
    return "#cfc8b9";
  }

  function textColorFor(id: string) {
    if (id === selected) return "#ffffff";
    return "#1b1a1f";
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr] lg:items-start">
      {/* ============== MAP CANVAS ============== */}
      <div className="relative overflow-hidden rounded-2xl border border-line bg-[#fdfbf7] p-4 shadow-sm sm:p-6">
        {/* Top Header & Map Controls */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-line/60 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand" />
              <p className="label-tag font-bold text-brand">
                Master Plan 2025 · IIE SIDCUL Haridwar
              </p>
            </div>
            <h3 className="mt-0.5 font-display text-lg font-bold text-ink sm:text-xl">
              1,695-Acre Industrial Estate Master Layout
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-lg border border-brand/20 bg-brand-50 px-2.5 py-1 font-medium text-brand">
              Select a sector to explore companies
            </span>
            <div className="hidden shrink-0 items-center gap-1 rounded-lg border border-line bg-white px-2 py-1 text-ink-700 sm:flex">
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 text-brand" aria-hidden="true">
                <path d="M12 2l3 7-3-1.5L9 9l3-7z" fill="currentColor" />
                <path d="M12 22V9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <span className="font-mono text-[0.65rem] font-bold">N</span>
            </div>
          </div>
        </div>

        {/* Quick Sector Selector Bar */}
        <div className="mb-3 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[0.7rem] font-bold uppercase tracking-wider text-muted">
            Sectors:
          </span>
          {ESTATE_SHAPES.map((s) => {
            const count = companiesFor(s.id).length;
            const isSel = selected === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelected(s.id)}
                onMouseEnter={() => setHovered(s.id)}
                onMouseLeave={() => setHovered(null)}
                className={`flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[0.72rem] font-semibold transition-all ${
                  isSel
                    ? "bg-brand text-white shadow-sm"
                    : "border border-line bg-white text-ink-700 hover:border-brand/40 hover:bg-brand-50/50"
                }`}
              >
                <span>{s.shortLabel}</span>
                {count > 0 && (
                  <span
                    className={`rounded-full px-1 text-[0.6rem] ${
                      isSel ? "bg-white/25 text-white" : "bg-canvas text-muted"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setSelected(OTHER_ID)}
            className={`rounded-md px-2 py-0.5 font-mono text-[0.72rem] transition-all ${
              selected === OTHER_ID
                ? "bg-brand text-white font-semibold shadow-sm"
                : "border border-line bg-white text-muted hover:text-ink"
            }`}
          >
            Other Units ({otherCompanies.length})
          </button>
        </div>

        {/* Official Haridwar sector map */}
        <div className="relative rounded-xl border border-line/80 bg-[#f9f7f2] p-1">
          <Image
            src="/haridwar_sectors.svg"
            alt="Haridwar SIIDCUL sector boundary map"
            width={904}
            height={748}
            priority
            className="h-auto w-full select-none"
          />
          <svg
            viewBox="0 0 904 748"
            className="pointer-events-none absolute inset-1 h-[calc(100%-0.5rem)] w-[calc(100%-0.5rem)]"
            role="group"
            aria-label="Clickable Haridwar SIIDCUL sectors"
          >
            {HARIDWAR_SECTOR_POLYGONS.map((sectorPolygon) => {
              const sector = sectors.find((item) => item.id === sectorPolygon.id);
              if (!sector) return null;
              const isSelected = selected === sector.id;
              const isHovered = hovered === sector.id;
              return (
                <g key={sectorPolygon.id}>
                  <polygon
                    points={sectorPolygon.points}
                    fill="transparent"
                    stroke={isSelected || isHovered ? "#c1121f" : "transparent"}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    className="pointer-events-auto cursor-pointer transition-all duration-200"
                    tabIndex={0}
                    role="button"
                    aria-label={`Select ${sector.label}, ${sector.companies.length} companies`}
                    aria-pressed={isSelected}
                    onMouseEnter={() => setHovered(sector.id)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(sector.id)}
                    onBlur={() => setHovered(null)}
                    onClick={() => setSelected(sector.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelected(sector.id);
                      }
                    }}
                  />
                  <text
                    x={sectorPolygon.points.split(" ")[0].split(",")[0]}
                    y={sectorPolygon.points.split(" ")[0].split(",")[1]}
                    dx="8"
                    dy="16"
                    className="pointer-events-none select-none font-mono text-[12px] font-bold"
                    fill={isSelected ? "#c1121f" : "#334155"}
                  >
                    {sector.shortLabel}
                  </text>
                </g>
              );
            })}
          </svg>
          <svg
            viewBox={`0 0 ${ESTATE_MAP_WIDTH} ${ESTATE_MAP_HEIGHT}`}
            className="hidden"
            role="group"
            aria-label="Official SIDCUL Integrated Industrial Estate Haridwar Master Plan Map"
          >
            <defs>
              {/* Architectural Grid Pattern */}
              <pattern id="archGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#ece7de" strokeWidth="0.6" />
              </pattern>
              {/* Green Belt Stripe Pattern */}
              <pattern id="greenStripes" width="10" height="10" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="10" stroke="#a7f3d0" strokeWidth="2.5" />
              </pattern>
              {/* Drop shadow filter for active sector */}
              <filter id="activeShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#7f0b14" floodOpacity="0.28" />
              </filter>
              {/* Outer estate clip path */}
              <clipPath id="estateClip">
                <path d={ESTATE_OUTER_BOUNDARY} />
              </clipPath>
            </defs>

            {/* Background Texture */}
            <rect width={ESTATE_MAP_WIDTH} height={ESTATE_MAP_HEIGHT} fill="#fdfbf7" />
            <rect width={ESTATE_MAP_WIDTH} height={ESTATE_MAP_HEIGHT} fill="url(#archGrid)" clipPath="url(#estateClip)" />

            {/* Estate Outer Boundary Stroke */}
            <path
              d={ESTATE_OUTER_BOUNDARY}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
              className="pointer-events-none"
            />

            {/* Green Belt (northwest Shivalik foothills boundary) */}
            <g className="pointer-events-none">
              <path
                d={GREEN_BELT_PATH}
                fill="#d1fae5"
                stroke="#6ee7b7"
                strokeWidth="1.2"
                strokeDasharray="4 2"
              />
              <path d={GREEN_BELT_PATH} fill="url(#greenStripes)" opacity="0.35" />
              <text
                x="540"
                y="18"
                textAnchor="middle"
                fill="#065f46"
                className="font-mono text-[9px] font-bold tracking-wider"
              >
                ▲ SHIVALIK RANGES · 70M GREEN BELT · RAJAJI NATIONAL PARK
              </text>
            </g>

            {/* Rawli Rao Riverbed (SE boundary) */}
            <g className="pointer-events-none">
              <path
                d={RAWLI_RAO_PATH}
                fill="#e0f2fe"
                stroke="#7dd3fc"
                strokeWidth="1.5"
              />
              <text
                x="550"
                y="598"
                textAnchor="middle"
                fill="#0369a1"
                className="font-mono text-[9px] font-bold tracking-widest"
              >
                RAWLI RAO DRAINAGE CORRIDOR
              </text>
            </g>

            {/* Master Plan Sector Polygons */}
            <g strokeLinejoin="round" strokeLinecap="round">
              {ESTATE_SHAPES.map((shape) => {
                const isSelected = shape.id === selected;
                const isHovered = shape.id === hovered;
                const count = companiesFor(shape.id).length;

                return (
                  <g key={shape.id} className="cursor-pointer">
                    <path
                      d={shape.d}
                      fill={fillFor(shape.id)}
                      stroke={strokeFor(shape.id)}
                      strokeWidth={isSelected ? 2.4 : isHovered ? 1.8 : 1.2}
                      filter={isSelected ? "url(#activeShadow)" : undefined}
                      className="transition-all duration-200"
                      tabIndex={0}
                      role="button"
                      aria-label={`${shape.name}, ${count} companies`}
                      aria-pressed={isSelected}
                      onMouseEnter={() => setHovered(shape.id)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(shape.id)}
                      onBlur={() => setHovered(null)}
                      onClick={() => setSelected(shape.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelected(shape.id);
                        }
                      }}
                    />

                    {/* Sector Centroid Badge & Label */}
                    <g
                      className="pointer-events-none select-none transition-transform duration-150"
                      transform={`translate(${shape.cx}, ${shape.cy})`}
                    >
                      <text
                        x="0"
                        y="0"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={textColorFor(shape.id)}
                        className={`font-display font-black tracking-tight ${
                          shape.shortLabel.length > 2 ? "text-[13px]" : "text-[16px]"
                        }`}
                      >
                        {shape.shortLabel}
                      </text>
                      {count > 0 && (
                        <text
                          x="0"
                          y="14"
                          textAnchor="middle"
                          fill={isSelected ? "#fecaca" : "#64748b"}
                          className="font-mono text-[9px] font-bold"
                        >
                          {count} {count === 1 ? "unit" : "units"}
                        </text>
                      )}
                    </g>
                  </g>
                );
              })}
            </g>

            {/* Road Network Overlay (60m, 45m Arterial Spine) */}
            {showRoads && (
              <g className="pointer-events-none" strokeLinecap="round" strokeLinejoin="round">
                {ROAD_PATHS.map((r, idx) => (
                  <path
                    key={`road-under-${idx}`}
                    d={r}
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="4.5"
                    opacity="0.3"
                  />
                ))}
                {ROAD_PATHS.map((r, idx) => (
                  <path
                    key={`road-${idx}`}
                    d={r}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3.2"
                  />
                ))}
                {/* 60M Spine Road Label */}
                <text
                  x="540"
                  y="233"
                  textAnchor="middle"
                  fill="#475569"
                  className="font-mono text-[8px] font-bold tracking-wider"
                >
                  60.0 MTR WIDE ARTERIAL SPINE ROAD
                </text>
              </g>
            )}

            {/* Major Anchor Tenant Landmarks */}
            {showLandmarks && (
              <g>
                {MAP_LANDMARKS.map((lm) => {
                  const isSecSelected = selected === lm.sectorId;
                  return (
                    <g
                      key={lm.id}
                      onClick={() => setSelected(lm.sectorId)}
                      className="cursor-pointer transition-transform hover:scale-110"
                      transform={`translate(${lm.x}, ${lm.y})`}
                    >
                      {/* Landmark Pin Indicator */}
                      <circle
                        r={isSecSelected ? 7 : 5}
                        fill={isSecSelected ? "#c1121f" : "#1e293b"}
                        stroke="#ffffff"
                        strokeWidth="1.8"
                        className="transition-all"
                      />
                      <rect
                        x="-45"
                        y="-22"
                        width="90"
                        height="15"
                        rx="3"
                        fill={isSecSelected ? "#1e293b" : "#ffffff"}
                        stroke={isSecSelected ? "#c1121f" : "#cbd5e1"}
                        strokeWidth="0.9"
                        className="transition-all"
                      />
                      <text
                        x="0"
                        y="-12"
                        textAnchor="middle"
                        fill={isSecSelected ? "#ffffff" : "#0f172a"}
                        className="pointer-events-none font-mono text-[7.5px] font-bold"
                      >
                        {lm.name.length > 18 ? lm.name.slice(0, 17) + "…" : lm.name}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* Active Selected Sector Callout Line */}
            {activeSectorShape && (
              <g className="pointer-events-none">
                <circle
                  cx={activeSectorShape.cx}
                  cy={activeSectorShape.cy}
                  r="24"
                  fill="none"
                  stroke="#c1121f"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  opacity="0.8"
                />
              </g>
            )}
          </svg>
        </div>

        {/* Map Legend Footer */}
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 text-[0.75rem] text-muted">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded border border-[#6ee7b7] bg-[#d1fae5]" />
              <span>70m Green Belt / Shivalik</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded border border-[#7dd3fc] bg-[#e0f2fe]" />
              <span>Rawli Rao Riverbed</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-4 rounded bg-[#ffffff] ring-1 ring-[#94a3b8]" />
              <span>60M Spine Roads</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-brand" />
              <span>Selected Sector</span>
            </span>
          </div>

          <p className="text-[0.68rem] text-muted">
            Directly modeled from SIIDCUL Haridwar Master Plan 2025.
          </p>
        </div>
      </div>

      {/* ============== SECTOR DETAIL INSPECTOR ============== */}
      <div className="rounded-2xl border border-line bg-white shadow-sm lg:sticky lg:top-20">
        {/* Header of Inspector */}
        <div className="border-b border-line p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-brand-50 px-2 py-0.5 font-mono text-[0.7rem] font-bold text-brand uppercase">
                  {selectedSectorDef ? selectedSectorDef.type : "Registry Records"}
                </span>
              </div>
              <h3 className="mt-1 font-display text-xl font-bold text-ink">
                {labelFor(selected)}
              </h3>
            </div>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand text-sm font-bold text-white shadow-sm">
              {companiesFor(selected).length}
            </span>
          </div>

          {selectedSectorDef?.tagline && (
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              {selectedSectorDef.tagline}
            </p>
          )}

          {/* Prominent Tenants Pill List from Master Plan */}
          {selectedSectorDef?.prominentTenants && selectedSectorDef.prominentTenants.length > 0 && (
            <div className="mt-3.5">
              <p className="text-[0.68rem] font-bold uppercase tracking-wider text-muted">
                Key Industrial Anchors:
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {selectedSectorDef.prominentTenants.map((tenant) => (
                  <span
                    key={tenant}
                    className="rounded-md border border-line bg-canvas px-2 py-0.5 text-[0.72rem] font-medium text-ink"
                  >
                    {tenant}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search within Sector */}
        <div className="border-b border-line px-5 py-2.5 bg-canvas/40">
          <div className="relative">
            <input
              type="text"
              value={companySearch}
              onChange={(e) => setCompanySearch(e.target.value)}
              placeholder={`Search ${companiesFor(selected).length} companies in ${labelFor(selected)}...`}
              className="w-full rounded-lg border border-line bg-white py-1.5 pl-8 pr-3 text-xs text-ink outline-none placeholder:text-muted focus:border-brand"
            />
            <svg
              className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
            {companySearch && (
              <button
                type="button"
                onClick={() => setCompanySearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-ink"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Company List Scroll Area */}
        <div className="max-h-[380px] divide-y divide-line overflow-y-auto">
          {activeCompanies.length === 0 ? (
            <div className="px-5 py-12 text-center text-xs text-muted">
              {companySearch
                ? `No companies matching "${companySearch}" in this sector.`
                : "No registered companies on file with this sector address yet."}
            </div>
          ) : (
            activeCompanies.map((c) => (
              <Link
                key={c.slug}
                href={`/directory/${c.slug}`}
                className="group flex cursor-pointer items-center gap-3 px-5 py-3 transition-colors duration-150 hover:bg-brand-50/50"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ink text-[0.62rem] font-bold text-white transition-colors group-hover:bg-brand">
                  {initialsOf(c.name)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-ink group-hover:text-brand">
                    {c.name}
                  </span>
                  {c.category && (
                    <span className="block truncate text-xs text-muted">
                      {c.category}
                    </span>
                  )}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 shrink-0 text-line transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-brand"
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
              </Link>
            ))
          )}
        </div>

        {/* Directory Link Footer */}
        <div className="border-t border-line bg-canvas/60 p-3.5 text-center">
          <Link
            href="/directory"
            className="text-xs font-semibold text-brand transition-colors hover:underline"
          >
            Browse all companies in directory →
          </Link>
        </div>
      </div>
    </div>
  );
}
