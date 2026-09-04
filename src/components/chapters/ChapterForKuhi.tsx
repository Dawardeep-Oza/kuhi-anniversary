import { useEffect, useRef, useState } from 'react';
import { Mail, Shuffle, ArrowDown } from 'lucide-react';
import { SectionShell, Eyebrow, ContinueButton, Divider, Glow } from '../ui';
import { useReveal } from '../../hooks/useReveal';

/* ---------- Typewriter ---------- */

function Typewriter({ text, speed = 28, onDone, start }: {
  text: string; speed?: number; onDone?: () => void; start: boolean;
}) {
  const [out, setOut] = useState('');
  const doneRef = useRef(false);

  useEffect(() => {
    if (!start) return;
    let i = 0;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      if (now - last >= speed) {
        i += 1;
        setOut(text.slice(0, i));
        last = now;
      }
      if (i < text.length) {
        raf = requestAnimationFrame(tick);
      } else if (!doneRef.current) {
        doneRef.current = true;
        onDone?.();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, text, speed]);

  return <span className={start && out.length < text.length ? 'cursor-blink' : ''}>{out}</span>;
}

/* ---------- Letter ---------- */

const LETTER_PARAS: string[] = [
  "Kuhi, six months. I still can't quite believe it's been that long, and at the same time it feels like you've been around for way longer.",
  "I genuinely love having you in my life. Not in a dramatic, movie-kind of way — in the quiet, ordinary, 'you're the first person I want to tell when something happens' kind of way.",
  "The distance isn't always easy. Some days it's honestly annoying. But somehow, you still feel close. Closer than a lot of people who are actually nearby.",
  "I appreciate the little bond we've built — the random conversations, the inside jokes, the way we can be ridiculous together and serious together in the same hour.",
  "I don't need everything to be perfect. I just want us to keep growing, keep figuring it out, keep making memories — even the small, unglamorous ones.",
  "I want to keep choosing you. Not because I have to, but because nothing else has ever made this much sense to me.",
];

const LETTER_END: { text: string; strong?: boolean }[] = [
  { text: "I don't know what every year ahead of us will look like." },
  { text: "But I know who I want beside me while we find out." },
  { text: "You.", strong: true },
  { text: "I'll keep loving you, Wifey.", strong: true },
  { text: "For a very, very long time." },
  { text: "And if forever gets a chance to happen," },
  { text: "I hope it's with you.", strong: true },
];

function Letter() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const [paraIdx, setParaIdx] = useState(-1);
  const [endIdx, setEndIdx] = useState(-1);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!shown) return;
    const t = window.setTimeout(() => setParaIdx(0), 500);
    return () => clearTimeout(t);
  }, [shown]);

  const onParaDone = () => {
    if (paraIdx < LETTER_PARAS.length - 1) setParaIdx((i) => i + 1);
    else if (endIdx === -1) setEndIdx(0);
  };
  const onEndDone = () => {
    if (endIdx < LETTER_END.length - 1) setEndIdx((i) => i + 1);
    else setFinished(true);
  };

  const canAdvance = shown &&
    ((paraIdx >= 0 && paraIdx < LETTER_PARAS.length - 1) ||
     (paraIdx === LETTER_PARAS.length - 1 && endIdx === -1) ||
     (endIdx >= 0 && endIdx < LETTER_END.length - 1));

  return (
    <div ref={ref} className="mx-auto max-w-xl">
      <div className="glass-strong rounded-3xl p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-2 text-blush-300">
          <Mail className="h-4 w-4" aria-hidden />
          <span className="font-sans text-[11px] uppercase tracking-widest2">A letter for you</span>
        </div>

        <div className="space-y-4 text-left">
          {LETTER_PARAS.map((p, i) => {
            if (i > paraIdx) return null;
            return (
              <p key={i} className="font-hand text-lg leading-relaxed text-cream/90 sm:text-xl">
                <Typewriter text={p} start={shown} onDone={i === paraIdx ? onParaDone : undefined} />
              </p>
            );
          })}
        </div>

        {paraIdx >= LETTER_PARAS.length - 1 && paraIdx !== -1 && (
          <div className="mt-6 space-y-2 border-l-2 border-blush-300/40 pl-5 text-left">
            {LETTER_END.map((e, i) => {
              if (i > endIdx) return null;
              return (
                <p
                  key={i}
                  className={`font-hand leading-relaxed ${
                    e.strong ? 'text-xl text-blush-200 sm:text-2xl' : 'text-base text-cream/85 sm:text-lg'
                  }`}
                >
                  <Typewriter text={e.text} start speed={24} onDone={i === endIdx ? onEndDone : undefined} />
                </p>
              );
            })}
            {finished && (
              <p className="mt-3 animate-fadeIn font-display text-2xl text-blush-300">
                Happy 6 months, Wifey. <span className="text-blush-400">❤</span>
              </p>
            )}
          </div>
        )}

        {canAdvance && (
          <button
            onClick={() => {
              if (paraIdx < LETTER_PARAS.length - 1) setParaIdx((i) => i + 1);
              else if (endIdx === -1) setEndIdx(0);
              else setEndIdx((i) => i + 1);
            }}
            className="mt-5 rounded-full border border-blush-300/30 bg-blush-500/10 px-4 py-1.5 font-sans text-[11px] text-blush-100 transition-colors hover:bg-blush-500/20"
          >
            keep reading ↓
          </button>
        )}
        {shown && paraIdx === -1 && (
          <p className="mt-3 font-sans text-xs text-cream/40">writing…</p>
        )}
      </div>
    </div>
  );
}

/* ---------- Love notes ---------- */

const NOTES: string[] = [
  "Just a reminder: you're loved.",
  "I hope you're smiling right now.",
  "You're still my favorite person.",
  "I miss you. A lot.",
  "You're stuck with me. Deal with it.",
  "I'm lucky to have you.",
  "I'd choose you again. And again.",
  "Hi Wifey ❤",
  "Just because.",
  "You make ordinary days feel different.",
  "Thinking about you. (As usual.)",
  "You're my favorite notification.",
  "If annoying you was a sport, I'd be undefeated.",
  "I still get happy when I see your name.",
  "Distance is temporary. You are not.",
  "You're worth every single mile.",
  "I like you more than sleep. And I really like sleep.",
  "Six months and I'd still rather talk to you than anyone.",
  "You're the best thing I didn't plan for.",
  "Forever still sounds pretty good to me.",
];

function LoveNotes() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const [note, setNote] = useState<string | null>(null);
  const [idx, setIdx] = useState(-1);
  const [animKey, setAnimKey] = useState(0);

  const roll = () => {
    let next = idx;
    while (next === idx) next = Math.floor(Math.random() * NOTES.length);
    setIdx(next);
    setNote(NOTES[next]);
    setAnimKey((k) => k + 1);
  };

  return (
    <div ref={ref} className={`reveal ${shown ? 'in' : ''} mt-12 text-center`}>
      <p className="font-display text-2xl text-cream sm:text-3xl">Random Love Notes</p>
      <p className="mt-1 font-sans text-xs text-cream/50">One at a time. Whenever you want.</p>

      <div className="mt-6 flex min-h-[120px] items-center justify-center">
        {note ? (
          <p key={animKey} className="max-w-sm animate-fadeUp font-hand text-2xl leading-snug text-blush-200 sm:text-3xl">
            {note}
          </p>
        ) : (
          <p className="font-sans text-sm text-cream/40">Press the button for a little message.</p>
        )}
      </div>

      <button
        onClick={roll}
        className="group mt-4 inline-flex items-center gap-2 rounded-full border border-blush-300/40 bg-blush-500/10 px-6 py-3 font-sans text-sm text-blush-100 transition-all duration-300 hover:border-blush-300/70 hover:bg-blush-500/20 hover:text-white active:scale-95"
      >
        <Shuffle className="h-4 w-4 transition-transform duration-500 group-hover:rotate-180" aria-hidden />
        Give me a random message <span className="text-blush-300">❤</span>
      </button>
    </div>
  );
}

/* ---------- Chapter ---------- */

export default function ChapterForKuhi() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <SectionShell id="ch4">
      <Glow className="top-10 left-1/4 h-52 w-52" color="blush" />
      <Glow className="bottom-10 right-1/4 h-44 w-44" color="burgundy" />
      <div ref={ref} className="text-center">
        <Eyebrow>Chapter 04 — For Kuhi</Eyebrow>
        <h2 className={`reveal ${shown ? 'in' : ''} font-display text-4xl font-light text-cream sm:text-6xl`}>
          For Kuhi.
        </h2>
        <p className={`reveal ${shown ? 'in' : ''} mt-3 font-sans text-xs uppercase tracking-widest2 text-cream/40`} style={{ animationDelay: '120ms' }}>
          (written, not copied from the internet)
        </p>

        <Divider className="my-8" />
        <Letter />
        <Divider className="my-10" />
        <LoveNotes />

        <div className={`reveal ${shown ? 'in' : ''} mt-10 flex flex-col items-center gap-3`} style={{ animationDelay: '400ms' }}>
          <ContinueButton href="#ch5">Keep going</ContinueButton>
          <span className="flex items-center gap-1 font-sans text-[10px] uppercase tracking-widest2 text-cream/30">
            <ArrowDown className="h-3 w-3" /> distance
          </span>
        </div>
      </div>
    </SectionShell>
  );
}
