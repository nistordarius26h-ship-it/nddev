import { useEffect, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

export function SensorFeed() {
  const [data, setData] = useState({
    battery: 87,
    lat: 45.6427,
    lon: 25.5887,
    temp: 36.4,
    uptime: 0,
  });
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = setInterval(() => {
      setData((d) => {
        const drift = (Math.random() - 0.5) * 0.0003;
        const tempJitter = (Math.random() - 0.5) * 0.4;
        const drain = reduce ? 0 : Math.random() * 0.015;
        return {
          battery: +Math.max(0, d.battery - drain).toFixed(2),
          lat: +(d.lat + drift).toFixed(6),
          lon: +(d.lon + drift).toFixed(6),
          temp: +(d.temp + tempJitter).toFixed(1),
          uptime: d.uptime + 1,
        };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-40 hidden sm:block select-none">
      {/* Collapsed button — vibrates to catch attention */}
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 border hairline bg-[#050505]/90 backdrop-blur-sm px-3 py-2 mono text-[10px] uppercase tracking-[0.2em] text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          style={{ animation: "hud-vibrate 3s ease-in-out infinite" }}
          aria-label="Show robot telemetry"
        >
          <span
            className="h-1.5 w-1.5 rounded-full bg-white shrink-0"
            style={{ animation: "pulse-pip 1.5s ease-in-out infinite" }}
          />
          ROBOT HUD
          <ChevronUp size={12} />
        </button>
      )}

      {/* Expanded panel */}
      {expanded && (
        <div className="border hairline bg-[#050505]/90 backdrop-blur-sm w-60 mono text-[10px] text-white/70">
          <div className="flex items-center justify-between px-3 py-2 border-b hairline">
            <span className="flex items-center gap-1.5 uppercase tracking-[0.2em] text-white/50">
              <span
                className="h-1.5 w-1.5 rounded-full bg-white shrink-0"
                style={{ animation: "pulse-pip 1.5s ease-in-out infinite" }}
              />
              [ROBOT TELEMETRY]
            </span>
            <button
              onClick={() => setExpanded(false)}
              className="text-white/40 hover:text-white transition-colors"
              aria-label="Minimize HUD"
            >
              <ChevronDown size={14} />
            </button>
          </div>
          <div className="p-3 space-y-0.5">
            <Row label="BATT" value={data.battery.toFixed(1) + "%"} bar={data.battery} />
            <Row label="TEMP" value={data.temp.toFixed(1) + "°C"} />
            <Row label="GPS" value={`${data.lat.toFixed(4)}, ${data.lon.toFixed(4)}`} />
            <Row label="UPTIME" value={data.uptime + "s"} />
          </div>
        </div>
      )}

      <style>{`
        @keyframes hud-vibrate {
          0%, 90%, 100% { transform: translateX(0); }
          91%, 93%, 95%, 97%, 99% { transform: translateX(-2px); }
          92%, 94%, 96%, 98% { transform: translateX(2px); }
        }
      `}</style>
    </div>
  );
}

function Row({ label, value, bar }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="text-white/40 w-12 shrink-0">{label}</span>
      <span className="flex-1 tabular-nums text-white/80 truncate">{value}</span>
      {bar !== undefined && (
        <span className="w-12 h-1 bg-white/10 block shrink-0">
          <span
            className="block h-full bg-white transition-all duration-500"
            style={{ width: bar + "%" }}
          />
        </span>
      )}
    </div>
  );
}