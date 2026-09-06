import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";
import StudentSidebar from "@/components/StudentSidebar";
import CompanySidebar from "@/components/CompanySidebar";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth-actions";
import { prisma } from "@/lib/prisma";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  if (session?.role === "STUDENT") {
    return (
      <StudentSidebar name={session.name} logoutAction={logoutAction}>
        {children}
      </StudentSidebar>
    );
  }

  if (session?.role === "COMPANY") {
    const company = await prisma.companyProfile.findUnique({
      where: { userId: session.userId },
      select: { companyName: true, verified: true },
    });

    return (
      <CompanySidebar
        companyName={company?.companyName ?? session.name}
        verified={company?.verified ?? false}
        logoutAction={logoutAction}
      >
        {children}
      </CompanySidebar>
    );
  }

  return (
    <>
      <Nav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
