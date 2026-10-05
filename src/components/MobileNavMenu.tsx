"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { SessionUser } from "@/lib/auth";

const TRANSITION_MS = 220;

export default function MobileNavMenu({
  session,
  logoutAction,
}: {
  session: SessionUser | null;
  logoutAction: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  function openMenu() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMounted(true);
    // mount closed first, then flip to open on the next frame so the
    // transition actually plays instead of snapping straight to open.
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
  }

  function closeMenu() {
    setOpen(false);
    closeTimer.current = setTimeout(() => setMounted(false), TRANSITION_MS);
  }

  function toggle() {
    if (open) closeMenu();
    else openMenu();
  }

  return (
    <div className="sm:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={toggle}
        className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-ink-700 transition-colors duration-200 hover:bg-brand-50 hover:text-brand"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="origin-center transition-all duration-200 ease-in-out"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0.5)",
            }}
          />
          <path
            d="M4 7h16M4 12h16M4 17h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="origin-center transition-all duration-200 ease-in-out"
            style={{
              opacity: open ? 0 : 1,
              transform: open ? "rotate(90deg) scale(0.5)" : "rotate(0deg) scale(1)",
            }}
          />
        </svg>
      </button>

      {mounted && (
        <div
          className="absolute inset-x-0 top-full overflow-hidden border-b border-line bg-white shadow-lg transition-all ease-in-out"
          style={{
            transitionDuration: `${TRANSITION_MS}ms`,
            maxHeight: open ? "24rem" : "0px",
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0)" : "translateY(-0.5rem)",
          }}
        >
          <nav className="flex flex-col gap-1 px-5 py-4 text-sm font-medium">
            <Link
              href="/jobs"
              onClick={closeMenu}
              className="rounded-lg px-3 py-2.5 text-ink-700 transition-colors duration-200 hover:bg-brand-50 hover:text-brand"
            >
              Job Portal
            </Link>
            <Link
              href="/directory"
              onClick={closeMenu}
              className="rounded-lg px-3 py-2.5 text-ink-700 transition-colors duration-200 hover:bg-brand-50 hover:text-brand"
            >
              Directory Hub
            </Link>
            {session?.role !== "STUDENT" && (
              <Link
                href="/equipment"
                onClick={closeMenu}
                className="rounded-lg px-3 py-2.5 text-ink-700 transition-colors duration-200 hover:bg-brand-50 hover:text-brand"
              >
                Marketplace
              </Link>
            )}

            {session?.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={closeMenu}
                className="rounded-lg px-3 py-2.5 text-ink-700 transition-colors duration-200 hover:bg-brand-50 hover:text-brand"
              >
                Admin
              </Link>
            )}

            <div className="mt-2 border-t border-line pt-3">
              {session ? (
                <div className="flex items-center justify-between gap-2 px-3">
                  <span className="text-xs text-muted">{session.name}</span>
                  <form action={logoutAction}>
                    <button type="submit" className="btn btn-outline btn-sm">
                      Log out
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex gap-2 px-3">
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="btn btn-ghost btn-sm flex-1"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="btn btn-primary btn-sm flex-1"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
