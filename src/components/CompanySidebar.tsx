"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarCollapse, SidebarChevron } from "@/components/useSidebarCollapse";

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
    href: "/jobs",
    label: "Job Portal",
    icon: BriefcaseIcon,
    match: (p) => p === "/jobs" || p.startsWith("/jobs/"),
  },
  {
    href: "/directory",
    label: "Directory Hub",
    icon: BookIcon,
    match: (p) => p === "/directory" || p.startsWith("/directory/"),
  },
  {
    href: "/equipment",
    label: "Marketplace",
    icon: SearchIcon,
    match: (p) => p === "/equipment" || p.startsWith("/equipment/"),
  },
];

const ALL_ITEMS = [...MANAGE_ITEMS, ...MARKETPLACE_ITEMS];

export default function CompanySidebar({
  companyName,
  verified,
  logoutAction,
  children,
}: {
  companyName: string;
  verified: boolean;
  logoutAction: () => Promise<void>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebarCollapse();

  return (
    <div className="flex w-full">
      {/* ============== DESKTOP SIDEBAR ============== */}
      <aside
        style={{ width: collapsed ? "4rem" : "16rem" }}
        className="sticky top-0 hidden h-screen min-w-0 shrink-0 flex-col overflow-hidden bg-ink lg:flex"
      >
        <SidebarContent
          pathname={pathname}
          companyName={companyName}
          verified={verified}
          logoutAction={logoutAction}
          collapsed={collapsed}
          onToggle={toggle}
        />
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
          <div className="flex gap-1.5 overflow-x-auto border-b border-line px-3 py-2.5">
            {ALL_ITEMS.map((item) => {
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
  companyName,
  verified,
  logoutAction,
  collapsed,
  onToggle,
}: {
  pathname: string;
  companyName: string;
  verified: boolean;
  logoutAction: () => Promise<void>;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Header + collapse toggle */}
      <div
        className={`flex items-center pt-3 ${
          collapsed ? "justify-center px-2" : "justify-between px-4"
        }`}
      >
        {!collapsed && (
          <span className="font-display text-sm font-bold tracking-tight text-white">
            SIDCUL<span className="text-brand"> Hub</span>
          </span>
        )}
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand" : "Collapse"}
          className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          <SidebarChevron collapsed={collapsed} />
        </button>
      </div>

      {/* Company identity */}
      {collapsed ? (
        <div
          title={companyName}
          className="mx-auto mt-3 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-sm font-bold text-white"
        >
          {companyName.trim().charAt(0).toUpperCase()}
        </div>
      ) : (
        <div className="mx-4 mt-3 rounded-xl bg-white/5 p-3.5">
          <p className="truncate text-sm font-semibold text-white">
            {companyName}
          </p>
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
      )}

      {/* Nav */}
      <nav
        className={`mt-6 flex-1 space-y-6 overflow-y-auto overflow-x-hidden ${
          collapsed ? "px-2" : "px-3"
        }`}
      >
        <div>
          {!collapsed && (
            <p className="label-tag px-2.5 text-slate-400">Manage</p>
          )}
          <div className="mt-2 space-y-0.5">
            {MANAGE_ITEMS.map((item) => (
              <SidebarLink
                key={item.href}
                item={item}
                active={item.match(pathname)}
                collapsed={collapsed}
              />
            ))}
          </div>
        </div>
        <div>
          {!collapsed && (
            <p className="label-tag px-2.5 text-slate-400">Marketplace</p>
          )}
          <div className="mt-2 space-y-0.5">
            {MARKETPLACE_ITEMS.map((item) => (
              <SidebarLink
                key={item.href}
                item={item}
                active={item.match(pathname)}
                collapsed={collapsed}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className={`border-t border-white/10 ${collapsed ? "p-2" : "p-3"}`}>
        <Link
          href="/"
          title={collapsed ? "Home" : undefined}
          className={`flex items-center rounded-lg text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white ${
            collapsed ? "justify-center py-2.5" : "gap-2.5 px-2.5 py-2.5"
          }`}
        >
          <HomeIcon className="h-4.5 w-4.5 shrink-0" />
          {!collapsed && "Home"}
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            title={collapsed ? "Log out" : undefined}
            className={`flex w-full cursor-pointer items-center rounded-lg text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white ${
              collapsed ? "justify-center py-2.5" : "gap-2.5 px-2.5 py-2.5"
            }`}
          >
            <LogoutIcon className="h-4.5 w-4.5 shrink-0" />
            {!collapsed && "Log out"}
          </button>
        </form>
      </div>
    </div>
  );
}

function SidebarLink({
  item,
  active,
  collapsed,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={`flex items-center rounded-lg text-sm font-medium transition-colors ${
        collapsed ? "justify-center py-2.5" : "gap-2.5 px-2.5 py-2.5"
      } ${
        active
          ? "bg-white text-ink"
          : "text-slate-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      <Icon className="h-4.5 w-4.5 shrink-0" />
      {!collapsed && item.label}
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

function BookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 5.5a2 2 0 012-2h13v14.5H6a2 2 0 00-2 2z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M4 18v.5a2 2 0 002 2h13" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
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
