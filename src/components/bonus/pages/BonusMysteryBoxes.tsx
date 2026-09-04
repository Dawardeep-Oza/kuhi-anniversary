import { useState } from 'react';
import { Sparkles } from 'lucide-react';

const BOX_MSGS = [
  'Your daily reminder:\nYou are very, very loved.',
  'Congratulations.\nYou are officially stuck with me.',
  'Distance is temporary.\nUs isn\'t.',
  'Somewhere between all the random conversations,\nyou became my favorite person.',
  "I'd choose you again.",
  'Plot twist:\nI still want forever.',
];

export default function BonusMysteryBoxes({ onNext }: { onNext: () => void }) {
  const [opened, setOpened] = useState<Set<number>>(new Set());
  const [active, setActive] = useState<number | null>(null);
  const [shaking, setShaking] = useState<number | null>(null);

  const open = (i: number) => {
    if (opened.has(i)) {
      setActive(i);
      return;
    }
    setShaking(i);
    setTimeout(() => {
      setShaking(null);
      setOpened((prev) => new Set(prev).add(i));
      setActive(i);
    }, 600);
  };

  const allOpened = opened.size === BOX_MSGS.length;

  return (
    <div className="relative z-10 flex min-h-[100svh] w-full flex-col items-center justify-center px-5 py-20 text-center">
      <p className="font-display text-3xl font-light text-cream sm:text-5xl">Six Months.</p>
      <p className="mt-2 font-display text-xl italic text-cream/60">Six boxes.</p>
      <p className="mt-1 font-display text-xl italic text-blush-200">Pick one.</p>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {BOX_MSGS.map((_, i) => {
          const isOpen = opened.has(i);
          const isShaking = shaking === i;
          return (
            <button
              key={i}
              onClick={() => open(i)}
              className={`relative flex aspect-square w-28 items-center justify-center rounded-2xl border transition-all duration-300 sm:w-36 ${
                isOpen
                  ? 'border-gold-400/40 bg-gold-500/10'
                  : 'border-blush-300/30 bg-blush-500/10 hover:border-blush-300/60 hover:bg-blush-500/20'
              } ${isShaking ? 'animate-shake' : ''} ${!isOpen ? 'hover:scale-105 active:scale-95' : ''}`}
            >
              {isOpen ? (
                <span className="font-hand text-base leading-snug text-gold-200">
                  {BOX_MSGS[i].split('\n').map((line, j) => (
                    <span key={j} className="block">{line}</span>
                  ))}
                </span>
              ) : (
                <span className="font-display text-3xl font-light text-blush-200">
                  {String(i + 1).padStart(2, '0')}
                </span>
              )}
              {isShaking && (
                <span className="absolute inset-0 rounded-2xl bg-gold-400/20 blur-md animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {active !== null && !allOpened && (
        <div className="mt-6 animate-fadeUp">
          <p className="font-hand text-xl leading-relaxed text-blush-200 whitespace-pre-line">
            {BOX_MSGS[active]}
          </p>
          <button
            onClick={() => setActive(null)}
            className="mt-3 font-sans text-xs text-cream/50 hover:text-cream"
          >
            close
          </button>
        </div>
      )}

      {allOpened && (
        <div className="mt-8 animate-fadeUp">
          <p className="font-display text-2xl italic text-blush-200">You opened everything.</p>
          <p className="mt-2 font-display text-xl italic text-cream/70">Nosy Wifey.</p>
          <p className="mt-3 text-2xl text-blush-300 animate-bobHeart">❤</p>
          <button
            onClick={onNext}
            className="group mt-6 inline-flex items-center gap-2 rounded-full border border-blush-300/40 bg-blush-500/15 px-6 py-3 font-sans text-sm text-blush-100 transition-all hover:border-blush-300/70 hover:bg-blush-500/25 hover:text-white active:scale-95"
          >
            Next
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
      )}

      <div className="mt-6 flex items-center gap-1.5">
        {BOX_MSGS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
              opened.has(i) ? 'bg-gold-400' : 'bg-cream/15'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
