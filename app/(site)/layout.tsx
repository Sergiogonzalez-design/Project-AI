import { SiteNavbar } from "@/components/site-navbar";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--background)]">
      <SiteNavbar />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
