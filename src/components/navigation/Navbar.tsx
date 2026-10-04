"use client";

import React, { useState, useEffect } from "react";
import { CommandSearch } from "./CommandSearch";
import { 
  Globe, 
  Search, 
  ChevronDown, 
  Menu, 
  X, 
  Cpu, 
  Layers, 
  Zap, 
  ChevronRight
} from "lucide-react";

const REGIONS = [
  { code: "us-east-1", name: "US East (N. Virginia)", ping: "1.2ms" },
  { code: "eu-central-1", name: "EU Central (Frankfurt)", ping: "0.9ms" },
  { code: "ap-northeast-1", name: "AP East (Tokyo)", ping: "1.4ms" },
  { code: "sa-east-1", name: "SA East (São Paulo)", ping: "2.1ms" },
];

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(REGIONS[0]);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);

  // Global Cmd+K / Ctrl+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full apple-glass-chrome transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          {/* Left: Brand Identity */}
          <div className="flex items-center space-x-7">
            <a href="#" className="flex items-center space-x-2.5 group">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/[0.08] border border-white/15 p-0.5 group-hover:border-white/30 transition-all">
                <div className="w-2 h-2 rounded-full bg-white group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-[13px] tracking-tight font-semibold text-[#f5f5f7] group-hover:text-white transition-colors">
                  Aether
                </span>
                <span className="text-[11px] text-[#86868b] font-medium tracking-normal">
                  Cloud
                </span>
              </div>
            </a>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
              {/* Products Dropdown */}
              <div className="relative" onMouseLeave={() => setIsProductsDropdownOpen(false)}>
                <button
                  onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                  onMouseEnter={() => setIsProductsDropdownOpen(true)}
                  className="flex items-center space-x-1 px-3 py-1 rounded-full text-[12px] text-[#86868b] hover:text-[#f5f5f7] hover:bg-white/[0.05] transition-colors"
                  aria-expanded={isProductsDropdownOpen}
                >
                  <span>Infrastructure</span>
                  <ChevronDown className="w-3 h-3 text-[#86868b] mt-0.5" />
                </button>

                {isProductsDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-80 rounded-2xl bg-[#1c1c1e]/95 backdrop-blur-2xl border border-white/10 p-3 shadow-2xl animate-in fade-in zoom-in-95 duration-100" style={{ boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.12), 0 20px 50px rgba(0, 0, 0, 0.7)" }}>
                    <div className="space-y-1">
                      <a
                        href="#infrastructure"
                        onClick={() => setIsProductsDropdownOpen(false)}
                        className="flex items-start space-x-3 p-2.5 rounded-xl hover:bg-white/[0.07] transition-colors group"
                      >
                        <Cpu className="w-4 h-4 text-[#2997ff] mt-0.5 shrink-0" />
                        <div>
                          <div className="text-[12px] font-medium text-[#f5f5f7] group-hover:text-[#2997ff]">
                            Accelerated AI Compute
                          </div>
                          <div className="text-[11px] text-[#86868b]">
                            NVIDIA B200 SXM6 & H100 GPU clusters with InfiniBand fabric.
                          </div>
                        </div>
                      </a>
                      <a
                        href="#infrastructure"
                        onClick={() => setIsProductsDropdownOpen(false)}
                        className="flex items-start space-x-3 p-2.5 rounded-xl hover:bg-white/[0.07] transition-colors group"
                      >
                        <Layers className="w-4 h-4 text-[#a1a1a6] mt-0.5 shrink-0" />
                        <div>
                          <div className="text-[12px] font-medium text-[#f5f5f7] group-hover:text-white">
                            Exabyte Object & Block Storage
                          </div>
                          <div className="text-[11px] text-[#86868b]">
                            Sub-millisecond NVMe-oF with zero replication lag.
                          </div>
                        </div>
                      </a>
                      <a
                        href="#network"
                        onClick={() => setIsProductsDropdownOpen(false)}
                        className="flex items-start space-x-3 p-2.5 rounded-xl hover:bg-white/[0.07] transition-colors group"
                      >
                        <Zap className="w-4 h-4 text-[#30d158] mt-0.5 shrink-0" />
                        <div>
                          <div className="text-[12px] font-medium text-[#f5f5f7] group-hover:text-[#30d158]">
                            140+ Tbps Global Backbone
                          </div>
                          <div className="text-[11px] text-[#86868b]">
                            Subsea fiber direct interconnects and Layer 7 DDoS mitigation.
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <a
                href="#terminal"
                className="px-3 py-1 rounded-full text-[12px] text-[#86868b] hover:text-[#f5f5f7] hover:bg-white/[0.05] transition-colors"
              >
                IaC Sandbox
              </a>

              <a
                href="#network"
                className="px-3 py-1 rounded-full text-[12px] text-[#86868b] hover:text-[#f5f5f7] hover:bg-white/[0.05] transition-colors"
              >
                Global Fabric
              </a>

              <a
                href="#calculator"
                className="px-3 py-1 rounded-full text-[12px] text-[#86868b] hover:text-[#f5f5f7] hover:bg-white/[0.05] transition-colors"
              >
                TCO Estimator
              </a>

              <a
                href="#compliance"
                className="px-3 py-1 rounded-full text-[12px] text-[#86868b] hover:text-[#f5f5f7] hover:bg-white/[0.05] transition-colors"
              >
                Trust & Security
              </a>
            </nav>
          </div>

          {/* Right Utility: Region, Search, Sign In, CTA */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Region Selector Pill */}
            <div className="relative">
              <button
                onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
                className="flex items-center space-x-2 px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-[11px] text-[#86868b] hover:text-[#f5f5f7] transition-all"
                aria-label="Active datacenter region selector"
                aria-expanded={isRegionDropdownOpen}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#30d158]" />
                <span className="font-mono text-[#f5f5f7]">{selectedRegion.code}</span>
                <span className="text-[#86868b]">({selectedRegion.ping})</span>
                <ChevronDown className="w-3 h-3 text-[#86868b]" />
              </button>

              {isRegionDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#1c1c1e]/95 backdrop-blur-2xl border border-white/10 p-2 shadow-2xl z-50" style={{ boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.12), 0 20px 50px rgba(0, 0, 0, 0.7)" }}>
                  <div className="text-[10px] font-mono text-[#86868b] uppercase px-3 py-1.5">
                    Active Edge Region
                  </div>
                  {REGIONS.map((r) => (
                    <button
                      key={r.code}
                      onClick={() => {
                        setSelectedRegion(r);
                        setIsRegionDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left hover:bg-white/[0.07] transition-colors"
                    >
                      <div>
                        <div className="text-[#f5f5f7] font-medium text-[12px]">{r.name}</div>
                        <div className="text-[10px] font-mono text-[#86868b]">{r.code}</div>
                      </div>
                      <span className="font-mono text-[#30d158] text-[11px]">{r.ping}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Trigger Pill */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center space-x-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-[12px] text-[#86868b] hover:text-[#f5f5f7] transition-all"
              aria-label="Search cloud resources (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.2 text-[10px] font-mono bg-white/[0.08] rounded text-[#a1a1a6]">
                ⌘K
              </kbd>
            </button>

            {/* Console Login */}
            <a
              href="#terminal"
              className="px-2.5 py-1 text-[12px] text-[#86868b] hover:text-[#f5f5f7] font-normal transition-colors"
            >
              Sign In
            </a>

            {/* Primary Action CTA: Apple White Pill */}
            <a
              href="#calculator"
              className="apple-btn-primary"
            >
              <span>Deploy</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 text-[#86868b] hover:text-[#f5f5f7]"
              aria-label="Open search dialog"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-[#86868b] hover:text-[#f5f5f7]"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-white/10 bg-[#121215]/95 backdrop-blur-2xl px-4 py-4 space-y-3">
            <div className="space-y-1">
              <a
                href="#infrastructure"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm text-[#f5f5f7] hover:bg-white/5"
              >
                Infrastructure Matrix
              </a>
              <a
                href="#terminal"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm text-[#f5f5f7] hover:bg-white/5"
              >
                IaC Terminal Sandbox
              </a>
              <a
                href="#network"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm text-[#f5f5f7] hover:bg-white/5"
              >
                Global Fiber Network
              </a>
              <a
                href="#calculator"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm text-[#f5f5f7] hover:bg-white/5"
              >
                TCO Cost Estimator
              </a>
              <a
                href="#compliance"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm text-[#f5f5f7] hover:bg-white/5"
              >
                Trust & Security
              </a>
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-col space-y-2">
              <a
                href="#calculator"
                onClick={() => setIsMobileMenuOpen(false)}
                className="apple-btn-primary w-full text-center"
              >
                Deploy Instance ($300 Credit)
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Global Cmd+K Search Modal */}
      <CommandSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
