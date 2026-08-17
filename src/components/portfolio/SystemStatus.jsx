export function SystemStatus({ time }) {
  return (
    <div className="hidden md:flex items-center gap-4 lg:gap-6">
      <span className="mono text-[10px] lg:text-xs text-white/50 tracking-wider tabular-nums">
        {time}
      </span>
      <span className="h-4 w-px bg-white/15" />
      <span className="flex items-center gap-2">
        <span
          className="h-1.5 w-1.5 rounded-full bg-white"
          style={{ animation: "pulse-pip 2s ease-in-out infinite" }}
        />
        <span className="mono text-[10px] lg:text-xs uppercase tracking-[0.2em] text-white/70">
          READY
        </span>
      </span>
    </div>
  );
}