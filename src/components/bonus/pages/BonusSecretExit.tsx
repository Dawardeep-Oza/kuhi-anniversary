import { useEffect, useState } from 'react';

const FINAL_LINES: { text: string; cls?: string }[] = [
  { text: 'YOU REALLY FOUND IT.', cls: 'font-display text-3xl font-light text-blush-300 sm:text-5xl' },
  { text: 'Okay Wifey.', cls: 'font-display text-xl italic text-cream/80' },
  { text: 'You officially completed the entire thing.', cls: 'font-display text-xl italic text-cream/80' },
];

const LETTER: { text: string; cls?: string }[] = [
  { text: 'Six months was never supposed to be the end of anything.', cls: 'text-cream/85' },
  { text: 'It was just the beginning.', cls: 'text-blush-200' },
  { text: "So here's to the conversations,", cls: 'text-cream/75' },
  { text: 'the laughs,', cls: 'text-cream/75' },
  { text: 'the annoying moments,', cls: 'text-cream/75' },
  { text: 'the distance,', cls: 'text-cream/75' },
  { text: 'the memories,', cls: 'text-cream/75' },
  { text: 'and everything we haven\'t done yet.', cls: 'text-cream/75' },
  { text: "I don't know exactly what the future will look like.", cls: 'text-cream/85' },
  { text: 'But I know I want you in it.', cls: 'text-blush-200' },
  { text: "I'll keep loving you, Kuhi.", cls: 'text-blush-300' },
  { text: 'Today.', cls: 'text-cream/80' },
  { text: 'Tomorrow.', cls: 'text-cream/80' },
  { text: 'And for as long as forever lets me.', cls: 'text-blush-200' },
];

export default function BonusSecretExit() {
  const [step, setStep] = useState(-1);

  useEffect(() => {
    const timers: number[] = [];
    const totalLines = FINAL_LINES.length + LETTER.length;
    for (let i = 0; i < totalLines; i++) {
      const delay = 800 + i * 1400;
      timers.push(window.setTimeout(() => setStep(i), delay));
    }
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative z-10 flex min-h-[100svh] w-full flex-col items-center justify-center px-5 py-20 text-center">
      {/* Title section */}
      <div className="flex flex-col items-center gap-4">
        {FINAL_LINES.map((l, i) => (
          <p
            key={i}
            className={`${l.cls} transition-all duration-700 ${
              i <= step ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            {l.text}
          </p>
        ))}
      </div>

      {/* Letter section */}
      {step >= FINAL_LINES.length - 1 && (
        <div className="mx-auto mt-12 max-w-lg space-y-3">
          {LETTER.map((l, i) => {
            const letterStep = step - FINAL_LINES.length;
            if (letterStep < i) return null;
            return (
              <p
                key={i}
                className={`font-display text-lg italic leading-relaxed transition-all duration-700 sm:text-xl ${
                  l.cls ?? 'text-cream/80'
                } ${letterStep === i ? 'translate-y-0 opacity-100' : 'translate-y-0 opacity-100'}`}
              >
                {l.text}
              </p>
            );
          })}
        </div>
      )}

      {/* Final heart */}
      {step >= FINAL_LINES.length + LETTER.length - 1 && (
        <p className="mt-10 animate-fadeUp text-5xl text-blush-300 animate-bobHeart">❤</p>
      )}
    </div>
  );
}
