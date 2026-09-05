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

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const TARGET = "nddev.dpdns.org";
const API = "https://api.globalping.io/v1/measurements";

// Keep this list matching the "main" (non-detail) cities in
// src/lib/portfolioData.js's MAP_LOCATIONS. Detail-zoom cities are left as
// illustrative estimates — measuring 100+ cities on every run isn't
// realistic on the free tier.
const CITIES = [
  { key: "Brasov,Romania", magic: "Bucharest+Romania" }, // nearest probe to Brasov
  { key: "Berlin,Germany", magic: "Berlin+Germany" },
  { key: "London,United Kingdom", magic: "London+United Kingdom" },
  { key: "Paris,France", magic: "Paris+France" },
  { key: "Madrid,Spain", magic: "Madrid+Spain" },
  { key: "Stockholm,Sweden", magic: "Stockholm+Sweden" },
  { key: "Moscow,Russia", magic: "Moscow+Russia" },
  { key: "Cairo,Egypt", magic: "Cairo+Egypt" },
  { key: "Abu Dhabi,UAE", magic: "Dubai+United Arab Emirates" }, // nearest probe
  { key: "New Delhi,India", magic: "New Delhi+India" },
  { key: "Singapore,Singapore", magic: "Singapore" },
  { key: "Beijing,China", magic: "Beijing+China" },
  { key: "Tokyo,Japan", magic: "Tokyo+Japan" },
  { key: "Seoul,South Korea", magic: "Seoul+South Korea" },
  { key: "Canberra,Australia", magic: "Sydney+Australia" }, // nearest probe
  { key: "Washington DC,USA", magic: "Washington DC+United States" },
  { key: "Ottawa,Canada", magic: "Toronto+Canada" }, // nearest probe
  { key: "Brasilia,Brazil", magic: "Sao Paulo+Brazil" }, // nearest probe
  { key: "Buenos Aires,Argentina", magic: "Buenos Aires+Argentina" },
  { key: "Pretoria,South Africa", magic: "Johannesburg+South Africa" }, // nearest probe
];

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

async function measureCity({ key, magic }) {
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
    // failed/garbage measurement rather than reporting it as "measured".
    if (typeof avg === "number" && avg > 0 && Math.round(avg) > 0) {
      console.log(`✓ ${key}: ${Math.round(avg)}ms (probe: ${probeLocation})`);
      return { key, ms: Math.round(avg) };
    }
    console.warn(
      `  ${key}: rejected implausible/missing reading (avg=${avg}, probe=${probeLocation}). ` +
        `Raw result: ${JSON.stringify(probeResult?.result?.stats ?? probeResult)}`
    );
    return null;
  } catch (err) {
    console.warn(`  ${key}: failed (${err.message}), skipping`);
    return null;
  }
}

async function main() {
  console.log(`Measuring latency to ${TARGET} from ${CITIES.length} cities via Globalping...`);
  const results = {};

  // Run sequentially with a small delay to stay well within free-tier limits.
  for (const city of CITIES) {
    const r = await measureCity(city);
    if (r) results[r.key] = r.ms;
    await new Promise((res) => setTimeout(res, 500));
  }

  const output = {
    target: TARGET,
    generatedAt: new Date().toISOString(),
    source: "globalping.io",
    latencies: results,
  };

  const outPath = path.resolve("public/latency.json");
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(output, null, 2) + "\n");
  console.log(`Wrote ${Object.keys(results).length}/${CITIES.length} measurements to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
