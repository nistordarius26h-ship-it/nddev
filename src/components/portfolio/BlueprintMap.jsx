import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

// Radial "spiderweb" layout: ABYSS.SYS sits at the center, four primary
// sections form a ring around it (also connected to each other, like a
// web), and the three project nodes fan outward from PROJECTS.
const CX = 500;
const CY = 340;

function polar(angleDeg, radius) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) };
}

const NODES = [
  { id: "top", label: "ABYSS.SYS", detail: "System root", ...{ x: CX, y: CY }, home: true },
  { id: "logs", label: "ABOUT", detail: "Background, stats, certifications", ...polar(180, 150) },
  { id: "assets", label: "PROJECTS", detail: "Robotics & AI builds", ...polar(270, 150) },
  { id: "skills", label: "SKILLS", detail: "Technical inventory", ...polar(0, 150) },
  { id: "contact", label: "CONTACT", detail: "Get in touch", ...polar(90, 150) },
  { id: "gaairobot", label: "GAAI ROBOT", detail: "Globally-controllable AI robot", ...polar(245, 260), small: true },
  { id: "aistallpredictionsystem", label: "STALL PREDICTION", detail: "Flight stall prediction model", ...polar(270, 260), small: true },
  { id: "esp32jamm", label: "ESP32 JAMM", detail: "Wireless signal research", ...polar(295, 260), small: true },
];

const EDGES = [
  // Hub spokes
  ["top", "logs"],
  ["top", "assets"],
  ["top", "skills"],
  ["top", "contact"],
  // Outer ring — connects the four primary nodes to each other, like a web
  ["logs", "assets"],
  ["assets", "skills"],
  ["skills", "contact"],
  ["contact", "logs"],
  // Project fan
  ["assets", "gaairobot"],
  ["assets", "aistallpredictionsystem"],
  ["assets", "esp32jamm"],
];

function nodeById(id) {
  return NODES.find((n) => n.id === id);
}

export function BlueprintMap({ open, onClose }) {
  const [closing, setClosing] = useState(false);
  const [scale, setScale] = useState(1);
  const transformRef = useRef(null);

  useEffect(() => {
    if (open) {
      setClosing(false);
      setScale(1);
    }
  }, [open]);

  if (!open) return null;

  const showDetail = scale >= 1.35;

  const requestClose = (thenScrollToId) => {
    const finish = () => {
      setClosing(true);
      setTimeout(() => {
        onClose();
        if (thenScrollToId) {
          document
            .getElementById(thenScrollToId)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 320);
    };

    if (thenScrollToId && transformRef.current) {
      try {
        transformRef.current.zoomToElement(`mesh-node-${thenScrollToId}`, 2.4, 500);
        setTimeout(finish, 520);
        return;
      } catch (e) {
        // react-zoom-pan-pinch couldn't target the element — just close normally
      }
    }
    finish();
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

      <div className="relative flex items-center justify-between border-b border-white/15 px-4 sm:px-6 h-12 z-10">
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

      <div className="relative h-[calc(100%-3rem)] w-full">
        <TransformWrapper
          ref={transformRef}
          initialScale={1}
          minScale={0.6}
          maxScale={4}
          centerOnInit
          wheel={{ step: 0.15 }}
          pinch={{ step: 5 }}
          doubleClick={{ step: 0.7 }}
          onTransformed={(_ref, state) => setScale(state.scale)}
        >
          <TransformComponent
            wrapperStyle={{ width: "100%", height: "100%" }}
            contentStyle={{ width: "100%", height: "100%" }}
          >
            <svg
              viewBox="0 0 1000 680"
              className="w-full h-full"
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
                    style={{ animationDelay: `${i * 55}ms` }}
                  />
                );
              })}

              {NODES.map((n, i) => (
                <g
                  key={n.id}
                  id={`mesh-node-${n.id}`}
                  className="mesh-node"
                  style={{ animationDelay: `${180 + i * 45}ms` }}
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
                    r={n.home ? 12 : n.small ? 6 : 8}
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
                  {showDetail && (
                    <text
                      x={n.x}
                      y={n.y + (n.small ? 34 : 42)}
                      textAnchor="middle"
                      className="mesh-node-detail"
                    >
                      {n.detail}
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </TransformComponent>
        </TransformWrapper>
      </div>

      <div className="blueprint-map-titleblock mono">
        DWG NO. ND-001 · REV A · SCROLL / PINCH TO ZOOM · CLICK A NODE TO NAVIGATE
      </div>
    </div>
  );
}
