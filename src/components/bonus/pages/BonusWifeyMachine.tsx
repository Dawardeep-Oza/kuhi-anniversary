import { useState } from 'react';
import { BonusButton } from '../BonusShell';

const RESULTS = [
  'Result:\n99% cute.',
  'Result:\n100% mine.',
  'Result:\nDangerously adorable.',
  'Result:\nWill probably annoy Dawar today.',
  'Result:\nNeeds a hug.',
  'Result:\nStill loved.',
  'Result:\nCannot escape the relationship.',
  'Result:\nWifey confirmed.',
];

export default function BonusWifeyMachine({ onNext }: { onNext: () => void }) {
  const [result, setResult] = useState<string | null>(null);
  const [pulling, setPulling] = useState(false);
  const [shake, setShake] = useState(false);
  const [idx, setIdx] = useState(-1);
  const [spins, setSpins] = useState(0);

  const pull = () => {
    if (pulling) return;
    setPulling(true);
    setShake(true);
    setResult(null);
    setTimeout(() => setShake(false), 500);
    setTimeout(() => {
      let next = idx;
      while (next === idx) next = Math.floor(Math.random() * RESULTS.length);
      setIdx(next);
      setResult(RESULTS[next]);
      setPulling(false);
      setSpins((s) => s + 1);
    }, 1000);
  };

  return (
    <div className="relative z-10 flex min-h-[100svh] w-full flex-col items-center justify-center px-5 py-20 text-center">
      <p className="font-sans text-[11px] uppercase tracking-widest2 text-blush-300/80">Bonus Experience</p>
      <h2 className="mt-2 font-display text-3xl font-light text-cream sm:text-5xl">
        THE OFFICIAL WIFEY MACHINE™
      </h2>

      <div className={`mt-10 ${shake ? 'animate-shake' : ''}`}>
        <div className="glass-strong relative rounded-3xl p-8 sm:p-10">
          {/* machine top */}
          <div className="mx-auto mb-6 h-3 w-32 rounded-full bg-gradient-to-r from-blush-500/30 via-gold-400/30 to-blush-500/30" />

          {/* display screen */}
          <div className="mb-8 flex min-h-[100px] items-center justify-center rounded-2xl border border-cream/10 bg-navy-950/60 px-6 py-4">
            {result ? (
              <p key={idx} className="animate-fadeUp font-hand text-xl leading-snug text-gold-200 whitespace-pre-line sm:text-2xl">
                {result}
              </p>
            ) : (
              <p className="font-sans text-sm text-cream/40">
                {pulling ? '…' : 'Pull the lever'}
              </p>
            )}
          </div>

          {/* lever */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={pull}
                disabled={pulling}
                className={`group relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-gold-400/50 bg-gold-500/15 transition-all duration-300 hover:scale-105 hover:border-gold-400 active:scale-95 disabled:opacity-50 ${
                  pulling ? 'rotate-90' : ''
                }`}
                aria-label="Pull"
              >
                <span className="absolute h-24 w-24 rounded-full bg-gold-400/20 blur-lg animate-pulseGlow" />
                <span className="relative font-display text-2xl text-gold-300">PULL</span>
              </button>
              <span className="h-8 w-1 rounded-full bg-gold-400/30" />
              <span className="h-4 w-4 rounded-full bg-gold-400/40" />
            </div>
          </div>

          {spins > 0 && (
            <p className="mt-6 font-sans text-[10px] uppercase tracking-widest2 text-cream/30">
              {spins} pull{spins > 1 ? 's' : ''} and counting
            </p>
          )}
        </div>
      </div>

      {spins >= 3 && (
        <BonusButton onClick={onNext}>Next</BonusButton>
      )}
    </div>
  );
}
