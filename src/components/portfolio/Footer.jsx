import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { SOCIALS } from "@/lib/portfolioData";

export default function Footer() {
  const [stamp, setStamp] = useState("");

  useEffect(() => {
    setStamp("LOG // " + Math.floor(Date.now() / 1000));
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative bg-transparent border-t hairline">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
          {/* Column 1: copyright / log entry */}
          <div>
            <p className="mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">
              [01] SYSTEM
            </p>
            <p className="mono text-xs text-white/60 tabular-nums">{stamp}</p>
            <p className="mono text-xs text-white/30 mt-1">
              © {new Date().getFullYear()} ABYSS.SYS — ALL RIGHTS RESERVED
            </p>
          </div>

          {/* Column 2: social protocols */}
          <div>
            <p className="mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">
              [02] PROTOCOLS
            </p>
            <ul className="space-y-1.5">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mono text-xs uppercase tracking-[0.15em] text-white/70 hover:text-white transition-colors"
                  >
                    {s.label} <span className="text-white/30">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: back to top */}
          <div className="sm:text-right">
            <p className="mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">
              [03] TERMINATE
            </p>
            <button
              onClick={scrollToTop}
              className="inline-flex h-10 w-10 items-center justify-center border hairline text-white hover:bg-white hover:text-[#050505] transition-colors"
              aria-label="Back to top"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}