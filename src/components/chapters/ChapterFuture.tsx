import { useState } from 'react';
import {
  Coffee, Camera, Plane, Sunrise, Film, UtensilsCrossed, CalendarDays,
  Car, Building2, Moon, MapPin, Sparkles, ArrowDown, Check,
} from 'lucide-react';
import { SectionShell, Eyebrow, ContinueButton, Divider, Glow } from '../ui';
import { useReveal } from '../../hooks/useReveal';

type Item = { icon: typeof Coffee; text: string };

const BUCKET: Item[] = [
  { icon: Coffee, text: 'First proper date.' },
  { icon: Plane, text: 'First trip together.' },
  { icon: Sunrise, text: 'First sunrise together.' },
  { icon: Film, text: 'First movie sitting next to each other instead of through a screen.' },
  { icon: Camera, text: 'First ridiculous couple photo.' },
  { icon: Car, text: 'First random road trip.' },
  { icon: UtensilsCrossed, text: 'First fancy dinner.' },
  { icon: CalendarDays, text: 'First completely lazy day together.' },
  { icon: Building2, text: 'First city we explore together.' },
  { icon: Moon, text: 'First time falling asleep next to each other.' },
  { icon: Sparkles, text: 'First "we should totally do this" plan that actually happens.' },
  { icon: MapPin, text: "Everything we haven't even thought of yet." },
];

function BucketList() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const [done, setDone] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const count = done.size;

  return (
    <div ref={ref} className={`reveal ${shown ? 'in' : ''} mt-10`}>
      <div className="mb-5 flex items-center justify-between">
        <span className="font-sans text-[11px] uppercase tracking-widest2 text-blush-300/80">
          {count} / {BUCKET.length} unlocked
        </span>
        <span className="font-sans text-[10px] text-cream/35">tap to mark</span>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
        {BUCKET.map((b, i) => {
          const Icon = b.icon;
          const isDone = done.has(i);
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={`flex items-center gap-3.5 rounded-2xl border px-4 py-3.5 text-left transition-all duration-300 ${
                isDone
                  ? 'border-gold-400/40 bg-gold-500/[0.07]'
                  : 'border-cream/10 bg-white/[0.03] hover:border-blush-300/30'
              }`}
              style={{
                animationDelay: `${i * 60}ms`,
                animation: shown ? `fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 60}ms forwards` : undefined,
                opacity: shown ? undefined : 0,
              }}
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-300 ${
                isDone ? 'bg-gold-500/20 text-gold-300' : 'bg-blush-500/10 text-blush-300'
              }`}>
                {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </span>
              <span className={`flex-1 font-sans text-sm leading-snug sm:text-[15px] ${
                isDone ? 'text-cream/50 line-through decoration-gold-400/40' : 'text-cream/85'
              }`}>
                {b.text}
              </span>
              <span className={`h-4 w-4 shrink-0 rounded-full border transition-all duration-300 ${
                isDone ? 'border-gold-400 bg-gold-400/30' : 'border-cream/25'
              }`} />
            </button>
          );
        })}
      </div>

      <div className="mt-8 space-y-1 text-center">
        <p className="font-display text-xl italic text-blush-200 sm:text-2xl">This list is intentionally unfinished.</p>
        <p className="font-display text-2xl text-cream sm:text-3xl">Good thing we're only six months in.</p>
      </div>
    </div>
  );
}

export default function ChapterFuture() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <SectionShell id="ch6">
      <Glow className="top-10 left-10 h-52 w-52" color="gold" />
      <Glow className="bottom-20 right-10 h-44 w-44" color="blush" />
      <div ref={ref} className="text-center">
        <Eyebrow>Chapter 06 — Our Future</Eyebrow>
        <h2 className={`reveal ${shown ? 'in' : ''} font-display text-4xl font-light text-cream sm:text-6xl`}>
          Things We Still Have To Do.
        </h2>
        <p className={`reveal ${shown ? 'in' : ''} mx-auto mt-5 max-w-lg font-sans text-sm leading-relaxed text-cream/70 sm:text-base`} style={{ animationDelay: '140ms' }}>
          A list of firsts we haven't gotten to yet. Tap the ones you're looking forward to.
          We have time.
        </p>

        <Divider className="my-8" />
        <BucketList />

        <div className={`reveal ${shown ? 'in' : ''} mt-10 flex flex-col items-center gap-3`} style={{ animationDelay: '400ms' }}>
          <ContinueButton href="#ch7">Keep going</ContinueButton>
          <span className="flex items-center gap-1 font-sans text-[10px] uppercase tracking-widest2 text-cream/30">
            <ArrowDown className="h-3 w-3" /> one last thing
          </span>
        </div>
      </div>
    </SectionShell>
  );
}
