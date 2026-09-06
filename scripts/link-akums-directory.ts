// Enriches the existing "Akums Drugs & Pharmaceuticals Ltd" directory listing
// (Pharmaceuticals) with the current plot address + contact, and links it to
// the hr@akums.in company account so that account owns the public page (logo
// + gallery + website/WhatsApp/email from the dashboard).
//
// Additive & idempotent — updates one existing DirectoryCompany by slug and
// links the profile only if it isn't linked yet. Touches nothing else.
// Run with: npx tsx scripts/link-akums-directory.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SLUG = "akums-drugs-pharmaceuticals-ltd";
const ADDRESS = "Plot No.27-30,Sector-8a,Sidcul Haridwar";
const CONTACT_PHONE = "8755500021";
const CONTACT_PERSON = "MR. K.D.SHARMA";

async function main() {
  const directory = await prisma.directoryCompany.findUnique({
    where: { slug: SLUG },
  });
  if (!directory) {
    throw new Error(`DirectoryCompany "${SLUG}" not found.`);
  }

  await prisma.directoryCompany.update({
    where: { id: directory.id },
    data: {
      address: ADDRESS,
      area: "SIDCUL Integrated Industrial Estate, Haridwar",
      phone: CONTACT_PHONE,
      description: `Contact: ${CONTACT_PERSON}`,
    },
  });

  const profile = await prisma.companyProfile.findFirst({
    where: { user: { email: "hr@akums.in" } },
  });
  if (!profile) {
    throw new Error(
      "hr@akums.in company profile not found — run `npm run db:seed` first.",
    );
  }

  await prisma.companyProfile.update({
    where: { id: profile.id },
    data: {
      phone: `+91${CONTACT_PHONE}`,
      ...(profile.directoryCompanyId === directory.id
        ? {}
        : { directoryCompanyId: directory.id }),
    },
  });

  console.log(
    profile.directoryCompanyId === directory.id
      ? `Updated details, already linked → /directory/${SLUG}`
      : `Updated details + linked hr@akums.in → /directory/${SLUG}`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
