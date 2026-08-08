import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AiOrientationDisclaimer } from "@/components/physio-report-view";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AIKinora",
  description: "Guía y consulta de fisioterapia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#F5F8FF] font-sans text-slate-900 antialiased">
        <div className="flex min-h-full flex-1 flex-col">{children}</div>
        <footer className="shrink-0 border-t border-slate-200/80 bg-white/90 px-4 py-2.5">
          <div className="mx-auto max-w-5xl">
            <AiOrientationDisclaimer />
          </div>
        </footer>
      </body>
    </html>
  );
}
