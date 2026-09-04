import { useCallback, useEffect, useRef, useState } from 'react';

type Balloon = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  msg: string;
  popped: boolean;
};

const MESSAGES = [
  'KUHI ❤', 'My favorite person.', 'Miss you.', 'Love you.',
  'Wifey.', 'Come here.', "You're cute.", 'Still choosing you.',
  'Forever.', 'Okay, one more hug.', "You're stuck with me.",
  'Still my favorite notification.',
];

const COLORS = ['#ff8fa8', '#f76a8c', '#ffb3c6', '#e6c46a', '#f0d68a', '#c084fc', '#7dd3fc'];

export default function BonusBalloons({ onNext }: { onNext: () => void }) {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const rafRef = useRef(0);
  const balloonsRef = useRef<Balloon[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const initBalloons = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const arr: Balloon[] = [];
    for (let i = 0; i < MESSAGES.length; i++) {
      arr.push({
        id: i,
        x: 40 + Math.random() * (w - 80),
        y: 60 + Math.random() * (h - 200),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.3,
        color: COLORS[i % COLORS.length],
        msg: MESSAGES[i],
        popped: false,
      });
    }
    balloonsRef.current = arr;
    setBalloons(arr);
  }, []);

  useEffect(() => {
    initBalloons();
    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const updated = balloonsRef.current.map((b) => {
        if (b.popped) return b;
        let nx = b.x + b.vx;
        let ny = b.y + b.vy;
        if (nx < 20 || nx > w - 20) b.vx *= -1;
        if (ny < 20 || ny > h - 40) b.vy *= -1;
        return { ...b, x: nx, y: ny };
      });
      balloonsRef.current = updated;
      setBalloons(updated);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [initBalloons]);

  const pop = (id: number) => {
    balloonsRef.current = balloonsRef.current.map((b) =>
      b.id === id ? { ...b, popped: true } : b,
    );
    setBalloons([...balloonsRef.current]);
    setPoppedCount((c) => c + 1);
  };

  const allPopped = poppedCount >= MESSAGES.length;

  return (
    <div ref={containerRef} className="relative min-h-[100svh] w-full overflow-hidden">
      {/* floating balloons */}
      {balloons.map((b) => (
        <button
          key={b.id}
          onPointerDown={() => !b.popped && pop(b.id)}
          className="absolute z-10 select-none"
          style={{ left: b.x, top: b.y, transform: 'translate(-50%, -50%)' }}
          aria-label="Pop balloon"
        >
          {b.popped ? (
            <span className="relative flex items-center justify-center">
              {b.msg.split('').map((ch, i) => (
                <span
                  key={i}
                  className="absolute text-lg font-display italic"
                  style={{
                    color: b.color,
                    transform: `translate(${(i - b.msg.length / 2) * 12}px, ${-20 - i * 3}px) rotate(${(Math.random() - 0.5) * 60}deg)`,
                    opacity: 0,
                    animation: `fadeUp 0.6s ease-out forwards`,
                    animationDelay: `${i * 30}ms`,
                  }}
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              ))}
            </span>
          ) : (
            <span className="relative flex flex-col items-center transition-transform hover:scale-110 active:scale-90">
              <span
                className="flex h-14 w-12 items-center justify-center rounded-t-full rounded-b-[50%] border-2 sm:h-16 sm:w-14"
                style={{
                  borderColor: b.color + '60',
                  background: `radial-gradient(circle at 35% 30%, ${b.color}50, ${b.color}20)`,
                  boxShadow: `0 0 20px ${b.color}30`,
                }}
              >
                <span className="text-[10px] font-sans text-white/40">?</span>
              </span>
              <span className="h-4 w-px" style={{ background: b.color + '40' }} />
            </span>
          )}
        </button>
      ))}

      {/* popped particles */}
      {balloons.filter((b) => b.popped).map((b) => (
        <div key={`p-${b.id}`} className="pointer-events-none absolute z-5" style={{ left: b.x, top: b.y }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full"
              style={{
                background: b.color,
                transform: `translate(${Math.cos((i / 8) * Math.PI * 2) * 30}px, ${Math.sin((i / 8) * Math.PI * 2) * 30}px)`,
                opacity: 0,
                animation: 'fadeUp 0.5s ease-out forwards',
              }}
            />
          ))}
        </div>
      ))}

      <div className="relative z-20 pt-12 text-center">
        <p className="font-display text-3xl font-light text-cream sm:text-4xl">Pop them.</p>
      </div>

      {allPopped && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-navy-950/60 backdrop-blur-sm">
          <p className="animate-fadeUp font-display text-2xl italic text-blush-200 sm:text-3xl">
            Okay, you destroyed all of them.
          </p>
          <p className="mt-3 animate-fadeUp font-display text-xl italic text-cream/70" style={{ animationDelay: '400ms' }}>
            Respect.
          </p>
          <button
            onClick={onNext}
            className="group mt-8 inline-flex items-center gap-2 rounded-full border border-blush-300/40 bg-blush-500/15 px-6 py-3 font-sans text-sm text-blush-100 transition-all hover:border-blush-300/70 hover:bg-blush-500/25 hover:text-white active:scale-95 animate-fadeUp"
            style={{ animationDelay: '800ms' }}
          >
            Next
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
      )}
    </div>
  );
}
