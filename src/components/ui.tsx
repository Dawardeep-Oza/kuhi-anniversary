import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

export function SectionShell({
  children,
  id,
  className = '',
}: {
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative z-10 flex min-h-[100svh] w-full flex-col items-center justify-center px-5 py-24 sm:px-10 ${className}`}
    >
      <div className="mx-auto w-full max-w-3xl">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 font-sans text-[11px] uppercase tracking-widest2 text-blush-300/80">
      {children}
    </p>
  );
}

export function ChapterTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-4xl font-light leading-tight text-cream sm:text-6xl">
      {children}
    </h2>
  );
}

export function ContinueButton({
  children,
  onClick,
  href,
  variant = 'solid',
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'solid' | 'ghost';
}) {
  const base =
    'group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-3.5 font-sans text-sm transition-all duration-300 active:scale-[0.97]';
  const styles =
    variant === 'solid'
      ? 'border border-blush-300/40 bg-blush-500/15 text-blush-100 hover:border-blush-300/70 hover:bg-blush-500/25 hover:text-white'
      : 'border border-cream/20 bg-white/[0.03] text-cream/80 hover:border-blush-300/40 hover:text-blush-100';
  const cls = `${base} ${styles}`;
  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
    </>
  );
  if (href) return <a href={href} className={cls}>{inner}</a>;
  return <button onClick={onClick} className={cls}>{inner}</button>;
}

export function Divider({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`mx-auto h-px w-20 bg-gradient-to-r from-transparent via-blush-300/50 to-transparent ${className}`}
    />
  );
}

/** A glow blob used to fill visual space behind sections. */
export function Glow({ className = '', color = 'blush' }: { className?: string; color?: 'blush' | 'gold' | 'burgundy' }) {
  const c = color === 'gold' ? 'bg-gold-400/10' : color === 'burgundy' ? 'bg-blush-800/20' : 'bg-blush-500/10';
  return <div aria-hidden className={`pointer-events-none absolute rounded-full blur-3xl ${c} ${className}`} />;
}
