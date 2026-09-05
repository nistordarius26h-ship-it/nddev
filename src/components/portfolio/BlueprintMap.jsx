import { useEffect, useState } from "react";
import { X } from "lucide-react";

// Node layout on a 1000x600 canvas. Each id must match a real element id
// elsewhere on the site (see Navbar.jsx / section components) so clicking
// a node can actually scroll there.
const NODES = [
  { id: "top", label: "ABYSS.SYS", x: 500, y: 60, home: true },
  { id: "logs", label: "ABOUT", x: 200, y: 230 },
  { id: "assets", label: "PROJECTS", x: 500, y: 230 },
  { id: "skills", label: "SKILLS", x: 800, y: 230 },
  { id: "gaairobot", label: "GAAI ROBOT", x: 330, y: 400, small: true },
  { id: "aistallpredictionsystem", label: "STALL PREDICTION", x: 500, y: 400, small: true },
  { id: "esp32jamm", label: "ESP32 JAMM", x: 670, y: 400, small: true },
  { id: "contact", label: "CONTACT", x: 500, y: 540 },
];

const EDGES = [
  ["top", "logs"],
  ["top", "assets"],
  ["top", "skills"],
  ["assets", "gaairobot"],
  ["assets", "aistallpredictionsystem"],
  ["assets", "esp32jamm"],
  ["logs", "contact"],
  ["assets", "contact"],
  ["skills", "contact"],
];

function nodeById(id) {
  return NODES.find((n) => n.id === id);
}

export function BlueprintMap({ open, onClose }) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) setClosing(false);
  }, [open]);

  if (!open) return null;

  const requestClose = (thenScrollToId) => {
    setClosing(true);
    setTimeout(() => {
      onClose();
      if (thenScrollToId) {
        document
          .getElementById(thenScrollToId)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 240);
  };

  return (
    <div
      className={`fixed inset-0 z-[110] bg-[#050b16] blueprint-map-overlay ${
        closing ? "closing" : ""
      }`}
      role="dialog"
      aria-label="Site schematic navigation"
    >
      <div className="blueprint-map-grid" />

      {/* Title bar, mirrors Terminal's chrome */}
      <div className="relative flex items-center justify-between border-b border-white/15 px-4 sm:px-6 h-12">
        <span className="mono text-[10px] uppercase tracking-[0.25em] text-white/70">
          SYSTEM SCHEMATIC — SITE MESH
        </span>
        <button
          onClick={() => requestClose()}
          className="text-white/60 hover:text-white transition-colors"
          aria-label="Close schematic view"
        >
          <X size={16} />
        </button>
      </div>

      {/* Mesh diagram */}
      <div className="relative h-[calc(100%-3rem)] w-full flex items-center justify-center px-4">
        <svg
          viewBox="0 0 1000 600"
          className="w-full max-w-5xl h-auto"
          role="img"
          aria-label="Diagram of site sections and projects"
        >
          {EDGES.map(([fromId, toId], i) => {
            const a = nodeById(fromId);
            const b = nodeById(toId);
            return (
              <line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                pathLength="1"
                className="mesh-line"
                style={{ animationDelay: `${i * 60}ms` }}
              />
            );
          })}

          {NODES.map((n, i) => (
            <g
              key={n.id}
              className="mesh-node"
              style={{ animationDelay: `${180 + i * 50}ms` }}
              onClick={() => requestClose(n.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") requestClose(n.id);
              }}
              aria-label={`Go to ${n.label}`}
            >
              <circle
                cx={n.x}
                cy={n.y}
                r={n.home ? 10 : n.small ? 5 : 7}
                className={`mesh-node-dot${n.home ? " mesh-node-home" : ""}`}
              />
              <text
                x={n.x}
                y={n.y + (n.small ? 22 : 28)}
                textAnchor="middle"
                className={`mesh-node-label${n.small ? " mesh-node-label-small" : ""}`}
              >
                {n.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="blueprint-map-titleblock mono">
        DWG NO. ND-001 · REV A · SITE SCHEMATIC · CLICK A NODE TO NAVIGATE
      </div>
    </div>
  );
}
