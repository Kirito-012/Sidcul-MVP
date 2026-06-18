import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIDCUL Careers — Hyper-Local Industrial Jobs, Haridwar",
  description:
    "The official job portal of the SIDCUL Manufacturers Association. Verified manufacturers in the Haridwar industrial estate hire local talent directly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-line bg-white">
          <div className="mx-auto max-w-6xl px-5 py-8 text-sm text-muted flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
            <p>
              <span className="font-semibold text-ink">SIDCUL Careers</span> —
              Manufacturers Association Directory Initiative, Haridwar.
            </p>
            <p>MVP demo · {new Date().getFullYear()}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
