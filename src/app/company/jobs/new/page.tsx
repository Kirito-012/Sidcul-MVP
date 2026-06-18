import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import PostJobForm from "@/components/forms/PostJobForm";

export default async function NewJobPage() {
  const session = await requireRole("COMPANY");
  const company = await prisma.companyProfile.findUnique({
    where: { userId: session.userId },
  });

  // Unverified companies cannot reach the posting form.
  if (!company?.verified) redirect("/company");

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <Link href="/company" className="text-sm text-muted hover:text-brand">
        ← Back to dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-ink">Post a new job</h1>
      <p className="mt-1 text-sm text-muted">
        Posting as <span className="font-medium">{company.companyName}</span>.
      </p>

      <div className="card mt-6 p-6">
        <PostJobForm />
      </div>
    </div>
  );
}
