"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  ChevronRight,
  Zap, 
  Activity
} from "lucide-react";

export function EnterpriseFooter() {
  return (
    <footer className="relative bg-[#000000] border-t border-white/[0.06] pt-20 pb-14 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* High-Conversion Enterprise Banner: Apple Pro Bento Card */}
        <div className="p-8 sm:p-12 apple-bento-card mb-20 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4 text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-[12px] font-medium text-[#a1a1a6]">
                <Zap className="w-3.5 h-3.5 text-[#2997ff]" />
                <span>Instant Developer Access</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-[#f5f5f7]">
                Accelerate Frontier AI Workloads Today.
              </h2>
              <p className="text-sm sm:text-base text-[#a1a1a6] max-w-2xl leading-relaxed">
                Get $300 in instant cloud compute credits, or contact our principal solutions architects
                for dedicated cluster reservations, custom interconnect topologies, and volume contracts.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <Link
                href="/sandbox"
                className="apple-btn-primary w-full text-center !py-3 !text-sm"
              >
                <span>Claim $300 Credits</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>

              <Link
                href="/calculator"
                className="apple-btn-secondary w-full text-center !py-3 !text-sm"
              >
                <span>Architecture Review</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Deep Multi-Column Directory: Apple Format */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-14 border-b border-white/[0.06] text-left">
          {/* Column 1: Compute & AI */}
          <div className="space-y-3">
            <h4 className="text-[12px] font-semibold text-[#f5f5f7] tracking-tight">
              Compute & AI
            </h4>
            <ul className="space-y-2 text-[12px] text-[#a1a1a6]">
              <li><Link href="/infrastructure" className="hover:text-[#f5f5f7] transition-colors">NVIDIA B200 Supernodes</Link></li>
              <li><Link href="/infrastructure" className="hover:text-[#f5f5f7] transition-colors">NVIDIA H100 SXM5</Link></li>
              <li><Link href="/infrastructure" className="hover:text-[#f5f5f7] transition-colors">AMD EPYC Bare Metal</Link></li>
              <li><Link href="/infrastructure" className="hover:text-[#f5f5f7] transition-colors">MicroVM Serverless</Link></li>
              <li><Link href="/infrastructure" className="hover:text-[#f5f5f7] transition-colors">InfiniBand Quantum-X800</Link></li>
            </ul>
          </div>

          {/* Column 2: Storage & Networking */}
          <div className="space-y-3">
            <h4 className="text-[12px] font-semibold text-[#f5f5f7] tracking-tight">
              Storage & Network
            </h4>
            <ul className="space-y-2 text-[12px] text-[#a1a1a6]">
              <li><Link href="/infrastructure" className="hover:text-[#f5f5f7] transition-colors">NVMe-oF Block Storage</Link></li>
              <li><Link href="/infrastructure" className="hover:text-[#f5f5f7] transition-colors">ExaScale Object Fabric</Link></li>
              <li><Link href="/infrastructure" className="hover:text-[#f5f5f7] transition-colors">Distributed SQL Spanner</Link></li>
              <li><Link href="/network" className="hover:text-[#f5f5f7] transition-colors">Subsea Terabit Mesh</Link></li>
              <li><Link href="/network" className="hover:text-[#f5f5f7] transition-colors">Autonomous Layer 7 Shield</Link></li>
            </ul>
          </div>

          {/* Column 3: Developer & IaC */}
          <div className="space-y-3">
            <h4 className="text-[12px] font-semibold text-[#f5f5f7] tracking-tight">
              Developer Ecosystem
            </h4>
            <ul className="space-y-2 text-[12px] text-[#a1a1a6]">
              <li><Link href="/sandbox" className="hover:text-[#f5f5f7] transition-colors">Terraform Provider</Link></li>
              <li><Link href="/sandbox" className="hover:text-[#f5f5f7] transition-colors">Pulumi Package</Link></li>
              <li><Link href="/sandbox" className="hover:text-[#f5f5f7] transition-colors">Aether CLI</Link></li>
              <li><Link href="/calculator" className="hover:text-[#f5f5f7] transition-colors">TCO Savings Engine</Link></li>
              <li><Link href="/network" className="hover:text-[#f5f5f7] transition-colors">Global Ping Simulator</Link></li>
            </ul>
          </div>

          {/* Column 4: Trust & Compliance */}
          <div className="space-y-3">
            <h4 className="text-[12px] font-semibold text-[#f5f5f7] tracking-tight">
              Trust & Security
            </h4>
            <ul className="space-y-2 text-[12px] text-[#a1a1a6]">
              <li><Link href="/security" className="hover:text-[#f5f5f7] transition-colors">SOC 2 Type II Reports</Link></li>
              <li><Link href="/security" className="hover:text-[#f5f5f7] transition-colors">ISO/IEC 27001 Certification</Link></li>
              <li><Link href="/security" className="hover:text-[#f5f5f7] transition-colors">FedRAMP High Package</Link></li>
              <li><Link href="/security" className="hover:text-[#f5f5f7] transition-colors">HIPAA / HITECH BAA</Link></li>
              <li><Link href="/security" className="hover:text-[#f5f5f7] transition-colors">Dedicated Cloud HSM</Link></li>
            </ul>
          </div>

          {/* Column 5: Global Infrastructure Status */}
          <div className="space-y-3 col-span-2 sm:col-span-1">
            <h4 className="text-[12px] font-semibold text-[#f5f5f7] tracking-tight">
              Fleet Status
            </h4>
            <div className="apple-inner-card p-3 space-y-2">
              <div className="flex items-center space-x-2 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-[#30d158]" />
                <span className="font-mono text-[#30d158] font-semibold">ALL SYSTEMS NORMAL</span>
              </div>
              <div className="text-[11px] font-mono text-[#d1d1d6]">
                Backbone: 142.8 Tbps
              </div>
              <div className="text-[11px] font-mono text-[#d1d1d6]">
                P99 SLA: 99.999%
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Standards */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#a1a1a6] gap-4">
          <div className="flex items-center space-x-2">
            <span>Copyright © 2026 Aether Cloud Inc. All rights reserved.</span>
            <span>•</span>
            <span className="text-[#f5f5f7]">WCAG 2.2 AA Verified</span>
          </div>

          <div className="flex items-center space-x-6">
            <a href="#compliance" className="hover:text-[#f5f5f7] transition-colors">Privacy Policy</a>
            <a href="#compliance" className="hover:text-[#f5f5f7] transition-colors">Terms of Service</a>
            <a href="#compliance" className="hover:text-[#f5f5f7] transition-colors">Security Disclosure</a>
            <a href="#network" className="hover:text-[#f5f5f7] transition-colors">System Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
