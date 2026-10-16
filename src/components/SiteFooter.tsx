"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function SiteFooter() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <footer className="border-t border-ink-950/10 bg-ink-950 text-slate-400">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <Image
                src="/smau-logo.webp"
                alt="SMAU International Industry & Trade Chambers"
                width={1316}
                height={1195}
                sizes="80px"
                loading="eager"
                className="h-16 w-auto shrink-0 sm:h-20"
              />
              <span className="font-display text-base font-bold tracking-tight text-white">
                SIDCUL<span className="text-brand"> Hub</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              The directory, jobs and equipment-leasing platform of the SIDCUL
              Manufacturers Association — Haridwar Integrated Industrial Estate.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <nav className="flex flex-col gap-2.5 text-sm">
              <p className="label-tag mb-1 text-slate-500">Explore</p>
              <Link href="/directory" className="transition-colors hover:text-white">
                Company directory
              </Link>
              <Link href="/jobs" className="transition-colors hover:text-white">
                Browse jobs
              </Link>
              <Link href="/equipment" className="transition-colors hover:text-white">
                Lease equipment
              </Link>
              <Link href="/about" className="transition-colors hover:text-white">
                About SMAU
              </Link>
            </nav>
            <nav className="flex flex-col gap-2.5 text-sm">
              <p className="label-tag mb-1 text-slate-500">Account</p>
              <Link href="/register" className="transition-colors hover:text-white">
                List your company
              </Link>
              <Link href="/login" className="transition-colors hover:text-white">
                Log in
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-center text-slate-500 sm:w-full sm:text-center">
              SMAU · © {new Date().getFullYear()} SIDCUL SMAU International Industry &amp; Trade
              Chambers (SIIATCH)
            </p>
          </div>
          <p className="text-center text-slate-500">
            @Design &amp; Develop by{" "}
            <a
              href="http://www.thecraftsync.com/contact/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-slate-300 underline decoration-slate-600 underline-offset-4 transition-colors hover:text-brand"
            >
              The Craft Sync
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
