"use client";

import React, { useEffect, useState, useRef, useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
    id: "item-b200",
    title: "NVIDIA B200 SXM6 AI Superclusters",
    category: "Compute",
    href: "/infrastructure",
    icon: <Cpu className="w-4 h-4 text-[#2997ff]" />,
    badge: "Pro",
  },
  {
    id: "item-baremetal",
    title: "Dual AMD EPYC 9654 192-Core Bare Metal",
    category: "Compute",
    href: "/infrastructure",
    icon: <Server className="w-4 h-4 text-[#f5f5f7]" />,
  },
  {
    id: "item-terminal",
    title: "Live IaC Sandbox & Terraform Deployment",
    category: "Tools",
    href: "/sandbox",
    icon: <Terminal className="w-4 h-4 text-[#30d158]" />,
  },
  {
    id: "item-tco",
    title: "Enterprise TCO & Savings Estimator",
    category: "Tools",
    href: "/calculator",
    icon: <Calculator className="w-4 h-4 text-[#ffd60a]" />,
  },
  {
    id: "item-network",
    title: "Global Fiber Backbone & 140Tbps Subsea Mesh",
    category: "Infrastructure",
    href: "/network",
    icon: <Globe className="w-4 h-4 text-[#2997ff]" />,
    badge: "140 Tbps",
  },
  {
    id: "item-compliance",
    title: "FedRAMP High, SOC 2 Type II & HSM Enclaves",
    category: "Security",
    href: "/security",
    icon: <Shield className="w-4 h-4 text-[#a1a1a6]" />,
  },
];

interface CommandSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandSearch({ isOpen, onClose }: CommandSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const listboxId = useId();

  const filteredItems = SEARCH_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  // Store previously focused element and restore on close
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      setSelectedIndex(0);
      const timer = setTimeout(() => inputRef.current?.focus(), 40);
      return () => clearTimeout(timer);
    } else {
      setQuery("");
      setSelectedIndex(0);
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === "function") {
        previousActiveElement.current.focus();
      }
    }
  }, [isOpen]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation: ArrowUp, ArrowDown, Enter, Escape with Focus Trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (filteredItems.length === 0 ? 0 : (prev + 1) % filteredItems.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (filteredItems.length === 0 ? 0 : (prev - 1 + filteredItems.length) % filteredItems.length));
      } else if (e.key === "Enter") {
        if (filteredItems[selectedIndex]) {
          e.preventDefault();
          const targetHref = filteredItems[selectedIndex].href;
          onClose();
          if (targetHref.startsWith("/")) {
            router.push(targetHref);
          } else {
            window.location.hash = targetHref;
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose, router]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Spotlight Cloud Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/75 backdrop-blur-xl transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-[#1c1c1e]/98 backdrop-blur-2xl border border-white/15 shadow-[0_24px_70px_rgba(0,0,0,0.85)] shadow-black overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        style={{ boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.15), 0 24px 70px rgba(0, 0, 0, 0.85)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Spotlight Input Bar with WAI-ARIA 1.2 Combobox */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/[0.08] bg-white/[0.02]">
          <Search className="w-5 h-5 text-[#a1a1a6] mr-3 shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={filteredItems.length > 0}
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-activedescendant={filteredItems[selectedIndex] ? filteredItems[selectedIndex].id : undefined}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resources, clusters, hardware, or documentation..."
            className="w-full bg-transparent text-[14px] text-[#f5f5f7] placeholder-[#a1a1a6] focus:outline-none"
            aria-label="Search hyperscale cloud resources"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#a1a1a6] hover:text-[#f5f5f7] hover:bg-white/10 transition-colors"
            aria-label="Close search dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Listbox */}
        <div
          id={listboxId}
          role="listbox"
          aria-label="Search suggestions"
          className="max-h-80 overflow-y-auto p-2 divide-y divide-white/[0.04]"
        >
          {filteredItems.length === 0 ? (
            <div className="py-10 text-center text-sm text-[#a1a1a6]">
              No resources found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <Link
                  key={item.id}
                  id={item.id}
                  role="option"
                  aria-selected={isSelected}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group ${
                    isSelected
                      ? "bg-white/[0.12] border border-white/20 text-white"
                      : "hover:bg-white/[0.07] border border-transparent"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${isSelected ? "bg-white/[0.15]" : "bg-white/[0.06]"} border border-white/[0.08]`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-[#f5f5f7] flex items-center gap-2">
                        <span>{item.title}</span>
                        {item.badge && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#2997ff]/20 text-[#2997ff] border border-[#2997ff]/30">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#a1a1a6]">{item.category}</div>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 text-[#a1a1a6] transition-transform ${
                      isSelected ? "translate-x-1 text-[#f5f5f7]" : "group-hover:translate-x-0.5"
                    }`}
                  />
                </Link>
              );
            })
          )}
        </div>

        {/* Footer shortcuts with high contrast */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/[0.08] bg-black/50 text-[11px] text-[#a1a1a6] font-mono">
          <span className="flex items-center gap-2">
            <span>Use</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[#f5f5f7] font-mono text-[10px]">↑</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[#f5f5f7] font-mono text-[10px]">↓</kbd>
            <span>to select</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[#f5f5f7] font-mono text-[10px]">↵</kbd>
            <span>to open</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[#f5f5f7] font-mono text-[10px]">esc</kbd>
            <span>to close</span>
          </span>
        </div>
      </div>
    </div>
  );
}
