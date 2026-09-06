import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import {
  PROFILE,
  ABOUT,
  PROJECTS,
  SKILL_GROUPS,
  GITHUB_URL,
  LINKEDIN_URL,
  CONTACT_EMAIL,
} from "@/lib/portfolioData";

// A real family tree, entirely self-contained: ABYSS.SYS at the center,
// four category nodes around it, and every leaf actually populated with
// real data. Nothing here navigates back to the main page — the only
// clickable nodes are ones that open a real external link (a project's
// GitHub repo, or a contact method) in a new tab. Everything else is
// purely informational.
const CX = 650;
const CY = 600;
const RING_RADIUS = 170;

function polar(angleDeg, radius, cx = CX, cy = CY) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

function angleFromHub(x, y) {
  return (Math.atan2(y - CY, x - CX) * 180) / Math.PI;
}

// Spreads `count` children around `origin`, fanned across `spread` degrees
// centered on `originAngle`. Alternates between `baseRadius` and
// `baseRadius + radiusStep` by index parity — a second staggered ring, not
// just a single arc — so dense branches get real room instead of cramming
// every sibling onto one crowded circle.
function fan(origin, originAngle, count, spread, baseRadius, radiusStep = 0) {
  if (count === 1) return [polar(originAngle, baseRadius, origin.x, origin.y)];
  const start = originAngle - spread / 2;
  const step = spread / (count - 1);
  return Array.from({ length: count }, (_, i) => {
    const radius = baseRadius + (i % 2 === 1 ? radiusStep : 0);
    return polar(start + i * step, radius, origin.x, origin.y);
  });
}

// For dense branches (many skills under one group), a wide fan collides
// with neighboring groups' fans since they all originate close together.
// Instead, lay items out as a narrow "spoke" trailing outward along the
// group's own direction from the hub — each successive item further out,
// with only a small alternating lateral jitter for label legibility. Since
// each group points a different direction, spokes diverge outward and
// don't cross into each other.
function spoke(origin, angleDeg, count, baseRadius, radiusStep, jitterDeg = 8) {
  return Array.from({ length: count }, (_, i) => {
    const a = angleDeg + (i % 2 === 0 ? -jitterDeg : jitterDeg);
    const r = baseRadius + i * radiusStep;
    return polar(a, r, origin.x, origin.y);
  });
}

// --- Real repo URLs. Note: the "gaairobot" slug in portfolioData.js
// doesn't match the actual repo name (ga_ai_robot) — corrected here. If
// the other two slugs are also off, tell me the real ones and I'll fix
// the source data too. ---
const REPO_OVERRIDES = {
  gaairobot: "ga_ai_robot",
  aistallpredictionsystem: "AI-Stall-Prediction-System",
};
function repoUrl(project) {
  const slug = REPO_OVERRIDES[project.repo] || project.repo;
  return `${GITHUB_URL}/${slug}`;
}

const aboutParagraph = ABOUT.paragraphs?.[0] || "";

const TITLES = [
  { id: "top", label: PROFILE.handle || "ABYSS.SYS", x: CX, y: CY, home: true },
  {
    id: "logs",
    label: "ABOUT",
    angle: 180,
    ...polar(180, RING_RADIUS),
    children: [
      { label: PROFILE.name, detail: PROFILE.tagline },
      { label: "BACKGROUND", detail: truncate(aboutParagraph, 58), wide: true },
    ],
  },
  {
    id: "assets",
    label: "PROJECTS",
    angle: 270,
    ...polar(270, RING_RADIUS),
    children: PROJECTS.map((p) => ({
      label: p.title.toUpperCase(),
      detail: truncate(p.description, 58),
      href: repoUrl(p),
      wide: true,
    })),
  },
  {
    id: "skills",
    label: "SKILLS",
    angle: 0,
    ...polar(0, RING_RADIUS),
    children: SKILL_GROUPS.map((g) => ({
      label: g.title.toUpperCase(),
      detail: `${g.skills.length} skills`,
      skills: g.skills,
    })),
  },
  {
    id: "contact",
    label: "CONTACT",
    angle: 90,
    ...polar(90, RING_RADIUS),
    children: [
      { label: "GITHUB", detail: "@" + GITHUB_URL.split("/").pop(), href: GITHUB_URL },
      { label: "LINKEDIN", detail: "Connect", href: LINKEDIN_URL },
      { label: "EMAIL", detail: CONTACT_EMAIL, href: "mailto:" + CONTACT_EMAIL },
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

function openExternal(href) {
  window.open(href, "_blank", "noopener,noreferrer");
}

function truncate(str, max) {
  if (!str || str.length <= max) return str;
  return str.slice(0, max - 1).trimEnd() + "…";
}

export function BlueprintMap({ open, onClose }) {
  const [closing, setClosing] = useState(false);

  useLockBodyScroll(open);

  useEffect(() => {
    if (open) setClosing(false);
  }, [open]);

  if (!open) return null;

  const requestClose = () => {
    setClosing(true);
    setTimeout(onClose, 350);
  };

  return (
    <div
      className={`fixed inset-0 z-[110] bg-[#050b16] blueprint-map-overlay ${
        closing ? "closing" : ""
      }`}
      role="dialog"
      aria-label="Site schematic"
    >
      <div className="blueprint-map-grid" />

      <div className="relative flex items-center justify-between border-b border-white/15 px-4 sm:px-6 h-12 z-10">
        <span className="mono text-[10px] uppercase tracking-[0.25em] text-white/70">
          SYSTEM SCHEMATIC — SITE MESH
        </span>
        <button
          onClick={requestClose}
          className="text-white/60 hover:text-white transition-colors"
          aria-label="Close schematic view"
        >
          <X size={16} />
        </button>
      </div>

      <div className="relative h-[calc(100%-3rem)] w-full">
        <TransformWrapper
          initialScale={0.42}
          minScale={0.4}
          maxScale={5}
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
              viewBox="0 0 1550 1350"
              className="w-full h-full"
              role="img"
              aria-label="Diagram of site sections and projects"
            >
              {/* Decorative web strands */}
              <circle cx={CX} cy={CY} r={130} className="mesh-web-ring" />
              <circle cx={CX} cy={CY} r={310} className="mesh-web-ring" />
              {[45, 135, 225, 315].map((a) => {
                const p = polar(a, 380);
                return (
                  <line key={a} x1={CX} y1={CY} x2={p.x} y2={p.y} className="mesh-web-thread" />
                );
              })}

              {/* Level 1 ring edges */}
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

              {/* Level 1 title nodes (unclickable — pure organization) */}
              {TITLES.map((title) => (
                <g key={title.id} className="mesh-node mesh-node-inert">
                  <circle
                    cx={title.x}
                    cy={title.y}
                    r={title.home ? 12 : 9}
                    className={`mesh-node-dot${title.home ? " mesh-node-home" : ""}`}
                  />
                  <text x={title.x} y={title.y + 28} textAnchor="middle" className="mesh-node-label">
                    {title.label}
                  </text>
                </g>
              ))}

              {/* Level 2 children + their own level-3 grandchildren (skills only) */}
              {TITLES.filter((t) => t.children).map((title) => {
                // Capped well inside this branch's own 90°-wide lane (the
                // 4 title nodes sit 90° apart) so it can never fan into a
                // neighboring branch's territory — that was the actual
                // cause of AI & DATA crossing into PROJECTS, and
                // ENGINEERING & ROBOTICS crossing into CONTACT.
                const spread = Math.min(70, Math.max(45, title.children.length * 18));
                const positions = fan(title, title.angle, title.children.length, spread, 260);

                return title.children.map((child, i) => {
                  const pos = positions[i];
                  const clickable = !!child.href;
                  const grandchildren = child.skills || [];
                  const childAngle = angleFromHub(pos.x, pos.y);
                  const gPositions = grandchildren.length
                    ? spoke({ x: pos.x, y: pos.y }, childAngle, grandchildren.length, 55, 30)
                    : [];
                  // Stagger alternating labels further out so adjacent
                  // siblings' text doesn't sit on the same line and overlap.
                  const stagger = i % 2 === 0 ? 0 : 20;

                  return (
                    <g key={`${title.id}-${child.label}`}>
                      <line
                        x1={title.x}
                        y1={title.y}
                        x2={pos.x}
                        y2={pos.y}
                        pathLength="1"
                        className="mesh-line mesh-line-child"
                        style={{ animationDelay: `${i * 40}ms` }}
                      />
                      <g
                        className={`mesh-node ${clickable ? "" : "mesh-node-inert"}`}
                        style={{ animationDelay: `${80 + i * 40}ms` }}
                        onClick={clickable ? () => openExternal(child.href) : undefined}
                        role={clickable ? "button" : undefined}
                        tabIndex={clickable ? 0 : undefined}
                        onKeyDown={
                          clickable
                            ? (e) => {
                                if (e.key === "Enter" || e.key === " ") openExternal(child.href);
                              }
                            : undefined
                        }
                        aria-label={clickable ? `Open ${child.label}` : undefined}
                      >
                        <circle cx={pos.x} cy={pos.y} r={6} className="mesh-node-dot mesh-node-dot-small" />
                        <text x={pos.x} y={pos.y + 18 + stagger} textAnchor="middle" className="mesh-node-label mesh-node-label-small">
                          {child.label}
                        </text>
                        <text
                          x={pos.x}
                          y={pos.y + 30 + stagger}
                          textAnchor="middle"
                          className={`mesh-node-detail${child.wide ? " mesh-node-detail-wide" : ""}`}
                        >
                          {child.detail}
                        </text>
                      </g>

                      {/* Level 3 — individual skills under each skill group */}
                      {grandchildren.map((skill, gi) => {
                        const gpos = gPositions[gi];
                        const gStagger = gi % 2 === 0 ? 0 : 16;
                        return (
                          <g key={skill}>
                            <line
                              x1={pos.x}
                              y1={pos.y}
                              x2={gpos.x}
                              y2={gpos.y}
                              pathLength="1"
                              className="mesh-line mesh-line-grandchild"
                              style={{ animationDelay: `${gi * 25}ms` }}
                            />
                            <g className="mesh-node mesh-node-inert" style={{ animationDelay: `${gi * 25}ms` }}>
                              <circle cx={gpos.x} cy={gpos.y} r={3.5} className="mesh-node-dot mesh-node-dot-tiny" />
                              <text x={gpos.x} y={gpos.y + 13 + gStagger} textAnchor="middle" className="mesh-node-label-tiny">
                                {skill}
                              </text>
                            </g>
                          </g>
                        );
                      })}
                    </g>
                  );
                });
              })}
            </svg>
          </TransformComponent>
        </TransformWrapper>
      </div>

      <div className="blueprint-map-titleblock mono">
        DWG NO. ND-001 · REV A · SCROLL/PINCH TO ZOOM · HIGHLIGHTED NODES OPEN EXTERNAL LINKS
      </div>
    </div>
  );
}
