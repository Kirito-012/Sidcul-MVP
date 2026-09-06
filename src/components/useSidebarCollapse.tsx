"use client";

import { useSyncExternalStore } from "react";

const KEY = "sidebar-collapsed";
const listeners = new Set<() => void>();

function read(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Remembers the desktop sidebar collapsed/expanded state in localStorage. */
export function useSidebarCollapse() {
  const collapsed = useSyncExternalStore(subscribe, read, () => false);

  function toggle() {
    try {
      localStorage.setItem(KEY, read() ? "0" : "1");
    } catch {
      /* private mode / storage disabled */
    }
    listeners.forEach((l) => l());
  }

  return { collapsed, toggle };
}

export function SidebarChevron({
  collapsed,
  className,
}: {
  collapsed: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`${className ?? "h-4 w-4"} transition-transform duration-200 ${
        collapsed ? "rotate-180" : ""
      }`}
      aria-hidden="true"
    >
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
