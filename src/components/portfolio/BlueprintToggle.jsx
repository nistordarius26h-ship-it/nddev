import { useEffect, useState } from "react";

const STORAGE_KEY = "abyss_blueprint_mode";

export function BlueprintToggle() {
  const [active, setActive] = useState(false);

  // Restore preference on load
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) === "1";
    setActive(saved);
    document.documentElement.classList.toggle("blueprint-mode", saved);
  }, []);

  const toggle = () => {
    setActive((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("blueprint-mode", next);
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={active}
        aria-label="Toggle blueprint schematic view"
        className="fixed bottom-6 right-6 z-[70] mono text-[10px] uppercase tracking-[0.15em] px-3 py-2 border hairline bg-black/60 backdrop-blur-sm text-white/70 hover:text-white hover:border-white/40 transition-colors"
      >
        {active ? "[ EXIT BLUEPRINT ]" : "[ BLUEPRINT VIEW ]"}
      </button>

      {/* Grid overlay + title block only visible while active (see index.css) */}
      <div className="blueprint-grid-overlay" />
      <div className="blueprint-titleblock">
        DWG NO. ND-001 · REV A · NISTOR DARIUS
      </div>
    </>
  );
}
