"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Slim brand-coloured progress bar across the top of the page. Starts the
 * moment an internal link is clicked and finishes when the new route has
 * rendered, so slow server pages never feel frozen.
 */
function ProgressBar() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const routeKey = `${pathname}?${search}`;

  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [seenRoute, setSeenRoute] = useState(routeKey);

  // The route changed while the bar was running → the new page has rendered.
  if (seenRoute !== routeKey) {
    setSeenRoute(routeKey);
    if (phase === "loading") setPhase("done");
  }

  // Ease toward 90% but never reach it until the route is ready.
  useEffect(() => {
    if (phase !== "loading") return;
    const id = setInterval(() => {
      setProgress((p) => (p < 90 ? p + (90 - p) * 0.08 : p));
    }, 200);
    // Safety net: never leave the bar hanging if a navigation is cancelled.
    const giveUp = setTimeout(() => setPhase("done"), 15000);
    return () => {
      clearInterval(id);
      clearTimeout(giveUp);
    };
  }, [phase]);

  // Let the full bar show briefly, then hide and reset.
  useEffect(() => {
    if (phase !== "done") return;
    const id = setTimeout(() => {
      setPhase("idle");
      setProgress(0);
    }, 250);
    return () => clearTimeout(id);
  }, [phase]);

  // Internal link clicked → start the bar.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest?.("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Same page (including hash-only jumps): nothing will load.
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) {
        return;
      }
      setProgress(8);
      setPhase("loading");
    }
    // Capture phase: runs before Next's <Link> handler calls preventDefault().
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  const width = phase === "done" ? 100 : progress;
  const visible = phase !== "idle";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-[3px]"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 200ms ease" }}
    >
      <div
        className="h-full bg-brand shadow-[0_0_10px_rgba(193,18,31,0.6)]"
        style={{
          width: `${width}%`,
          transition: phase === "done" ? "width 150ms ease-out" : "width 300ms ease-out",
        }}
      />
    </div>
  );
}

export default function NavProgress() {
  return (
    <Suspense fallback={null}>
      <ProgressBar />
    </Suspense>
  );
}
