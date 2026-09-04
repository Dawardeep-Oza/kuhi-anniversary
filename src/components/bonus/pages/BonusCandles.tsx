import { useState } from 'react';

const WORDS = ['YOU', 'MAKE', 'LIFE', 'FEEL', 'BETTER', '❤'];

export default function BonusCandles({ onNext }: { onNext: () => void }) {
  const [lit, setLit] = useState<Set<number>>(new Set());
  const allLit = lit.size === WORDS.length;

  const toggle = (i: number) => {
    setLit((prev) => {
      const next = new Set(prev);
      if (next.has(i)) return next;
      next.add(i);
      return next;
    });
  };

  const brightness = lit.size / WORDS.length;

  return (
    <div
      className="relative z-10 flex min-h-[100svh] w-full flex-col items-center justify-center px-5 py-20 text-center transition-all duration-1000"
      style={{
        background: `radial-gradient(${brightness * 60}% ${brightness * 50}% at 50% 40%, rgba(240,214,138,${brightness * 0.15}), transparent)`,
      }}
    >
      <p className="font-display text-3xl font-light text-cream sm:text-5xl">Six months.</p>
      <p className="mt-2 font-display text-xl italic text-cream/60">Six little lights.</p>

      <div className="mt-12 flex flex-wrap items-end justify-center gap-5 sm:gap-10">
        {WORDS.map((word, i) => {
          const isLit = lit.has(i);
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              className="group flex flex-col items-center gap-2"
              aria-label={`Candle ${i + 1}`}
            >
              {/* flame */}
              {isLit && (
                <span className="relative flex h-8 w-5 flex-col items-center">
                  <span className="h-4 w-3 rounded-full bg-gradient-to-t from-gold-500 to-gold-200 blur-[1px] animate-pulseGlow" />
                  <span className="absolute top-0 h-2 w-1.5 rounded-full bg-white/80" />
                  <span className="absolute -top-2 h-6 w-6 rounded-full bg-gold-400/20 blur-md animate-pulseGlow" />
                </span>
              )}
              {!isLit && <span className="h-8" />}

              {/* candle body */}
              <span
                className={`flex h-20 w-6 items-start justify-center rounded-t-md rounded-b-sm border transition-all duration-500 ${
                  isLit
                    ? 'border-gold-400/40 bg-gradient-to-b from-gold-200/30 to-blush-200/20'
                    : 'border-cream/15 bg-navy-800/60 group-hover:border-gold-400/30'
                }`}
              >
                {!isLit && <span className="mt-1 h-1 w-0.5 rounded-full bg-cream/30" />}
              </span>

              {/* word */}
              <span
                className={`font-display text-sm transition-all duration-700 ${
                  isLit ? 'text-gold-200 opacity-100' : 'text-cream/20 opacity-0'
                }`}
              >
                {word}
              </span>

              {/* base */}
              <span className="h-1.5 w-10 rounded-full bg-cream/10" />
            </button>
          );
        })}
      </div>

      {allLit && (
        <div className="mt-12 animate-fadeUp">
          <p className="font-display text-2xl italic text-gold-200 sm:text-3xl">
            And that's enough light for tonight.
          </p>
          <button
            onClick={onNext}
            className="group mt-8 inline-flex items-center gap-2 rounded-full border border-blush-300/40 bg-blush-500/15 px-6 py-3 font-sans text-sm text-blush-100 transition-all hover:border-blush-300/70 hover:bg-blush-500/25 hover:text-white active:scale-95"
          >
            One last thing
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
      )}
    </div>
  );
}
