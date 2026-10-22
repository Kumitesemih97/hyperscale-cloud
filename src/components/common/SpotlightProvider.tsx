"use client";

import { useEffect } from "react";

/**
 * High-performance hardware spotlight tracker.
 * Updates CSS custom properties (--mouse-x, --mouse-y) directly on DOM elements
 * without triggering any React reconciliation cycles or re-renders.
 */
export function SpotlightProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    let activeCard: HTMLElement | null = null;
    let cardRect: DOMRect | null = null;

    const handlePointerMove = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const card = target.closest(".apple-bento-card") as HTMLElement | null;
      if (card) {
        if (card !== activeCard) {
          activeCard = card;
          cardRect = card.getBoundingClientRect();
        }

        if (cardRect) {
          const x = e.clientX - cardRect.left;
          const y = e.clientY - cardRect.top;
          card.style.setProperty("--mouse-x", `${x}px`);
          card.style.setProperty("--mouse-y", `${y}px`);
        }
      } else {
        activeCard = null;
        cardRect = null;
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return null;
}

