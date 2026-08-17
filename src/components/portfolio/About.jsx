export function About() {
  return (
    <section id="logs" className="relative bg-transparent border-t hairline scroll-mt-16">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 py-20 lg:py-28">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-12">
          <span className="mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            [02]
          </span>
          <span className="h-px flex-1 bg-white/10" />
          <span className="mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            ABOUT — PROFILE
          </span>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Bio */}
          <div className="lg:col-span-8 lg:col-start-3">
            <h2 className="block font-heading font-bold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
              The !=visible Engine
            </h2>

            <p className="block max-w-2xl leading-relaxed mt-6 text-base sm:text-lg text-white/60">
              I'm an AI and robotics engineer who lives in the space between data
              and cognition. My main focus is robotics, AI, electronics, and
              design — building intelligent systems that sense, think, and move.
            </p>
            <p className="block max-w-2xl leading-relaxed mt-4 text-sm sm:text-base text-white/40">
              I design intelligent systems, ship predictive pipelines, and treat
              every model as a living instrument. I build for durability, document
              like a paranoid, and optimize every process I touch.
            </p>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-6 border-t hairline pt-8">
              <div>
                <p className="mono text-[10px] uppercase tracking-[0.2em] text-white/40">[01]</p>
                <p className="mt-2 font-heading font-bold text-white text-3xl sm:text-4xl lg:text-5xl tabular-nums">9</p>
                <p className="mt-1 mono text-[10px] sm:text-xs uppercase tracking-[0.15em] text-white/50">Projects Completed</p>
              </div>
              <div>
                <p className="mono text-[10px] uppercase tracking-[0.2em] text-white/40">[02]</p>
                <p className="mt-2 font-heading font-bold text-white text-3xl sm:text-4xl lg:text-5xl tabular-nums">47</p>
                <p className="mt-1 mono text-[10px] sm:text-xs uppercase tracking-[0.15em] text-white/50">Certificates</p>
              </div>
              <div>
                <p className="mono text-[10px] uppercase tracking-[0.2em] text-white/40">[03]</p>
                <p className="mt-2 font-heading font-bold text-white text-3xl sm:text-4xl lg:text-5xl tabular-nums">90</p>
                <p className="mt-1 mono text-[10px] sm:text-xs uppercase tracking-[0.15em] text-white/50">Skills</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}