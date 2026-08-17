import { Image } from "@/components/ui/image";
import { WorldMap } from "./WorldMap";

const GITHUB_URL = "https://github.com/nistordarius26h-ship-it";

function SignalMeter({ level, max = 5 }) {
  return (
    <div className="mt-4 flex items-center gap-2">
      <span className="mono text-[10px] uppercase tracking-[0.2em] text-white/40">
        RATING
      </span>
      <span className="flex items-end gap-1">
        {Array.from({ length: max }).map((_, i) =>
        <span
          key={i}
          className="w-1.5 bg-white"
          style={{
            height: 6 + i * 3,
            opacity: i < level ? 1 : 0.18
          }} />

        )}
      </span>
      <span className="mono text-[10px] text-white/40 tabular-nums">
        {level}/{max}
      </span>
    </div>);

}

export function Portfolio() {
  return (
    <section id="assets" className="relative bg-transparent border-t hairline scroll-mt-16">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 py-20 lg:py-28">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-10">
          <span className="mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            [03]
          </span>
          <span className="h-px flex-1 bg-white/10" />
          <span className="mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            PORTFOLIO — ASSETS
          </span>
        </div>

        <h2 className="block font-heading font-bold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight">
          Work
        </h2>
        <p className="block mt-4 max-w-xl text-sm sm:text-base text-white/50 leading-relaxed">A focused index of systems I've designed and built - take a look

        </p>

        {/* Featured main project — global AI robot latency map */}
        <div className="mt-14">
          <div className="flex items-center gap-3 mb-6">
            <span className="mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              [FEATURED]
            </span>
            <span className="h-px flex-1 bg-white/10" />
            <span className="mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              MAIN PROJECT
            </span>
          </div>
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-4">
              <h3 className="block font-heading font-bold text-white text-2xl sm:text-3xl tracking-tight leading-tight">
                Global AI Robot — Remote Control Mesh
              </h3>
              <p className="block mt-4 text-sm text-white/50 leading-relaxed">
                A globally accessible AI robot you can control from anywhere.
                The home server lives in Brasov (50ms); edge nodes relay commands
                worldwide. Click any pin to inspect regional latency.
              </p>
              <a
                href="#gaairobot"
                className="mt-6 inline-flex items-center gap-2 bg-white text-[#050505] mono text-xs uppercase tracking-[0.2em] font-medium px-5 py-3 hover:bg-white/90 transition-colors">
                
                Explore GAAI Robot
                <span>→</span>
              </a>
              <div className="mt-6 flex items-center gap-4 border-t hairline pt-4">
                <span className="flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-white"
                    style={{ animation: "pulse-pip 2s ease-in-out infinite" }} />
                  
                  <span className="mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                    ONLINE
                  </span>
                </span>
                <span className="mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                  20 NODES
                </span>
              </div>
            </div>
            <div className="lg:col-span-8">
              <WorldMap />
            </div>
          </div>
        </div>

        {/* GitHub projects */}
        <div className="mt-20">
          <div className="flex items-center gap-3 mb-6">
            <span className="mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              [GITHUB]
            </span>
            <span className="h-px flex-1 bg-white/10" />
            <span className="mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              MAIN PROJECTS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border hairline">
            {/* GAAI Robot */}
            <article id="gaairobot" className="group relative bg-[#050505] flex flex-col scroll-mt-24">
              <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.02]">
                <Image
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80"
                  fittingType="fit"
                  className="block w-full h-full object-contain"
                  alt="GAAI Robot" />
                
                <span className="pointer-events-none absolute top-3 right-3 mono text-[10px] text-white/60 tabular-nums bg-[#050505]/70 px-2 py-1">
                  #gaairobot
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="block font-heading font-semibold text-white text-lg sm:text-xl tracking-tight">
                  GAAI Robot
                </h3>
                <p className="block mt-3 flex-1 text-sm text-white/50 leading-relaxed">
                  Globally accessible AI robot you can control from anywhere.
                  Home server in Brasov, edge nodes worldwide.
                </p>
                <SignalMeter level={5} />
                <a
                  href={`${GITHUB_URL}/gaairobot`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/70 hover:text-white border-b hairline pb-1 w-fit transition-colors group-hover:border-white">
                  
                  View on GitHub
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </a>
              </div>
            </article>

            {/* AI Stall Prediction System */}
            <article id="aistallpredictionsystem" className="group relative bg-[#050505] flex flex-col scroll-mt-24">
              <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.02]">
                <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
                  fittingType="fit"
                  className="block w-full h-full object-contain"
                  alt="AI Stall Prediction System" />
                
                <span className="pointer-events-none absolute top-3 right-3 mono text-[10px] text-white/60 tabular-nums bg-[#050505]/70 px-2 py-1">
                  #aistallpredictionsystem
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="block font-heading font-semibold text-white text-lg sm:text-xl tracking-tight">
                  AI Stall Prediction System
                </h3>
                <p className="block mt-3 flex-1 text-sm text-white/50 leading-relaxed">
                  Predictive analytics system forecasting stall conditions from
                  real-time sensor and telemetry data.
                </p>
                <SignalMeter level={4} />
                <a
                  href={`${GITHUB_URL}/aistallpredictionsystem`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/70 hover:text-white border-b hairline pb-1 w-fit transition-colors group-hover:border-white">
                  
                  View on GitHub
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </a>
              </div>
            </article>

            {/* ESP32 JAMM */}
            <article id="esp32jamm" className="group relative bg-[#050505] flex flex-col scroll-mt-24">
              <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.02]">
                <Image
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80"
                  fittingType="fit"
                  className="block w-full h-full object-contain"
                  alt="ESP32 JAMM" />
                
                <span className="pointer-events-none absolute top-3 right-3 mono text-[10px] text-white/60 tabular-nums bg-[#050505]/70 px-2 py-1">
                  #esp32jamm
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="block font-heading font-semibold text-white text-lg sm:text-xl tracking-tight">
                  ESP32 JAMM
                </h3>
                <p className="block mt-3 flex-1 text-sm text-white/50 leading-relaxed">
                  ESP32-based research and signal tooling for controlled RF
                  testing.
                </p>
                <SignalMeter level={3} />
                <a
                  href={`${GITHUB_URL}/esp32jamm`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/70 hover:text-white border-b hairline pb-1 w-fit transition-colors group-hover:border-white">
                  
                  View on GitHub
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </a>
              </div>
            </article>
          </div>

          {/* See more on GitHub */}
          <div className="mt-8 flex justify-center">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border hairline text-white mono text-xs uppercase tracking-[0.2em] font-medium px-6 py-4 hover:bg-white hover:text-[#050505] transition-colors">
              
              See more on GitHub
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>);

}