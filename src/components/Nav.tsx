import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth-actions";

export default async function Nav() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center border-2 border-ink bg-accent font-display text-base font-bold text-white">
            S
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-ink">
            SIDCUL <span className="text-accent">Careers</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm font-medium sm:gap-2">
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

          {session?.role === "COMPANY" && (
            <Link
              href="/company"
              className="hidden rounded-lg px-3 py-2 text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand sm:inline-block"
            >
              Dashboard
            </Link>
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
            <div className="flex items-center gap-2 pl-2">
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
            <div className="flex items-center gap-2 pl-1">
              <Link href="/login" className="btn btn-ghost btn-sm">
                Log in
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
