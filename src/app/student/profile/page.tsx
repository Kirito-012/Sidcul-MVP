import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import ProfileForm from "@/components/forms/ProfileForm";

export const metadata = { title: "My profile — SIDCUL Hub" };

export default async function StudentProfilePage() {
  const session = await requireRole("STUDENT");
  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session.userId },
  });

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="text-2xl font-bold text-ink">My profile</h1>
      <p className="mt-1 text-sm text-muted">
        Keep your details up to date — companies see this when you apply.
      </p>
      <div className="mt-6">
        <ProfileForm
          profile={{
            fullName: profile?.fullName ?? session.name,
            email: session.email,
            phone: profile?.phone ?? "",
            location: profile?.location ?? "",
            education: profile?.education ?? "",
            skills: profile?.skills ?? "",
            experience: profile?.experience ?? "",
            about: profile?.about ?? "",
            hasAadhaar: Boolean(profile?.aadhaarDocumentUrl),
          }}
        />
      </div>
    </div>
  );
}
