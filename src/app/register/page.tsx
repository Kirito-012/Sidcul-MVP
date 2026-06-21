import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import RegisterForm from "@/components/forms/RegisterForm";

export default async function RegisterPage() {
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

        <div className="relative max-w-md border-l-2 border-brand pl-5">
          <p className="label-tag text-sky-300">Now onboarding</p>
          <p className="mt-3 font-display text-2xl font-bold leading-tight text-white">
            Join the hyper-local hiring network for the SIDCUL estate.
          </p>
          <p className="mt-3 text-sm text-slate-300">
            Students apply directly to verified manufacturers. Companies
            post roles without paying recruiter fees.
          </p>
        </div>

        <p className="label-tag relative text-slate-500">
          Manufacturers Assoc. · Haridwar
        </p>
      </div>

      <div className="flex flex-col items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-2xl font-bold text-ink">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-muted">
            Join the SIDCUL hiring network.
          </p>

          <div className="card mt-6 p-6">
            <RegisterForm />
          </div>

          <p className="mt-4 text-center text-sm text-muted">
            Already registered?{" "}
            <Link href="/login" className="font-semibold text-brand">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
