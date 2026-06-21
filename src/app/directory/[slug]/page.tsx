import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DirectoryCompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const company = await prisma.directoryCompany.findUnique({ where: { slug } });
  if (!company) notFound();

  const website = company.website
    ? company.website.startsWith("http")
      ? company.website
      : `https://${company.website}`
    : null;

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <Link href="/directory" className="text-sm text-muted hover:text-brand">
        ← Back to directory
      </Link>

      <div className="card mt-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-ink">{company.name}</h1>
            {company.category && (
              <span className="badge mt-2 bg-brand-50 text-brand-600">
                {company.category}
              </span>
            )}
          </div>
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-2xl">
            💻
          </span>
        </div>

        <p className="mt-3 text-sm font-medium text-muted">
          📍 {company.area ?? "SIDCUL IT Park, Dehradun"}
        </p>

        {company.description && (
          <p className="mt-4 leading-relaxed text-ink-700">
            {company.description}
          </p>
        )}

        <hr className="my-5 border-line" />

        <dl className="grid gap-4 sm:grid-cols-2">
          {company.address && (
            <Field label="Address">{company.address}</Field>
          )}
          {company.phone && (
            <Field label="Phone">
              <a href={`tel:${company.phone}`} className="text-brand">
                {company.phone}
              </a>
            </Field>
          )}
          {company.email && (
            <Field label="Email">
              <a href={`mailto:${company.email}`} className="text-brand">
                {company.email}
              </a>
            </Field>
          )}
          {website && (
            <Field label="Website">
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-brand"
              >
                {company.website}
              </a>
            </Field>
          )}
        </dl>
      </div>

      <p className="mt-3 text-xs text-muted">
        Listing data compiled from public business directories.
      </p>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </dt>
      <dd className="mt-1 text-ink-700">{children}</dd>
    </div>
  );
}
