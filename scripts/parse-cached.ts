// Parses already-downloaded IDBF category HTML files (in /tmp) into
// DirectoryCompany records. Used when the live site is rate-limiting us.
// Run with: npx tsx scripts/parse-cached.ts
import "dotenv/config";
import fs from "node:fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const IT_PARK_RE = /it park|sahastradhara|sidcul/i;

// [cached file path, category label]
const FILES: [string, string][] = [
  ["/tmp/idbf_sw.html", "Software Companies"],
];

function decode(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function parseCards(html: string) {
  const cards: { url: string; name: string; address: string; pincode: string | null }[] = [];
  for (const block of html.split('<div class="biz-card">').slice(1)) {
    const m = block.match(/biz-card-name"><a href="([^"]+)">([^<]+)<\/a>/);
    if (!m) continue;
    const rows = [
      ...block.matchAll(/<div class="biz-info-row">[\s\S]*?<\/svg>([^<]+)<\/div>/g),
    ].map((r) => decode(r[1]));
    const address = rows.join(", ");
    cards.push({
      url: m[1].trim(),
      name: decode(m[2]),
      address,
      pincode: address.match(/\b(\d{6})\b/)?.[1] ?? null,
    });
  }
  return cards;
}

async function main() {
  let kept = 0;
  for (const [file, label] of FILES) {
    if (!fs.existsSync(file)) {
      console.log(`skip (missing): ${file}`);
      continue;
    }
    const html = fs.readFileSync(file, "utf8");
    for (const c of parseCards(html)) {
      const inPark = IT_PARK_RE.test(c.address);
      const slug = c.url.split("/").pop() as string;
      const data = {
        name: c.name,
        category: label,
        address: c.address || null,
        area: inPark
          ? "SIDCUL IT Park, Sahastradhara Road, Dehradun"
          : "Dehradun, Uttarakhand",
        pincode: c.pincode,
        phone: null,
        email: null,
        website: null,
        description: `${c.name} is a technology company (${label}) listed in the SIDCUL IT directory, Dehradun.`,
      };
      try {
        await prisma.directoryCompany.upsert({
          where: { sourceUrl: c.url },
          create: { ...data, slug, sourceUrl: c.url },
          update: data,
        });
        kept++;
      } catch {
        // skip collisions
      }
    }
  }
  console.log(`Upserted ${kept}. Total: ${await prisma.directoryCompany.count()}`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
