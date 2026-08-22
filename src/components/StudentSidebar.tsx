"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  icon: (p: { className?: string }) => React.ReactElement;
  match: (pathname: string) => boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/student",
    label: "My Applications",
    icon: ClipboardIcon,
    match: (p) => p === "/student",
  },
  {
    href: "/jobs",
    label: "Browse Jobs",
    icon: BriefcaseIcon,
    match: (p) => p === "/jobs" || p.startsWith("/jobs/"),
  },
  {
    href: "/directory",
    label: "IT Directory",
    icon: SearchIcon,
    match: (p) => p === "/directory" || p.startsWith("/directory/"),
  },
];

export default function StudentSidebar({
  name,
  logoutAction,
  children,
}: {
  name: string;
  logoutAction: () => Promise<void>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex w-full">
      {/* ============== DESKTOP SIDEBAR ============== */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-ink lg:flex">
        <SidebarContent pathname={pathname} name={name} logoutAction={logoutAction} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* ============== MOBILE HEADER ============== */}
        <div className="sticky top-0 z-30 bg-ink lg:hidden">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
            <Link href="/" className="font-display text-base font-bold tracking-tight text-white">
              SIDCUL <span className="text-accent">Hub</span>
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="cursor-pointer text-xs font-semibold text-slate-300 transition-colors hover:text-white"
              >
                Log out
              </button>
            </form>
          </div>
          <div className="flex gap-1.5 overflow-x-auto border-b-2 border-ink px-3 py-2.5">
            {NAV_ITEMS.map((item) => {
              const active = item.match(pathname);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? "bg-white text-ink"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({
  pathname,
  name,
  logoutAction,
}: {
  pathname: string;
  name: string;
  logoutAction: () => Promise<void>;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Student identity */}
      <div className="mx-4 mt-4 rounded-xl bg-white/5 p-3.5">
        <p className="truncate text-sm font-semibold text-white">{name}</p>
        <span className="badge mt-1.5 bg-accent-50 text-accent-600">Student</span>
      </div>

      {/* Nav */}
      <nav className="mt-6 flex-1 space-y-6 overflow-y-auto px-3">
        <div>
          <p className="label-tag px-2.5 text-slate-400">Menu</p>
          <div className="mt-2 space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <SidebarLink key={item.href} item={item} active={item.match(pathname)} />
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          <HomeIcon className="h-4.5 w-4.5 shrink-0" />
          Home
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogoutIcon className="h-4.5 w-4.5 shrink-0" />
            Log out
          </button>
        </form>
      </div>
    </div>
  );
}

function SidebarLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
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

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="5" y="4.5" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 4V3a1 1 0 011-1h4a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M8.5 11h7M8.5 15h7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
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

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 20l-3.2-3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 11l8-7 8 7v8.5a1 1 0 01-1 1h-4.5v-6h-5v6H5a1 1 0 01-1-1V11z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M15 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h7a2 2 0 002-2v-2M10 12h11m0 0l-3.5-3.5M21 12l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
