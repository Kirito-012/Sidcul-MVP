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
  "Others",
] as const;

export type Sector = (typeof SECTORS)[number];

/** Sentinel SECTORS value that reveals a free-text "your sector" input at signup. */
export const OTHER_SECTOR_VALUE = "Others";

/** Indian mobile number: optional +91/91/0 prefix, then a 10-digit number starting 6-9. */
export const INDIAN_PHONE_RE = /^(?:\+91|91|0)?[6-9]\d{9}$/;

/** Loose email check — good enough for a public contact field. */
export const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Canonical directory taxonomy (distinct from the job-posting SECTORS above).
 * `dbCategory` is the raw string stored on DirectoryCompany.category — kept
 * separate from `label` so we can display a friendlier name (e.g. the scraped
 * IT Park companies are stored as "Software Companies") without touching data.
 */
export const DIRECTORY_CATEGORIES = [
  { label: "Pharmaceuticals", dbCategory: "Pharmaceuticals" },
  { label: "IT & Software", dbCategory: "Software Companies" },
  { label: "Automobiles & Auto Components", dbCategory: "Automobile & Auto Component" },
  {
    label: "Electricals & Power",
    dbCategory: "Electrical & Electric Component,Power",
  },
  {
    label: "Pharma, Cosmetic & Ayush",
    dbCategory: "Pharma Cosmetic & Ayush/HEALTHCARE",
  },
  { label: "Paper & Packaging", dbCategory: "Paper & Paper Packaging" },
  {
    label: "Building Materials & Chemicals",
    dbCategory: "Building Materials & Others Chemicals",
  },
  { label: "Service Providers", dbCategory: "Service Provider" },
  { label: "Food Processing", dbCategory: "Food Processing" },
  { label: "Plastic & Plastic Packaging", dbCategory: "Plastic & Plastic Packaging" },
] as const;

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

/** Equipment categories for leasing listings. */
export const EQUIPMENT_CATEGORIES = [
  "Heavy Machinery",
  "Material Handling",
  "Packaging & Filling",
  "Testing & QC Instruments",
  "Power & Utility",
  "Tools & Fabrication",
] as const;

export type EquipmentCategory = (typeof EQUIPMENT_CATEGORIES)[number];

/** Lifecycle of a lease request (managed booking flow). */
export const LEASE_STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

export type LeaseStatus = (typeof LEASE_STATUSES)[number]["value"];

export const LEASE_STATUS_LABELS: Record<string, string> = Object.fromEntries(
  LEASE_STATUSES.map((s) => [s.value, s.label]),
);
