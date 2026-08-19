// Seeds demo equipment-leasing data between the two verified demo companies
// (Akums Drugs & Pharmaceuticals, Hindustan Unilever Ltd) so the leasing
// feature has something to look at out of the box. Rerunnable: wipes and
// recreates only the Equipment (and cascaded LeaseRequests) owned by these
// two companies — does not touch other companies' listings.
// Run with: npm run seed:leasing
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
}

async function main() {
  const akums = await prisma.companyProfile.findFirst({
    where: { user: { email: "hr@akums.in" } },
  });
  const hul = await prisma.companyProfile.findFirst({
    where: { user: { email: "hr@hul.in" } },
  });

  if (!akums || !hul) {
    throw new Error(
      "Demo companies not found — run `npm run db:seed` first to create hr@akums.in and hr@hul.in.",
    );
  }

  // Clean slate for just these two companies' equipment (cascades to their lease requests).
  await prisma.equipment.deleteMany({
    where: { companyId: { in: [akums.id, hul.id] } },
  });

  // ---- Akums lists equipment ----
  const tabletPress = await prisma.equipment.create({
    data: {
      companyId: akums.id,
      name: "Tablet Compression Machine",
      description:
        "Rotary tablet press, 16-station, GMP compliant. Available with operator.",
      category: "Heavy Machinery",
      location: "Haridwar",
      rate: "₹5,000 / day",
      status: "LISTED",
    },
  });

  const blisterPacker = await prisma.equipment.create({
    data: {
      companyId: akums.id,
      name: "Blister Packing Machine",
      description:
        "Automatic blister packaging line for tablets/capsules. Includes changeover tooling for common formats.",
      category: "Packaging & Filling",
      location: "Haridwar",
      rate: "₹4,200 / day",
      status: "LISTED",
    },
  });

  const generator = await prisma.equipment.create({
    data: {
      companyId: akums.id,
      name: "Diesel Generator — 500 KVA",
      description:
        "Silent-canopy backup generator, well maintained, serviced every 250 hours. Suitable for plant-scale backup power.",
      category: "Power & Utility",
      location: "Haridwar",
      rate: "₹9,000 / day",
      status: "LISTED",
    },
  });

  // ---- HUL lists equipment ----
  const forklift = await prisma.equipment.create({
    data: {
      companyId: hul.id,
      name: "Forklift — 3 Ton",
      description:
        "Diesel forklift, 3-ton capacity, 4.5m lift height. Trained operator available on request.",
      category: "Material Handling",
      location: "Haridwar",
      rate: "₹3,500 / day",
      status: "LISTED",
    },
  });

  const coldStorage = await prisma.equipment.create({
    data: {
      companyId: hul.id,
      name: "Cold Storage Container (Reefer)",
      description:
        "20ft refrigerated container unit, -18°C to +4°C range. Ideal for short-term temperature-controlled storage.",
      category: "Power & Utility",
      location: "Haridwar",
      rate: "₹6,500 / day",
      status: "LISTED",
    },
  });

  const shrinkWrapper = await prisma.equipment.create({
    data: {
      companyId: hul.id,
      name: "Industrial Shrink Wrap Machine",
      description:
        "Automatic shrink wrap tunnel for palletized/bulk packaging. High throughput, easy changeover.",
      category: "Packaging & Filling",
      location: "Haridwar",
      rate: "₹3,800 / day",
      status: "LISTED",
    },
  });

  // ---- Lease requests: HUL leasing from Akums ----
  await prisma.leaseRequest.create({
    data: {
      equipmentId: tabletPress.id,
      requesterId: hul.id,
      startDate: daysFromNow(14),
      endDate: daysFromNow(23),
      message: "Need this for a short production run at our plant.",
      status: "ACCEPTED",
    },
  });

  await prisma.leaseRequest.create({
    data: {
      equipmentId: tabletPress.id,
      requesterId: hul.id,
      startDate: daysFromNow(18),
      endDate: daysFromNow(28),
      message: "Backup window in case our primary line is delayed.",
      status: "PENDING",
    },
  });

  await prisma.leaseRequest.create({
    data: {
      equipmentId: blisterPacker.id,
      requesterId: hul.id,
      startDate: daysFromNow(30),
      endDate: daysFromNow(35),
      message: "Evaluating for a seasonal packaging run — can we get a quick turnaround?",
      status: "PENDING",
    },
  });

  // ---- Lease requests: Akums leasing from HUL ----
  await prisma.leaseRequest.create({
    data: {
      equipmentId: forklift.id,
      requesterId: akums.id,
      startDate: daysFromNow(10),
      endDate: daysFromNow(17),
      message: "Warehouse reshuffle next week, need extra material handling capacity.",
      status: "ACCEPTED",
    },
  });

  await prisma.leaseRequest.create({
    data: {
      equipmentId: coldStorage.id,
      requesterId: akums.id,
      startDate: daysFromNow(20),
      endDate: daysFromNow(25),
      message: "Temporary cold-chain overflow storage for a batch of biologics.",
      status: "REJECTED",
    },
  });

  await prisma.leaseRequest.create({
    data: {
      equipmentId: shrinkWrapper.id,
      requesterId: akums.id,
      startDate: daysFromNow(12),
      endDate: daysFromNow(16),
      message: "Bulk packaging trial for an export order.",
      status: "CANCELLED",
    },
  });

  const equipmentCount = await prisma.equipment.count({
    where: { companyId: { in: [akums.id, hul.id] } },
  });
  const leaseCount = await prisma.leaseRequest.count({
    where: { equipment: { companyId: { in: [akums.id, hul.id] } } },
  });
  console.log(
    `Leasing demo seed complete: ${equipmentCount} equipment listings, ${leaseCount} lease requests.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
