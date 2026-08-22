import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import JobCard from "@/components/JobCard";
import EquipmentCard from "@/components/EquipmentCard";

export default async function CompanyProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const company = await prisma.companyProfile.findUnique({
    where: { id },
    include: {
      jobs: {
        where: { status: "OPEN" },
        orderBy: { createdAt: "desc" },
      },
      equipment: {
        where: { status: "LISTED" },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!company) notFound();

  const website = company.website
    ? company.website.startsWith("http")
      ? company.website
      : `https://${company.website}`
    : null;

  const jobs = company.verified ? company.jobs : [];
  const equipment = company.verified ? company.equipment : [];

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold text-ink">
                {company.companyName}
              </h1>
              {company.verified ? (
                <span className="badge bg-accent-50 text-accent-600">
                  <CheckIcon className="h-3.5 w-3.5" />
                  Verified
                </span>
              ) : (
                <span className="badge bg-amber-100 text-amber-800">
                  Pending verification
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted">
              {company.sector ? `${company.sector} · ` : ""}
              {company.location ?? "SIDCUL, Haridwar"}
            </p>
          </div>
        </div>

        {company.about && (
          <>
            <hr className="my-5 border-line" />
            <h2 className="font-semibold text-ink">About</h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed text-ink-700">
              {company.about}
            </p>
          </>
        )}

        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm font-semibold text-brand"
          >
            Visit website →
          </a>
        )}
      </div>

      {!company.verified && (
        <div className="card mt-6 border-amber-200 bg-amber-50 p-5">
          <p className="text-sm text-amber-800">
            This company is awaiting verification, so its job postings and
            equipment listings aren&apos;t public yet.
          </p>
        </div>
      )}

      {company.verified && (
        <>
          <h2 className="mt-8 text-lg font-semibold text-ink">
            Open positions
          </h2>
          {jobs.length === 0 ? (
            <p className="mt-3 text-sm text-muted">
              No open positions right now.
            </p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {jobs.map((job) => (
                <JobCard key={job.id} job={{ ...job, company }} />
              ))}
            </div>
          )}

          <h2 className="mt-8 text-lg font-semibold text-ink">
            Equipment for lease
          </h2>
          {equipment.length === 0 ? (
            <p className="mt-3 text-sm text-muted">
              No equipment listed for lease right now.
            </p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {equipment.map((item) => (
                <EquipmentCard key={item.id} item={{ ...item, company }} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 12.5l4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
