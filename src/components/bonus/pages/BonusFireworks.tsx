import { useCallback, useRef, useState } from 'react';
import FireworksCanvas, { useFireworksApi } from '../FireworksCanvas';
import { BonusButton } from '../BonusShell';
import type { FireworkType } from '../FireworksCanvas';

const FW_TYPES: FireworkType[] = ['normal', 'heart', 'star', 'flower'];
const MESSAGES = [
  'Hi Wifey ❤',
  'Still here?',
  'Yep. Still obsessed with you.',
  '6 months and counting…',
  "You're stuck with me.",
];

export default function BonusFireworks({ onNext }: { onNext: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { launch } = useFireworksApi(canvasRef);
  const [taps, setTaps] = useState(0);
  const [showButton, setShowButton] = useState(false);

  const handleTap = useCallback((e: React.PointerEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    const type = FW_TYPES[Math.floor(Math.random() * FW_TYPES.length)];
    launch(x, y, type);
    setTaps((t) => {
      const nt = t + 1;
      if (nt >= 8) setShowButton(true);
      return nt;
    });
  }, [launch]);

  const msgIdx = taps < 3 ? -1 : Math.min(Math.floor((taps - 3) / 2), MESSAGES.length - 1);
  const allMessagesShown = taps >= 12;

  return (
    <div className="relative min-h-[100svh] w-full overflow-hidden" onPointerDown={handleTap}>
      <FireworksCanvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" />
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-5 text-center">
        {!showButton ? (
          <>
            <p className="font-display text-3xl italic text-cream/80 sm:text-5xl animate-pulse">
              Tap anywhere.
            </p>
            {msgIdx >= 0 && msgIdx < MESSAGES.length && (
              <p key={msgIdx} className="mt-6 animate-fadeUp font-hand text-2xl text-blush-200 sm:text-3xl">
                {MESSAGES[msgIdx]}
              </p>
            )}
            {allMessagesShown && (
              <>
                <p className="mt-8 animate-fadeUp font-display text-xl italic text-cream/60">Okay…</p>
                <p className="mt-2 animate-fadeUp font-display text-xl italic text-cream/60" style={{ animationDelay: '800ms' }}>
                  Now let's make this interesting.
                </p>
              </>
            )}
          </>
        ) : (
          <div className="animate-fadeUp">
            <p className="font-display text-2xl italic text-blush-200 sm:text-3xl">Okay…</p>
            <p className="mt-3 font-display text-xl italic text-cream/70">Now let's make this interesting.</p>
            <BonusButton onClick={onNext}>LIGHT THE FUSE</BonusButton>
          </div>
        )}
      </div>
    </div>
  );
}
