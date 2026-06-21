import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "@/components/forms/LoginForm";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/");

  return (
    <div className="grid min-h-[calc(100vh-65px)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <Link href="/" className="relative flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center border-2 border-white/40 bg-accent font-display text-base font-bold text-white">
            S
          </span>
          <span className="font-display text-lg font-bold text-white">
            SIDCUL <span className="text-accent">Careers</span>
          </span>
        </Link>

        <div className="relative max-w-md border-l-2 border-accent pl-5">
          <p className="label-tag text-accent">Estate Reg. No. UK-SIDCUL-HW</p>
          <p className="mt-3 font-display text-2xl font-bold leading-tight text-white">
            Manufacturing jobs in the SIDCUL Haridwar industrial estate.
          </p>
          <p className="mt-3 text-sm text-slate-300">
            Verified manufacturers post openings. Local talent applies
            directly — no recruiters, no middlemen.
          </p>
        </div>

        <p className="label-tag relative text-slate-500">
          Manufacturers Assoc. · Haridwar
        </p>
      </div>

      <div className="flex flex-col items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-2xl font-bold text-ink">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-muted">
            Log in to post jobs or manage your applications.
          </p>

          <div className="card mt-6 p-6">
            <LoginForm />
          </div>

          <p className="mt-4 text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-brand">
              Sign up
            </Link>
          </p>

          <div className="mt-6 rounded-xl border border-line bg-white p-4 text-xs text-muted">
            <p className="mb-1 font-semibold text-ink-700">Demo accounts</p>
            <p>Admin: admin@sidcul.in</p>
            <p>Company (verified): hr@akums.in</p>
            <p>Company (pending): hr@havells.in</p>
            <p>Student: rahul@student.in</p>
            <p className="mt-1">Password for all: password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
