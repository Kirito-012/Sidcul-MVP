"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  icon: (p: { className?: string }) => React.ReactElement;
  match: (pathname: string) => boolean;
};

const MANAGE_ITEMS: NavItem[] = [
  {
    href: "/company",
    label: "Dashboard",
    icon: BriefcaseIcon,
    match: (p) => p === "/company" || p.startsWith("/company/jobs"),
  },
  {
    href: "/company/equipment",
    label: "Equipment",
    icon: ToolIcon,
    match: (p) => p.startsWith("/company/equipment"),
  },
  {
    href: "/company/leases",
    label: "Lease Requests",
    icon: ArrowsIcon,
    match: (p) => p.startsWith("/company/leases"),
  },
];

const MARKETPLACE_ITEMS: NavItem[] = [
  {
    href: "/equipment",
    label: "Browse Equipment",
    icon: SearchIcon,
    match: (p) => p === "/equipment" || p.startsWith("/equipment/"),
  },
];

export default function CompanySidebar({
  companyName,
  verified,
  userName,
  logoutAction,
  children,
}: {
  companyName: string;
  verified: boolean;
  userName: string;
  logoutAction: () => Promise<void>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      {/* ============== DESKTOP SIDEBAR ============== */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-ink lg:flex">
        <SidebarContent
          pathname={pathname}
          companyName={companyName}
          verified={verified}
          userName={userName}
          logoutAction={logoutAction}
        />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* ============== MOBILE TOPBAR ============== */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b-2 border-ink bg-ink px-4 py-3 lg:hidden">
          <Link href="/company" className="flex items-center gap-2">
            <Image
              src="/sidcul-logo.jpeg"
              alt="SIDCUL Industrial Association logo"
              width={479}
              height={640}
              className="h-8 w-auto shrink-0 object-contain"
            />
            <span className="font-display text-base font-bold tracking-tight text-white">
              SIDCUL <span className="text-accent">Hub</span>
            </span>
          </Link>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-white transition-colors hover:bg-white/10"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        </header>

        <main className="flex-1">{children}</main>
      </div>

      {/* ============== MOBILE DRAWER ============== */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/60 backdrop-blur-[1px]"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-ink shadow-xl">
            <div className="flex items-center justify-end px-3 pt-3">
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-white transition-colors hover:bg-white/10"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent
              pathname={pathname}
              companyName={companyName}
              verified={verified}
              userName={userName}
              logoutAction={logoutAction}
              onNavigate={() => setOpen(false)}
            />
          </aside>
        </div>
      )}
    </div>
  );
}

function SidebarContent({
  pathname,
  companyName,
  verified,
  userName,
  logoutAction,
  onNavigate,
}: {
  pathname: string;
  companyName: string;
  verified: boolean;
  userName: string;
  logoutAction: () => Promise<void>;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <Link
        href="/company"
        onClick={onNavigate}
        className="hidden items-center gap-2.5 px-5 py-5 lg:flex"
      >
        <Image
          src="/sidcul-logo.jpeg"
          alt="SIDCUL Industrial Association logo"
          width={479}
          height={640}
          className="h-9 w-auto shrink-0 object-contain"
        />
        <span className="font-display text-lg font-bold tracking-tight text-white">
          SIDCUL <span className="text-accent">Hub</span>
        </span>
      </Link>

      {/* Company identity */}
      <div className="mx-4 mt-1 rounded-xl bg-white/5 p-3.5 lg:mt-0">
        <p className="truncate text-sm font-semibold text-white">{companyName}</p>
        <span
          className={`badge mt-1.5 ${
            verified
              ? "bg-accent-50 text-accent-600"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {verified ? (
            <>
              <CheckIcon className="h-3 w-3" />
              Verified
            </>
          ) : (
            "Pending verification"
          )}
        </span>
      </div>

      {/* Nav */}
      <nav className="mt-6 flex-1 space-y-6 overflow-y-auto px-3">
        <div>
          <p className="label-tag px-2.5 text-slate-400">Manage</p>
          <div className="mt-2 space-y-0.5">
            {MANAGE_ITEMS.map((item) => (
              <SidebarLink
                key={item.href}
                item={item}
                active={item.match(pathname)}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
        <div>
          <p className="label-tag px-2.5 text-slate-400">Marketplace</p>
          <div className="mt-2 space-y-0.5">
            {MARKETPLACE_ITEMS.map((item) => (
              <SidebarLink
                key={item.href}
                item={item}
                active={item.match(pathname)}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          className="block rounded-lg px-2.5 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          ← View public site
        </Link>
        <div className="mt-1 flex items-center justify-between gap-2 px-2.5 py-1.5">
          <span className="truncate text-xs text-slate-400">{userName}</span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="cursor-pointer text-xs font-semibold text-slate-300 transition-colors hover:text-white"
            >
              Log out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function SidebarLink({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-white text-ink"
          : "text-slate-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      <Icon className="h-4.5 w-4.5 shrink-0" />
      {item.label}
    </Link>
  );
}

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="7.5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 7.5V6a2 2 0 012-2h4a2 2 0 012 2v1.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M3 12.5h18" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function ToolIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M14.7 6.3a4 4 0 015.6 5.6l-7 7a4 4 0 01-5.6-5.6l1.6-1.6M9.5 14.5l-5 5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 8h13m0 0l-3.5-3.5M17 8l-3.5 3.5M20 16H7m0 0l3.5-3.5M7 16l3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 20l-3.2-3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 12.5l4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
