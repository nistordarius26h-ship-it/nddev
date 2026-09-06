import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

// Radial "spiderweb" layout: ABYSS.SYS sits at the center, four primary
// sections form a ring around it (also connected to each other, like a
// web). Hold a title node to reveal its own mini-web of children in
// place; release to collapse back — no need to close/reopen the overlay
// to look around. PROJECTS is the exception: its children are real,
// separately-navigable destinations, so they stay always visible.
const CX = 500;
const CY = 340;
const RING_RADIUS = 150;
const CHILD_RADIUS = 95;

function polar(angleDeg, radius, cx = CX, cy = CY) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

const TITLES = [
  { id: "top", label: "ABYSS.SYS", x: CX, y: CY, home: true },
  {
    id: "logs",
    label: "ABOUT",
    angle: 180,
    ...polar(180, RING_RADIUS),
    children: [
      { label: "AI & ROBOTICS ENGINEER", detail: "Hybrid AI-assisted engineering" },
      { label: "10+ CERTIFICATIONS", detail: "Google, Harvard, IBM & more" },
      { label: "BASED IN BRAȘOV", detail: "Romania" },
    ],
  },
  {
    id: "assets",
    label: "PROJECTS",
    angle: 270,
    ...polar(270, RING_RADIUS),
    alwaysShowChildren: true,
    children: [
      { id: "gaairobot", label: "GAAI ROBOT", detail: "Globally-controllable AI robot", nav: true },
      { id: "aistallpredictionsystem", label: "STALL PREDICTION", detail: "Flight stall prediction model", nav: true },
      { id: "esp32jamm", label: "ESP32 JAMM", detail: "Wireless signal research", nav: true },
    ],
  },
  {
    id: "skills",
    label: "SKILLS",
    angle: 0,
    ...polar(0, RING_RADIUS),
    children: [
      { label: "AI & DATA", detail: "Group 01" },
      { label: "CLOUD & SECURITY", detail: "Group 02" },
      { label: "PROFESSIONAL", detail: "Group 03" },
      { label: "ENGINEERING & ROBOTICS", detail: "Group 04" },
    ],
  },
  {
    id: "contact",
    label: "CONTACT",
    angle: 90,
    ...polar(90, RING_RADIUS),
    children: [
      { label: "DIRECT MESSAGE", detail: "Open a channel" },
      { label: "SOCIAL LINKS", detail: "External protocols" },
    ],
  },
];

const RING_EDGES = [
  ["top", "logs"],
  ["top", "assets"],
  ["top", "skills"],
  ["top", "contact"],
  ["logs", "assets"],
  ["assets", "skills"],
  ["skills", "contact"],
  ["contact", "logs"],
];

function titleById(id) {
  return TITLES.find((t) => t.id === id);
}

function childPositions(title) {
  const count = title.children.length;
  const spread = count > 1 ? 68 : 0;
  const start = title.angle - spread / 2;
  const step = count > 1 ? spread / (count - 1) : 0;
  return title.children.map((child, i) => ({
    ...child,
    ...polar(start + i * step, CHILD_RADIUS, title.x, title.y),
  }));
}

function TitleNode({ title, expanded, onExpand, onCollapse, onNavigate }) {
  const timerRef = useRef(null);
  const heldRef = useRef(false);
  const holdable = !title.home && !title.alwaysShowChildren;

  const startHold = (e) => {
    e.preventDefault();
    if (!holdable) return;
    heldRef.current = false;
    timerRef.current = setTimeout(() => {
      heldRef.current = true;
      onExpand(title.id);
    }, 260);
  };
  const endHold = () => {
    if (!holdable) {
      onNavigate(title.id);
      return;
    }
    clearTimeout(timerRef.current);
    if (heldRef.current) {
      onCollapse();
      heldRef.current = false;
    } else {
      onNavigate(title.id);
    }
  };
  const cancelHold = () => {
    if (!holdable) return;
    clearTimeout(timerRef.current);
    if (heldRef.current) {
      onCollapse();
      heldRef.current = false;
    }
  };

  return (
    <g
      className="mesh-node"
      onPointerDown={startHold}
      onPointerUp={endHold}
      onPointerLeave={cancelHold}
      onPointerCancel={cancelHold}
      onContextMenu={(e) => e.preventDefault()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onNavigate(title.id);
      }}
      aria-label={
        holdable ? `${title.label} — click to open, hold to preview` : `Go to ${title.label}`
      }
    >
      <circle
        cx={title.x}
        cy={title.y}
        r={title.home ? 12 : 9}
        className={`mesh-node-dot${title.home ? " mesh-node-home" : ""}${
          expanded ? " mesh-node-active" : ""
        }`}
      />
      <text x={title.x} y={title.y + 28} textAnchor="middle" className="mesh-node-label">
        {title.label}
      </text>
    </g>
  );
}

export function BlueprintMap({ open, onClose }) {
  const [closing, setClosing] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const transformRef = useRef(null);

  useLockBodyScroll(open);

  useEffect(() => {
    if (open) {
      setClosing(false);
      setExpandedId(null);
    }
  }, [open]);

  if (!open) return null;

  const expandTitle = (id) => {
    setExpandedId(id);
    try {
      transformRef.current?.zoomToElement(`mesh-node-${id}`, 1.7, 280);
    } catch (e) {
      /* zoomToElement not available — expansion still renders, just no auto-zoom */
    }
  };

  const collapseTitle = () => {
    setExpandedId(null);
    try {
      transformRef.current?.resetTransform(280);
    } catch (e) {
      /* no-op */
    }
  };

  const requestClose = (thenScrollToId) => {
    setClosing(true);
    setTimeout(() => {
      onClose();
      if (thenScrollToId) {
        // Wait a frame after unmount so body scroll is unlocked first —
        // otherwise scrollIntoView can't animate and just jumps instantly.
        requestAnimationFrame(() => {
          document
            .getElementById(thenScrollToId)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    }, 350);
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
              {/* Purely decorative web strands, for the spiderweb feel */}
              <circle cx={CX} cy={CY} r={95} className="mesh-web-ring" />
              <circle cx={CX} cy={CY} r={215} className="mesh-web-ring" />
              {[45, 135, 225, 315].map((a) => {
                const p = polar(a, 260);
                return (
                  <line
                    key={a}
                    x1={CX}
                    y1={CY}
                    x2={p.x}
                    y2={p.y}
                    className="mesh-web-thread"
                  />
                );
              })}

              {/* Real (interactive) edges */}
              {RING_EDGES.map(([fromId, toId], i) => {
                const a = titleById(fromId);
                const b = titleById(toId);
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

              {/* Title nodes + their children */}
              {TITLES.map((title) => {
                const showChildren = title.alwaysShowChildren || expandedId === title.id;
                const kids = title.children ? childPositions(title) : [];
                return (
                  <g key={title.id}>
                    <g id={`mesh-node-${title.id}`}>
                      <TitleNode
                        title={title}
                        expanded={expandedId === title.id}
                        onExpand={expandTitle}
                        onCollapse={collapseTitle}
                        onNavigate={(id) => requestClose(id)}
                      />
                    </g>

                    {showChildren &&
                      kids.map((child, i) => (
                        <g key={child.id || child.label}>
                          <line
                            x1={title.x}
                            y1={title.y}
                            x2={child.x}
                            y2={child.y}
                            pathLength="1"
                            className="mesh-line mesh-line-child"
                            style={{ animationDelay: `${i * 40}ms` }}
                          />
                          <g
                            className="mesh-node mesh-node-child"
                            style={{ animationDelay: `${80 + i * 40}ms` }}
                            onClick={child.nav ? () => requestClose(child.id) : undefined}
                            role={child.nav ? "button" : undefined}
                            tabIndex={child.nav ? 0 : undefined}
                            onKeyDown={
                              child.nav
                                ? (e) => {
                                    if (e.key === "Enter" || e.key === " ") requestClose(child.id);
                                  }
                                : undefined
                            }
                            aria-label={child.nav ? `Go to ${child.label}` : undefined}
                          >
                            <circle cx={child.x} cy={child.y} r={5} className="mesh-node-dot mesh-node-dot-small" />
                            <text x={child.x} y={child.y + 18} textAnchor="middle" className="mesh-node-label mesh-node-label-small">
                              {child.label}
                            </text>
                            <text x={child.x} y={child.y + 30} textAnchor="middle" className="mesh-node-detail">
                              {child.detail}
                            </text>
                          </g>
                        </g>
                      ))}
                  </g>
                );
              })}
            </svg>
          </TransformComponent>
        </TransformWrapper>
      </div>

      <div className="blueprint-map-titleblock mono">
        DWG NO. ND-001 · REV A · CLICK TO OPEN · HOLD A TITLE TO PREVIEW · SCROLL/PINCH TO ZOOM
      </div>
    </div>
  );
}
