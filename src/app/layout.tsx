import type { Metadata } from "next";
import Image from "next/image";
import { Inter, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import CompanySidebar from "@/components/CompanySidebar";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth-actions";
import { prisma } from "@/lib/prisma";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "SIDCUL Hub — Directory, Jobs & Equipment Leasing, Haridwar Industrial Estate",
  description:
    "The official platform of the SIDCUL Manufacturers Association. Browse verified manufacturers and IT firms in the Haridwar industrial estate, see their open roles, and lease equipment between member companies.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  const company =
    session?.role === "COMPANY"
      ? await prisma.companyProfile.findUnique({
          where: { userId: session.userId },
          select: { companyName: true, verified: true },
        })
      : null;

  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {session?.role === "COMPANY" ? (
          <CompanySidebar
            companyName={company?.companyName ?? session.name}
            verified={company?.verified ?? false}
            userName={session.name}
            logoutAction={logoutAction}
          >
            {children}
          </CompanySidebar>
        ) : (
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
        )}
      </body>
    </html>
  );
}
