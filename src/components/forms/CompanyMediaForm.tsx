"use client";

import Image from "next/image";
import { useActionState, useId, useRef, useState } from "react";
import { updateCompanyMediaAction } from "@/lib/actions/company-actions";
import { type ActionState } from "@/lib/constants";
import SubmitButton from "@/components/forms/SubmitButton";

type Props = {
  companyName: string;
  about: string | null;
  website: string | null;
  whatsappNumber: string | null;
  contactEmail: string | null;
  mapUrl: string | null;
  location: string | null;
  logoUrl: string | null;
  galleryImage1Url: string | null;
  galleryImage2Url: string | null;
  linkedSlug: string | null;
};

const MAX_ABOUT = 2000;
const ACCEPT = "image/jpeg,image/png,image/webp";

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 16V4m0 0L7 9m5-5l5 5M5 20h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** One image field — used for the square logo and the 4:3 gallery tiles. */
function ImageField({
  name,
  label,
  current,
  variant,
}: {
  name: string;
  label: string;
  current: string | null;
  variant: "avatar" | "photo" | "slide";
}) {
  const inputId = useId();
  const [preview, setPreview] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const shown = removed ? null : (preview ?? current);
  const removeName = `remove${name[0].toUpperCase()}${name.slice(1)}`;

  const frame =
    variant === "avatar"
      ? "aspect-square w-28 rounded-2xl"
      : variant === "slide"
        ? "aspect-[16/10] w-full rounded-xl"
        : "aspect-[4/3] w-full rounded-xl";

  return (
    <div>
      <p className="field-label">{label}</p>
      <div className={variant === "avatar" ? "flex items-start gap-4" : ""}>
        <div
          className={`group relative ${frame} shrink-0 overflow-hidden border bg-canvas ${
            shown ? "border-line" : "border-2 border-dashed border-line"
          }`}
        >
          {shown ? (
            <>
              <button
                type="button"
                onClick={() => setZoomed(true)}
                aria-label="View image full size"
                className="absolute inset-0 cursor-zoom-in"
              >
                <Image
                  src={shown}
                  alt=""
                  fill
                  sizes={variant === "avatar" ? "112px" : "(min-width: 768px) 640px, 100vw"}
                  className="object-cover"
                  unoptimized={shown.startsWith("blob:")}
                />
              </button>
              {variant !== "avatar" && (
                <label
                  htmlFor={inputId}
                  className="absolute bottom-2 right-2 inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-ink shadow-md transition-colors hover:bg-white"
                >
                  <UploadIcon className="h-3.5 w-3.5" />
                  Change
                </label>
              )}
              {current && !preview && (
                <button
                  type="button"
                  onClick={() => setRemoved((r) => !r)}
                  aria-label="Remove image"
                  className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                >
                  <XIcon className="h-3.5 w-3.5" />
                </button>
              )}
            </>
          ) : (
            <label
              htmlFor={inputId}
              className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-1.5 p-3 text-center text-muted transition-colors hover:bg-brand-50/40 hover:text-brand"
            >
              <UploadIcon className="h-5 w-5" />
              <span className="text-xs font-semibold">Upload image</span>
              <span className="text-[0.65rem]">JPG, PNG or WebP · ≤6 MB</span>
            </label>
          )}
        </div>

        {variant === "avatar" && (
          <div className="pt-1">
            <label
              htmlFor={inputId}
              className="btn btn-outline btn-sm cursor-pointer"
            >
              {shown ? "Replace" : "Upload"}
            </label>
            {current && (
              <button
                type="button"
                onClick={() => setRemoved((r) => !r)}
                className="btn btn-ghost btn-sm ml-2 text-red-600 hover:bg-red-50"
              >
                {removed ? "Undo" : "Remove"}
              </button>
            )}
            <p className="mt-2 max-w-[16rem] text-xs text-muted">
              Square image works best — shown as your avatar across the
              directory.
            </p>
          </div>
        )}
      </div>

      {zoomed && shown && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={() => setZoomed(false)}
          onKeyDown={(e) => e.key === "Escape" && setZoomed(false)}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-3 bg-black/85 p-4 sm:p-8"
        >
          <div className="flex max-w-full flex-col items-end gap-3">
            <button
              type="button"
              autoFocus
              onClick={() => setZoomed(false)}
              aria-label="Close preview"
              className="grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
            >
              <XIcon className="h-5 w-5" />
            </button>
            {/* Plain <img>: sizes to the picture so the close button hugs it. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={shown}
              alt=""
              onClick={(e) => e.stopPropagation()}
              className="max-h-[75vh] max-w-full rounded-lg object-contain"
            />
          </div>
        </div>
      )}

      <input
        id={inputId}
        name={name}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          setPreview(f ? URL.createObjectURL(f) : null);
          if (f) setRemoved(false);
        }}
      />
      {/* Submitted only when the user hit "Remove" and didn't pick a new file. */}
      {removed && !preview && (
        <input type="checkbox" name={removeName} defaultChecked hidden readOnly />
      )}
    </div>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Swipeable scroll-snap carousel. Every slide stays mounted so each slide's
 * file input is still part of the form when it is submitted.
 */
function GalleryCarousel({ children }: { children: React.ReactNode[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const count = children.length;

  function go(i: number) {
    const track = trackRef.current;
    if (!track) return;
    const next = Math.max(0, Math.min(count - 1, i));
    track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
    setIndex(next);
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="relative">
        <div
          ref={trackRef}
          onScroll={(e) => {
            const t = e.currentTarget;
            setIndex(Math.round(t.scrollLeft / t.clientWidth));
          }}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {children.map((child, i) => (
            <div
              key={i}
              aria-roledescription="slide"
              aria-label={`Photo ${i + 1} of ${count}`}
              className="w-full shrink-0 snap-center px-px"
            >
              {child}
            </div>
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              disabled={index === 0}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-ink shadow-md transition-opacity hover:bg-white disabled:pointer-events-none disabled:opacity-0"
            >
              <ChevronIcon className="h-4 w-4 rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              disabled={index === count - 1}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-ink shadow-md transition-opacity hover:bg-white disabled:pointer-events-none disabled:opacity-0"
            >
              <ChevronIcon className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      <div className="mt-3 flex items-center justify-center gap-2" role="group" aria-label="Choose photo">
        {children.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            aria-label={`Show photo ${i + 1}`}
            aria-current={i === index}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-6 bg-brand" : "w-2 bg-line hover:bg-muted/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function CompanyMediaForm({
  companyName,
  about,
  website,
  whatsappNumber,
  contactEmail,
  mapUrl,
  location,
  logoUrl,
  galleryImage1Url,
  galleryImage2Url,
  linkedSlug,
}: Props) {
  const [state, formAction] = useActionState(
    updateCompanyMediaAction,
    {} as ActionState,
  );
  const [aboutValue, setAboutValue] = useState(about ?? "");

  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    [companyName, location, "Haridwar, Uttarakhand"].filter(Boolean).join(", "),
  )}`;

  return (
    <form action={formAction} className="card p-5 sm:p-6">
      <div>
        <h2 className="text-lg font-semibold text-ink">Public profile</h2>
        <p className="mt-1 text-sm text-muted">
          Description, contact details and photos for your listing.{" "}
          {linkedSlug ? (
            <>
              Live at{" "}
              <a
                href={`/directory/${linkedSlug}`}
                className="font-medium text-brand hover:underline"
              >
                /directory/{linkedSlug}
              </a>
              .
            </>
          ) : (
            "Shown on your public directory page once it's linked."
          )}
        </p>
      </div>

      {state?.error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="mt-4 rounded-lg bg-accent-50 px-3 py-2 text-sm text-accent-600">
          Profile updated.
        </p>
      )}

      {/* ---- About ---- */}
      <div className="mt-6">
        <div className="flex items-baseline justify-between">
          <label className="field-label" htmlFor="about">
            About
          </label>
          <span className="text-xs text-muted">
            {aboutValue.length}/{MAX_ABOUT}
          </span>
        </div>
        <textarea
          id="about"
          name="about"
          rows={4}
          maxLength={MAX_ABOUT}
          value={aboutValue}
          onChange={(e) => setAboutValue(e.target.value)}
          className="textarea"
          placeholder="What your company makes or does, key facilities, certifications…"
        />
      </div>

      {/* ---- Contact & links ---- */}
      <div className="mt-6 border-t border-line pt-5">
        <p className="label-tag mb-3 text-muted">Contact &amp; links</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="website" label="Website">
            <input
              id="website"
              name="website"
              type="url"
              inputMode="url"
              defaultValue={website ?? ""}
              className="input"
              placeholder="https://example.com"
            />
          </Field>
          <Field id="contactEmail" label="Contact email">
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              defaultValue={contactEmail ?? ""}
              className="input"
              placeholder="contact@example.com"
            />
          </Field>
          <Field id="whatsappNumber" label="WhatsApp number">
            <input
              id="whatsappNumber"
              name="whatsappNumber"
              type="tel"
              inputMode="numeric"
              defaultValue={whatsappNumber ?? ""}
              className="input"
              placeholder="98765 43210"
            />
          </Field>
          <Field
            id="mapUrl"
            label={
              <span className="flex items-baseline justify-between gap-2">
                <span>Google Maps location</span>
                <a
                  href={mapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.7rem] font-semibold normal-case tracking-normal text-brand hover:underline"
                >
                  Find on Google Maps ↗
                </a>
              </span>
            }
          >
            <input
              id="mapUrl"
              name="mapUrl"
              type="url"
              inputMode="url"
              defaultValue={mapUrl ?? ""}
              className="input"
              placeholder="Paste the Share → Copy link"
            />
          </Field>
        </div>
        <p className="mt-2 text-xs text-muted">
          On Google Maps, find your company → <b>Share</b> → <b>Copy link</b>,
          then paste it above. A “Directions” button appears on your public
          page.
        </p>
      </div>

      {/* ---- Images ---- */}
      <div className="mt-6 border-t border-line pt-5">
        <p className="label-tag mb-3 text-muted">Images</p>

        <ImageField
          name="logo"
          label="Profile picture / logo"
          current={logoUrl}
          variant="avatar"
        />

        <p className="field-label mt-6">Gallery photos</p>
        <p className="-mt-1 mb-2 text-xs text-muted">
          Up to two — facility, product or team shots.
        </p>
        <GalleryCarousel>
          {[
            <ImageField
              key="g1"
              name="gallery1"
              label="Photo 1"
              current={galleryImage1Url}
              variant="slide"
            />,
            <ImageField
              key="g2"
              name="gallery2"
              label="Photo 2"
              current={galleryImage2Url}
              variant="slide"
            />,
          ]}
        </GalleryCarousel>
      </div>

      <div className="mt-6 border-t border-line pt-5">
        <SubmitButton pendingText="Saving…" className="btn btn-primary">
          Save profile
        </SubmitButton>
      </div>
    </form>
  );
}
