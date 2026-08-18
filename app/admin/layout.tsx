import type { Metadata } from "next";
import { AdminHeaderBar } from "@/components/admin-header-bar";

export const metadata: Metadata = {
  title: "Admin · AIKinora",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-[calc(100dvh-2.75rem)] bg-neutral-100">
      <AdminHeaderBar />
      {children}
    </div>
  );
}
