import { useEffect, useRef, useState } from "react";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
];

const BOOT_LINES = [
  "[!] UNEXPECTED INPUT SEQUENCE DETECTED",
  "> re-authenticating operator...",
  "> operator: UNKNOWN",
  "> override accepted",
  "",
  "  W A K I N G   U P",
  "",
  "> spinning up actuators.......... OK",
  "> vision system.................. OK",
  "> ego...................... TOO MUCH",
  "",
  "[OK] hi. you found the easter egg.",
];

export function KonamiEasterEgg() {
  const [active, setActive] = useState(false);
  const progress = useRef(0);

  useEffect(() => {
    function onKeyDown(e) {
      // Don't hijack input while the person is typing somewhere (e.g. the terminal)
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      const expected = SEQUENCE[progress.current];

      if (e.key === expected) {
        progress.current += 1;
        if (progress.current === SEQUENCE.length) {
          progress.current = 0;
          setActive(true);
        }
      } else {
        progress.current = e.key === SEQUENCE[0] ? 1 : 0;
      }
    }

    // Also triggerable by typing "easteregg" + Enter in the terminal
    function onTerminalTrigger() {
      setActive(true);
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("trigger-easter-egg", onTerminalTrigger);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("trigger-easter-egg", onTerminalTrigger);
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setActive(false), 2800);
    return () => clearTimeout(t);
  }, [active]);

  if (!active) return null;

  return (
    <div
      className="konami-overlay"
      role="status"
      aria-live="polite"
      onClick={() => setActive(false)}
    >
      <pre>{BOOT_LINES.join("\n")}</pre>
    </div>
  );
}
