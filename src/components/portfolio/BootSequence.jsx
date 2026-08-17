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

/*
 * Total time spent typing the characters.
 *
 * This is intentionally independent of:
 * - screen size
 * - PC vs phone
 * - CPU speed
 * - browser timer speed
 */
const TOTAL_TYPING_TIME = 6000;

/*
 * Small pauses between completed lines.
 * These are NOT part of the 6 second typing time.
 */
const LINE_PAUSES = [
  180,
  140,
  120,
  140,
  180,
  220,
  300,
  120,
  120,
  120,
  220,
  260,
  320,
  280,
  220,
  900,
];

export function BootSequence({ onDone }) {
  const [lines, setLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const [typing, setTyping] = useState(false);
  const [cinematic, setCinematic] = useState(false);
  const [fading, setFading] = useState(false);
  const [hidden, setHidden] = useState(false);

  const timers = useRef([]);
  const animationFrame = useRef(null);
  const skipped = useRef(false);

  const clearTimers = () => {
    timers.current.forEach((timer) => {
      clearTimeout(timer);
    });

    timers.current = [];

    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
  };

  useEffect(() => {
    skipped.current = false;

    let lineIndex = 0;
    let startTime = null;

    /*
     * Flatten the boot text into a single character timeline.
     *
     * Each character gets a position in the 6 second timeline.
     */
    const characterPositions = [];

    let totalCharacters = 0;

    BOOT_LINES.forEach((line) => {
      totalCharacters += line.length;
    });

    let currentCharacter = 0;

    BOOT_LINES.forEach((line, index) => {
      const positions = [];

      for (let i = 0; i < line.length; i++) {
        positions.push({
          character: i + 1,
          time:
            (currentCharacter / totalCharacters) *
            TOTAL_TYPING_TIME,
        });

        currentCharacter++;
      }

      characterPositions.push({
        lineIndex: index,
        text: line,
        positions,
      });
    });

    /*
     * Start with the first empty line.
     */
    setLines([""]);
    setTyping(true);

    const animate = (timestamp) => {
      if (skipped.current) {
        return;
      }

      if (!startTime) {
        startTime = timestamp;
      }

      /*
       * IMPORTANT:
       * We calculate progress from elapsed time.
       *
       * This makes the animation much more consistent
       * across different devices.
       */
      const elapsed = timestamp - startTime;

      const clampedTime = Math.min(
        elapsed,
        TOTAL_TYPING_TIME
      );

      /*
       * Determine which characters should currently
       * be visible.
       */
      let globalCharacters = Math.floor(
        (clampedTime / TOTAL_TYPING_TIME) *
          totalCharacters
      );

      globalCharacters = Math.min(
        globalCharacters,
        totalCharacters
      );

      const newLines = [];

      let remainingCharacters = globalCharacters;

      for (let i = 0; i < BOOT_LINES.length; i++) {
        const text = BOOT_LINES[i];

        if (remainingCharacters >= text.length) {
          newLines.push(text);
          remainingCharacters -= text.length;
        } else {
          newLines.push(
            text.slice(0, remainingCharacters)
          );

          break;
        }
      }

      /*
       * Keep already-completed lines visible.
       */
      while (newLines.length < BOOT_LINES.length) {
        newLines.push("");
      }

      setLines(newLines);

      /*
       * Progress is based on actual elapsed time,
       * not number of setTimeout calls.
       */
      setProgress(
        Math.round(
          (clampedTime / TOTAL_TYPING_TIME) * 100
        )
      );

      if (elapsed < TOTAL_TYPING_TIME) {
        animationFrame.current =
          requestAnimationFrame(animate);

        return;
      }

      /*
       * Typing is finished.
       */
      setLines(BOOT_LINES);
      setProgress(100);
      setTyping(false);

      /*
       * Now reveal the final state.
       */
      const cinematicTimer = setTimeout(() => {
        if (skipped.current) {
          return;
        }

        setCinematic(true);

        /*
         * Give SYSTEM READY a moment to breathe.
         */
        const fadeTimer = setTimeout(() => {
          if (skipped.current) {
            return;
          }

          setFading(true);

          /*
           * Cinematic 1.4 second fade.
           */
          const hideTimer = setTimeout(() => {
            if (skipped.current) {
              return;
            }

            setHidden(true);

            if (onDone) {
              onDone();
            }
          }, 1400);

          timers.current.push(hideTimer);
        }, 1000);

        timers.current.push(fadeTimer);
      }, LINE_PAUSES[LINE_PAUSES.length - 1]);

      timers.current.push(cinematicTimer);
    };

    animationFrame.current =
      requestAnimationFrame(animate);

    return () => {
      skipped.current = true;
      clearTimers();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const skip = () => {
    if (skipped.current) {
      return;
    }

    skipped.current = true;

    clearTimers();

    setLines(BOOT_LINES);
    setProgress(100);
    setTyping(false);
    setCinematic(true);

    /*
     * Short cinematic transition when skipped.
     */
    const fadeTimer = setTimeout(() => {
      setFading(true);

      const hideTimer = setTimeout(() => {
        setHidden(true);

        if (onDone) {
          onDone();
        }
      }, 500);

      timers.current.push(hideTimer);
    }, 100);

    timers.current.push(fadeTimer);
  };

  if (hidden) {
    return null;
  }

  const terminalClassName =
    "fixed inset-0 z-[200] bg-[#050505] flex flex-col px-4 sm:px-8 py-6 cursor-pointer overflow-hidden transition-all ease-out";

  const terminalStateClassName = fading
    ? "opacity-0 scale-[1.015] blur-[2px]"
    : "opacity-100 scale-100 blur-0";

  return (
    <div
      onClick={skip}
      className={[
        terminalClassName,
        terminalStateClassName,
      ].join(" ")}
      style={{
        transitionDuration: "1400ms",
      }}
    >
      {/* Ambient cinematic glow */}
      <div
        className={[
          "pointer-events-none absolute inset-0",
          "transition-opacity duration-1000",
          cinematic
            ? "opacity-100"
            : "opacity-0",
        ].join(" ")}
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.055), transparent 55%)",
        }}
      />

      {/* Header */}
      <div className="relative mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4">
        ABYSS.SYS — BOOT SEQUENCE
      </div>

      {/* Terminal */}
      <div className="relative flex-1 overflow-hidden mono text-[11px] sm:text-xs leading-relaxed text-white/70">
        {lines.map((line, index) => {
          const isCurrentLine =
            index === lines.length - 1;

          return (
            <div
              key={index}
              className={[
                "whitespace-pre-wrap",
                "transition-colors duration-300",
                isCurrentLine && cinematic
                  ? "text-white"
                  : "",
              ].join(" ")}
            >
              <span className="text-white/30">
                {">"}
              </span>{" "}
              {line}

              {/* Typing cursor */}
              {isCurrentLine &&
                typing &&
                !fading && (
                  <span
                    className="inline-block w-[7px] h-[15px] ml-[2px] bg-white/80 align-[-2px]"
                    style={{
                      animation:
                        "boot-cursor 0.65s steps(2, start) infinite",
                    }}
                  />
                )}

              {/* Idle cursor */}
              {isCurrentLine &&
                !typing &&
                !cinematic &&
                !fading && (
                  <span
                    className="inline-block w-[7px] h-[15px] ml-[2px] bg-white/70 align-[-2px]"
                    style={{
                      animation:
                        "boot-cursor 0.8s steps(2, start) infinite",
                    }}
                  />
                )}

              {/* Final cursor */}
              {isCurrentLine &&
                cinematic &&
                !fading && (
                  <span
                    className="inline-block w-[7px] h-[15px] ml-[2px] bg-white align-[-2px]"
                    style={{
                      animation:
                        "boot-cursor 0.5s steps(2, start) infinite",
                    }}
                  />
                )}
            </div>
          );
        })}
      </div>

      {/* Progress */}
      <div className="relative mt-4">
        <div className="flex items-center justify-between mono text-[10px] text-white/40 mb-2">
          <span>
            {cinematic
              ? "SYSTEM ONLINE"
              : "LOADING"}
          </span>

          <span className="tabular-nums">
            {progress}%
          </span>
        </div>

        <div className="h-1 w-full bg-white/10 overflow-hidden">
          <div
            className={[
              "h-full bg-white transition-all duration-300",
              cinematic
                ? "shadow-[0_0_14px_rgba(255,255,255,0.75)]"
                : "",
            ].join(" ")}
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <p className="mt-3 mono text-[10px] text-white/30">
          click to skip
        </p>
      </div>

      <style>{`
        @keyframes boot-cursor {
          0%,
          45% {
            opacity: 1;
          }

          46%,
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}