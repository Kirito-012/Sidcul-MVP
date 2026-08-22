import Image from "next/image";
import Nav from "@/components/Nav";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
