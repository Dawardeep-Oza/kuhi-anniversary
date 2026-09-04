import { useCallback, useEffect, useRef, useState } from 'react';
import FireworksCanvas, { useFireworksApi } from '../FireworksCanvas';
import { BonusButton } from '../BonusShell';

const REACTIONS = [
  { msg: 'I literally told you not to.', sub: "…but I'm glad you did." },
  { msg: 'Wifey…', sub: "Why are you like this?" },
  { msg: 'Okay, fine.', sub: "Press it again." },
  { msg: 'Seriously. Don\'t.', sub: "(I know you will.)" },
  { msg: 'Fine. You win.', sub: "You always do." },
];

export default function BonusDontPress({ onNext }: { onNext: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { burst } = useFireworksApi(canvasRef);
  const [clicks, setClicks] = useState(0);
  const [boom, setBoom] = useState(false);
  const [shake, setShake] = useState(false);

  const handlePress = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    burst(
      w * 0.3 + Math.random() * w * 0.4,
      h * 0.2 + Math.random() * h * 0.3,
      ['normal', 'heart', 'star', 'flower'][clicks % 4] as never,
    );
    setBoom(true);
    setShake(true);
    setTimeout(() => setShake(false), 500);
    setTimeout(() => setBoom(false), 1200);
    setClicks((c) => c + 1);
  }, [burst, clicks]);

  const reaction = REACTIONS[Math.min(clicks, REACTIONS.length - 1)];
  const isLast = clicks >= REACTIONS.length;

  return (
    <div className={`relative min-h-[100svh] w-full overflow-hidden ${shake ? 'animate-shake' : ''}`}>
      <FireworksCanvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" />
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-5 text-center">
        <p className="font-display text-4xl font-light text-cream/70 sm:text-6xl">DO NOT PRESS.</p>

        <button
          onClick={handlePress}
          className="group relative mt-12 flex h-32 w-32 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 active:scale-90 sm:h-40 sm:w-40"
          aria-label="The button"
        >
          <span className="absolute inset-0 rounded-full bg-blush-500/20 blur-xl animate-pulseGlow" />
          <span className="absolute inset-0 rounded-full border-2 border-blush-400/50 bg-blush-500/15 transition-all group-hover:border-blush-400 group-hover:bg-blush-500/30" />
          <span className="relative font-display text-2xl text-blush-200 sm:text-3xl">PRESS</span>
        </button>

        {boom && (
          <p className="mt-8 animate-fadeUp font-display text-5xl font-light text-gold-300 sm:text-7xl">
            BOOM 💥
          </p>
        )}

        {clicks > 0 && !boom && (
          <div className="mt-10 animate-fadeUp">
            <p className="font-display text-2xl italic text-blush-200 sm:text-3xl">{reaction.msg}</p>
            <p className="mt-3 font-display text-lg italic text-cream/70">{reaction.sub}</p>
          </div>
        )}

        {isLast && !boom && (
          <BonusButton onClick={onNext}>Next</BonusButton>
        )}
      </div>
    </div>
  );
}
