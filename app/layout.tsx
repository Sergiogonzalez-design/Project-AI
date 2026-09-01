import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { AiOrientationDisclaimer } from "@/components/physio-report-view";
import { ScrollToTopOnNavigate } from "@/components/scroll-to-top-on-navigate";
import { UiLocaleProvider } from "@/lib/ui-locale";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
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
        <UiLocaleProvider>
          <ScrollToTopOnNavigate />
          <div className="flex min-h-full flex-1 flex-col">{children}</div>
          <footer className="shrink-0 border-t border-slate-200/80 bg-white/90 px-4 py-2.5">
            <div className="mx-auto flex max-w-5xl flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
              <AiOrientationDisclaimer />
              <p className="text-xs text-neutral-500">
                <Link href="/privacidad" className="font-medium text-blue-600 hover:underline">
                  Privacidad y términos
                </Link>
              </p>
            </div>
          </footer>
        </UiLocaleProvider>
      </body>
    </html>
  );
}
