import { useEffect, useState } from "react";
import { TerminalSquare, Compass } from "lucide-react";
import { Heartbeat } from "./Heartbeat";
import { NavLinks } from "./NavLinks";
import { SystemStatus } from "./SystemStatus";

const NAV_ITEMS = [
  { label: "ROOT", href: "#top" },
  { label: "ABOUT", href: "#logs" },
  { label: "ASSETS", href: "#assets" },
  { label: "SKILLS", href: "#skills" },
  { label: "CONTACT", href: "#contact" },
];

export default function Navbar({ onToggleTerminal, onToggleBlueprint }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-GB", { hour12: false }) + " UTC");
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-[#050505]/80 backdrop-blur-sm">
      <div className="border-b hairline">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
          {/* Left: heartbeat + name */}
          <a href="#top" className="flex items-center gap-3 group" aria-label="Home">
            <Heartbeat />
            <span className="mono text-xs sm:text-sm font-medium tracking-[0.2em] uppercase text-white">
              ABYSS<span className="text-white/40">.SYS</span>
            </span>
          </a>

          {/* Center: nav links */}
          <NavLinks items={NAV_ITEMS} />

          {/* Right: terminal toggle + status */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
            <button
              onClick={onToggleBlueprint}
              className="flex items-center gap-2 mono text-[10px] uppercase tracking-[0.2em] text-white/70 hover:text-white border hairline px-3 py-2 transition-colors"
              aria-label="Open site schematic"
            >
              <Compass size={14} />
              <span className="hidden sm:inline">MAP</span>
            </button>
            <button
              onClick={onToggleTerminal}
              className="flex items-center gap-2 mono text-[10px] uppercase tracking-[0.2em] text-white/70 hover:text-white border hairline px-3 py-2 transition-colors"
              aria-label="Launch terminal"
            >
              <TerminalSquare size={14} />
              <span className="hidden sm:inline">TERM</span>
            </button>
            <SystemStatus time={time} />
          </div>
        </div>
      </div>
    </nav>
  );
}