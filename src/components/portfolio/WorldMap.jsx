import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MAP_LOCATIONS, MAP_LOCATIONS_DETAIL } from "@/lib/portfolioData";

const pinIcon = (home, detail) =>
  L.divIcon({
    className: "",
    html: `<div class="abyss-pin${home ? " abyss-pin-home" : ""}${
      detail ? " abyss-pin-detail" : ""
    }"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

function ZoomTracker({ onZoom }) {
  const map = useMapEvents({
    zoomend: () => onZoom(map.getZoom()),
  });
  useEffect(() => {
    onZoom(map.getZoom());
  }, [map, onZoom]);
  return null;
}

function timeAgo(isoString) {
  if (!isoString) return null;
  const diffMs = Date.now() - new Date(isoString).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 48) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function WorldMap() {
  const [zoom, setZoom] = useState(2);
  const [liveData, setLiveData] = useState(null); // { generatedAt, latencies: { "City,Country": ms } }
  const [liveStatus, setLiveStatus] = useState("loading"); // loading | live | unavailable

  useEffect(() => {
    let cancelled = false;
    fetch("/latency.json", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("no latency.json");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setLiveData(data);
        setLiveStatus("live");
      })
      .catch(() => {
        if (!cancelled) setLiveStatus("unavailable");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Merge real measurements over the static fallback numbers.
  const locations = useMemo(() => {
    const merge = (loc) => {
      const key = `${loc.city},${loc.country}`;
      const liveMs = liveData?.latencies?.[key];
      return typeof liveMs === "number"
        ? { ...loc, ms: liveMs, isLive: true }
        : { ...loc, isLive: false };
    };
    return {
      main: MAP_LOCATIONS.map(merge),
      detail: MAP_LOCATIONS_DETAIL.map(merge),
    };
  }, [liveData]);

  const [selected, setSelected] = useState(null);
  const activeSelected =
    selected || locations.main.find((l) => l.home) || locations.main[0];

  const showDetail = zoom >= 3;
  const lastUpdated = timeAgo(liveData?.generatedAt);

  return (
    <div className="grid lg:grid-cols-12 gap-px bg-white/10 border hairline">
      {/* Map */}
      <div className="lg:col-span-8 bg-[#050505]">
        <div className="h-[360px] sm:h-[440px] lg:h-[520px] w-full">
          <MapContainer
            center={[30, 15]}
            zoom={2}
            minZoom={2}
            scrollWheelZoom={false}
            worldCopyJump
            className="h-full w-full abyss-map"
          >
            <ZoomTracker onZoom={setZoom} />
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; OpenStreetMap &copy; CARTO'
            />
            {locations.main.map((loc) => (
              <Marker
                key={loc.country}
                position={loc.coords}
                icon={pinIcon(loc.home, false)}
                eventHandlers={{ click: () => setSelected(loc) }}
              >
                <Popup className="abyss-popup">
                  <div className="mono text-[11px] text-white">
                    <p className="uppercase tracking-widest text-white/80">
                      {loc.city}, {loc.country}
                    </p>
                    <p className="mt-1 text-white/50">
                      {loc.ms} ms {loc.isLive ? "· measured" : "· estimated"}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
            {showDetail &&
              locations.detail.map((loc) => (
                <Marker
                  key={loc.country}
                  position={loc.coords}
                  icon={pinIcon(false, true)}
                  eventHandlers={{ click: () => setSelected(loc) }}
                >
                  <Popup className="abyss-popup">
                    <div className="mono text-[11px] text-white">
                      <p className="uppercase tracking-widest text-white/80">
                        {loc.city}, {loc.country}
                      </p>
                      <p className="mt-1 text-white/50">
                        {loc.ms} ms {loc.isLive ? "· measured" : "· estimated"}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>
      </div>

      {/* Info panel */}
      <div className="lg:col-span-4 bg-[#050505] p-6 sm:p-8 flex flex-col">
        <div className="flex items-center justify-between mb-6 pb-4 border-b hairline">
          <span className="mono text-[10px] uppercase tracking-[0.2em] text-white/50">
            [LATENCY MONITOR]
          </span>
          <span className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full bg-white"
              style={{
                animation:
                  liveStatus === "live" ? "pulse-pip 2s ease-in-out infinite" : "none",
                opacity: liveStatus === "live" ? 1 : 0.4,
              }}
            />
            <span className="mono text-[10px] uppercase tracking-[0.2em] text-white/50">
              {liveStatus === "live" ? "LIVE" : liveStatus === "loading" ? "..." : "ESTIMATED"}
            </span>
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <p className="mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            {activeSelected?.home ? "HOME SERVER" : "EDGE NODE"}
          </p>
          <p className="mt-2 font-heading font-bold text-white text-2xl sm:text-3xl tracking-tight">
            {activeSelected?.city}
          </p>
          <p className="mono text-xs uppercase tracking-[0.15em] text-white/50 mt-1">
            {activeSelected?.country}
          </p>

          <div className="mt-8 flex items-baseline gap-2">
            <span className="font-heading font-bold text-white text-5xl sm:text-6xl tabular-nums">
              {activeSelected?.ms}
            </span>
            <span className="mono text-sm text-white/50">ms</span>
          </div>
          <p className="mono text-[10px] uppercase tracking-[0.2em] text-white/40 mt-2">
            {activeSelected?.isLive ? "Measured Response Time" : "Estimated Response Time"}
          </p>

          {activeSelected?.home && (
            <p className="mt-6 mono text-[10px] uppercase tracking-[0.15em] text-white/50 border-l-2 border-white/40 pl-3">
              Origin node — robot control server hosted in {activeSelected.city}.
            </p>
          )}
        </div>

        <p className="mt-6 pt-4 border-t hairline mono text-[10px] text-white/30">
          {liveStatus === "live" && lastUpdated
            ? `Real measurements via Globalping · updated ${lastUpdated}.`
            : liveStatus === "unavailable"
            ? "Live data unavailable — showing estimated values."
            : "Loading latency data..."}
        </p>
        <p className="mt-1 mono text-[10px] text-white/30">
          {showDetail
            ? `Zoomed in — ${locations.main.length + locations.detail.length} nodes visible.`
            : `Click any pin to inspect latency. Zoom in to reveal more nodes.`}
        </p>
      </div>
    </div>
  );
}
