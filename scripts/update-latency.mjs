// scripts/update-latency.mjs
//
// Fetches REAL latency measurements from Globalping (https://globalping.io) —
// a free, open-source network of real probes distributed worldwide — and
// writes the results to public/latency.json.
//
// This is meant to run on a schedule via GitHub Actions (see
// .github/workflows/update-latency.yml), NOT on every page load: browsers
// can't do raw pings, and hammering the free API from every visitor would
// blow through rate limits. Instead we measure periodically and serve a
// static snapshot — still real data, just not live-per-visitor.
//
// If a real measurement fails or comes back implausible (e.g. rounds to
// 0ms between two different countries, which isn't physically possible),
// we fall back to a distance-based estimate computed from real
// coordinates (great-circle distance -> approximate fiber propagation
// delay), and mark it `measured: false` so the site can honestly label it
// "estimated" instead of claiming it's a real ping.

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const TARGET = "nddev.dpdns.org";
const API = "https://api.globalping.io/v1/measurements";

// Home = Brasov, Romania (nearest probe used for measurement is Bucharest).
const HOME = { lat: 45.6427, lon: 25.5887 };

// Keep this list matching the "main" (non-detail) cities in
// src/lib/portfolioData.js's MAP_LOCATIONS.
const CITIES = [
  { key: "Brasov,Romania", magic: "Bucharest+Romania", lat: 45.6427, lon: 25.5887 },
  { key: "Berlin,Germany", magic: "Berlin+Germany", lat: 52.52, lon: 13.405 },
  { key: "London,United Kingdom", magic: "London+United Kingdom", lat: 51.5074, lon: -0.1278 },
  { key: "Paris,France", magic: "Paris+France", lat: 48.8566, lon: 2.3522 },
  { key: "Madrid,Spain", magic: "Madrid+Spain", lat: 40.4168, lon: -3.7038 },
  { key: "Stockholm,Sweden", magic: "Stockholm+Sweden", lat: 59.3293, lon: 18.0686 },
  { key: "Moscow,Russia", magic: "Moscow+Russia", lat: 55.7558, lon: 37.6173 },
  { key: "Cairo,Egypt", magic: "Cairo+Egypt", lat: 30.0444, lon: 31.2357 },
  { key: "Abu Dhabi,UAE", magic: "Dubai+United Arab Emirates", lat: 24.4539, lon: 54.3773 },
  { key: "New Delhi,India", magic: "New Delhi+India", lat: 28.6139, lon: 77.209 },
  { key: "Singapore,Singapore", magic: "Singapore", lat: 1.3521, lon: 103.8198 },
  { key: "Beijing,China", magic: "Beijing+China", lat: 39.9042, lon: 116.4074 },
  { key: "Tokyo,Japan", magic: "Tokyo+Japan", lat: 35.6762, lon: 139.6503 },
  { key: "Seoul,South Korea", magic: "Seoul+South Korea", lat: 37.5665, lon: 126.978 },
  { key: "Canberra,Australia", magic: "Sydney+Australia", lat: -35.2809, lon: 149.13 },
  { key: "Washington DC,USA", magic: "Washington DC+United States", lat: 38.9072, lon: -77.0369 },
  { key: "Ottawa,Canada", magic: "Toronto+Canada", lat: 45.4215, lon: -75.6972 },
  { key: "Brasilia,Brazil", magic: "Sao Paulo+Brazil", lat: -15.7975, lon: -47.8919 },
  { key: "Buenos Aires,Argentina", magic: "Buenos Aires+Argentina", lat: -34.6037, lon: -58.3816 },
  { key: "Pretoria,South Africa", magic: "Johannesburg+South Africa", lat: -25.7479, lon: 28.2293 },
];

// --- Distance-based fallback estimate ---

function haversineKm(a, b) {
  const R = 6371; // Earth radius, km
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Real fiber routes aren't straight lines and add routing/processing
// overhead, so this isn't precise — but it's a physically grounded
// approximation, not an arbitrary placeholder number.
function estimateLatencyMs(distanceKm) {
  const speedOfLightInFiberKmPerMs = 200; // ~2/3 c
  const routingOverheadFactor = 1.4;
  const fixedOverheadMs = 15;
  const rtt =
    ((distanceKm * 2) / speedOfLightInFiberKmPerMs) * routingOverheadFactor +
    fixedOverheadMs;
  return Math.max(5, Math.round(rtt));
}

async function createMeasurement(magic) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "ping",
      target: TARGET,
      locations: [{ magic, limit: 1 }],
      measurementOptions: { packets: 4 },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Create measurement failed (${res.status}): ${body}`);
  }
  const data = await res.json();
  return data.id;
}

async function pollMeasurement(id, { timeoutMs = 20000, intervalMs = 1500 } = {}) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const res = await fetch(`${API}/${id}`);
    if (!res.ok) throw new Error(`Poll failed (${res.status})`);
    const data = await res.json();
    if (data.status === "finished") return data;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error(`Measurement ${id} timed out`);
}

async function measureCity(city) {
  const { key, magic } = city;
  const distanceKm = haversineKm(HOME, city);
  const fallback = { key, ms: estimateLatencyMs(distanceKm), measured: false };

  try {
    const id = await createMeasurement(magic);
    const result = await pollMeasurement(id);
    const probeResult = result.results?.[0];
    const avg = probeResult?.result?.stats?.avg;
    const probeLocation = probeResult?.probe?.city
      ? `${probeResult.probe.city}, ${probeResult.probe.country}`
      : "unknown probe location";

    // A rounded 0ms reading between two different countries is not
    // physically plausible over real internet routing — treat it as a
    // failed measurement and use the distance-based estimate instead.
    if (typeof avg === "number" && avg > 0 && Math.round(avg) > 0) {
      console.log(`✓ ${key}: ${Math.round(avg)}ms measured (probe: ${probeLocation})`);
      return { key, ms: Math.round(avg), measured: true };
    }

    console.warn(
      `  ${key}: rejected implausible/missing reading (avg=${avg}, probe=${probeLocation}). ` +
        `Falling back to ~${fallback.ms}ms estimate. Raw stats: ` +
        JSON.stringify(probeResult?.result?.stats ?? probeResult)
    );
    return fallback;
  } catch (err) {
    console.warn(`  ${key}: failed (${err.message}). Falling back to ~${fallback.ms}ms estimate.`);
    return fallback;
  }
}

async function main() {
  console.log(`Measuring latency to ${TARGET} from ${CITIES.length} cities via Globalping...`);
  const results = {};

  for (const city of CITIES) {
    const r = await measureCity(city);
    results[r.key] = { ms: r.ms, measured: r.measured };
    await new Promise((res) => setTimeout(res, 500));
  }

  // Sanity check: Brasov is the closest probe to home by definition, so
  // nothing else should ever measure a lower latency. If it does, that
  // measurement is wrong (routing weirdness, a bad probe, etc.) — replace
  // it with the distance-based estimate rather than reporting a number
  // that's provably impossible.
  const home = results["Brasov,Romania"];
  if (home?.measured) {
    for (const city of CITIES) {
      if (city.key === "Brasov,Romania") continue;
      const r = results[city.key];
      if (r.measured && r.ms <= home.ms) {
        const distanceKm = haversineKm(HOME, city);
        const estimate = estimateLatencyMs(distanceKm);
        console.warn(
          `  ${city.key}: rejected — measured ${r.ms}ms is not lower than ` +
            `Brasov's own ${home.ms}ms, which isn't physically possible. ` +
            `Falling back to ~${estimate}ms estimate.`
        );
        results[city.key] = { ms: estimate, measured: false };
      }
    }
  }

  const output = {
    target: TARGET,
    generatedAt: new Date().toISOString(),
    source: "globalping.io + distance-based estimate fallback",
    latencies: results,
  };

  const outPath = path.resolve("public/latency.json");
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(output, null, 2) + "\n");
  const measuredCount = Object.values(results).filter((r) => r.measured).length;
  console.log(`Wrote ${CITIES.length} cities to ${outPath} (${measuredCount} real, ${CITIES.length - measuredCount} estimated)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
