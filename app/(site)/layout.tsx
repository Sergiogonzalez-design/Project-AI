import { SiteNavbar } from "@/components/site-navbar";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-[calc(100dvh-2.75rem)] flex-col bg-[var(--background)]">
      <SiteNavbar />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
