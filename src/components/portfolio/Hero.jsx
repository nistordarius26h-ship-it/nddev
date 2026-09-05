import { TerminalSquare } from "lucide-react";
import { ResumeButton } from "./ResumeButton";

const CONTACT_EMAIL = "nistordarius26h@gmail.com";

export default function Hero({ onToggleTerminal }) {
  return (
    <header
      id="top"
      className="relative min-h-[90vh] w-full overflow-hidden bg-transparent flex items-center scroll-mt-16"
    >
      {/* Corner registration marks */}
      <CornerMark className="top-20 left-4" />
      <CornerMark className="top-20 right-4" rotate="rotate-90" />
      <CornerMark className="bottom-4 left-4" rotate="-rotate-90" />
      <CornerMark className="bottom-4 right-4" rotate="rotate-180" />

      {/* Coordinate labels */}
      <div className="absolute top-20 left-4 sm:left-6 lg:left-10 mono text-[10px] text-white/30 tracking-widest tabular-nums z-10">
        00:01 — INIT
      </div>
      <div className="absolute bottom-6 right-4 sm:right-6 lg:right-10 mono text-[10px] text-white/30 tracking-widest tabular-nums z-10">
        VIEWPORT 90VH
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-10 pt-28 pb-20">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          {/* Headline block */}
          <div className="lg:col-span-8">
            <div
              className="flex items-center gap-3 mb-6"
              style={{ animation: "fade-up 0.6s ease-out both" }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full bg-white"
                style={{ animation: "pulse-pip 2s ease-in-out infinite" }}
              />
              <span className="mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/50">
                SYSTEM ONLINE — AVAILABLE FOR WORK
              </span>
            </div>

            <h1
              className="block font-heading font-bold tracking-tight text-white leading-[0.95] text-5xl sm:text-7xl lg:text-8xl"
              style={{ animation: "fade-up 0.6s ease-out 0.1s both" }}
            >
              DARIUS NISTOR
            </h1>

            <p
              className="block mt-6 max-w-xl text-base sm:text-lg text-white/60 leading-relaxed"
              style={{ animation: "fade-up 0.6s ease-out 0.2s both" }}
            >
              AI & Robotics Engineer — I design systems that sense, think, and move.
            </p>

            {/* Buttons */}
            <div
              className="mt-10 flex flex-col sm:flex-row gap-4"
              style={{ animation: "fade-up 0.6s ease-out 0.3s both" }}
            >
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="group inline-flex items-center justify-center gap-2 bg-white text-[#050505] mono text-xs uppercase tracking-[0.2em] font-medium px-6 py-4 hover:bg-white/90 transition-colors"
              >
                Contact For Work
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a
                href="#assets"
                className="group inline-flex items-center justify-center gap-2 border hairline text-white mono text-xs uppercase tracking-[0.2em] font-medium px-6 py-4 hover:bg-white hover:text-[#050505] transition-colors"
              >
                View Portfolio
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
              <button
                onClick={onToggleTerminal}
                className="group inline-flex items-center justify-center gap-2 border hairline text-white/80 mono text-xs uppercase tracking-[0.2em] font-medium px-6 py-4 hover:bg-white hover:text-[#050505] transition-colors"
              >
                <TerminalSquare size={14} />
                Launch Terminal
              </button>
              <ResumeButton />
            </div>
          </div>

          {/* Domain status panel */}
          <div className="lg:col-span-4">
            <div
              className="border hairline p-5 sm:p-6 bg-white/[0.015]"
              style={{ animation: "fade-up 0.6s ease-out 0.4s both" }}
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b hairline">
                <span className="mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                  [DOMAINS]
                </span>
                <span className="mono text-[10px] text-white/30 tabular-nums">
                  5 MODULES
                </span>
              </div>
              <ul className="space-y-3">
                <DomainRow label="AI" />
                <DomainRow label="ENGINEERING" />
                <DomainRow label="ROBOTICS" />
                <DomainRow label="ELECTRONICS" />
                <DomainRow label="TECH" />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function DomainRow({ label }) {
  return (
    <li className="flex items-center justify-between">
      <span className="mono text-xs sm:text-sm uppercase tracking-[0.15em] text-white/80">
        {label}
      </span>
      <span className="flex items-center gap-2">
        <span
          className="h-1.5 w-1.5 rounded-full bg-white"
          style={{ animation: "pulse-pip 2s ease-in-out infinite" }}
        />
        <span className="mono text-[10px] uppercase tracking-[0.15em] text-white/50">
          ACTIVE
        </span>
      </span>
    </li>
  );
}

function CornerMark({ className = "", rotate = "" }) {
  return (
    <div className={`absolute ${className} ${rotate}`} aria-hidden="true">
      <div className="h-3 w-3 border-l border-t border-white/30" />
    </div>
  );
}