import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
