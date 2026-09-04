import { useEffect, useRef, useCallback, forwardRef } from 'react';

/**
 * Shared canvas-based fireworks engine.
 * Pass a ref and use `useFireworksApi(ref)` to get launch/burst functions.
 */

export type FireworkType = 'normal' | 'heart' | 'star' | 'flower';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  color: string;
  size: number;
  gravity: number;
};

type Rocket = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetY: number;
  color: string;
  trail: { x: number; y: number }[];
};

export type FireworksAPI = {
  launch: (x?: number, y?: number, type?: FireworkType) => void;
  burst: (x: number, y: number, type?: FireworkType) => void;
};

const COLORS = [
  '#ff8fa8', '#f76a8c', '#ffb3c6', '#ffd1dc',
  '#e6c46a', '#f0d68a', '#f7e9b8',
  '#fdf6f0', '#ff6b9d', '#c084fc', '#7dd3fc', '#86efac',
];

function pickColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function heartPoints(scale: number): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];
  for (let t = 0; t < Math.PI * 2; t += (Math.PI * 2) / 42) {
    const px = 16 * Math.pow(Math.sin(t), 3);
    const py = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    pts.push({ x: px * scale * 0.06, y: py * scale * 0.06 });
  }
  return pts;
}

function starPoints(scale: number): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const r = i % 2 === 0 ? scale : scale * 0.4;
    pts.push({ x: Math.cos(angle) * r * 0.04, y: Math.sin(angle) * r * 0.04 });
  }
  return pts;
}

function flowerPoints(scale: number): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];
  const petals = 8;
  for (let p = 0; p < petals; p++) {
    const baseAngle = (Math.PI * 2 / petals) * p;
    for (let s = 0; s < 6; s++) {
      const angle = baseAngle + (s - 2.5) * 0.08;
      pts.push({ x: Math.cos(angle) * scale * 0.05, y: Math.sin(angle) * scale * 0.05 });
    }
  }
  return pts;
}

const FireworksCanvas = forwardRef<HTMLCanvasElement, { className?: string; autoClear?: boolean }>(
  function FireworksCanvas({ className = '', autoClear = true }, ref) {
    const innerRef = useRef<HTMLCanvasElement | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const rocketsRef = useRef<Rocket[]>([]);
    const rafRef = useRef(0);
    const lastRef = useRef(0);

    const setRef = useCallback((el: HTMLCanvasElement | null) => {
      innerRef.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) (ref as React.MutableRefObject<HTMLCanvasElement | null>).current = el;
    }, [ref]);

    const getSize = useCallback(() => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      return { w: window.innerWidth, h: window.innerHeight, dpr };
    }, []);

    const explode = useCallback((cx: number, cy: number, color: string, type: FireworkType) => {
      const count = type === 'normal' ? 60 : 42;
      const speed = type === 'normal' ? 5 : 4;
      let points: { x: number; y: number }[] | null = null;

      if (type === 'heart') points = heartPoints(speed * 10);
      else if (type === 'star') points = starPoints(speed * 10);
      else if (type === 'flower') points = flowerPoints(speed * 10);

      for (let i = 0; i < count; i++) {
        let vx: number, vy: number;
        if (points) {
          const p = points[i % points.length];
          vx = p.x * (0.8 + Math.random() * 0.4);
          vy = p.y * (0.8 + Math.random() * 0.4);
        } else {
          const angle = (Math.PI * 2 / count) * i + Math.random() * 0.2;
          const s = speed * (0.6 + Math.random() * 0.6);
          vx = Math.cos(angle) * s;
          vy = Math.sin(angle) * s;
        }
        particlesRef.current.push({
          x: cx, y: cy, vx, vy,
          life: 0, max: 900 + Math.random() * 400,
          color: Math.random() < 0.3 ? pickColor() : color,
          size: 2 + Math.random() * 1.5,
          gravity: 0.03,
        });
      }
    }, []);

    const draw = useCallback((now: number) => {
      const canvas = innerRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const { w, h } = getSize();

      const dt = lastRef.current ? Math.min(50, now - lastRef.current) : 16;
      lastRef.current = now;

      if (autoClear) {
        ctx.fillStyle = 'rgba(6, 9, 18, 0.18)';
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.clearRect(0, 0, w, h);
      }

      const rockets = rocketsRef.current;
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.x += r.vx; r.y += r.vy; r.vy += 0.04;
        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 12) r.trail.shift();

        for (let t = 0; t < r.trail.length; t++) {
          const tp = r.trail[t];
          const alpha = t / r.trail.length;
          ctx.beginPath();
          ctx.arc(tp.x, tp.y, 2 * alpha, 0, Math.PI * 2);
          ctx.fillStyle = r.color;
          ctx.globalAlpha = alpha * 0.8;
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        if (r.y <= r.targetY) {
          explode(r.x, r.y, r.color, 'normal');
          rockets.splice(i, 1);
        }
      }

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        p.x += p.vx; p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.99; p.vy *= 0.99;

        const t = p.life / p.max;
        if (t >= 1) { particles.splice(i, 1); continue; }
        const alpha = 1 - t;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - t * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5 * (1 - t * 0.5), 0, Math.PI * 2);
        ctx.globalAlpha = alpha * 0.15;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      rafRef.current = requestAnimationFrame(draw);
    }, [getSize, autoClear, explode]);

    // Store API on canvas element
    const launch = useCallback((x?: number, y?: number, type: FireworkType = 'normal') => {
      const { w, h } = getSize();
      const startX = x ?? Math.random() * w * 0.8 + w * 0.1;
      const targetY = y ?? h * 0.15 + Math.random() * h * 0.3;
      rocketsRef.current.push({
        x: startX, y: h,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -8 - Math.random() * 3,
        targetY, color: pickColor(), trail: [],
      });
    }, [getSize]);

    const burst = useCallback((x: number, y: number, type: FireworkType = 'normal') => {
      explode(x, y, pickColor(), type);
    }, [explode]);

    useEffect(() => {
      const canvas = innerRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const api: FireworksAPI = { launch, burst };
      (canvas as unknown as { __fw: FireworksAPI }).__fw = api;

      lastRef.current = 0;
      rafRef.current = requestAnimationFrame(draw);

      const onResize = () => {
        const nw = window.innerWidth;
        const nh = window.innerHeight;
        const ndpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = nw * ndpr;
        canvas.height = nh * ndpr;
        canvas.style.width = nw + 'px';
        canvas.style.height = nh + 'px';
        ctx.setTransform(ndpr, 0, 0, ndpr, 0, 0);
      };
      window.addEventListener('resize', onResize);

      return () => {
        cancelAnimationFrame(rafRef.current);
        window.removeEventListener('resize', onResize);
      };
    }, [draw, launch, burst]);

    return <canvas ref={setRef} aria-hidden className={className} />;
  },
);

export default FireworksCanvas;

export function useFireworksApi(canvasRef: React.RefObject<HTMLCanvasElement | null>): FireworksAPI {
  const launch = useCallback((x?: number, y?: number, type: FireworkType = 'normal') => {
    const c = canvasRef.current as unknown as { __fw?: FireworksAPI } | null;
    c?.__fw?.launch(x, y, type);
  }, [canvasRef]);

  const burst = useCallback((x: number, y: number, type: FireworkType = 'normal') => {
    const c = canvasRef.current as unknown as { __fw?: FireworksAPI } | null;
    c?.__fw?.burst(x, y, type);
  }, [canvasRef]);

  return { launch, burst };
}
