import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "@/components/forms/LoginForm";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/");

  return (
    <div className="mx-auto flex max-w-md flex-col px-5 py-12">
      <h1 className="text-2xl font-bold text-ink">Welcome back</h1>
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

      <div className="mt-6 rounded-lg border border-line bg-white p-4 text-xs text-muted">
        <p className="mb-1 font-semibold text-ink-700">Demo accounts</p>
        <p>Admin: admin@sidcul.in</p>
        <p>Company (verified): hr@akums.in</p>
        <p>Company (pending): hr@havells.in</p>
        <p>Student: rahul@student.in</p>
        <p className="mt-1">Password for all: password123</p>
      </div>
    </div>
  );
}
