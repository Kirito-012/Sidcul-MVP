/**
 * Branded full-area loader shown by route `loading.tsx` files while a page's
 * data streams in. Server component — pure CSS animation.
 */
export default function PageLoader({
  label = "Loading",
  className = "min-h-[60vh]",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex w-full flex-col items-center justify-center gap-5 px-5 ${className}`}
    >
      <div className="relative grid h-16 w-16 place-items-center">
        <span className="absolute inset-0 rounded-full border-[3px] border-line" />
        <span className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-brand" />
        <span className="font-display text-sm font-bold tracking-tight text-ink">
          S<span className="text-brand">H</span>
        </span>
      </div>
      <div className="text-center">
        <p className="font-display text-base font-bold tracking-tight text-ink">
          SIDCUL<span className="text-brand"> Hub</span>
        </p>
        <p className="label-tag mt-1.5 justify-center text-muted">{label}…</p>
      </div>
      <span className="sr-only">{label}, please wait</span>
    </div>
  );
}

/** Shimmering placeholder block. */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-xl bg-ink/[0.07] ${className}`}
    />
  );
}

/** Dashboard-style skeleton: a heading row plus a stack of cards. */
export function DashboardSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto max-w-4xl px-5 py-10"
    >
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-3 h-4 w-80 max-w-full" />
      <div className="mt-8 space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card space-y-3 p-5">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading, please wait</span>
    </div>
  );
}
