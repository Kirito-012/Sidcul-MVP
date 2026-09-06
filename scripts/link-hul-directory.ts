// Adds "Hindustan Unilever Ltd" to the public DirectoryCompany list and links
// it to the existing hr@hul.in company account, so that account can enrich its
// public directory page (logo + 2-image gallery) from the company dashboard.
//
// Additive & idempotent — upserts one DirectoryCompany by sourceUrl and links
// the profile only if it isn't linked yet. Does not touch any other data.
// Run with: npx tsx scripts/link-hul-directory.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SOURCE_URL = "local://company-accounts/hindustan-unilever-ltd";
const SLUG = "hindustan-unilever-ltd";

async function main() {
  const profile = await prisma.companyProfile.findFirst({
    where: { user: { email: "hr@hul.in" } },
  });
  if (!profile) {
    throw new Error(
      "hr@hul.in company profile not found — run `npm run db:seed` first.",
    );
  }

  const directory = await prisma.directoryCompany.upsert({
    where: { sourceUrl: SOURCE_URL },
    update: {
      name: profile.companyName,
      category: profile.sector ?? "FMCG & Packaging",
      address: profile.location ?? "SIDCUL, Haridwar",
      area: "SIDCUL Integrated Industrial Estate, Haridwar",
      phone: profile.phone,
      website: null,
      description: profile.about,
    },
    create: {
      name: profile.companyName,
      slug: SLUG,
      category: profile.sector ?? "FMCG & Packaging",
      address: profile.location ?? "SIDCUL, Haridwar",
      area: "SIDCUL Integrated Industrial Estate, Haridwar",
      phone: profile.phone,
      description: profile.about,
      sourceUrl: SOURCE_URL,
    },
  });

  if (profile.directoryCompanyId !== directory.id) {
    await prisma.companyProfile.update({
      where: { id: profile.id },
      data: { directoryCompanyId: directory.id },
    });
    console.log(`Linked ${profile.companyName} → /directory/${directory.slug}`);
  } else {
    console.log(`Already linked → /directory/${directory.slug}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
