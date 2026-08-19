import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import LeaseRequestForm from "@/components/forms/LeaseRequestForm";

export default async function EquipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const equipment = await prisma.equipment.findUnique({
    where: { id },
    include: { company: true },
  });

  // Hide listings from unverified companies entirely.
  if (!equipment || !equipment.company.verified) notFound();

  const session = await getSession();

  let ownCompanyId: string | null = null;
  if (session?.role === "COMPANY") {
    const company = await prisma.companyProfile.findUnique({
      where: { userId: session.userId },
    });
    ownCompanyId = company?.id ?? null;
  }

  const unlisted = equipment.status !== "LISTED";
  const isOwnListing = ownCompanyId !== null && ownCompanyId === equipment.companyId;

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <Link href="/equipment" className="text-sm text-muted hover:text-brand">
        ← Back to all equipment
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main */}
        <div>
          <div className="card p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-ink">{equipment.name}</h1>
                <p className="mt-1 text-muted">
                  {equipment.company.companyName}
                  {equipment.company.verified && (
                    <span className="ml-1 text-brand">✓ Verified</span>
                  )}
                </p>
              </div>
              {unlisted && (
                <span className="badge bg-slate-100 text-slate-500">Unlisted</span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {equipment.category && (
                <span className="badge bg-brand-50 text-brand-600">
                  {equipment.category}
                </span>
              )}
              <span className="badge bg-slate-100 text-ink-700">
                📍 {equipment.location}
              </span>
              {equipment.rate && (
                <span className="badge bg-green-50 text-green-700">
                  {equipment.rate}
                </span>
              )}
            </div>

            <hr className="my-5 border-line" />

            <h2 className="font-semibold text-ink">Description</h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed text-ink-700">
              {equipment.description}
            </p>
          </div>

          {equipment.company.about && (
            <div className="card mt-4 p-6">
              <h2 className="font-semibold text-ink">
                About {equipment.company.companyName}
              </h2>
              <p className="mt-2 leading-relaxed text-ink-700">
                {equipment.company.about}
              </p>
              {equipment.company.website && (
                <a
                  href={equipment.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm font-semibold text-brand"
                >
                  Visit website →
                </a>
              )}
            </div>
          )}
        </div>

        {/* Lease request panel */}
        <aside>
          <div className="card sticky top-20 p-5">
            <h2 className="font-semibold text-ink">Request this equipment</h2>

            {unlisted ? (
              <p className="mt-3 text-sm text-muted">
                This equipment is currently unavailable for lease.
              </p>
            ) : !session ? (
              <div className="mt-3 space-y-3">
                <p className="text-sm text-muted">
                  Log in as a company to request a lease.
                </p>
                <Link href="/login" className="btn btn-primary w-full">
                  Log in
                </Link>
                <Link href="/register" className="btn btn-outline w-full">
                  Create company account
                </Link>
              </div>
            ) : session.role !== "COMPANY" ? (
              <p className="mt-3 text-sm text-muted">
                Only company accounts can request equipment leases.
              </p>
            ) : isOwnListing ? (
              <p className="mt-3 text-sm text-muted">This is your own listing.</p>
            ) : (
              <div className="mt-3">
                <LeaseRequestForm equipmentId={equipment.id} />
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
