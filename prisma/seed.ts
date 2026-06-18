// Seed demo data for the SIDCUL job portal.
// Run with: npm run db:seed
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PASSWORD = "password123";

async function main() {
  // Clean slate (dependency order) so the seed is rerunnable.
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.companyProfile.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  // ---- Admin ----
  await prisma.user.create({
    data: {
      email: "admin@sidcul.in",
      passwordHash,
      role: "ADMIN",
      name: "SIDCUL Admin",
    },
  });

  // ---- Verified company: Akums Drugs (Pharmaceuticals) ----
  await prisma.user.create({
    data: {
      email: "hr@akums.in",
      passwordHash,
      role: "COMPANY",
      name: "Akums Drugs HR",
      companyProfile: {
        create: {
          companyName: "Akums Drugs & Pharmaceuticals",
          sector: "Pharmaceuticals",
          location: "SIDCUL, Haridwar",
          website: "https://akums.in",
          about:
            "One of India's largest contract manufacturing organisations (CMOs), operating multiple WHO-GMP certified formulation facilities inside the SIDCUL Integrated Industrial Estate.",
          verified: true,
          jobs: {
            create: [
              {
                title: "QA Chemist (WHO-GMP)",
                description:
                  "Perform in-process and finished-goods quality checks on formulation lines. B.Pharm / M.Sc Chemistry preferred. Familiarity with GMP documentation required.",
                location: "Haridwar",
                jobType: "FULL_TIME",
                sector: "Pharmaceuticals",
                salary: "₹3.0–4.2 LPA",
                status: "OPEN",
              },
              {
                title: "Production Operator — Tablet Section",
                description:
                  "Operate compression and coating machines. ITI / Diploma holders welcome. Training provided on SOPs and changeover procedures.",
                location: "Haridwar",
                jobType: "SHIFT",
                sector: "Pharmaceuticals",
                salary: "₹16,000–22,000 / month",
                status: "OPEN",
              },
              {
                title: "Packaging Line Trainee",
                description:
                  "Entry-level role on blister and bottle packing lines. Freshers and ITI graduates encouraged to apply. Rotational shifts.",
                location: "Haridwar",
                jobType: "INTERNSHIP",
                sector: "Pharmaceuticals",
                salary: "₹12,000 / month stipend",
                status: "OPEN",
              },
            ],
          },
        },
      },
    },
  });

  // ---- Verified company: Hindustan Unilever (FMCG) ----
  await prisma.user.create({
    data: {
      email: "hr@hul.in",
      passwordHash,
      role: "COMPANY",
      name: "HUL Plant HR",
      companyProfile: {
        create: {
          companyName: "Hindustan Unilever Ltd",
          sector: "FMCG & Packaging",
          location: "SIDCUL, Haridwar",
          website: "https://hul.co.in",
          about:
            "FMCG anchor delivering personal-care and packaging operations directly inside the Integrated Industrial Estate.",
          verified: true,
          jobs: {
            create: [
              {
                title: "Seasonal Packaging Line Operators (50 openings)",
                description:
                  "High-volume seasonal hiring for peak-demand packing lines. Shift-basis micro-contracts of 3 months. No prior experience needed.",
                location: "Haridwar",
                jobType: "SEASONAL",
                sector: "FMCG & Packaging",
                salary: "₹15,000–18,000 / month",
                status: "OPEN",
              },
              {
                title: "Maintenance Technician (Electrical)",
                description:
                  "Preventive and breakdown maintenance of packaging machinery. ITI Electrician with 1+ year experience preferred.",
                location: "Haridwar",
                jobType: "FULL_TIME",
                sector: "FMCG & Packaging",
                salary: "₹2.4–3.0 LPA",
                status: "OPEN",
              },
            ],
          },
        },
      },
    },
  });

  // ---- UNVERIFIED company: Havells (to demo the admin verification flow) ----
  await prisma.user.create({
    data: {
      email: "hr@havells.in",
      passwordHash,
      role: "COMPANY",
      name: "Havells HR",
      companyProfile: {
        create: {
          companyName: "Havells India Ltd",
          sector: "Electrical & Auto",
          location: "SIDCUL, Haridwar",
          website: "https://havells.com",
          about:
            "Manufacturer of consumer electricals, cables, switchgear and machinery components. Awaiting directory verification.",
          verified: false,
        },
      },
    },
  });

  // ---- Student ----
  await prisma.user.create({
    data: {
      email: "rahul@student.in",
      passwordHash,
      role: "STUDENT",
      name: "Rahul Verma",
      studentProfile: {
        create: {
          fullName: "Rahul Verma",
          phone: "+91 98765 43210",
          education: "Diploma in Mechanical Engineering, Govt. Polytechnic Haridwar",
          skills: "Machine operation, CNC basics, GMP awareness, MS Office",
        },
      },
    },
  });

  const counts = {
    users: await prisma.user.count(),
    companies: await prisma.companyProfile.count(),
    jobs: await prisma.job.count(),
  };
  console.log("Seed complete:", counts);
  console.log(`All demo accounts use password: ${PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
