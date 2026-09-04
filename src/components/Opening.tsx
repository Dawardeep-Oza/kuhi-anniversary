import { useMemo, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useSequence } from '../hooks/useSequence';

export default function Opening({ onEnter }: { onEnter: () => void }) {
  const lines = useMemo(
    () => [
      'Hey, KUHI.',
      'Wifey, I made you a little something.',
      'Six months of us.',
      'Ready?',
    ],
    []
  );
  const { count, done } = useSequence(lines, 1300, 1700);
  const [leaving, setLeaving] = useState(false);

  const enter = () => {
    setLeaving(true);
    window.setTimeout(onEnter, 900);
  };

  return (
    <div
      className={`relative z-10 flex min-h-[100svh] w-full flex-col items-center justify-center px-6 text-center transition-all duration-700 ${
        leaving ? 'scale-110 opacity-0 blur-md' : 'scale-100 opacity-100'
      }`}
    >
      {/* floating decorative orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[12%] top-[20%] h-2 w-2 rounded-full bg-blush-300 animate-floatXY" />
        <div className="absolute right-[15%] top-[30%] h-1.5 w-1.5 rounded-full bg-gold-300 animate-floatY" style={{ animationDelay: '1s' }} />
        <div className="absolute left-[20%] bottom-[22%] h-2 w-2 rounded-full bg-blush-200/70 animate-floatXY" style={{ animationDelay: '2s' }} />
        <div className="absolute right-[22%] bottom-[18%] h-1.5 w-1.5 rounded-full bg-gold-200 animate-floatY" style={{ animationDelay: '0.5s' }} />
        <div className="absolute left-[50%] top-[12%] h-1 w-1 rounded-full bg-cream/60 animate-floatXY" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="flex flex-col items-center gap-6">
        <div
          className={`flex items-center gap-2 transition-all duration-1000 ${
            count > 0 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Sparkles className="h-4 w-4 text-gold-300 animate-pulse" aria-hidden />
          <span className="font-sans text-[11px] uppercase tracking-widest3 text-cream/50">A little gift for you</span>
          <Sparkles className="h-4 w-4 text-gold-300 animate-pulse" aria-hidden />
        </div>

        <div className="flex flex-col gap-5 sm:gap-6">
          {lines.map((line, i) => (
            <p
              key={i}
              className={`font-display leading-tight transition-all duration-1000 sm:text-5xl ${
                i < count ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              } ${i === 0 ? 'text-3xl italic text-blush-200 sm:text-5xl' : i === 3 ? 'text-4xl text-cream sm:text-6xl' : 'text-2xl text-cream/85 sm:text-4xl'}`}
            >
              {line}
            </p>
          ))}
        </div>

        <div
          className={`mt-8 transition-all duration-700 ${done ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
        >
          <button
            onClick={enter}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-blush-300/40 bg-blush-500/10 px-9 py-4 font-sans text-base text-blush-100 transition-all duration-500 hover:border-blush-300/80 hover:bg-blush-500/20 hover:text-white active:scale-95"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-blush-300/20 to-transparent group-hover:animate-sweep" />
            <span className="relative z-10 tracking-wide">ENTER OUR STORY</span>
            <ArrowRight className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden />
          </button>
        </div>
      </div>

      <p
        className={`absolute bottom-8 font-sans text-xs tracking-widest2 text-cream/40 transition-opacity duration-1000 ${
          done ? 'opacity-100' : 'opacity-0'
        }`}
      >
        6 months <span className="text-blush-300">❤</span>
      </p>
    </div>
  );
}
