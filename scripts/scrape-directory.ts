// Scrapes the public IDBF Dehradun business directory for IT/tech companies and
// stores them as read-only DirectoryCompany records for the SIDCUL IT directory.
//
// Listing-only scrape: reads each category page's company cards (name + address)
// rather than hammering per-company detail pages (which are rate-limited and hide
// phone/website behind JS). Run with: npm run scrape:directory
//
// NOTE: third-party compiled directory data, used to bootstrap the MVP. Verify
// usage rights before relying on it for a public production launch.
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const BASE = "https://dehradun.idbf.in";
const MAX_COMPANIES = 400; // effectively "all" qualifying companies

// IT-first ordering so that, if we hit the cap, software/IT firms are kept over
// retail shops. [slug, display label]
const CATEGORIES: [string, string][] = [
  ["software-companies", "Software Companies"],
  ["website-developer-designer", "Website Developers & Designers"],
  ["computer-center", "Computer Centres"],
  ["electronics-manufacturers", "Electronics Manufacturers"],
  ["cctv-camera", "CCTV & Security Systems"],
  ["computer-shops", "Computer Shops"],
  ["computer-printer-shops", "Computer & Printer Shops"],
  ["electronics", "Electronics"],
  ["hardware-tools", "Hardware & Tools"],
];

const HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  Cookie: "null=null",
};

const IT_PARK_RE = /it park|sahastradhara|sidcul/i;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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

// Spammy listings cram many keywords with separators — keep the first clean part.
function tidyName(raw: string): string {
  let n = raw.split(/\s*\|\s*|\s+[-–—]\s+/)[0];
  n = n.replace(/\s+in\s+(dehradun|uttarakhand)\b.*$/i, "");
  n = n.replace(/\s+/g, " ").trim();
  if (n.length > 60) n = n.slice(0, 57).trim() + "…";
  return n || raw.slice(0, 60).trim();
}

type Card = {
  url: string;
  name: string;
  address: string;
  pincode: string | null;
  category: string;
};

function parseCards(html: string, categoryLabel: string): Card[] {
  const cards: Card[] = [];
  const blocks = html.split('<div class="biz-card">').slice(1);
  for (const block of blocks) {
    const nameMatch = block.match(
      /biz-card-name"><a href="([^"]+)">([^<]+)<\/a>/,
    );
    if (!nameMatch) continue;
    const url = nameMatch[1].trim();
    const name = decode(nameMatch[2]);
    const rows = [
      ...block.matchAll(/<div class="biz-info-row">[\s\S]*?<\/svg>([^<]+)<\/div>/g),
    ].map((m) => decode(m[1]));
    const address = rows.join(", ");
    const pincode = address.match(/\b(\d{6})\b/)?.[1] ?? null;
    cards.push({ url, name, address, pincode, category: categoryLabel });
  }
  return cards;
}

async function fetchCategory(slug: string): Promise<string> {
  // Light retry — an outer loop handles longer waits while the throttle clears.
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(`${BASE}/${slug}`, { headers: HEADERS });
      if (res.ok) {
        const html = await res.text();
        if (html.includes("biz-card")) return html;
      }
    } catch {
      // fall through to retry
    }
    await sleep(3000);
  }
  return "";
}

async function main() {
  const seen = new Map<string, Card>();

  for (const [slug, label] of CATEGORIES) {
    if (seen.size >= MAX_COMPANIES) break;
    const html = await fetchCategory(slug);
    const cards = parseCards(html, label);
    for (const card of cards) {
      if (!seen.has(card.url)) seen.set(card.url, card);
    }
    console.log(`category ${slug}: +${cards.length} cards → ${seen.size} unique`);
    await sleep(2000);
  }

  console.log(`\nUpserting ${Math.min(seen.size, MAX_COMPANIES)} companies…\n`);
  let kept = 0;
  for (const card of seen.values()) {
    if (kept >= MAX_COMPANIES) break;
    const inPark = IT_PARK_RE.test(card.address);
    const slug = card.url.split("/").pop() as string;
    const name = tidyName(card.name);
    const data = {
      name,
      category: card.category,
      address: card.address || null,
      area: inPark
        ? "SIDCUL IT Park, Sahastradhara Road, Dehradun"
        : "Dehradun, Uttarakhand",
      pincode: card.pincode,
      phone: null,
      website: null,
      email: null,
      description: `${name} is a technology company${
        card.category ? ` (${card.category})` : ""
      } listed in the SIDCUL IT directory, Dehradun.`,
    };
    try {
      await prisma.directoryCompany.upsert({
        where: { sourceUrl: card.url },
        create: { ...data, slug, sourceUrl: card.url },
        update: data,
      });
      kept++;
    } catch {
      // slug/sourceUrl collision — skip
    }
  }

  const total = await prisma.directoryCompany.count();
  console.log(`Done. ${kept} companies upserted (${total} total in DB).`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
