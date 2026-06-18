import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth-actions";

export default async function Nav() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-sm font-bold text-white">
            S
          </span>
          <span className="text-lg font-bold tracking-tight text-ink">
            SIDCUL <span className="text-brand">Careers</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2 text-sm font-medium">
          <Link
            href="/jobs"
            className="rounded-lg px-3 py-2 text-ink-700 hover:bg-canvas"
          >
            Browse Jobs
          </Link>

          {session?.role === "COMPANY" && (
            <Link
              href="/company"
              className="rounded-lg px-3 py-2 text-ink-700 hover:bg-canvas"
            >
              Dashboard
            </Link>
          )}
          {session?.role === "STUDENT" && (
            <Link
              href="/student"
              className="rounded-lg px-3 py-2 text-ink-700 hover:bg-canvas"
            >
              My Applications
            </Link>
          )}
          {session?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="rounded-lg px-3 py-2 text-ink-700 hover:bg-canvas"
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
