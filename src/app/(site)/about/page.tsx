import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About SMAU — SIDCUL Hub",
  description:
    "SMAU International Industry & Trade Chambers, Haridwar — connecting industries, empowering businesses and enabling global trade.",
};

const HERO_IMG =
  "/hari-ki-pauri.webp";
const FACTORY_IMG =
  "/industrial-units.webp";
const ESTATE_IMG =
  "/haridwar-mansa-devi.webp";

const AUDIENCE = [
  "Manufacturers",
  "Traders",
  "Entrepreneurs",
  "Industrialists",
  "Business professionals",
];

const PILLARS = [
  {
    title: "Industry development",
    body: "Encouraging knowledge sharing and strategic partnerships that drive sustainable economic growth across the region.",
    icon: (
      <path d="M3 21h18M5 21V10l5 3V8l5 3V4l4 2v15M9 17h2m4 0h2" />
    ),
  },
  {
    title: "Business networking",
    body: "Bringing manufacturers, traders and professionals together to collaborate, learn and grow as one community.",
    icon: (
      <>
        <circle cx="6" cy="7" r="2.5" />
        <circle cx="18" cy="7" r="2.5" />
        <circle cx="12" cy="18" r="2.5" />
        <path d="M8 8.5l3 7m5-7l-3 7M8.5 7h7" />
      </>
    ),
  },
  {
    title: "Trade opportunities",
    body: "Facilitating trade connections and supporting expansion into new markets — local, national and international.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" />
      </>
    ),
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ============== HERO ============== */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="pointer-events-none absolute inset-0">
          <Image
            src={HERO_IMG}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-[0.4]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/40" />
          <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-brand/20 blur-[120px]" />
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:py-24 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="label-tag text-brand">About SMAU</p>
            <h1 className="mt-4 font-display text-3xl font-bold leading-[1.1] sm:text-5xl">
              SMAU International Industry &amp; Trade Chambers
              <span className="text-brand">, Haridwar</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-slate-300 sm:text-lg">
              Connecting Industries. Empowering Businesses. Enabling Global
              Trade.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/directory" className="btn btn-primary">
                Explore the directory
              </Link>
              <Link
                href="/register"
                className="btn border border-white/25 bg-white/5 text-white hover:bg-white/10"
              >
                Join the network
              </Link>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[16rem] lg:max-w-xs">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <Image
                src="/smau-logo.webp"
                alt="SMAU International Industry & Trade Chambers"
                width={1316}
                height={1195}
                priority
                sizes="320px"
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============== WHO WE ARE ============== */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="label-tag text-brand">Who we are</p>
            <h2 className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
              A platform for industrial growth and collaboration
            </h2>
            <p className="mt-5 leading-relaxed text-ink-700">
              SMAU International Industry &amp; Trade Chambers is envisioned as
              a platform dedicated to fostering industrial growth, promoting
              business collaboration, and strengthening trade opportunities at
              local, national, and international levels.
            </p>
            <p className="mt-4 leading-relaxed text-ink-700">
              With a focus on industry development, entrepreneurship, and
              business networking, SMAU aims to bring together the people who
              build and move the economy:
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {AUDIENCE.map((a) => (
                <li
                  key={a}
                  className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm font-medium text-ink-700"
                >
                  {a}
                </li>
              ))}
            </ul>
            <p className="mt-5 leading-relaxed text-ink-700">
              Together they encourage knowledge sharing, strategic
              partnerships, and sustainable economic growth.
            </p>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_24px_60px_-28px_rgba(27,26,31,0.45)]">
              <Image
                src={FACTORY_IMG}
                alt="Manufacturing and warehousing units in the SIDCUL industrial estate"
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-4 rounded-xl border border-line bg-white px-4 py-3 shadow-lg sm:left-6">
              <p className="label-tag text-muted">Based in</p>
              <p className="font-display text-sm font-bold text-ink">
                Haridwar, Uttarakhand
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============== VISION & MISSION ============== */}
      <section className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-16 sm:py-20 md:grid-cols-2">
          <article className="rounded-2xl border border-line bg-canvas p-7 sm:p-9">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand text-white">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </span>
            <p className="label-tag mt-5 text-brand">Our vision</p>
            <p className="mt-3 font-display text-xl font-bold leading-snug text-ink sm:text-2xl">
              To build a strong and connected business community that drives
              industrial innovation, entrepreneurship, and international trade.
            </p>
          </article>

          <article className="rounded-2xl bg-ink-950 p-7 text-white sm:p-9">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand text-white">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="4.5" />
                <circle cx="12" cy="12" r="1" />
              </svg>
            </span>
            <p className="label-tag mt-5 text-brand">Our mission</p>
            <p className="mt-3 font-display text-xl font-bold leading-snug sm:text-2xl">
              To promote business networking, industrial development, trade
              collaboration, and opportunities for sustainable business growth.
            </p>
          </article>
        </div>
      </section>

      {/* ============== WHAT WE FOCUS ON ============== */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="max-w-2xl">
          <p className="label-tag text-brand">What we focus on</p>
          <h2 className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
            Strengthening the region&rsquo;s industrial ecosystem
          </h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-line bg-white p-6 transition-shadow duration-200 hover:shadow-[0_18px_40px_-28px_rgba(27,26,31,0.35)]"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand ring-1 ring-inset ring-brand/10">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  {p.icon}
                </svg>
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-ink">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============== HARIDWAR / CLOSING ============== */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="pointer-events-none absolute inset-0">
          <Image
            src={ESTATE_IMG}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-[0.25]"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-ink-950 via-ink-950/90 to-ink-950/60" />
        </div>
        <div className="relative mx-auto max-w-4xl px-5 py-16 text-center sm:py-24">
          <p className="mx-auto max-w-2xl leading-relaxed text-slate-300">
            Based in Haridwar, Uttarakhand, SMAU seeks to contribute to the
            region&rsquo;s industrial ecosystem by encouraging collaboration
            among businesses, facilitating trade connections, and supporting
            opportunities for expansion into new markets.
          </p>
          <p className="mt-8 font-display text-2xl font-bold sm:text-3xl">
            Building Connections,{" "}
            <span className="text-brand">Creating Opportunities.</span>
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/jobs" className="btn btn-primary">
              Browse jobs
            </Link>
            <Link
              href="/register"
              className="btn border border-white/25 bg-white/5 text-white hover:bg-white/10"
            >
              List your company
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
