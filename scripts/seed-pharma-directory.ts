// Seeds SIDCUL pharma companies (from the SIDCUL Manufacturers Association
// spreadsheet) into the DirectoryCompany table, categorized as "Pharmaceuticals".
// Additive/idempotent — upserts by sourceUrl, does not touch other directory
// categories (e.g. the scraped IT Park companies).
// Run with: npx tsx scripts/seed-pharma-directory.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PHARMA_COMPANIES = [
  {
    "name": "Agrawal Drugs Pvt Limited",
    "slug": "agrawal-drugs-pvt-limited",
    "address": "24,Sec-6B,SIDCUL IIE HARIDWAR 249403",
    "pincode": "249403",
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/agrawal-drugs-pvt-limited"
  },
  {
    "name": "Akme Biotec",
    "slug": "akme-biotec",
    "address": "24,Sec-5, SIDCUL.IIE,HARIDWAR-249403",
    "pincode": "249403",
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/akme-biotec"
  },
  {
    "name": "Akums Drugs & Pharmaceuticals Ltd",
    "slug": "akums-drugs-pharmaceuticals-ltd",
    "address": "19-21,SEC-6A, SIDCULE IIE, HARIDWAR-249403",
    "pincode": "249403",
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/akums-drugs-pharmaceuticals-ltd"
  },
  {
    "name": "Apco Pharma Ltd.",
    "slug": "apco-pharma-ltd",
    "address": "D-8,IndI.Area. Haridwar-349401 H.O.-359/25,IGNOU Rood, Saidulajab (Saket), New Delhi-30.",
    "pincode": null,
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/apco-pharma-ltd"
  },
  {
    "name": "Arogya Formulations (P) Ltd.",
    "slug": "arogya-formulations-p-ltd",
    "address": "76,Sec-6A,SIDCUL IIE,Haridwar-249403",
    "pincode": "249403",
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/arogya-formulations-p-ltd"
  },
  {
    "name": "Baxil Pharma Pvt.Ltd.",
    "slug": "baxil-pharma-pvt-ltd",
    "address": "10 km, Haridwar Narinital Highway, Shyampur, Haridwar-249408",
    "pincode": "249408",
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/baxil-pharma-pvt-ltd"
  },
  {
    "name": "Bon-Heur Pharmaceuticals",
    "slug": "bon-heur-pharmaceuticals",
    "address": "Plot-130B-131, Sec-6A, IIE, SIDCUL, Haridwar",
    "pincode": null,
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/bon-heur-pharmaceuticals"
  },
  {
    "name": "Devot Pharmaceutical",
    "slug": "devot-pharmaceutical",
    "address": "PLOT NO. 13,SECTOR 6B ,IIE,SIDCUL ,HARIDWAR",
    "pincode": null,
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/devot-pharmaceutical"
  },
  {
    "name": "Eastern Healthcare",
    "slug": "eastern-healthcare",
    "address": "7, Sec-6A,IIE SIDCUL Haridwar-249403",
    "pincode": "249403",
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/eastern-healthcare"
  },
  {
    "name": "Eskage Pharma P.Ltd.",
    "slug": "eskage-pharma-p-ltd",
    "address": null,
    "pincode": null,
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/eskage-pharma-p-ltd"
  },
  {
    "name": "HSN International",
    "slug": "hsn-international",
    "address": "54,55/6A,IIE, SIDCUL Haridwar UK",
    "pincode": null,
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/hsn-international"
  },
  {
    "name": "IG Pharma",
    "slug": "ig-pharma",
    "address": "12.4 Merrut road,Village Libberheri ,Roorkee",
    "pincode": null,
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/ig-pharma"
  },
  {
    "name": "Inodaya Pharmaceuticals",
    "slug": "inodaya-pharmaceuticals",
    "address": "25/5,iie,sidcul,Haridwar",
    "pincode": null,
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/inodaya-pharmaceuticals"
  },
  {
    "name": "J.Pee Drug",
    "slug": "j-pee-drug",
    "address": "53/6A,IIE,SIDCUL,Haridwar 249403",
    "pincode": "249403",
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/j-pee-drug"
  },
  {
    "name": "Jeneka Healthcare",
    "slug": "jeneka-healthcare",
    "address": "15,Sec-6b, SIDCUL IIE,Haridwar (U.K.)",
    "pincode": null,
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/jeneka-healthcare"
  },
  {
    "name": "La Grande Herbs & Pharma Ltd.",
    "slug": "la-grande-herbs-pharma-ltd",
    "address": "13, Sector 6B,IIE, SIDCUL, Haridwar,UK",
    "pincode": null,
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/la-grande-herbs-pharma-ltd"
  },
  {
    "name": "Life Max Cancer Lab",
    "slug": "life-max-cancer-lab",
    "address": null,
    "pincode": null,
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/life-max-cancer-lab"
  },
  {
    "name": "Mascot Healthcare",
    "slug": "mascot-healthcare",
    "address": "79-80, IIE, SIDCUL, Sector 6A, Haridwar (UK)",
    "pincode": null,
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/mascot-healthcare"
  },
  {
    "name": "Matins Health Care",
    "slug": "matins-health-care",
    "address": "10,Sec.5, SIDCUL IIE,Haridwar 249403",
    "pincode": "249403",
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/matins-health-care"
  },
  {
    "name": "Maxcure Drugs & Pharma Ltd",
    "slug": "maxcure-drugs-pharma-ltd",
    "address": "Plot No. 13, Sector -6A,IIA,SIDCUL,Ranipur, Haridwar-239403",
    "pincode": "239403",
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/maxcure-drugs-pharma-ltd"
  },
  {
    "name": "Medicamen Biotech",
    "slug": "medicamen-biotech",
    "address": "Plot No.86 &87, Sec-6A,SIDCUL,Haridwar",
    "pincode": null,
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/medicamen-biotech"
  },
  {
    "name": "Medimark Drugs & P`ceuticals",
    "slug": "medimark-drugs-p-ceuticals",
    "address": "39,Sec,6A SIDCUL IIE, Haridwar-249403",
    "pincode": "249403",
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/medimark-drugs-p-ceuticals"
  },
  {
    "name": "Om Bio Medic Pvt.Limited",
    "slug": "om-bio-medic-pvt-limited",
    "address": "68-69,82-83/6A,SIDCUL,IIE Haridwar",
    "pincode": null,
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/om-bio-medic-pvt-limited"
  },
  {
    "name": "Onus Zeneka Pharmaceuticals",
    "slug": "onus-zeneka-pharmaceuticals",
    "address": "Plot No. 88, Sector IIDC, Integrated Industrial Estate (IIE), BHEL,Haridwar- 249403",
    "pincode": "249403",
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/onus-zeneka-pharmaceuticals"
  },
  {
    "name": "Parrish Pharmaceuticals",
    "slug": "parrish-pharmaceuticals",
    "address": "Plot-50, sec-8A, IIE, SIDCUL haridwar",
    "pincode": null,
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/parrish-pharmaceuticals"
  },
  {
    "name": "Penta Biotech",
    "slug": "penta-biotech",
    "address": "92-93,Sec-6A SIDCUL IIE Haridwar-249403",
    "pincode": "249403",
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/penta-biotech"
  },
  {
    "name": "Percose India Limited",
    "slug": "percose-india-limited",
    "address": "23/6B, IIE, SIDCUL Haridwar",
    "pincode": null,
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/percose-india-limited"
  },
  {
    "name": "Pfizer A.H.Ltd.",
    "slug": "pfizer-a-h-ltd",
    "address": "F-1/1 , Sector-6B, IIE SIDCUL, Haridwar",
    "pincode": null,
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/pfizer-a-h-ltd"
  },
  {
    "name": "Pharma Synth Formulations Ltd",
    "slug": "pharma-synth-formulations-ltd",
    "address": "Plot No. - 18-22, Sec 6B, SIDCUL IIE, Haridwar - 249403 Regd Off. A-10/15 Jhilmil Indl Area Delhi-110095",
    "pincode": "249403",
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/pharma-synth-formulations-ltd"
  },
  {
    "name": "Poddar Pharmac. P.Ltd.",
    "slug": "poddar-pharmac-p-ltd",
    "address": "E-35,Ind.Area Haridwar 249401",
    "pincode": "249401",
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/poddar-pharmac-p-ltd"
  },
  {
    "name": "Psychotropics India Ltd",
    "slug": "psychotropics-india-ltd",
    "address": "46 &49 Sec.6A SIDCUL IIE, Haridwar, Corp.Off: A-32, dlf Sec-11 Faridabad-121006",
    "pincode": null,
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/psychotropics-india-ltd"
  },
  {
    "name": "Redox Pharmachem Pvt Ltd",
    "slug": "redox-pharmachem-pvt-ltd",
    "address": "Plot no. 61-62 Sector &, SIDCUL IIE, Haridwar, 249403",
    "pincode": "249403",
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/redox-pharmachem-pvt-ltd"
  },
  {
    "name": "Ravian Life Science Pvt.Ltd",
    "slug": "ravian-life-science-pvt-ltd",
    "address": "plot No-34, Sector -8A, IIE, SIDCUL,Haridwar",
    "pincode": null,
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/ravian-life-science-pvt-ltd"
  },
  {
    "name": "Renowed Lifesciences",
    "slug": "renowed-lifesciences",
    "address": "SIDCUL Haridwar",
    "pincode": null,
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/renowed-lifesciences"
  },
  {
    "name": "Rivpra Formulation P. Ltd",
    "slug": "rivpra-formulation-p-ltd",
    "address": null,
    "pincode": null,
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/rivpra-formulation-p-ltd"
  },
  {
    "name": "Sarv Pharma",
    "slug": "sarv-pharma",
    "address": "PLOT NO .28 SECOR 3 SIDCUL",
    "pincode": null,
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/sarv-pharma"
  },
  {
    "name": "Salute Bestochem",
    "slug": "salute-bestochem",
    "address": "Plot-23, Sec.6A SIDCUL IIE Haridwar-249403. H.o.-A-4/14,Site-4, Industrial Area,Sahibabad-2101010",
    "pincode": "249403",
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/salute-bestochem"
  },
  {
    "name": "Skymap",
    "slug": "skymap",
    "address": null,
    "pincode": null,
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/skymap"
  },
  {
    "name": "Sucantis Biotech Pvt Ltd",
    "slug": "sucantis-biotech-pvt-ltd",
    "address": "Plot- E127 & 128 Inds. Area bahadrabad",
    "pincode": null,
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/sucantis-biotech-pvt-ltd"
  },
  {
    "name": "Synokem Pharma Ltd",
    "slug": "synokem-pharma-ltd",
    "address": "Plot 35-36, Sector 6A, IIE, SIDCUL, Haridwar",
    "pincode": null,
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/synokem-pharma-ltd"
  },
  {
    "name": "Talent Healthcare",
    "slug": "talent-healthcare",
    "address": "66-67,Sec.6A,SIDCUL, IIE Haridwar-249403",
    "pincode": "249403",
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/talent-healthcare"
  },
  {
    "name": "Themis Medicare Ltd.",
    "slug": "themis-medicare-ltd",
    "address": "16,17 & Sec-6A, SIDCUL IIE Haridwar 249403",
    "pincode": "249403",
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/themis-medicare-ltd"
  },
  {
    "name": "Unimark Healthcare Ltd",
    "slug": "unimark-healthcare-ltd",
    "address": "24,25,37/6A,IIE, SIDCUL, Haridwar UK",
    "pincode": null,
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/unimark-healthcare-ltd"
  },
  {
    "name": "United Bioceuticals Pvt. Ltd",
    "slug": "united-bioceuticals-pvt-ltd",
    "address": "33 C, IP-IV, Begampur, Haridwar UK",
    "pincode": null,
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/united-bioceuticals-pvt-ltd"
  },
  {
    "name": "Vivimed Labs Limited",
    "slug": "vivimed-labs-limited",
    "address": "D-9 , Old Industrial Area, Haridwar",
    "pincode": null,
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/vivimed-labs-limited"
  },
  {
    "name": "Vivotex Pharma",
    "slug": "vivotex-pharma",
    "address": "Plot No-28 B, Sector-8B, IIE, SIDCUL Haridwar",
    "pincode": null,
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/vivotex-pharma"
  },
  {
    "name": "Zaneka Healthcare (P) Ltd.",
    "slug": "zaneka-healthcare-p-ltd",
    "address": "BHEL Ranipur Haridwar",
    "pincode": null,
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/zaneka-healthcare-p-ltd"
  },
  {
    "name": "Zaneka Drugs",
    "slug": "zaneka-drugs",
    "address": "90-91, Sector 6A, IIE, SIDCUL, Haridwar",
    "pincode": null,
    "category": "Pharmaceuticals",
    "sourceUrl": "local://pharma-directory/zaneka-drugs"
  }
] as const;

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  let created = 0;
  let updated = 0;

  for (const company of PHARMA_COMPANIES) {
    const existing = await prisma.directoryCompany.findUnique({
      where: { sourceUrl: company.sourceUrl },
    });

    // slug must stay unique across the whole directory; nudge on collision
    // with a different company (unlikely, but the field has a unique index).
    let slug: string = company.slug;
    if (!existing) {
      let i = 2;
      while (
        await prisma.directoryCompany.findUnique({ where: { slug } })
      ) {
        slug = `${company.slug}-${i++}`;
      }
    }

    await prisma.directoryCompany.upsert({
      where: { sourceUrl: company.sourceUrl },
      create: {
        name: company.name,
        slug,
        category: company.category,
        address: company.address ?? undefined,
        pincode: company.pincode ?? undefined,
        sourceUrl: company.sourceUrl,
      },
      update: {
        name: company.name,
        category: company.category,
        address: company.address ?? undefined,
        pincode: company.pincode ?? undefined,
      },
    });

    if (existing) updated++;
    else created++;
  }

  console.log(`Pharma directory seed complete: ${created} created, ${updated} updated.`);
  console.log(`Total directory companies in DB: ${await prisma.directoryCompany.count()}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
