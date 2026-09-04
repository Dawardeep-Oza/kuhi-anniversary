import { useEffect, useState } from 'react';

const LABELS = ['US', 'LITTLE THINGS', 'THE CHAOS', 'FOR KUHI', 'DISTANCE', 'OUR FUTURE', 'ONE LAST THING'];

export default function ProgressDots({ active }: { active: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed right-3 top-1/2 z-40 -translate-y-1/2 transition-opacity duration-700 sm:right-5 ${
        mounted && active > 0 ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* desktop: vertical dots with labels on hover */}
      <div className="hidden flex-col items-end gap-3 lg:flex">
        {LABELS.map((label, i) => {
          const n = i + 1;
          const isActive = n === active;
          const isPast = n < active;
          return (
            <div key={i} className="group flex items-center gap-2.5">
              <span
                className={`whitespace-nowrap font-sans text-[10px] uppercase tracking-widest2 transition-all duration-300 ${
                  isActive ? 'text-blush-300 opacity-100' : 'text-cream/40 opacity-0 group-hover:opacity-100'
                }`}
              >
                {String(n).padStart(2, '0')} · {label}
              </span>
              <span
                className={`block rounded-full transition-all duration-500 ${
                  isActive ? 'h-2 w-5 bg-blush-400 shadow-[0_0_10px_2px_rgba(247,106,140,0.5)]'
                    : isPast ? 'h-2 w-2 bg-blush-500/60'
                    : 'h-2 w-2 bg-cream/20'
                }`}
              />
            </div>
          );
        })}
      </div>
      {/* tablet: numbers only */}
      <div className="hidden flex-col items-end gap-2.5 md:flex lg:hidden">
        {LABELS.map((_, i) => {
          const n = i + 1;
          const isActive = n === active;
          const isPast = n < active;
          return (
            <span
              key={i}
              className={`font-sans text-[10px] tracking-widest2 transition-all duration-500 ${
                isActive ? 'text-blush-300' : isPast ? 'text-blush-500/60' : 'text-cream/25'
              }`}
            >
              {String(n).padStart(2, '0')}
            </span>
          );
        })}
      </div>
      {/* mobile: compact pill */}
      <div className="glass rounded-full px-3 py-1.5 md:hidden">
        <span className="font-sans text-[11px] tracking-widest2 text-blush-300">
          {String(active).padStart(2, '0')}
          <span className="text-cream/40"> / 07</span>
        </span>
      </div>
    </div>
  );
}
