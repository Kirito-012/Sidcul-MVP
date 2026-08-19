import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth-actions";
import MobileNavMenu from "@/components/MobileNavMenu";

export default async function Nav() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-white/90 backdrop-blur-md relative">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/sidcul-logo.jpeg"
            alt="SIDCUL Industrial Association logo"
            width={479}
            height={640}
            className="h-10 w-auto shrink-0 object-contain"
            priority
          />
          <span className="font-display text-lg font-bold tracking-tight text-ink">
            SIDCUL <span className="text-accent">Hub</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm font-medium sm:gap-2">
          {session?.role !== "COMPANY" && (
            <>
              <Link
                href="/jobs"
                className="hidden rounded-lg px-3 py-2 text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand sm:inline-block"
              >
                Browse Jobs
              </Link>
              <Link
                href="/directory"
                className="hidden rounded-lg px-3 py-2 text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand sm:inline-block"
              >
                IT Directory
              </Link>
            </>
          )}
          <Link
            href="/equipment"
            className="hidden rounded-lg px-3 py-2 text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand sm:inline-block"
          >
            Lease Equipment
          </Link>

          {session?.role === "COMPANY" && (
            <>
              <Link
                href="/company"
                className="hidden rounded-lg px-3 py-2 text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand sm:inline-block"
              >
                Dashboard
              </Link>
              <Link
                href="/company/equipment"
                className="hidden rounded-lg px-3 py-2 text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand sm:inline-block"
              >
                My Equipment
              </Link>
              <Link
                href="/company/leases"
                className="hidden rounded-lg px-3 py-2 text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand sm:inline-block"
              >
                My Lease Requests
              </Link>
            </>
          )}
          {session?.role === "STUDENT" && (
            <Link
              href="/student"
              className="hidden rounded-lg px-3 py-2 text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand sm:inline-block"
            >
              My Applications
            </Link>
          )}
          {session?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="hidden rounded-lg px-3 py-2 text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand sm:inline-block"
            >
              Admin
            </Link>
          )}

          {session ? (
            <div className="hidden items-center gap-2 pl-2 sm:flex">
              <span className="hidden text-xs text-muted sm:inline">
                {session.name}
              </span>
              <form action={logoutAction}>
                <button type="submit" className="btn btn-outline btn-sm">
                  Log out
                </button>
              </form>
            </div>
          ) : (
            <div className="hidden items-center gap-2 pl-1 sm:flex">
              <Link href="/login" className="btn btn-ghost btn-sm">
                Log in
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Sign up
              </Link>
            </div>
          )}

          <MobileNavMenu session={session} logoutAction={logoutAction} />
        </nav>
      </div>
    </header>
  );
}
