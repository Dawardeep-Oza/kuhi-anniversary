import { useCallback, useRef, useState } from 'react';
import FireworksCanvas, { useFireworksApi } from '../FireworksCanvas';

type ShootingState = 'idle' | 'shooting' | 'done';

export default function BonusMakeAWish({ onNext }: { onNext: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { launch, burst } = useFireworksApi(canvasRef);
  const [state, setState] = useState<ShootingState>('idle');

  const makeWish = useCallback(() => {
    if (state !== 'idle') return;
    setState('shooting');

    const w = window.innerWidth;
    const h = window.innerHeight;

    // launch a shooting star
    launch(w * 0.1, h * 0.1, 'normal');

    // sequence of fireworks
    const seq = [
      { delay: 600, x: w * 0.3, y: h * 0.3, type: 'heart' as const },
      { delay: 900, x: w * 0.6, y: h * 0.25, type: 'star' as const },
      { delay: 1200, x: w * 0.4, y: h * 0.35, type: 'flower' as const },
      { delay: 1500, x: w * 0.7, y: h * 0.4, type: 'normal' as const },
      { delay: 1800, x: w * 0.25, y: h * 0.2, type: 'heart' as const },
    ];
    seq.forEach((s) => setTimeout(() => burst(s.x, s.y, s.type), s.delay));

    setTimeout(() => setState('done'), 2500);
  }, [state, launch, burst]);

  return (
    <div className="relative min-h-[100svh] w-full overflow-hidden">
      <FireworksCanvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" />

      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-5 text-center">
        {state === 'idle' && (
          <div className="animate-fadeIn">
            <p className="font-display text-3xl italic text-cream/80 sm:text-4xl">Make a wish.</p>
            <button
              onClick={makeWish}
              className="group relative mt-12 flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300 hover:scale-125 active:scale-90"
              aria-label="Make a wish"
            >
              <span className="absolute h-16 w-16 rounded-full bg-gold-400/20 blur-lg animate-pulseGlow" />
              <span className="relative h-3 w-3 rounded-full bg-gold-200 shadow-[0_0_20px_6px_rgba(247,233,184,0.6)]" />
              <span className="absolute h-10 w-10 rounded-full border border-gold-300/30 animate-spinSlow" />
            </button>
            <p className="mt-6 font-sans text-xs text-cream/40">tap the star</p>
          </div>
        )}

        {state === 'shooting' && (
          <p className="font-display text-2xl italic text-gold-200 animate-pulse">…</p>
        )}

        {state === 'done' && (
          <div className="animate-fadeUp">
            <p className="font-display text-xl italic text-cream/85 sm:text-2xl">
              I hope whatever you wished for…
            </p>
            <p className="mt-3 font-display text-xl italic text-blush-200 sm:text-2xl">
              …we get to experience it together someday.
            </p>
            <p className="mt-6 text-3xl text-blush-300 animate-bobHeart">❤</p>
            <button
              onClick={onNext}
              className="group mt-8 inline-flex items-center gap-2 rounded-full border border-blush-300/40 bg-blush-500/15 px-6 py-3 font-sans text-sm text-blush-100 transition-all hover:border-blush-300/70 hover:bg-blush-500/25 hover:text-white active:scale-95"
            >
              Next
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
