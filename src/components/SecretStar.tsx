import { useState } from 'react';
import { Sparkle, X } from 'lucide-react';

/**
 * A tiny glowing star hidden at a fixed spot in the viewport.
 * When discovered, reveals a secret message overlay.
 */
export default function SecretStar() {
  const [found, setFound] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  return (
    <>
      {/* the hidden star — tucked bottom-left, easy to miss */}
      {!found && (
        <button
          onClick={() => setFound(true)}
          aria-label="A tiny glowing star"
          className="group fixed bottom-6 left-5 z-40 flex h-5 w-5 items-center justify-center sm:bottom-8 sm:left-8"
        >
          <Sparkle
            className="h-3.5 w-3.5 text-gold-300/40 transition-all duration-500 hover:scale-150 hover:text-gold-300 group-hover:animate-pulse"
            aria-hidden
          />
          <span className="absolute h-5 w-5 rounded-full bg-gold-300/10 blur-md animate-pulseGlow" />
        </button>
      )}

      {/* secret reveal overlay */}
      {found && !dismissed && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/80 px-6 backdrop-blur-md animate-fadeIn"
          onClick={() => setDismissed(true)}
        >
          <div
            className="glass-strong relative max-w-md rounded-3xl p-8 text-center animate-fadeUp"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setDismissed(true)}
              aria-label="Close"
              className="absolute right-4 top-4 text-cream/40 transition-colors hover:text-cream"
            >
              <X className="h-4 w-4" />
            </button>
            <Sparkle className="mx-auto mb-4 h-7 w-7 animate-bobHeart text-gold-300" aria-hidden />
            <p className="font-display text-2xl font-light text-blush-300 sm:text-3xl">YOU FOUND THE SECRET.</p>
            <div className="mx-auto my-5 h-px w-16 bg-gradient-to-r from-transparent via-blush-300/50 to-transparent" />
            <p className="mt-2 font-display text-lg italic text-cream/90">Okay, fine.</p>
            <p className="mt-3 font-sans text-[15px] leading-relaxed text-cream/80">
              I love you more than I'm willing to admit on this website.
            </p>
            <p className="mt-2 font-sans text-sm text-cream/55">…but don't tell anyone.</p>
            <p className="mt-5 text-2xl text-blush-300">❤</p>
            <button
              onClick={() => setDismissed(true)}
              className="mt-6 rounded-full border border-cream/20 px-5 py-2 font-sans text-xs text-cream/70 transition-colors hover:border-blush-300/50 hover:text-blush-100"
            >
              Our little secret
            </button>
          </div>
        </div>
      )}
    </>
  );
}
