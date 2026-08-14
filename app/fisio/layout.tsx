import type { Metadata } from "next";
import { FisioHeaderBar } from "@/components/fisio-header-bar";

export const metadata: Metadata = {
  title: "Panel del fisioterapeuta · AIKinora",
  robots: { index: false, follow: false },
};

export default function FisioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-100">
      <FisioHeaderBar />
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}
