import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import LockedField from "@/components/LockedField";

function initialsOf(name: string) {
  const words = name.trim().split(/\s+/);
  return ((words[0]?.[0] ?? "") + (words[1]?.[0] ?? "")).toUpperCase();
}

export default async function DirectoryCompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [company, session] = await Promise.all([
    prisma.directoryCompany.findUnique({
      where: { slug },
      include: {
        companyProfiles: {
          where: { verified: true },
          take: 1,
          include: {
            _count: { select: { jobs: true } },
          },
        },
      },
    }),
    getSession(),
  ]);
  if (!company) notFound();

  const unlocked = session !== null;

  // A verified, registered account that owns this listing (adds logo + gallery
  // + its own contact details, which take precedence over the scraped ones).
  const owner = company.companyProfiles[0] ?? null;
  const gallery = [owner?.galleryImage1Url, owner?.galleryImage2Url].filter(
    (u): u is string => Boolean(u),
  );

  const rawWebsite = owner?.website ?? company.website;
  const website = rawWebsite
    ? rawWebsite.startsWith("http")
      ? rawWebsite
      : `https://${rawWebsite}`
    : null;
  const phone = owner?.phone ?? company.phone;
  const email = owner?.contactEmail ?? company.email;
  const whatsapp = owner?.whatsappNumber ?? null;
  const whatsappDigits = whatsapp?.replace(/[^\d]/g, "") ?? null;

  // Google Maps: the owner's pasted link if set, otherwise a search built from
  // the listing's address so every company still gets a "Directions" button.
  const addressForMap = [company.address, "Haridwar, Uttarakhand"]
    .filter(Boolean)
    .join(", ");
  const mapUrl =
    owner?.mapUrl ??
    (company.address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressForMap)}`
      : null);

  // Member-directory rows store the contact person in `description` as
  // "Contact: NAME" — surface it as its own field, and keep it out of the
  // free-text "About" block.
  const contactPerson = /^contact:/i.test(company.description ?? "")
    ? company.description!.replace(/^contact:\s*/i, "")
    : null;
  const aboutText =
    owner?.about ?? (contactPerson ? null : company.description);

  return (
    <div>
      {/* Header band — mirrors the directory hero for continuity */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="pointer-events-none absolute inset-0">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Haridwar_from_Mansa_Devi_road.jpg/1280px-Haridwar_from_Mansa_Devi_road.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[center_30%] opacity-[0.2]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/78 via-ink-950/90 to-ink-950" />
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand/25 blur-[110px]" />
        </div>

        <div className="relative mx-auto max-w-3xl px-5 pb-20 pt-10 sm:pt-12">
          <Link
            href="/directory"
            className="label-tag inline-flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
          >
            <ArrowIcon className="h-3.5 w-3.5 rotate-180" />
            Back to directory
          </Link>

          <div className="mt-6 flex items-start gap-4 sm:gap-5">
            <span className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-ink font-display text-xl font-bold text-white ring-1 ring-inset ring-white/15 sm:h-20 sm:w-20 sm:text-2xl">
              {owner?.logoUrl ? (
                <Image
                  src={owner.logoUrl}
                  alt={`${company.name} logo`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                initialsOf(company.name)
              )}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {company.category && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-slate-200 ring-1 ring-inset ring-white/15">
                    {company.category}
                  </span>
                )}
                {owner && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/15 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-brand ring-1 ring-inset ring-brand/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                    Registered member
                  </span>
                )}
              </div>
              <h1 className="mt-2 font-display text-2xl font-bold leading-tight sm:text-3xl">
                {company.name}
              </h1>
              <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-slate-300">
                <PinIcon className="h-4 w-4 shrink-0" />
                {company.area ?? "SIDCUL Industrial Estate, Haridwar"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-5 pb-16">
        <div className="card relative z-10 -mt-10 overflow-hidden shadow-[0_24px_60px_-28px_rgba(27,26,31,0.4)]">
          {gallery.length > 0 && (
            <div className="grid gap-3 border-b border-line p-4 sm:grid-cols-2 sm:p-5">
              {gallery.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl bg-canvas ring-1 ring-inset ring-line"
                >
                  <Image
                    src={src}
                    alt={`${company.name} — photo ${i + 1}`}
                    fill
                    sizes="(min-width: 640px) 320px, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {aboutText && (
            <div className="border-b border-line p-6 sm:p-7">
              <p className="label-tag mb-2.5 text-muted">About</p>
              <p className="leading-relaxed text-ink-700">
                <LockedField unlocked={unlocked}>{aboutText}</LockedField>
              </p>
            </div>
          )}

          {/* Spec fields */}
          <dl className="divide-y divide-line">
            {company.address && <Field label="Address">{company.address}</Field>}
            {company.pincode && <Field label="Pincode">{company.pincode}</Field>}
            {mapUrl && (
              <Field label="Location">
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-brand hover:underline"
                >
                  <PinIcon className="h-4 w-4 shrink-0" />
                  View on Google Maps
                </a>
              </Field>
            )}
            {contactPerson && (
              <Field label="Contact person">
                <LockedField unlocked={unlocked}>{contactPerson}</LockedField>
              </Field>
            )}
            {phone && (
              <Field label="Phone">
                <LockedField unlocked={unlocked}>
                  <a
                    href={`tel:${phone}`}
                    className="text-brand hover:underline"
                  >
                    {phone}
                  </a>
                </LockedField>
              </Field>
            )}
            {email && (
              <Field label="Email">
                <a
                  href={`mailto:${email}`}
                  className="break-all text-brand hover:underline"
                >
                  {email}
                </a>
              </Field>
            )}
            {website && (
              <Field label="Website">
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-brand hover:underline"
                >
                  {website.replace(/^https?:\/\//, "")}
                </a>
              </Field>
            )}
          </dl>

          {/* Action footer */}
          {(phone || whatsapp || mapUrl || website) && (
            <div className="border-t border-line bg-canvas p-5">
              <p className="text-sm text-muted">
                Get in touch with{" "}
                <span className="font-semibold text-ink">{company.name}</span>
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
                {phone && (
                  <a
                    href={unlocked ? `tel:${phone}` : "/login"}
                    className="btn btn-outline btn-sm w-full sm:w-auto"
                  >
                    <PhoneIcon className="h-4 w-4" />
                    {unlocked ? "Call" : "Sign in to call"}
                  </a>
                )}
                {whatsapp && whatsappDigits && (
                  <a
                    href={unlocked ? `https://wa.me/${whatsappDigits}` : "/login"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm w-full sm:w-auto"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    WhatsApp
                  </a>
                )}
                {mapUrl && (
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm w-full sm:w-auto"
                  >
                    <PinIcon className="h-4 w-4" />
                    Directions
                  </a>
                )}
                {website && (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm w-full sm:w-auto"
                  >
                    <GlobeIcon className="h-4 w-4" />
                    Visit website
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <p className="mt-3 text-xs text-muted">
          Listing data compiled from public business directories.
        </p>
      </div>
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
    <div className="grid gap-1 px-6 py-4 transition-colors hover:bg-canvas sm:grid-cols-[160px_1fr] sm:gap-4 sm:py-5">
      <dt className="label-tag pt-0.5 text-muted">{label}</dt>
      <dd className="text-ink-700">{children}</dd>
    </div>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 21s-6.5-5.6-6.5-11A6.5 6.5 0 1118.5 10c0 5.4-6.5 11-6.5 11z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
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

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M6.5 4h3l1.2 4-2 1.3a11 11 0 005 5l1.3-2 4 1.2v3a2 2 0 01-2.2 2A16 16 0 014.5 6.2 2 2 0 016.5 4z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.97L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm0 1.67c2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 012.42 5.82c0 4.54-3.7 8.24-8.25 8.24a8.23 8.23 0 01-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm-3.6 4.42c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.03 2.6c.13.18 1.76 2.8 4.37 3.82 2.16.85 2.6.68 3.07.64.47-.04 1.52-.62 1.73-1.22.21-.6.21-1.11.15-1.22-.06-.11-.23-.17-.48-.3-.25-.12-1.52-.75-1.75-.83-.23-.09-.4-.13-.57.12-.17.25-.65.83-.8 1-.14.17-.29.19-.54.06-.25-.12-1.06-.39-2.02-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.01-.38.11-.5.11-.11.25-.29.38-.44.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.55-1.37-.77-1.87-.2-.48-.4-.42-.55-.42h-.48z" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 3.5c2.5 2.2 2.5 14.8 0 17M12 3.5c-2.5 2.2-2.5 14.8 0 17M3.5 12h17"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}
