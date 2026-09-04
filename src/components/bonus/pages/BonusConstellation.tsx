import { useRef, useState } from 'react';

/**
 * Interactive constellation: click stars in the right sequence to draw
 * a heart shape, then reveal "KUHI".
 */

type StarPt = { x: number; y: number; id: number; label?: string };

// Heart shape points (normalized 0-1, will scale to viewport)
const HEART: { x: number; y: number }[] = [
  { x: 0.5, y: 0.18 },
  { x: 0.32, y: 0.12 },
  { x: 0.18, y: 0.22 },
  { x: 0.15, y: 0.38 },
  { x: 0.25, y: 0.52 },
  { x: 0.5, y: 0.72 },
  { x: 0.75, y: 0.52 },
  { x: 0.85, y: 0.38 },
  { x: 0.82, y: 0.22 },
  { x: 0.68, y: 0.12 },
];

const DECOR = 40;

export default function BonusConstellation({ onNext }: { onNext: () => void }) {
  const [clicked, setClicked] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [wrongFlash, setWrongFlash] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const stars: StarPt[] = [];
  // Heart stars (clickable, in order)
  HEART.forEach((p, i) => stars.push({ x: p.x, y: p.y, id: i, label: String(i) }));
  // Decorative stars (clickable but wrong)
  for (let i = 0; i < DECOR; i++) {
    stars.push({
      x: Math.random(),
      y: Math.random(),
      id: HEART.length + i,
    });
  }

  const handleClick = (id: number) => {
    if (done) return;
    if (id < HEART.length) {
      const expected = clicked.length;
      if (id === expected) {
        const next = [...clicked, id];
        setClicked(next);
        if (next.length === HEART.length) {
          setTimeout(() => setDone(true), 800);
        }
      } else {
        setWrongFlash(true);
        setTimeout(() => setWrongFlash(false), 400);
      }
    } else {
      setWrongFlash(true);
      setTimeout(() => setWrongFlash(false), 400);
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-[100svh] w-full overflow-hidden">
      <div className={`absolute inset-0 transition-colors duration-300 ${wrongFlash ? 'bg-blush-900/20' : ''}`} />

      {stars.map((s) => {
        const isHeart = s.id < HEART.length;
        const isClicked = isHeart && clicked.includes(s.id);
        const isNext = isHeart && s.id === clicked.length && !done;
        return (
          <button
            key={s.id}
            onPointerDown={() => handleClick(s.id)}
            className="absolute z-30 -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125"
            style={{ left: `${s.x * 90 + 5}%`, top: `${s.y * 80 + 10}%` }}
            aria-label="Star"
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                isClicked
                  ? 'h-3 w-3 bg-blush-300 shadow-[0_0_12px_4px_rgba(255,179,198,0.6)]'
                  : isNext
                  ? 'h-2 w-2 bg-gold-300 shadow-[0_0_8px_2px_rgba(240,214,138,0.4)] animate-pulse'
                  : 'h-1 w-1 bg-cream/40 hover:bg-cream/70'
              }`}
            />
          </button>
        );
      })}

      {/* connecting lines */}
      <svg className="pointer-events-none absolute inset-0 z-5 h-full w-full">
        {clicked.map((id, i) => {
          if (i === 0) return null;
          const prev = HEART[clicked[i - 1]];
          const curr = HEART[id];
          return (
            <line
              key={i}
              x1={`${prev.x * 90 + 5}%`}
              y1={`${prev.y * 80 + 10}%`}
              x2={`${curr.x * 90 + 5}%`}
              y2={`${curr.y * 80 + 10}%`}
              stroke="rgba(255,179,198,0.5)"
              strokeWidth="1.5"
              style={{ animation: 'fadeIn 0.5s ease forwards' }}
            />
          );
        })}
      </svg>

      <div className="pointer-events-none relative z-20 pt-12 text-center">
        <p className="font-display text-2xl italic text-cream/80 sm:text-3xl">
          There's something hidden here.
        </p>
        <p className="mt-2 font-display text-lg italic text-blush-200">Find it.</p>
        {clicked.length > 0 && !done && (
          <p className="mt-2 font-sans text-xs text-gold-300/60">
            {clicked.length} / {HEART.length}
          </p>
        )}
      </div>

      {done && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-navy-950/50 backdrop-blur-sm">
          <p className="animate-fadeUp font-display text-3xl italic text-blush-300 sm:text-4xl">
            You found it.
          </p>
          <p className="mt-4 animate-fadeUp font-display text-xl italic text-cream/85" style={{ animationDelay: '600ms' }}>
            Even in a sky full of stars…
          </p>
          <p className="mt-2 animate-fadeUp font-display text-xl italic text-blush-200" style={{ animationDelay: '1200ms' }}>
            I'd still look for you.
          </p>
          <button
            onClick={onNext}
            className="group mt-8 inline-flex items-center gap-2 rounded-full border border-blush-300/40 bg-blush-500/15 px-6 py-3 font-sans text-sm text-blush-100 transition-all hover:border-blush-300/70 hover:bg-blush-500/25 hover:text-white active:scale-95 animate-fadeUp"
            style={{ animationDelay: '2000ms' }}
          >
            Keep going
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
      )}
    </div>
  );
}
