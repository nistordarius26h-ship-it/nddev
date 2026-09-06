import { useEffect } from "react";

/**
 * Locks page scroll while `active` is true. Used by every full-screen
 * overlay (Terminal, BlueprintMap, KonamiEasterEgg) so scrolling inside
 * them doesn't leak through and scroll the page underneath.
 */
export function useLockBodyScroll(active) {
  useEffect(() => {
    if (!active) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [active]);
}
