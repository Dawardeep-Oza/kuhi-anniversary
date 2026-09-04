import { useEffect, useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { SectionShell, Eyebrow, Divider, Glow } from '../ui';
import { useReveal } from '../../hooks/useReveal';

const FINALE: { text: string; cls?: string; pause?: boolean }[] = [
  { text: 'Okay, Wifey.' },
  { text: "That's everything." },
  { text: 'But actually…', pause: true },
  { text: "There's one thing I want you to remember." },
  { text: 'Six months is only the beginning.', cls: 'text-blush-300' },
  { text: "I'll keep loving you.", cls: 'text-blush-200', pause: true },
  { text: 'Through the easy days.' },
  { text: 'Through the annoying days.' },
  { text: 'Through the distance.' },
  { text: 'Through whatever comes next.' },
  { text: 'Because if I get to choose…' },
  { text: "I'll keep choosing you.", cls: 'text-blush-300' },
];

function CinematicFinale() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const [step, setStep] = useState(-1);
  const [revealBig, setRevealBig] = useState(false);

  useEffect(() => {
    if (!shown) return;
    const timers: number[] = [];
    FINALE.forEach((f, i) => {
      const prevDelay = FINALE.slice(0, i).reduce((a, x) => a + (x.pause ? 2400 : 1500), 600);
      timers.push(window.setTimeout(() => setStep(i), prevDelay));
    });
    const total = FINALE.reduce((a, x) => a + (x.pause ? 2400 : 1500), 600);
    timers.push(window.setTimeout(() => setRevealBig(true), total + 800));
    return () => timers.forEach(clearTimeout);
  }, [shown]);

  return (
    <div ref={ref} className="text-center">
      <div className="min-h-[50vh] flex flex-col justify-center gap-4 sm:gap-5">
        {FINALE.map((f, i) => (
          <p
            key={i}
            className={`font-display text-xl italic leading-snug transition-all duration-700 sm:text-2xl ${
              f.cls ?? 'text-cream/85'
            } ${i <= step ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
          >
            {f.text}
          </p>
        ))}
      </div>

      {revealBig && (
        <div className="mt-12 animate-fadeUp">
          <Divider className="mb-10" />
          <h2 className="font-display text-4xl font-light leading-tight text-cream sm:text-7xl">
            HAPPY 6 MONTHS, <span className="text-shimmer">KUHI</span> <span className="text-blush-300">❤</span>
          </h2>
          <p className="mt-6 font-display text-2xl italic text-blush-200 sm:text-3xl">My Wifey.</p>
          <p className="mt-8 font-display text-lg italic text-cream/80 sm:text-xl">Forever sounds good to me.</p>

          <div className="mx-auto mt-10 flex max-w-xs flex-col items-center gap-1.5">
            <p className="font-sans text-[11px] uppercase tracking-widest2 text-cream/50">Chapter 6 complete.</p>
            <p className="font-sans text-[11px] uppercase tracking-widest2 text-blush-300/80">See you in Chapter 7.</p>
          </div>

          <p className="mt-10 text-3xl text-blush-300 animate-bobHeart" aria-hidden>❤</p>
        </div>
      )}
    </div>
  );
}

export default function ChapterLast() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const [opened, setOpened] = useState(false);

  return (
    <SectionShell id="ch7">
      <Glow className="top-1/3 left-1/3 h-60 w-60" color="blush" />
      <Glow className="bottom-10 right-1/4 h-48 w-48" color="gold" />
      <div ref={ref} className="text-center">
        <Eyebrow>Chapter 07 — One Last Thing</Eyebrow>

        {!opened ? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-7">
            <h2 className={`reveal ${shown ? 'in' : ''} font-display text-4xl font-light text-cream sm:text-5xl`}>
              Last thing.
            </h2>
            <p className={`reveal ${shown ? 'in' : ''} font-sans text-sm text-cream/60`} style={{ animationDelay: '200ms' }}>
              One more, before you go.
            </p>
            <button
              onClick={() => setOpened(true)}
              className={`reveal ${shown ? 'in' : ''} group inline-flex items-center gap-2 rounded-full border border-blush-300/40 bg-blush-500/10 px-8 py-4 font-sans text-sm text-blush-100 transition-all duration-300 hover:border-blush-300/70 hover:bg-blush-500/20 hover:text-white active:scale-95`}
              style={{ animationDelay: '400ms' }}
            >
              <Lock className="h-4 w-4 text-blush-300" aria-hidden />
              Open it.
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </button>
          </div>
        ) : (
          <CinematicFinale />
        )}
      </div>
    </SectionShell>
  );
}
