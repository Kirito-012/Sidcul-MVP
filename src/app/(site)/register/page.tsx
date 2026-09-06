import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import RegisterForm from "@/components/forms/RegisterForm";

export default async function RegisterPage() {
  const session = await getSession();
  if (session) redirect("/");

  return (
    <div className="grid min-h-[calc(100vh-65px)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute inset-0">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Haridwar_from_Mansa_Devi_road.jpg/1280px-Haridwar_from_Mansa_Devi_road.jpg"
            alt=""
            fill
            sizes="50vw"
            className="object-cover opacity-[0.22]"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-ink-950 via-ink-950/92 to-ink-950/70" />
          <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-brand/20 blur-[120px]" />
        </div>
        <Link href="/" className="relative flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-black ring-1 ring-white/10">
            <Image
              src="/sidkullogo.jpeg"
              alt="SIDCUL Manufacturers Association"
              width={1154}
              height={846}
              className="h-full w-full object-cover"
            />
          </span>
          <span className="font-display text-lg font-bold text-white">
            SIDCUL<span className="text-brand"> Hub</span>
          </span>
        </Link>

        <div className="relative max-w-md border-l-2 border-brand pl-5">
          <p className="label-tag text-brand">Now onboarding</p>
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
