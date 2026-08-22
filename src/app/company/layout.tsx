import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth-actions";
import CompanySidebar from "@/components/CompanySidebar";

export default async function CompanySectionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireRole("COMPANY");

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
