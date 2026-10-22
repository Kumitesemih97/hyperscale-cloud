import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SpotlightProvider } from "@/components/common/SpotlightProvider";
import { Navbar } from "@/components/navigation/Navbar";
import { EnterpriseFooter } from "@/components/footer/EnterpriseFooter";

export const metadata: Metadata = {
  title: "Aether Cloud — Hyperscale Infrastructure for Frontier AI",
  description:
    "Enterprise-grade hyperscale infrastructure platform. Sub-millisecond global edge, NVIDIA B200 AI superclusters, exabyte-scale storage, and zero-trust confidential compute.",
  keywords: [
    "cloud provider",
    "hyperscale",
    "GPU clusters",
    "NVIDIA B200",
    "enterprise cloud",
    "bare metal",
    "confidential computing",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#000000] text-[#f5f5f7] antialiased selection:bg-[#0071e3]/30 selection:text-white flex flex-col justify-between">
        <SpotlightProvider />
        <Navbar />
        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>
        <EnterpriseFooter />
      </body>
    </html>
  );
}
