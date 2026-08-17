export function Heartbeat() {
  const bars = [0, 1, 2, 3, 4, 5, 6];
  return (
    <div className="flex items-end gap-[2px] h-4" aria-hidden="true">
      {bars.map((i) => (
        <span
          key={i}
          className="w-[2px] bg-white origin-bottom"
          style={{
            height: "100%",
            animation: `heartbeat ${0.8 + (i % 3) * 0.15}s ease-in-out ${i * 0.08}s infinite`,
          }}
        />
      ))}
    </div>
  );
}