import { useState } from 'react';

const MILESTONES = [
  { count: 1, label: '' },
  { count: 10, label: '' },
  { count: 100, label: '' },
  { count: 1000, label: '' },
  { count: 10000, label: '' },
  { count: 100000, label: '' },
  { count: 1000000, label: '' },
];

export default function BonusInfiniteButton({ onNext }: { onNext: () => void }) {
  const [clicks, setClicks] = useState(0);
  const [display, setDisplay] = useState('0');
  const [infinity, setInfinity] = useState(false);
  const [pulses, setPulses] = useState<number[]>([]);

  const handleClick = () => {
    const nc = clicks + 1;
    setClicks(nc);

    // pulse animation
    const pid = Date.now();
    setPulses((p) => [...p, pid]);
    setTimeout(() => setPulses((p) => p.filter((x) => x !== pid)), 800);

    if (nc > MILESTONES[MILESTONES.length - 1].count) {
      setInfinity(true);
      setDisplay('∞');
    } else {
      // find milestone
      const m = MILESTONES.find((m) => m.count === nc);
      if (m) {
        setDisplay(nc.toLocaleString());
      } else if (nc < 100) {
        setDisplay(String(nc));
      }
    }
  };

  return (
    <div className="relative z-10 flex min-h-[100svh] w-full flex-col items-center justify-center px-5 py-20 text-center">
      <p className="font-display text-2xl italic text-cream/80 sm:text-3xl">
        How much do I love you?
      </p>

      <div className="mt-10 flex min-h-[80px] items-center justify-center">
        <p
          className={`font-display font-light transition-all duration-500 ${
            infinity ? 'text-6xl text-blush-300 sm:text-8xl animate-pulseGlow' : 'text-4xl text-cream sm:text-6xl'
          }`}
        >
          {display}
        </p>
      </div>

      <button
        onClick={handleClick}
        className="group relative mt-10 flex h-28 w-28 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 active:scale-90 sm:h-32 sm:w-32"
        aria-label="Click to count love"
      >
        {pulses.map((id) => (
          <span
            key={id}
            className="absolute inset-0 rounded-full border-2 border-blush-400/50"
            style={{ animation: 'ping 0.8s ease-out forwards' }}
          />
        ))}
        <span className="absolute inset-0 rounded-full bg-blush-500/20 blur-lg animate-pulseGlow" />
        <span className="absolute inset-0 rounded-full border-2 border-blush-400/50 bg-blush-500/15 transition-all group-hover:border-blush-400 group-hover:bg-blush-500/30" />
        <span className="relative text-4xl text-blush-300 transition-transform group-hover:scale-110">❤</span>
      </button>
      <p className="mt-4 font-sans text-xs uppercase tracking-widest2 text-cream/40">CLICK</p>

      {infinity && (
        <div className="mt-10 animate-fadeUp">
          <p className="font-display text-2xl italic text-cream/85 sm:text-3xl">Yeah…</p>
          <p className="mt-2 font-display text-xl italic text-blush-200">That's more accurate.</p>
          <p className="mt-6 font-sans text-sm text-cream/60">
            Unfortunately, this button isn't powerful enough to count it.
          </p>
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
  );
}
