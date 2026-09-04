import { useCallback, useEffect, useRef, useState } from 'react';
import FireworksCanvas, { useFireworksApi } from '../FireworksCanvas';
import { BonusButton } from '../BonusShell';

const REACTIONS = [
  { boom: 'BOOM.', sub: 'Just wanted to make sure you were paying attention.', heart: true },
  { boom: 'BOOM.', sub: '…again? Okay.' },
  { boom: 'BOOM.', sub: "Okay okay, I get it. You like explosions.", next: true },
];

export default function BonusFirecracker({ onNext }: { onNext: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { burst } = useFireworksApi(canvasRef);
  const [stage, setStage] = useState<'idle' | 'burning' | 'count' | 'boom'>('idle');
  const [count, setCount] = useState(3);
  const [round, setRound] = useState(0);
  const [shake, setShake] = useState(false);

  const explode = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        burst(
          w * 0.2 + Math.random() * w * 0.6,
          h * 0.15 + Math.random() * h * 0.4,
          ['normal', 'heart', 'star', 'flower'][Math.floor(Math.random() * 4)] as never,
        );
      }, i * 120);
    }
    setShake(true);
    setTimeout(() => setShake(false), 600);
  }, [burst]);

  const lightFuse = () => {
    if (stage !== 'idle') return;
    setStage('burning');
    setTimeout(() => setStage('count'), 1200);
  };

  useEffect(() => {
    if (stage !== 'count') return;
    if (count > 0) {
      const t = setTimeout(() => setCount((c) => c - 1), 700);
      return () => clearTimeout(t);
    }
    setStage('boom');
    explode();
  }, [stage, count, explode]);

  const reaction = REACTIONS[round] ?? REACTIONS[REACTIONS.length - 1];

  const reset = () => {
    setRound((r) => r + 1);
    setStage('idle');
    setCount(3);
  };

  return (
    <div className={`relative min-h-[100svh] w-full overflow-hidden ${shake ? 'animate-shake' : ''}`}>
      <FireworksCanvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" />
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-5 text-center">
        {stage === 'idle' && (
          <div className="animate-fadeIn">
            <p className="font-display text-2xl italic text-cream/85 sm:text-3xl">Wifey, you have one job.</p>
            <p className="mt-2 font-display text-lg italic text-cream/60">Light the fuse.</p>
            <button
              onClick={lightFuse}
              className="group mt-10 relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold-400/50 bg-gold-500/15 transition-all duration-300 hover:scale-110 hover:border-gold-400 hover:bg-gold-500/30 active:scale-95"
              aria-label="Light the fuse"
            >
              <span className="absolute h-20 w-20 rounded-full bg-gold-400/20 blur-lg animate-pulseGlow" />
              <span className="relative font-display text-3xl text-gold-300">🔥</span>
            </button>
          </div>
        )}

        {stage === 'burning' && (
          <div className="animate-fadeIn">
            <p className="font-display text-2xl italic text-gold-200">Burning…</p>
            <div className="mt-6 h-1 w-32 overflow-hidden rounded-full bg-cream/10">
              <div className="h-full bg-gradient-to-r from-gold-400 to-blush-400 animate-lineGrow" style={{ transformOrigin: 'left' }} />
            </div>
          </div>
        )}

        {stage === 'count' && (
          <p key={count} className="font-display text-8xl font-light text-blush-300 animate-fadeIn sm:text-9xl">
            {count > 0 ? count : ''}
          </p>
        )}

        {stage === 'boom' && (
          <div className="animate-fadeUp">
            <p className="font-display text-5xl font-light text-blush-200 sm:text-7xl">{reaction.boom}</p>
            <p className="mt-5 font-display text-xl italic text-cream/80">{reaction.sub}</p>
            {reaction.heart && <p className="mt-3 text-3xl text-blush-300 animate-bobHeart">❤</p>}
            {reaction.next ? (
              <BonusButton onClick={onNext}>Next surprise</BonusButton>
            ) : (
              <button
                onClick={reset}
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-cream/20 px-6 py-3 font-sans text-sm text-cream/70 transition-all hover:border-blush-300/50 hover:text-blush-100 active:scale-95"
              >
                Again?
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
