import { useEffect, useState } from 'react';
import {
  Moon, Infinity as Inf, Smile, Heart, Ban, Sparkles, ArrowDown, Check,
} from 'lucide-react';
import { SectionShell, Eyebrow, ContinueButton, Divider, Glow } from '../ui';
import { useReveal } from '../../hooks/useReveal';

/* ---------- Stats dashboard ---------- */

type Stat = { value: string; label: string; icon: typeof Heart; countTo?: number; display?: string };

const STATS: Stat[] = [
  { value: '6', label: 'Months Together', icon: Heart, countTo: 6 },
  { value: '∞', label: "Times I've thought about you", icon: Inf },
  { value: '∞', label: "Times I'll choose you", icon: Sparkles },
  { value: 'Too many', label: 'Late night conversations', icon: Moon },
  { value: 'Uncountable', label: 'Reasons to smile', icon: Smile },
  { value: '0', label: 'Chances of getting rid of me', icon: Ban, countTo: 0 },
];

function CountUp({ to }: { to: number }) {
  const { ref, shown } = useReveal<HTMLSpanElement>();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!shown) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1200;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shown, to]);
  return <span ref={ref}>{shown ? n : 0}</span>;
}

function StatCard({ s, i, shown }: { s: Stat; i: number; shown: boolean }) {
  const Icon = s.icon;
  return (
    <div
      className={`reveal ${shown ? 'in' : ''} glass flex flex-col items-center justify-center gap-2 rounded-2xl p-5 text-center`}
      style={{ animationDelay: `${i * 90}ms` }}
    >
      <Icon className="h-5 w-5 text-blush-300/70" aria-hidden />
      <div className="font-display text-3xl font-light text-blush-300 sm:text-4xl">
        {s.countTo !== undefined ? <CountUp to={s.countTo} /> : s.value}
      </div>
      <div className="font-sans text-[10px] uppercase tracking-widest2 text-cream/55">{s.label}</div>
    </div>
  );
}

/* ---------- Pick a card ---------- */

const PICK_CARDS = [
  "You make ordinary days better.",
  "I hope you know how loved you are.",
  "Distance doesn't change my favorite person.",
  "I still get happy when I see your name.",
  "You're my favorite notification.",
  "You're stuck with me.",
  "I'd choose you again.",
  "I'm keeping you.",
  "More memories are coming.",
  "You make me smile without trying.",
  "Wifey supremacy.",
  "Forever sounds pretty good.",
];

function PickACard() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const [revealed, setRevealed] = useState<number[]>([]);
  const [allDone, setAllDone] = useState(false);

  const toggle = (i: number) => {
    setRevealed((prev) => {
      const next = prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i];
      setAllDone(next.length === PICK_CARDS.length);
      return next;
    });
  };

  return (
    <div ref={ref} className="mt-12">
      <p className={`reveal ${shown ? 'in' : ''} font-display text-2xl text-cream sm:text-3xl`}>Pick one.</p>
      <p className={`reveal ${shown ? 'in' : ''} mt-1 font-sans text-xs text-cream/50`} style={{ animationDelay: '80ms' }}>
        Or pick all of them. I don't mind.
      </p>

      <div className="mt-5 grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3">
        {PICK_CARDS.map((msg, i) => {
          const isOpen = revealed.includes(i);
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={`relative flex aspect-[3/4] items-center justify-center rounded-xl border p-3 text-center transition-all duration-500 ${
                isOpen
                  ? 'border-blush-300/50 bg-blush-500/10'
                  : 'border-gold-400/25 bg-navy-800/60 hover:border-gold-400/50 hover:bg-navy-700/60'
              }`}
              aria-label={isOpen ? msg : 'A face-down card'}
            >
              {isOpen ? (
                <span className="font-hand text-sm leading-snug text-cream/90 animate-flipIn">{msg}</span>
              ) : (
                <span className="text-2xl text-gold-300/40">❤</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-cream/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blush-400 to-gold-400 transition-all duration-500"
          style={{ width: `${(revealed.length / PICK_CARDS.length) * 100}%` }}
        />
      </div>

      {allDone && (
        <div className="mt-6 animate-fadeUp space-y-1 text-center">
          <p className="font-display text-lg italic text-blush-200">Okay, you found them all.</p>
          <p className="font-display text-xl text-cream">But I still have more to say.</p>
        </div>
      )}
    </div>
  );
}

/* ---------- Quiz ---------- */

type Q = { q: string; options: string[]; answer: number; wrong: string };

const QUIZ: Q[] = [
  {
    q: 'What does Dawar call Kuhi?',
    options: ['Babe', 'Wifey', 'Kuhi', 'Hey you'],
    answer: 1,
    wrong: 'Close. But "Wifey" is the official title around here.',
  },
  {
    q: 'Who is the favorite person?',
    options: ['The cat', 'Kuhi', 'My phone', 'Trick question — Kuhi', ],
    answer: 3,
    wrong: 'It was Kuhi. But the trick version is also Kuhi.',
  },
  {
    q: 'What is the official duration of this chaos?',
    options: ['6 days', '6 weeks', '6 months', '6 lifetimes'],
    answer: 2,
    wrong: 'Six months. Feels like six lifetimes (the good kind).',
  },
  {
    q: "What happens if Kuhi tries to escape?",
    options: ['She escapes', 'Not happening', 'A chase scene', 'Negotiations begin'],
    answer: 1,
    wrong: 'Not happening. Stuck with me, remember?',
  },
  {
    q: "How many chances of getting rid of Dawar?",
    options: ['Many', 'A few', 'One', 'Zero'],
    answer: 3,
    wrong: 'Zero. The report was very clear on this.',
  },
  {
    q: 'What is Dawar’s favorite hobby?',
    options: ['Being annoying', 'Missing Kuhi', 'Both', 'Sleep'],
    answer: 2,
    wrong: 'Both. Definitely both.',
  },
];

function Quiz() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === QUIZ[step].answer) setScore((s) => s + 1);
  };
  const next = () => {
    if (step + 1 >= QUIZ.length) {
      setDone(true);
    } else {
      setStep((s) => s + 1);
      setPicked(null);
    }
  };

  if (done) {
    return (
      <div ref={ref} className={`reveal ${shown ? 'in' : ''} mt-12 text-center`}>
        <div className="glass-strong rounded-3xl p-7">
          <div className="mb-3 flex items-center justify-center gap-2 text-gold-300">
            <Sparkles className="h-5 w-5" /> <span className="font-sans text-xs uppercase tracking-widest2">Quiz Complete</span>
          </div>
          <p className="font-display text-3xl text-blush-300">{score} / {QUIZ.length}</p>
          <p className="mt-4 font-display text-xl italic text-cream/90">Congratulations.</p>
          <p className="mt-1 font-sans text-sm text-cream/70">You know us pretty well.</p>
          <p className="mt-3 font-hand text-lg text-blush-200">But I'm still keeping some secrets.</p>
          <button
            onClick={() => { setDone(false); setStep(0); setPicked(null); setScore(0); }}
            className="mt-5 rounded-full border border-cream/20 px-5 py-2 font-sans text-xs text-cream/70 transition-colors hover:border-blush-300/50 hover:text-blush-100"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const q = QUIZ[step];
  return (
    <div ref={ref} className={`reveal ${shown ? 'in' : ''} mt-12`}>
      <div className="mb-3 flex items-center justify-between">
        <span className="font-sans text-[11px] uppercase tracking-widest2 text-blush-300/80">
          How well do you know your Dawar?
        </span>
        <span className="font-sans text-[10px] text-cream/40">{step + 1} / {QUIZ.length}</span>
      </div>
      <div className="glass-strong rounded-3xl p-6">
        <p className="font-display text-xl text-cream sm:text-2xl">{q.q}</p>
        <div className="mt-4 flex flex-col gap-2.5">
          {q.options.map((opt, i) => {
            const isPicked = picked === i;
            const isAnswer = i === q.answer;
            const reveal = picked !== null;
            return (
              <button
                key={i}
                onClick={() => choose(i)}
                disabled={reveal}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left font-sans text-sm transition-all duration-300 ${
                  reveal && isAnswer
                    ? 'border-gold-400/60 bg-gold-500/15 text-gold-200'
                    : reveal && isPicked && !isAnswer
                    ? 'border-blush-700/60 bg-blush-800/20 text-cream/60'
                    : 'border-cream/10 bg-white/[0.03] text-cream/80 hover:border-blush-300/30'
                }`}
              >
                <span>{opt}</span>
                {reveal && isAnswer && <Check className="h-4 w-4 text-gold-300" />}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <div className="mt-4 animate-fadeIn">
            <p className="font-hand text-base text-blush-200">
              {picked === q.answer ? "Correct. You're paying attention." : q.wrong}
            </p>
            <button
              onClick={next}
              className="mt-3 rounded-full border border-blush-300/40 bg-blush-500/10 px-5 py-2 font-sans text-xs text-blush-100 transition-colors hover:bg-blush-500/20"
            >
              {step + 1 >= QUIZ.length ? 'See result' : 'Next question'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Chapter ---------- */

export default function ChapterChaos() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <SectionShell id="ch3">
      <Glow className="-top-10 right-10 h-48 w-48" color="burgundy" />
      <Glow className="bottom-20 left-5 h-44 w-44" color="gold" />
      <div ref={ref} className="text-center">
        <Eyebrow>Chapter 03 — The Chaos</Eyebrow>
        <h2 className={`reveal ${shown ? 'in' : ''} font-display text-3xl font-light text-cream sm:text-5xl`}>
          The Official Kuhi &amp; Wifey Report
        </h2>
        <p className={`reveal ${shown ? 'in' : ''} mt-2 font-sans text-xs uppercase tracking-widest2 text-cream/40`} style={{ animationDelay: '120ms' }}>
          (highly scientific, completely made up)
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {STATS.map((s, i) => (
            <StatCard key={i} s={s} i={i} shown={shown} />
          ))}
        </div>

        <p className={`reveal ${shown ? 'in' : ''} mt-7 font-display text-xl italic text-blush-200 sm:text-2xl`} style={{ animationDelay: '600ms' }}>
          Sorry Wifey. You're stuck with me.
        </p>

        <Divider className="my-10" />

        <PickACard />
        <Divider className="my-10" />
        <Quiz />

        <div className={`reveal ${shown ? 'in' : ''} mt-10 flex flex-col items-center gap-3`} style={{ animationDelay: '400ms' }}>
          <ContinueButton href="#ch4">Keep going</ContinueButton>
          <span className="flex items-center gap-1 font-sans text-[10px] uppercase tracking-widest2 text-cream/30">
            <ArrowDown className="h-3 w-3" /> for kuhi
          </span>
        </div>
      </div>
    </SectionShell>
  );
}
