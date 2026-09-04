import { useEffect, useRef } from 'react';

type Star = { x: number; y: number; r: number; baseAlpha: number; twPhase: number; speed: number; gold: boolean };
type Particle = { x: number; y: number; vx: number; vy: number; r: number; life: number; max: number };
type Shooter = { x: number; y: number; vx: number; vy: number; life: number; len: number };

/**
 * Twinkling starfield + slow drifting "dust" motes + occasional shooting star.
 * GPU-light, rAF loop, pauses when tab hidden.
 */
export default function Starfield({ density = 110 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let stars: Star[] = [];
    let particles: Particle[] = [];
    let shooter: Shooter | null = null;
    let nextShooter = 4000 + Math.random() * 6000;
    let w = 0, h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let last = performance.now();

    const build = () => {
      w = window.innerWidth; h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((density * Math.min(w, 900)) / 900);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.5 + 0.3,
        baseAlpha: Math.random() * 0.5 + 0.15,
        twPhase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.6 + 0.3,
        gold: Math.random() < 0.16,
      }));
      const pCount = Math.round(count * 0.25);
      particles = Array.from({ length: pCount }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -Math.random() * 0.12 - 0.04,
        r: Math.random() * 1.6 + 0.5,
        life: 0, max: 6000 + Math.random() * 6000,
      }));
    };

    let t = 0;
    const draw = (now: number) => {
      const dt = Math.min(50, now - last); last = now;
      t += 0.016;
      ctx.clearRect(0, 0, w, h);

      // stars
      for (const s of stars) {
        const a = s.baseAlpha + Math.sin(t * s.speed + s.twPhase) * 0.35;
        const alpha = Math.max(0, Math.min(1, a));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.gold ? `rgba(240,214,138,${alpha})` : `rgba(255,245,247,${alpha})`;
        ctx.fill();
      }

      // drifting motes
      for (const p of particles) {
        p.life += dt;
        p.x += p.vx; p.y += p.vy;
        if (p.life > p.max || p.y < -10) {
          p.x = Math.random() * w; p.y = h + 10; p.life = 0;
        }
        const fade = Math.sin((p.life / p.max) * Math.PI) * 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,179,198,${fade})`;
        ctx.fill();
      }

      // shooting star
      nextShooter -= dt;
      if (!shooter && nextShooter <= 0) {
        const fromLeft = Math.random() < 0.5;
        shooter = {
          x: fromLeft ? -20 : w + 20,
          y: Math.random() * h * 0.5,
          vx: fromLeft ? 6 + Math.random() * 3 : -(6 + Math.random() * 3),
          vy: 2 + Math.random() * 2,
          life: 0, len: 80 + Math.random() * 60,
        };
        nextShooter = 6000 + Math.random() * 10000;
      }
      if (shooter) {
        shooter.x += shooter.vx; shooter.y += shooter.vy; shooter.life += dt;
        const tailX = shooter.x - shooter.vx * (shooter.len / 8);
        const tailY = shooter.y - shooter.vy * (shooter.len / 8);
        const grad = ctx.createLinearGradient(shooter.x, shooter.y, tailX, tailY);
        grad.addColorStop(0, 'rgba(255,245,247,0.9)');
        grad.addColorStop(1, 'rgba(255,245,247,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(shooter.x, shooter.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
        if (shooter.x < -60 || shooter.x > w + 60 || shooter.y > h + 60) shooter = null;
      }

      raf = requestAnimationFrame(draw);
    };

    build();
    raf = requestAnimationFrame(draw);

    const onResize = () => build();
    const onVis = () => {
      if (document.hidden) { cancelAnimationFrame(raf); last = performance.now(); }
      else { last = performance.now(); raf = requestAnimationFrame(draw); }
    };
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [density]);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-0" />;
}
