// Shared, framework-agnostic constants & types (safe to import in client or server).

export type Role = "STUDENT" | "COMPANY" | "ADMIN";

/** Standard return shape for form server actions used with useActionState. */
export type ActionState = { error?: string; success?: boolean };

/** Industrial sectors mirrored from the SIDCUL directory deck. */
export const SECTORS = [
  "Pharmaceuticals",
  "FMCG & Packaging",
  "Electrical & Auto",
  "Allied Services",
] as const;

export type Sector = (typeof SECTORS)[number];

/** Job types skewed toward industrial/manufacturing hiring. */
export const JOB_TYPES = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "SHIFT", label: "Shift-basis" },
  { value: "SEASONAL", label: "Seasonal" },
  { value: "INTERNSHIP", label: "Internship / Trainee" },
] as const;

export type JobType = (typeof JOB_TYPES)[number]["value"];

export const JOB_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  JOB_TYPES.map((t) => [t.value, t.label]),
);

/** Lifecycle of a student's application, shown to companies. */
export const APPLICATION_STATUSES = [
  { value: "APPLIED", label: "Applied" },
  { value: "REVIEWED", label: "Reviewed" },
  { value: "SHORTLISTED", label: "Shortlisted" },
  { value: "REJECTED", label: "Rejected" },
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]["value"];

export const APPLICATION_STATUS_LABELS: Record<string, string> = Object.fromEntries(
  APPLICATION_STATUSES.map((s) => [s.value, s.label]),
);
