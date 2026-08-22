import Image from "next/image";
import Nav from "@/components/Nav";
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
      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/sidcul-logo.jpeg"
              alt="SIDCUL Industrial Association logo"
              width={479}
              height={640}
              className="h-8 w-auto shrink-0 object-contain"
            />
            <p className="text-sm text-muted">
              <span className="font-semibold text-ink">SIDCUL Hub</span>{" "}
              — Manufacturers Association Directory, Jobs & Leasing Platform, Haridwar.
            </p>
          </div>
          <p className="label-tag text-muted">
            © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </>
  );
}
