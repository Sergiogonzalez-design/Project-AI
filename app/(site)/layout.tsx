import { SiteNavbar } from "@/components/site-navbar";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteNavbar />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
