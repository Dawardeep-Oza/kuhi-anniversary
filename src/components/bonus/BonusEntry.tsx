import { useState } from 'react';
import { Eye, ArrowRight } from 'lucide-react';
import { useReveal } from '../../hooks/useReveal';
import { LineReveal, BonusButton } from './BonusShell';

/**
 * Entry point for the bonus section.
 * Shows a "Wait... there's more" button, then an intro sequence,
 * then calls onEnter to start the bonus experience.
 */
export default function BonusEntry({ onEnter }: { onEnter: () => void }) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const [started, setStarted] = useState(false);

  if (started) {
    return (
      <section className="relative z-10 flex min-h-[100svh] w-full flex-col items-center justify-center px-5 sm:px-10">
        <LineReveal
          lines={[
            { text: 'Okay Wifey…' },
            { text: "You didn't think that was everything, did you?" },
            { text: 'Welcome to the completely unnecessary but absolutely important bonus section.', cls: 'text-blush-200' },
          ]}
          baseDelay={800}
          stepDelay={2200}
          onDone={() => {}}
        />
        <BonusButton onClick={onEnter} delay={7400}>
          LET'S GO
        </BonusButton>
      </section>
    );
  }

  return (
    <section className="relative z-10 flex min-h-[100svh] w-full flex-col items-center justify-center px-5 sm:px-10">
      <div ref={ref} className="text-center">
        <p className={`reveal ${shown ? 'in' : ''} mb-6 font-sans text-[11px] uppercase tracking-widest2 text-blush-300/60`}>
          Bonus Experiences
        </p>
        <button
          type="button"
          onClick={() => setStarted(true)}
          className={`reveal ${shown ? 'in' : ''} group inline-flex items-center gap-3 rounded-full border border-gold-400/40 bg-gold-500/10 px-8 py-4 font-display text-lg italic text-gold-200 transition-all duration-300 hover:border-gold-400/70 hover:bg-gold-500/20 hover:text-white active:scale-95`}
          style={{ animationDelay: '200ms' }}
        >
          <Eye className="h-5 w-5 text-gold-300" aria-hidden />
          Wait… there's more
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
        </button>
        <p className={`reveal ${shown ? 'in' : ''} mt-4 font-sans text-xs text-cream/40`} style={{ animationDelay: '400ms' }}>
          (if you're not done yet)
        </p>
      </div>
    </section>
  );
}
