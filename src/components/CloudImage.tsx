/* eslint-disable @next/next/no-img-element -- Cloudinary resizes at its own CDN; Next's optimizer would only add a second hop. */

const WIDTHS = [320, 480, 640, 828, 1080, 1600];

/**
 * Cloudinary delivery URL for a given width. Cloudinary resizes and re-encodes
 * at its CDN edge (f_auto → WebP/AVIF, q_auto, width-capped). Non-Cloudinary
 * sources (e.g. blob: previews) are returned untouched.
 */
export function cloudinaryUrl(src: string, width: number): string {
  const marker = "/image/upload/";
  if (!src.includes("res.cloudinary.com") || !src.includes(marker)) return src;
  return src.replace(marker, `${marker}f_auto,q_auto,c_limit,w_${width}/`);
}

type Props = {
  src: string;
  alt: string;
  /** Standard `sizes` attribute — what width the image occupies on screen. */
  sizes?: string;
  className?: string;
  /** Fill the nearest positioned parent (parent must be `relative`). */
  fill?: boolean;
  /** Load immediately instead of lazily (above-the-fold images). */
  priority?: boolean;
};

/** Plain `<img>` for Cloudinary-hosted uploads, with a responsive srcset. */
export default function CloudImage({
  src,
  alt,
  sizes = "100vw",
  className = "",
  fill = false,
  priority = false,
}: Props) {
  const isCloudinary = src.includes("res.cloudinary.com");
  return (
    <img
      src={isCloudinary ? cloudinaryUrl(src, 828) : src}
      srcSet={
        isCloudinary
          ? WIDTHS.map((w) => `${cloudinaryUrl(src, w)} ${w}w`).join(", ")
          : undefined
      }
      sizes={isCloudinary ? sizes : undefined}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={`${fill ? "absolute inset-0 h-full w-full " : ""}${className}`}
    />
  );
}
