import { SiteSidebar } from "@/components/site-sidebar";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-1 bg-white">
      <SiteSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
