"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { EstateSectorDef, EstateSectorCompany } from "@/lib/estate-sectors";
import {
  ESTATE_MAP_HEIGHT,
  ESTATE_MAP_WIDTH,
  ESTATE_SHAPES,
} from "@/lib/estate-shapes";

type SectorWithCompanies = EstateSectorDef & { companies: EstateSectorCompany[] };

const OTHER_ID = "other";
const GUTTER = 200; // room for the leader-line callout labels, right of the shape

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
  const busiest = useMemo(
    () =>
      [...sectors].sort((a, b) => b.companies.length - a.companies.length)[0] ??
      null,
    [sectors],
  );

  const [selected, setSelected] = useState<string>(busiest?.id ?? OTHER_ID);
  const [hovered, setHovered] = useState<string | null>(null);

  const labelFor = (id: string) =>
    id === OTHER_ID
      ? "Other registered units"
      : sectors.find((s) => s.id === id)?.label ?? id;

  const companiesFor = (id: string) =>
    id === OTHER_ID
      ? otherCompanies
      : sectors.find((s) => s.id === id)?.companies ?? [];

  const activeId = hovered ?? selected;
  const activeShape = ESTATE_SHAPES.find((s) => s.id === activeId);

  const activeCompanies = companiesFor(selected);
  const activeLabel = labelFor(selected);

  // Site palette: brand blue (--color-brand/-50) for the outline, accent
  // green (--color-accent/-600) for the selected sector — same pairing the
  // rest of the page uses for "informational" vs. "active/CTA" state.
  function fillFor(id: string) {
    if (id === selected) return "#16a34a";
    if (id === hovered) return "#bae0fd";
    return "#e0f2fe";
  }
  function strokeFor(id: string) {
    if (id === selected) return "#15803d";
    return "#7fb3d5";
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-start">
      {/* ============== MAP ============== */}
      <div className="relative overflow-hidden rounded-2xl border border-line bg-white p-4 sm:p-6">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <p className="label-tag text-brand">Estate outline</p>
            <h3 className="mt-1 font-display text-lg font-bold text-ink sm:text-xl">
              SIDCUL Integrated Industrial Estate, Haridwar
            </h3>
          </div>
          <div className="flex shrink-0 flex-col items-center text-ink-700">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
              <path d="M12 2l3 7-3-1.5L9 9l3-7z" fill="currentColor" />
              <path d="M12 22V9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <span className="label-tag mt-0.5 text-[0.6rem]">N</span>
          </div>
        </div>

        <svg
          viewBox={`0 0 ${ESTATE_MAP_WIDTH + GUTTER} ${ESTATE_MAP_HEIGHT}`}
          className="h-auto w-full"
          role="group"
          aria-label="Interactive map of SIDCUL estate sectors"
        >
          <g strokeLinejoin="round" strokeLinecap="round">
            {ESTATE_SHAPES.map((shape) =>
              shape.ds.map((d, i) => {
                const count = companiesFor(shape.id).length;
                return (
                  <path
                    key={`${shape.id}-${i}`}
                    d={d}
                    fill={fillFor(shape.id)}
                    stroke={strokeFor(shape.id)}
                    strokeWidth={shape.id === selected ? 1.3 : 1}
                    className="cursor-pointer outline-none transition-colors duration-200"
                    tabIndex={i === 0 ? 0 : -1}
                    role="button"
                    aria-label={`${labelFor(shape.id)}, ${count} ${count === 1 ? "company" : "companies"}`}
                    aria-pressed={shape.id === selected}
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
                );
              }),
            )}
          </g>

          {/* Leader lines + callout labels, exactly as on a printed locator
              map: no lettering inside the regions themselves, two hairlines
              running out to the right margin. */}
          {activeShape && (
            <g className="pointer-events-none">
              <line
                x1={activeShape.cx}
                y1={activeShape.cy}
                x2={ESTATE_MAP_WIDTH + 12}
                y2={activeShape.cy - 44}
                stroke="#0b2540"
                strokeWidth="1.4"
              />
              <line
                x1={activeShape.cx}
                y1={activeShape.cy}
                x2={ESTATE_MAP_WIDTH + 12}
                y2={activeShape.cy + 38}
                stroke="#0b2540"
                strokeWidth="1.4"
              />
              <text
                x={ESTATE_MAP_WIDTH + 18}
                y={activeShape.cy - 48}
                className="select-none font-display font-bold"
                fontSize="19"
                fill="#0b2540"
              >
                {labelFor(activeId)}
              </text>
              <text
                x={ESTATE_MAP_WIDTH + 18}
                y={activeShape.cy + 43}
                className="select-none font-mono"
                fontSize="14"
                fill="#51677e"
              >
                {companiesFor(activeId).length}{" "}
                {companiesFor(activeId).length === 1 ? "company" : "companies"}
              </text>
            </g>
          )}
        </svg>

        <p className="mt-3 text-[0.7rem] leading-relaxed text-muted">
          Illustrative estate outline — sector names and company counts are
          drawn from real registry addresses; the shape itself is stylized,
          not a surveyed plot boundary.
        </p>
      </div>

      {/* ============== DETAIL PANEL ============== */}
      <div className="rounded-2xl border border-line bg-white lg:sticky lg:top-20">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <p className="label-tag text-brand">Selected zone</p>
            <h3 className="mt-0.5 font-display text-lg font-bold text-ink">
              {activeLabel}
            </h3>
          </div>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-50 font-mono text-sm font-bold text-brand">
            {activeCompanies.length}
          </span>
        </div>

        {activeCompanies.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted">
            No companies on file for this sector yet.
          </p>
        ) : (
          <div className="max-h-96 divide-y divide-line overflow-y-auto">
            {activeCompanies.map((c) => (
              <Link
                key={c.slug}
                href={`/directory/${c.slug}`}
                className="group flex cursor-pointer items-center gap-3 px-5 py-3 transition-colors duration-200 hover:bg-brand-50/50"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand to-brand-700 text-[0.6rem] font-bold text-white ring-1 ring-inset ring-white/20">
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
                <ArrowIcon className="h-4 w-4 shrink-0 text-line transition-colors duration-200 group-hover:text-brand" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
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
