import Link from "next/link";

export default function LockedField({
  unlocked,
  children,
}: {
  unlocked: boolean;
  children: React.ReactNode;
}) {
  if (unlocked) return <>{children}</>;

  return (
    <span className="relative inline-flex select-none items-center">
      <span aria-hidden="true" className="pointer-events-none blur-[6px]">
        {children}
      </span>
      <Link
        href="/login"
        className="absolute inset-0 flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-brand"
      >
        <LockIcon className="h-3.5 w-3.5 shrink-0" />
        Sign in to access
      </Link>
    </span>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="5" y="10.5" width="14" height="9" rx="1.8" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 10.5V8a4 4 0 018 0v2.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
