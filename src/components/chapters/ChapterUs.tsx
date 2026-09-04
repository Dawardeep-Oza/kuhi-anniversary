import { useState } from 'react';
import { Moon, MessageCircle, Sparkles, Globe, Heart, MapPin, ArrowDown } from 'lucide-react';
import { SectionShell, Eyebrow, ChapterTitle, ContinueButton, Divider, Glow } from '../ui';
import { useReveal } from '../../hooks/useReveal';

const MONTHS = [
  {
    n: 1,
    icon: Sparkles,
    title: 'Month One',
    text: "Everything was still new. Every conversation felt like discovering another little piece of you.",
  },
  {
    n: 2,
    icon: MessageCircle,
    title: 'Month Two',
    text: "Somehow, talking to you started becoming one of my favorite parts of the day.",
  },
  {
    n: 3,
    icon: Heart,
    title: 'Month Three',
    text: "The random conversations became the important ones.",
  },
  {
    n: 4,
    icon: Globe,
    title: 'Month Four',
    text: "We were already building our own little world.",
  },
  {
    n: 5,
    icon: Moon,
    title: 'Month Five',
    text: "Distance was still distance, but you never felt distant.",
  },
  {
    n: 6,
    icon: Heart,
    title: 'Month Six',
    text: "And here we are.",
  },
];

const YOU_ME = [
  { side: 'you', text: 'Two different places.' },
  { side: 'us', text: 'One ridiculous amount of conversations.' },
  { side: 'me', text: 'Different days.' },
  { side: 'us', text: 'Same person I want to tell everything to.' },
  { side: 'you', text: 'Sometimes miles apart.' },
  { side: 'me', text: 'Never really far from my thoughts.' },
];

function Timeline() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div ref={ref} className="mt-10">
      <div className="relative pl-8 sm:pl-10">
        {/* vertical line */}
        <div className="absolute left-2.5 top-2 bottom-2 w-px bg-gradient-to-b from-blush-300/60 via-blush-300/30 to-gold-300/40 sm:left-3.5" />

        <div className="flex flex-col gap-3">
          {MONTHS.map((m, i) => {
            const Icon = m.icon;
            const isOpen = open === m.n;
            return (
              <div
                key={m.n}
                className={`reveal ${shown ? 'in' : ''} relative`}
                style={{ animationDelay: `${i * 90}ms` }}
              >
                {/* node */}
                <button
                  onClick={() => setOpen(isOpen ? null : m.n)}
                  className="flex w-full items-start gap-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`absolute -left-[1.4rem] top-1 flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-300 sm:-left-[1.7rem] ${
                      isOpen
                        ? 'border-blush-300 bg-blush-500/30 shadow-[0_0_12px_3px_rgba(247,106,140,0.4)]'
                        : 'border-cream/30 bg-navy-900'
                    }`}
                  >
                    <Icon className={`h-2.5 w-2.5 ${isOpen ? 'text-blush-200' : 'text-cream/50'}`} aria-hidden />
                  </span>
                  <div
                    className={`flex-1 rounded-2xl border px-4 py-3 transition-all duration-400 ${
                      isOpen
                        ? 'border-blush-300/40 bg-blush-500/10'
                        : 'border-cream/10 bg-white/[0.02] hover:border-blush-300/25'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-display text-lg ${isOpen ? 'text-blush-200' : 'text-cream/85'}`}>
                        {m.title}
                      </span>
                      <span className="font-sans text-[10px] tracking-widest2 text-cream/35">
                        {String(m.n).padStart(2, '0')}
                      </span>
                    </div>
                    <div
                      className={`grid transition-all duration-500 ${
                        isOpen ? 'mt-2 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <p className="overflow-hidden font-sans text-sm leading-relaxed text-cream/75">
                        {m.text}
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function YouMeGrid() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div ref={ref} className="mt-12">
      <div className="grid grid-cols-3 gap-3 sm:gap-5">
        {['YOU', 'US', 'ME'].map((label, i) => (
          <div
            key={label}
            className={`reveal ${shown ? 'in' : ''} glass rounded-2xl py-5 text-center`}
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <span className={`font-display text-2xl tracking-wide sm:text-4xl ${label === 'US' ? 'text-blush-300' : 'text-cream/80'}`}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-2.5">
        {YOU_ME.map((item, i) => {
          const isOpen = open === i;
          const align = item.side === 'you' ? 'self-start' : item.side === 'me' ? 'self-end' : 'self-center';
          return (
            <button
              key={i}
              onClick={() => setOpen(isOpen ? null : i)}
              className={`${align} max-w-[88%] rounded-2xl border px-4 py-3 text-left transition-all duration-400 ${
                isOpen ? 'border-blush-300/50 bg-blush-500/10' : 'border-cream/10 bg-white/[0.03] hover:border-blush-300/30'
              }`}
            >
              <span className={`text-[9px] uppercase tracking-widest2 ${item.side === 'us' ? 'text-blush-300' : 'text-cream/40'}`}>
                {item.side}
              </span>
              <span className={`block overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'}`}>
                <span className="mt-1.5 block font-display text-base text-cream sm:text-lg">{item.text}</span>
              </span>
              {!isOpen && <span className="mt-0.5 block font-sans text-[11px] text-cream/30">tap</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ChapterUs() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <SectionShell id="ch1">
      <Glow className="-top-10 left-0 h-48 w-48" color="blush" />
      <Glow className="bottom-10 right-0 h-40 w-40" color="gold" />
      <div ref={ref} className="text-center">
        <Eyebrow>Chapter 01 — Us</Eyebrow>
        <p className={`reveal ${shown ? 'in' : ''} font-display text-2xl`}>
          <ChapterTitle>Six months. <span className="text-blush-300">Two people.</span> One little story.</ChapterTitle>
        </p>
        <p
          className={`reveal ${shown ? 'in' : ''} mx-auto mt-6 max-w-xl font-sans text-sm leading-relaxed text-cream/70 sm:text-base`}
          style={{ animationDelay: '160ms' }}
        >
          Six months sounds like a number, but somehow it feels like so much more. Conversations, random laughs,
          late nights, missing each other, annoying each other, making up — and a whole lot of reasons to smile.
        </p>

        <Divider className="my-8" />

        {/* Timeline */}
        <div className="text-left">
          <p className={`reveal ${shown ? 'in' : ''} mb-1 text-center font-sans text-[11px] uppercase tracking-widest2 text-blush-300/80`} style={{ animationDelay: '240ms' }}>
            Six Months of Us
          </p>
          <Timeline />
        </div>

        {/* You & Me */}
        <div className="mt-14">
          <p className={`reveal ${shown ? 'in' : ''} font-display text-2xl text-cream sm:text-3xl`} style={{ animationDelay: '200ms' }}>
            You. Me. <span className="text-blush-300">Us.</span>
          </p>
          <YouMeGrid />
          <p className={`reveal ${shown ? 'in' : ''} mt-8 font-display text-lg italic text-blush-200 sm:text-xl`} style={{ animationDelay: '600ms' }}>
            That's probably my favorite thing about us.
          </p>
        </div>

        <div className={`reveal ${shown ? 'in' : ''} mt-10 flex flex-col items-center gap-3`} style={{ animationDelay: '720ms' }}>
          <ContinueButton href="#ch2">Keep going</ContinueButton>
          <span className="flex items-center gap-1 font-sans text-[10px] uppercase tracking-widest2 text-cream/30">
            <ArrowDown className="h-3 w-3" /> little things
          </span>
        </div>
      </div>
    </SectionShell>
  );
}
