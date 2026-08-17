import { useEffect, useRef, useState } from "react";

const BOOT_LINES = [
  "ABYSS.SYS bootloader v1.4.88",
  "CPU0: ESP32-D0WD-V3  240MHz  2 cores",
  "Flash: 4MB  OK",
  "PSRAM: 8MB  OK",
  "Mounting /spiffs... OK",
  "Initializing Wi-Fi... STA + AP",
  "Connecting to edge mesh...",
  "  -> Brasov (home)  50ms",
  "  -> Berlin  28ms",
  "  -> London  33ms",
  "  -> Tokyo  220ms",
  "Robot control server: ONLINE",
  "Loading AI inference engine... OK",
  "Sensor bus: I2C / SPI / UART calibrated",
  "Mounting portfolio... OK",
  "SYSTEM READY — revealing interface",
];

export function BootSequence({ onDone }) {
  const [lines, setLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);
  const [hidden, setHidden] = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Slower terminal output so every line is easy to read
    const stepMs = reduce ? 100 : 700;

    const arr = [];

    BOOT_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setLines((l) => [...l, line]);
        setProgress(
          Math.round(((i + 1) / BOOT_LINES.length) * 100)
        );
      }, i * stepMs);

      arr.push(t);
    });

    // Give the final "SYSTEM READY" message some time to sit on screen
    const finish = setTimeout(() => {
      setProgress(100);
      setFading(true);

      const hide = setTimeout(() => {
        setHidden(true);
        onDone?.();
      }, reduce ? 150 : 1200);

      arr.push(hide);
    }, BOOT_LINES.length * stepMs + (reduce ? 200 : 1800));

    arr.push(finish);
    timers.current = arr;

    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const skip = () => {
    timers.current.forEach(clearTimeout);

    setLines(BOOT_LINES);
    setProgress(100);
    setFading(true);

    setTimeout(() => {
      setHidden(true);
      onDone?.();
    }, 200);
  };

  if (hidden) return null;

  return (
    <div
      onClick={skip}
      className={`fixed inset-0 z-[200] bg-[#050505] flex flex-col px-4 sm:px-8 py-6 cursor-pointer transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4">
        ABYSS.SYS — BOOT SEQUENCE
      </div>

      <div className="flex-1 overflow-hidden mono text-[11px] sm:text-xs leading-relaxed text-white/70">
        {lines.map((l, i) => (
          <div key={i} className="whitespace-pre-wrap">
            <span className="text-white/30">{">"}</span> {l}
          </div>
        ))}

        {!fading && (
          <span
            className="inline-block w-2 h-4 bg-white/70 align-middle"
            style={{
              animation: "pulse-pip 1s ease-in-out infinite",
            }}
          />
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mono text-[10px] text-white/40 mb-2">
          <span>LOADING</span>
          <span className="tabular-nums">{progress}%</span>
        </div>

        <div className="h-1 w-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-100"
            style={{ width: progress + "%" }}
          />
        </div>

        <p className="mt-3 mono text-[10px] text-white/30">
          click to skip
        </p>
      </div>
    </div>
  );
}