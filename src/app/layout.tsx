import type { Metadata } from "next";
import Image from "next/image";
import { Inter, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

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
  title: "SIDCUL Careers — Company Directory, Haridwar Industrial Estate",
  description:
    "The official company directory of the SIDCUL Manufacturers Association. Browse verified manufacturers and IT firms in the Haridwar industrial estate, and see their open roles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
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
                <span className="font-semibold text-ink">SIDCUL Careers</span>{" "}
                — Manufacturers Association Directory Initiative, Haridwar.
              </p>
            </div>
            <p className="label-tag text-muted">
              © {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
