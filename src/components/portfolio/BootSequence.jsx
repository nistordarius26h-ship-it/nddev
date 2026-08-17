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

// Time to wait after each line finishes typing.
const LINE_DELAYS = [
  900,
  750,
  650,
  750,
  900,
  1250,
  1600,
  1100,
  800,
  800,
  1400,
  1550,
  2000,
  1750,
  1200,
  2200,
];

export function BootSequence({ onDone }) {
  const [lines, setLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);
  const [cinematic, setCinematic] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [typing, setTyping] = useState(false);

  const timers = useRef([]);
  const typingTimer = useRef(null);
  const skipped = useRef(false);

  const clearTimers = () => {
    timers.current.forEach((timer) => {
      clearTimeout(timer);
    });

    timers.current = [];

    if (typingTimer.current) {
      clearTimeout(typingTimer.current);
      typingTimer.current = null;
    }
  };

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Natural character-by-character typing speed.
    const getCharacterDelay = (character) => {
      if (reduceMotion) {
        return 8;
      }

      // Base typing speed with natural variation.
      let delay = 34 + Math.random() * 35;

      // Spaces create a small human-like pause.
      if (character === " ") {
        delay += 35 + Math.random() * 45;
      }

      // Punctuation creates a longer pause.
      if ([".", ",", ":", ";", "!"].includes(character)) {
        delay += 90 + Math.random() * 100;
      }

      // Slight variation around numbers.
      if (/[0-9]/.test(character)) {
        delay += Math.random() * 20;
      }

      return Math.max(18, delay);
    };

    const typeLine = (lineIndex) => {
      if (
        skipped.current ||
        lineIndex >= BOOT_LINES.length
      ) {
        return;
      }

      const text = BOOT_LINES[lineIndex];

      let characterIndex = 0;

      // Add an empty line before typing starts.
      setLines((currentLines) => [
        ...currentLines,
        "",
      ]);

      setTyping(true);

      // Short pause before the first character.
      typingTimer.current = setTimeout(() => {
        const typeCharacter = () => {
          if (skipped.current) {
            return;
          }

          if (characterIndex < text.length) {
            const character = text[characterIndex];

            characterIndex += 1;

            setLines((currentLines) => {
              const updatedLines = [...currentLines];

              updatedLines[updatedLines.length - 1] =
                text.slice(0, characterIndex);

              return updatedLines;
            });

            const delay = getCharacterDelay(character);

            typingTimer.current = setTimeout(
              typeCharacter,
              delay
            );

            return;
          }

          // Finished typing this line.
          setTyping(false);

          const lineDelay =
            LINE_DELAYS[lineIndex] || 900;

          const nextTimer = setTimeout(() => {
            if (skipped.current) {
              return;
            }

            const nextIndex = lineIndex + 1;

            setProgress(
              Math.round(
                (nextIndex / BOOT_LINES.length) * 100
              )
            );

            if (nextIndex < BOOT_LINES.length) {
              typeLine(nextIndex);
              return;
            }

            /*
             * All lines are finished.
             * Pause before the cinematic reveal.
             */
            const cinematicTimer = setTimeout(() => {
              if (skipped.current) {
                return;
              }

              setCinematic(true);

              const fadeTimer = setTimeout(() => {
                if (skipped.current) {
                  return;
                }

                setFading(true);

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
              }, 1100);

              timers.current.push(fadeTimer);
            }, 400);

            timers.current.push(cinematicTimer);
          }, lineDelay);

          timers.current.push(nextTimer);
        };

        typeCharacter();
      }, 120);
    };

    typeLine(0);

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

    setTyping(false);
    setLines(BOOT_LINES);
    setProgress(100);
    setCinematic(true);

    // Keep a small transition even when skipped.
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

  /*
   * Keep the static Tailwind classes separate.
   * This avoids the JSX/template-literal syntax error
   * that caused the GitHub Actions build to fail.
   */
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
      {/* Cinematic ambient glow */}
      <div
        className={[
          "pointer-events-none absolute inset-0",
          "transition-opacity duration-1000",
          cinematic ? "opacity-100" : "opacity-0",
        ].join(" ")}
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.055), transparent 55%)",
        }}
      />

      {/* Terminal header */}
      <div className="relative mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4">
        ABYSS.SYS — BOOT SEQUENCE
      </div>

      {/* Terminal output */}
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

              {/* Blinking cursor while typing */}
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

              {/* Cursor after line has finished */}
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

              {/* Bright cursor during final reveal */}
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

      {/* Progress bar */}
      <div className="relative mt-4">
        <div className="flex items-center justify-between mono text-[10px] text-white/40 mb-2">
          <span>
            {cinematic ? "SYSTEM ONLINE" : "LOADING"}
          </span>

          <span className="tabular-nums">
            {progress}%
          </span>
        </div>

        <div className="h-1 w-full bg-white/10 overflow-hidden">
          <div
            className={[
              "h-full bg-white transition-all duration-700",
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

      {/* Blinking terminal cursor animation */}
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