import { useState } from 'react';
import {
  Moon, MessageCircle, Heart, Smile, Coffee, Sparkles, Star,
  Phone, Sun, Music, Eye, Zap, Feather, ArrowDown,
} from 'lucide-react';
import { SectionShell, Eyebrow, ContinueButton, Divider, Glow } from '../ui';
import { useReveal } from '../../hooks/useReveal';

type Card = { icon: typeof Moon; title: string; back: string };

const CARDS: Card[] = [
  { icon: Moon, title: 'Late Night Talks', back: "The kind where you look up and it's suddenly 3am." },
  { icon: MessageCircle, title: 'Random Messages', back: 'The ones that say nothing and mean everything.' },
  { icon: Heart, title: 'Missing You', back: "My least favorite hobby. I do it a lot." },
  { icon: Smile, title: 'Making Each Other Laugh', back: 'Usually at the worst possible moment.' },
  { icon: Zap, title: 'Being Annoying', back: 'A shared sport. I think I might be winning.' },
  { icon: Sparkles, title: 'Being Cute', back: "Don't tell anyone. We have a reputation." },
  { icon: Feather, title: "Arguments That Didn't Last", back: 'We both get stubborn. Then we both get soft.' },
  { icon: Eye, title: 'Things Only We Understand', back: "A whole private language built from inside jokes." },
  { icon: Phone, title: 'Calling Just Because', back: 'No reason. Just wanted to hear you.' },
  { icon: Star, title: 'Thinking About Each Other', back: 'More often than either of us admits.' },
  { icon: Sun, title: 'Counting Down Until We Meet', back: 'A number that is currently too big.' },
  { icon: Heart, title: 'Choosing Each Other', back: 'Every single day. Even the annoying ones.' },
  { icon: Coffee, title: 'Ordinary Days, But Different', back: 'You have a way of making nothing feel like something.' },
  { icon: Music, title: 'Songs That Remind Me Of You', back: "A growing list I pretend I don't have." },
];

function FlipCard({ card, i, shown }: { card: Card; i: number; shown: boolean }) {
  const [flipped, setFlipped] = useState(false);
  const Icon = card.icon;
  return (
    <button
      onClick={() => setFlipped((f) => !f)}
      className={`flip-card reveal ${shown ? 'in' : ''} aspect-[3/4] w-full ${flipped ? 'flipped' : ''}`}
      style={{ animationDelay: `${(i % 7) * 70 + Math.floor(i / 7) * 40}ms` }}
      aria-label={card.title}
    >
      <div className="flip-inner">
        {/* front */}
        <div className="flip-face flex flex-col items-center justify-center gap-3 rounded-2xl border border-cream/10 bg-white/[0.03] p-4 text-center transition-colors hover:border-blush-300/30">
          <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-blush-500/8 blur-2xl" />
          <Icon className="h-7 w-7 text-blush-300" aria-hidden />
          <span className="font-display text-sm leading-tight text-cream/90 sm:text-base">{card.title}</span>
          <span className="font-sans text-[9px] uppercase tracking-widest2 text-cream/25">tap to flip</span>
        </div>
        {/* back */}
        <div className="flip-face flip-back flex flex-col items-center justify-center gap-2 rounded-2xl border border-blush-300/30 bg-blush-500/10 p-4 text-center">
          <Icon className="h-5 w-5 text-blush-300/70" aria-hidden />
          <span className="font-hand text-base leading-snug text-cream/90">{card.back}</span>
        </div>
      </div>
    </button>
  );
}

export default function ChapterLittleThings() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <SectionShell id="ch2">
      <Glow className="top-20 right-0 h-52 w-52" color="blush" />
      <Glow className="bottom-20 left-0 h-40 w-40" color="burgundy" />
      <div ref={ref} className="text-center">
        <Eyebrow>Chapter 02 — Little Things</Eyebrow>
        <h2 className={`reveal ${shown ? 'in' : ''} font-display text-4xl font-light text-cream sm:text-6xl`}>
          The Little Things
        </h2>
        <p
          className={`reveal ${shown ? 'in' : ''} mx-auto mt-5 max-w-lg font-sans text-sm leading-relaxed text-cream/70 sm:text-base`}
          style={{ animationDelay: '140ms' }}
        >
          It's never the big stuff. It's always the small, ordinary, unremarkable stuff —
          the stuff that quietly became everything. Tap each one.
        </p>
        <Divider className="my-8" />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4">
          {CARDS.map((c, i) => (
            <FlipCard key={i} card={c} i={i} shown={shown} />
          ))}
        </div>

        <p
          className={`reveal ${shown ? 'in' : ''} mt-10 font-display text-xl italic text-blush-200 sm:text-2xl`}
          style={{ animationDelay: '500ms' }}
        >
          And somehow, those little things became my favorite things.
        </p>
        <div className={`reveal ${shown ? 'in' : ''} mt-8 flex flex-col items-center gap-3`} style={{ animationDelay: '620ms' }}>
          <ContinueButton href="#ch3">Keep going</ContinueButton>
          <span className="flex items-center gap-1 font-sans text-[10px] uppercase tracking-widest2 text-cream/30">
            <ArrowDown className="h-3 w-3" /> the chaos
          </span>
        </div>
      </div>
    </SectionShell>
  );
}
