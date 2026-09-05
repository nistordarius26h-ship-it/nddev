import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import {
  PROFILE,
  ABOUT,
  PROJECTS,
  SKILL_GROUPS,
  CERTIFICATES,
  SOCIALS,
} from "@/lib/portfolioData";

const HELP = [
  "about      — operator profile & bio",
  "projects   — deployed systems index",
  "cert       — verified certifications",
  "skills     — instrumentation by discipline",
  "contact    — open a channel",
  "social      — external protocols",
  "whoami     — identity check",
  "clear      — clear the buffer",
  "exit       — return to graphical shell",
];

export function Terminal({ onClose }) {
  const [closing, setClosing] = useState(false);
  const [history, setHistory] = useState([
    { type: "sys", text: "ABYSS.SYS // v1.4.88 — command interface ready." },
    { type: "sys", text: "Type 'help' to list available commands." },
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const run = (raw) => {
    const cmd = raw.trim().toLowerCase();
    const out = [];
    if (!cmd) return;

    switch (cmd) {
      case "help":
        out.push({ type: "out", lines: HELP });
        break;
      case "about":
        out.push({ type: "out", lines: [ABOUT.title, "", ...ABOUT.paragraphs] });
        break;
      case "projects":
        out.push({
          type: "out",
          lines: [
            "REPO                    TITLE",
            "----                    -----",
            ...PROJECTS.map((p) => `${p.repo.padEnd(24)} ${p.title}`),
          ],
        });
        break;
      case "cert":
      case "certificates":
        out.push({
          type: "out",
          lines: CERTIFICATES.map((c) => `${c.id}  ${c.name} — ${c.issuer}`),
        });
        break;
      case "skills":
        out.push({
          type: "out",
          lines: SKILL_GROUPS.flatMap((g) => [
            `[${g.id}] ${g.title}`,
            "  " + g.skills.join("  ·  "),
            "",
          ]),
        });
        break;
      case "contact":
        out.push({
          type: "out",
          lines: [
            "Open a channel — reach out directly via any protocol below:",
            ...SOCIALS.map((s) => `  ${s.label.padEnd(10)} ${s.href}`),
          ],
        });
        break;
      case "social":
        out.push({
          type: "out",
          lines: SOCIALS.map((s) => `${s.label.padEnd(10)} ${s.href}`),
        });
        break;
      case "whoami":
        out.push({
          type: "out",
          lines: [`${PROFILE.name} // ${PROFILE.handle}`, PROFILE.tagline],
        });
        break;
      case "clear":
        setHistory([]);
        return;
      case "exit":
      case "quit":
        requestClose();
        return;
      case "easteregg":
        window.dispatchEvent(new Event("trigger-easter-egg"));
        out.push({ type: "out", lines: ["initiating override sequence..."] });
        break;
      default:
        out.push({
          type: "err",
          lines: [`command not found: ${cmd} — type 'help'`],
        });
    }

    setHistory((h) => [
      ...h,
      { type: "cmd", text: raw },
      ...out.flatMap((o) => (o.lines ? o.lines.map((l) => ({ type: o.type, text: l })) : [o])),
    ]);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    run(input);
    setCmdHistory((h) => (input.trim() ? [...h, input] : h));
    setInput("");
    setHistIdx(-1);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!cmdHistory.length) return;
      const idx = histIdx === -1 ? cmdHistory.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(idx);
      setInput(cmdHistory[idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx === -1) return;
      const idx = histIdx + 1;
      if (idx >= cmdHistory.length) {
        setHistIdx(-1);
        setInput("");
      } else {
        setHistIdx(idx);
        setInput(cmdHistory[idx]);
      }
    }
  };

  const requestClose = () => {
    setClosing(true);
    setTimeout(onClose, 200);
  };

  return (
    <div className={`fixed inset-0 z-[100] bg-[#050505] flex flex-col terminal-overlay ${closing ? "closing" : ""}`}>
      {/* Title bar */}
      <div className="flex items-center justify-between border-b hairline px-4 sm:px-6 h-12">
        <span className="mono text-[10px] uppercase tracking-[0.25em] text-white/60">
          ABYSS.SYS — TERMINAL
        </span>
        <button
          onClick={requestClose}
          className="text-white/60 hover:text-white"
          aria-label="Close terminal"
        >
          <X size={16} />
        </button>
      </div>

      {/* Buffer */}
      <div
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 mono text-xs sm:text-sm leading-relaxed"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((line, i) => (
          <div
            key={i}
            className={
              line.type === "cmd"
                ? "text-white"
                : line.type === "err"
                ? "text-white/80"
                : line.type === "sys"
                ? "text-white/50"
                : "text-white/70 whitespace-pre-wrap"
            }
          >
            {line.type === "cmd" ? (
              <>
                <span className="text-white/40">visitor@abyss:~$ </span>
                {line.text}
              </>
            ) : (
              line.text || "\u00A0"
            )}
          </div>
        ))}

        {/* Active input line */}
        <form onSubmit={onSubmit} className="flex items-center mt-1">
          <span className="text-white/40">visitor@abyss:~$&nbsp;</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            className="flex-1 bg-transparent text-white focus:outline-none caret-white"
            autoComplete="off"
            spellCheck={false}
            aria-label="Terminal command input"
          />
        </form>
        <div ref={endRef} />
      </div>

      {/* Hint bar */}
      <div className="border-t hairline px-4 sm:px-6 py-2 mono text-[10px] uppercase tracking-[0.2em] text-white/30">
        try: about · projects · cert · skills · contact · help · exit
      </div>
    </div>
  );
}