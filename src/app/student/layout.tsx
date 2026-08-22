import { requireRole } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth-actions";
import StudentSidebar from "@/components/StudentSidebar";

export default async function StudentSectionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireRole("STUDENT");

  return (
    <StudentSidebar name={session.name} logoutAction={logoutAction}>
      {children}
    </StudentSidebar>
  );
}
