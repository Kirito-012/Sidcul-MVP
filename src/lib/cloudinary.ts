import "server-only";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  timeout: 120000,
});

export type CloudinaryUpload = {
  url: string;
  publicId: string;
};

/**
 * Uploads a browser `File` to Cloudinary and returns its optimized delivery
 * URL. Images are auto-cropped/compressed via Cloudinary's `f_auto,q_auto`
 * transformation baked into the returned URL; non-image files (e.g. the EM
 * registration document) are uploaded as-is with `resource_type: "auto"`.
 */
export async function uploadFileToCloudinary(
  file: File,
  opts: { folder: string; kind?: "image" | "auto" } = { folder: "sidcul" },
): Promise<CloudinaryUpload> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const kind = opts.kind ?? "image";
  const mime = file.type || "application/octet-stream";
  const dataUri = `data:${mime};base64,${buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: opts.folder,
    resource_type: kind === "image" ? "image" : "auto",
    // Auto-format + auto-quality: Cloudinary picks the best codec
    // (e.g. WebP/AVIF) and compression for the requesting browser.
    transformation:
      kind === "image" ? [{ fetch_format: "auto", quality: "auto" }] : undefined,
  });

  return { url: result.secure_url, publicId: result.public_id };
}
