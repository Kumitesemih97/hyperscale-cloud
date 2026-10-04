import React from "react";
import { Navbar } from "@/components/navigation/Navbar";
import { Hero } from "@/components/hero/Hero";
import { InfrastructureMatrix } from "@/components/infrastructure/InfrastructureMatrix";
import { SandboxTerminal } from "@/components/terminal/SandboxTerminal";
import { ComplianceGrid } from "@/components/compliance/ComplianceGrid";
import { CostEstimator } from "@/components/calculator/CostEstimator";
import { GlobalNetworkVisualizer } from "@/components/network/GlobalNetworkVisualizer";
import { EnterpriseFooter } from "@/components/footer/EnterpriseFooter";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#000000] text-[#f5f5f7] flex flex-col justify-between selection:bg-[#0071e3]/30 selection:text-white">
      <Navbar />
      <Hero />
      <InfrastructureMatrix />
      <SandboxTerminal />
      <ComplianceGrid />
      <CostEstimator />
      <GlobalNetworkVisualizer />
      <EnterpriseFooter />
    </main>
  );
}
