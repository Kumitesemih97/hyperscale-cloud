"use client";

import React, { useEffect, useState, useRef } from "react";
import { Search, X, Cpu, Server, Shield, Globe, Terminal, ArrowRight, Calculator } from "lucide-react";

interface SearchItem {
  id: string;
  title: string;
  category: "Infrastructure" | "Compute" | "Security" | "Tools";
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const SEARCH_ITEMS: SearchItem[] = [
  {
    id: "compute-b200",
    title: "NVIDIA B200 SXM6 AI Superclusters",
    category: "Compute",
    href: "#infrastructure",
    icon: <Cpu className="w-4 h-4 text-[#2997ff]" />,
    badge: "Pro",
  },
  {
    id: "compute-baremetal",
    title: "Dual AMD EPYC 9654 192-Core Bare Metal",
    category: "Compute",
    href: "#infrastructure",
    icon: <Server className="w-4 h-4 text-[#f5f5f7]" />,
  },
  {
    id: "infra-terminal",
    title: "Live IaC Sandbox & Terraform Deployment",
    category: "Tools",
    href: "#terminal",
    icon: <Terminal className="w-4 h-4 text-[#30d158]" />,
  },
  {
    id: "infra-tco",
    title: "Enterprise TCO & Savings Estimator",
    category: "Tools",
    href: "#calculator",
    icon: <Calculator className="w-4 h-4 text-[#ffd60a]" />,
  },
  {
    id: "network-map",
    title: "Global Fiber Backbone & 140Tbps Subsea Mesh",
    category: "Infrastructure",
    href: "#network",
    icon: <Globe className="w-4 h-4 text-[#2997ff]" />,
    badge: "140 Tbps",
  },
  {
    id: "security-compliance",
    title: "FedRAMP High, SOC 2 Type II & HSM Enclaves",
    category: "Security",
    href: "#compliance",
    icon: <Shield className="w-4 h-4 text-[#a1a1a6]" />,
  },
];

interface CommandSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandSearch({ isOpen, onClose }: CommandSearchProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredItems = SEARCH_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Spotlight Cloud Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-xl transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-[#1c1c1e]/95 backdrop-blur-2xl border border-white/15 shadow-[0_24px_70px_rgba(0,0,0,0.85)] shadow-black overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        style={{ boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.15), 0 24px 70px rgba(0, 0, 0, 0.85)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Spotlight Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/[0.08] bg-white/[0.02]">
          <Search className="w-5 h-5 text-[#86868b] mr-3 shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resources, clusters, hardware, or documentation..."
            className="w-full bg-transparent text-[14px] text-[#f5f5f7] placeholder-[#86868b] focus:outline-none"
            aria-label="Search hyperscale cloud resources"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#86868b] hover:text-[#f5f5f7] hover:bg-white/10 transition-colors"
            aria-label="Close search dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-white/[0.04]">
          {filteredItems.length === 0 ? (
            <div className="py-10 text-center text-sm text-[#86868b]">
              No resources found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={onClose}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/[0.08] transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-white/[0.06] border border-white/[0.08]">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-[#f5f5f7] group-hover:text-white flex items-center gap-2">
                      {item.title}
                      {item.badge && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#2997ff]/20 text-[#2997ff] border border-[#2997ff]/30">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#86868b]">{item.category}</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#86868b] group-hover:text-[#f5f5f7] group-hover:translate-x-0.5 transition-all" />
              </a>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/[0.08] bg-black/40 text-[11px] text-[#86868b] font-mono">
          <span>Navigate with arrow keys or return</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 font-mono text-[10px]">esc</kbd>
            <span>to close</span>
          </span>
        </div>
      </div>
    </div>
  );
}
