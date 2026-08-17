import { useEffect, useRef } from "react";

export function CircuitBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf;
    let w = 0, h = 0, dpr = 1;
    let points = [];
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const spacing = 64;
      points = [];
      for (let y = spacing / 2; y < h; y += spacing) {
        for (let x = spacing / 2; x < w; x += spacing) {
          points.push({
            x: x + (Math.random() - 0.5) * 10,
            y: y + (Math.random() - 0.5) * 10,
            ox: x,
            oy: y,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);

    const linkDist = 110;
    const mouseDist = 190;
    let t = 0;

    const draw = () => {
      t += 0.01;
      ctx.clearRect(0, 0, w, h);

      // dots + drift
      const near = [];
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (!reduce) {
          p.x = p.ox + Math.cos(t + p.phase) * 3;
          p.y = p.oy + Math.sin(t + p.phase) * 3;
        }
        const dxm = p.x - mouse.x;
        const dym = p.y - mouse.y;
        const dm = Math.hypot(dxm, dym);
        let alpha = 0.07;
        if (dm < mouseDist) {
          alpha = 0.12 + 0.45 * (1 - dm / mouseDist);
          near.push(p);
        }
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
      }

      // links from near-mouse points to mouse + neighbors
      ctx.lineWidth = 0.5;
      for (let i = 0; i < near.length; i++) {
        const p = near[i];
        const dxm = p.x - mouse.x;
        const dym = p.y - mouse.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < mouseDist) {
          ctx.strokeStyle = `rgba(255,255,255,${0.28 * (1 - dm / mouseDist)})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
        for (let j = i + 1; j < near.length; j++) {
          const q = near[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < linkDist) {
            ctx.strokeStyle = `rgba(255,255,255,${0.18 * (1 - d / linkDist)})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      aria-hidden="true"
    />
  );
}