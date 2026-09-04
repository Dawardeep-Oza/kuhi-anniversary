import { useCallback, useEffect, useRef, useState } from 'react';
import FireworksCanvas, { useFireworksApi } from '../FireworksCanvas';
import type { FireworkType } from '../FireworksCanvas';

const SHOW_MESSAGES = [
  '6 months.',
  'KUHI.',
  'My Wifey.',
  'Still my favorite.',
  'Still choosing you.',
  'Still loving you.',
];

const FINALE_LINES = [
  "I'll keep loving you.",
  'Forever.',
  'Happy 6 Months, KUHI ❤',
];

export default function BonusFinalShow({ onNext }: { onNext: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { launch, burst } = useFireworksApi(canvasRef);
  const [phase, setPhase] = useState<'intro' | 'showing' | 'dark' | 'finale' | 'done'>('intro');
  const [msgIdx, setMsgIdx] = useState(-1);
  const [finaleIdx, setFinaleIdx] = useState(-1);

  const startShow = useCallback(() => {
    setPhase('showing');
    setMsgIdx(0);
  }, []);

  // Show phase: fire messages + fireworks
  useEffect(() => {
    if (phase !== 'showing') return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const types: FireworkType[] = ['normal', 'heart', 'star', 'flower'];

    // continuous fireworks during the show
    const fwInterval = setInterval(() => {
      const x = w * 0.15 + Math.random() * w * 0.7;
      const y = h * 0.1 + Math.random() * h * 0.4;
      burst(x, y, types[Math.floor(Math.random() * types.length)]);
    }, 400);

    // advance messages
    const msgTimers: number[] = [];
    SHOW_MESSAGES.forEach((_, i) => {
      if (i === 0) return;
      msgTimers.push(window.setTimeout(() => setMsgIdx(i), i * 2200));
    });

    // transition to dark phase
    const darkTimer = window.setTimeout(() => {
      setPhase('dark');
    }, SHOW_MESSAGES.length * 2200 + 1000);

    return () => {
      clearInterval(fwInterval);
      msgTimers.forEach(clearTimeout);
      clearTimeout(darkTimer);
    };
  }, [phase, burst]);

  // Dark phase: brief pause, then finale
  useEffect(() => {
    if (phase !== 'dark') return;
    const t1 = setTimeout(() => setPhase('finale'), 1500);
    return () => clearTimeout(t1);
  }, [phase]);

  // Finale: one big heart explosion, then reveal lines
  useEffect(() => {
    if (phase !== 'finale') return;
    const w = window.innerWidth;
    const h = window.innerHeight;

    // big heart firework
    setTimeout(() => burst(w * 0.5, h * 0.35, 'heart'), 200);
    setTimeout(() => burst(w * 0.35, h * 0.3, 'heart'), 400);
    setTimeout(() => burst(w * 0.65, h * 0.3, 'heart'), 600);

    // reveal finale lines
    FINALE_LINES.forEach((_, i) => {
      setTimeout(() => setFinaleIdx(i), 800 + i * 1800);
    });

    const doneTimer = setTimeout(() => setPhase('done'), 800 + FINALE_LINES.length * 1800 + 1000);
    return () => clearTimeout(doneTimer);
  }, [phase, burst]);

  return (
    <div className="relative min-h-[100svh] w-full overflow-hidden">
      <FireworksCanvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" />

      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-5 text-center">
        {phase === 'intro' && (
          <div className="animate-fadeIn">
            <p className="font-display text-2xl italic text-cream/85 sm:text-3xl">Okay, Wifey.</p>
            <p className="mt-4 font-display text-xl italic text-cream/70">
              You've made it through all the nonsense.
            </p>
            <p className="mt-6 font-display text-xl italic text-cream/70">So…</p>
            <p className="mt-2 font-display text-xl italic text-blush-200">Let's end this properly.</p>
            <button
              onClick={startShow}
              className="group mt-10 inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-500/10 px-8 py-4 font-sans text-sm text-gold-200 transition-all duration-300 hover:border-gold-400/70 hover:bg-gold-500/20 hover:text-white active:scale-95"
            >
              START THE SHOW 🎆
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
        )}

        {phase === 'showing' && msgIdx >= 0 && (
          <div className="flex flex-col items-center gap-4">
            {SHOW_MESSAGES.map((msg, i) => (
              <p
                key={i}
                className={`font-display text-3xl font-light italic transition-all duration-700 sm:text-5xl ${
                  i <= msgIdx ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                } ${i === msgIdx ? 'text-blush-300' : 'text-cream/60'}`}
              >
                {msg}
              </p>
            ))}
          </div>
        )}

        {phase === 'dark' && (
          <p className="font-display text-xl italic text-cream/30 animate-pulse">…</p>
        )}

        {phase === 'finale' && (
          <div className="flex flex-col items-center gap-6">
            {FINALE_LINES.map((line, i) => (
              <p
                key={i}
                className={`font-display transition-all duration-700 ${
                  i <= finaleIdx ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                } ${i === 0 ? 'text-2xl italic text-blush-200 sm:text-3xl' : ''} ${
                  i === 1 ? 'text-4xl font-light text-blush-300 sm:text-6xl' : ''
                } ${
                  i === 2 ? 'text-3xl font-light text-shimmer sm:text-5xl' : ''
                }`}
              >
                {line}
              </p>
            ))}
          </div>
        )}

        {phase === 'done' && (
          <div className="animate-fadeUp">
            <p className="font-display text-3xl font-light text-shimmer sm:text-5xl">
              Happy 6 Months, KUHI ❤
            </p>
            <p className="mt-6 text-4xl text-blush-300 animate-bobHeart">❤</p>
          </div>
        )}
      </div>

      {/* Secret exit: tiny star in corner after show is done */}
      {phase === 'done' && (
        <button
          onClick={onNext}
          className="fixed bottom-6 right-6 z-40 flex h-5 w-5 items-center justify-center sm:bottom-8 sm:right-8"
          aria-label="A tiny glowing star"
        >
          <span className="h-3 w-3 rounded-full bg-gold-300/60 shadow-[0_0_10px_3px_rgba(240,214,138,0.4)] animate-pulseGlow" />
          <span className="absolute h-5 w-5 rounded-full bg-gold-300/10 blur-md animate-pulseGlow" />
        </button>
      )}

      {phase === 'done' && (
        <p className="fixed bottom-12 right-6 z-40 font-sans text-[10px] text-cream/40 sm:bottom-14 sm:right-8">
          …wait.
        </p>
      )}
    </div>
  );
}
