import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MAP_LOCATIONS, MAP_LOCATIONS_DETAIL } from "@/lib/portfolioData";

// Response times shown here are distance-based estimates, not live pings.
// A real "ping the domain" measurement was tried and removed: this site is
// served via GitHub Pages, which sits behind a global CDN (Fastly), so a
// ping to the domain is answered by the nearest CDN edge almost everywhere
// on Earth — it never actually reaches the origin. That makes real
// geographic latency variance impossible to measure this way, no matter
// how the script is tuned. These numbers are a straightforward physical
// estimate instead: great-circle distance -> approximate fiber
// propagation delay. Always labeled as an estimate, never as "live".

const HOME = { lat: 45.6427, lon: 25.5887 }; // Brasov, Romania

function haversineKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function estimateMs(distanceKm) {
  const speedOfLightInFiberKmPerMs = 200;
  const routingOverheadFactor = 1.4;
  const fixedOverheadMs = 15;
  const rtt =
    ((distanceKm * 2) / speedOfLightInFiberKmPerMs) * routingOverheadFactor +
    fixedOverheadMs;
  return Math.max(5, Math.round(rtt));
}

function withEstimate(loc) {
  if (loc.home) return { ...loc, ms: 4 };
  const distanceKm = haversineKm(HOME, { lat: loc.coords[0], lon: loc.coords[1] });
  return { ...loc, ms: estimateMs(distanceKm) };
}

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

export function WorldMap() {
  const [zoom, setZoom] = useState(2);

  const locations = useMemo(
    () => ({
      main: MAP_LOCATIONS.map(withEstimate),
      detail: MAP_LOCATIONS_DETAIL.map(withEstimate),
    }),
    []
  );

  const [selected, setSelected] = useState(null);
  const activeSelected =
    selected || locations.main.find((l) => l.home) || locations.main[0];

  const showDetail = zoom >= 3;

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
              url="https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
              attribution='Tiles &copy; Esri — Esri, HERE, Garmin, &copy; OpenStreetMap contributors'
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
                    <p className="mt-1 text-white/50">{loc.ms} ms · estimated</p>
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
                      <p className="mt-1 text-white/50">{loc.ms} ms · estimated</p>
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
          <span className="mono text-[10px] uppercase tracking-[0.2em] text-white/50">
            ESTIMATED
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
            Estimated Response Time
          </p>

          {activeSelected?.home && (
            <p className="mt-6 mono text-[10px] uppercase tracking-[0.15em] text-white/50 border-l-2 border-white/40 pl-3">
              Origin node — robot control server hosted in {activeSelected.city}.
            </p>
          )}
        </div>

        <p className="mt-6 pt-4 border-t hairline mono text-[10px] text-white/30">
          Estimated from great-circle distance, not a live ping.
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
