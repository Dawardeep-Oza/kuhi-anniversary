import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useSequence } from '../../hooks/useSequence';

export function BonusShell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`relative z-10 flex min-h-[100svh] w-full flex-col items-center justify-center px-5 py-20 sm:px-10 ${className}`}>
      <div className="mx-auto w-full max-w-2xl text-center">{children}</div>
    </section>
  );
}

export function BonusTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-4xl font-light leading-tight text-cream sm:text-5xl">
      {children}
    </h2>
  );
}

export function BonusText({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-display text-xl italic leading-snug text-cream/85 sm:text-2xl ${className}`}>
      {children}
    </p>
  );
}

export function BonusButton({
  children,
  onClick,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  onClick: () => void;
  delay?: number;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group mt-8 inline-flex items-center gap-2 rounded-full border border-blush-300/40 bg-blush-500/15 px-8 py-4 font-sans text-sm text-blush-100 transition-all duration-300 hover:border-blush-300/70 hover:bg-blush-500/25 hover:text-white active:scale-95 animate-fadeUp ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
    </button>
  );
}

/** Animated line-by-line reveal for intro sequences. */
export function LineReveal({
  lines,
  baseDelay = 600,
  stepDelay = 1600,
  onDone,
  onLine,
}: {
  lines: { text: string; cls?: string; pause?: boolean }[];
  baseDelay?: number;
  stepDelay?: number;
  onDone?: () => void;
  onLine?: (idx: number) => void;
}) {
  const { count, done } = useSequence(
    lines.map((l) => l.text),
    baseDelay,
    stepDelay,
  );

  useEffect(() => {
    if (done) onDone?.();
  }, [done, onDone]);

  useEffect(() => {
    if (count > 0) onLine?.(count - 1);
  }, [count, onLine]);

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-5">
      {lines.map((l, i) => (
        <p
          key={i}
          className={`font-display text-xl italic leading-snug transition-all duration-700 sm:text-2xl ${
            l.cls ?? 'text-cream/85'
          } ${i < count ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        >
          {l.text}
        </p>
      ))}
    </div>
  );
}
