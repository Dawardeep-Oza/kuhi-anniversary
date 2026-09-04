import { useEffect, useState } from 'react';
import {
  Coffee, Film, Sofa, Moon, Headphones, Phone, Heart, ArrowDown, MapPin, X,
} from 'lucide-react';
import { SectionShell, Eyebrow, ContinueButton, Divider, Glow } from '../ui';
import { useReveal } from '../../hooks/useReveal';

/* ---------- Star map ---------- */

const DISTANCE_LINES = [
  'Different places.',
  'Same little universe.',
  'Distance is annoying.',
  "But it doesn't get to decide how much I love you.",
  "One day we'll look back at this distance and laugh about how dramatic it felt.",
];

function StarMap() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const [visible, setVisible] = useState(0);
  const [closer, setCloser] = useState(false);

  useEffect(() => {
    if (!shown) return;
    const timers: number[] = [];
    DISTANCE_LINES.forEach((_, i) =>
      timers.push(window.setTimeout(() => setVisible(i + 1), 700 + i * 1800))
    );
    return () => timers.forEach(clearTimeout);
  }, [shown]);

  return (
    <div ref={ref} className="mt-8">
      <div className="relative mx-auto h-48 w-full max-w-md">
        {/* left point — KUHI */}
        <div
          className="absolute top-1/2 flex -translate-y-1/2 flex-col items-center gap-2 transition-all duration-[2500ms] ease-out"
          style={{ left: closer ? '42%' : '4%' }}
        >
          <span className="h-4 w-4 rounded-full bg-blush-400 shadow-[0_0_24px_8px_rgba(247,106,140,0.55)] animate-pulseGlow" />
          <span className="font-sans text-[11px] tracking-widest2 text-blush-200">KUHI</span>
        </div>
        {/* right point — ME (Dawar) */}
        <div
          className="absolute top-1/2 flex -translate-y-1/2 flex-col items-center gap-2 transition-all duration-[2500ms] ease-out"
          style={{ right: closer ? '42%' : '4%' }}
        >
          <span className="h-4 w-4 rounded-full bg-gold-400 shadow-[0_0_24px_8px_rgba(230,196,106,0.5)] animate-pulseGlow" />
          <span className="font-sans text-[11px] tracking-widest2 text-gold-300">ME</span>
        </div>
        {/* connecting line */}
        <div className="absolute top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-blush-400/70 via-cream/40 to-gold-400/70 animate-lineGrow"
          style={{ left: '12%', right: '12%' }} />
        {/* middle marker */}
        <MapPin className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-cream/30" aria-hidden />
        {/* decorative tiny stars */}
        {[
          { l: '10%', t: '15%' }, { l: '85%', t: '20%' }, { l: '30%', t: '80%' },
          { l: '70%', t: '75%' }, { l: '50%', t: '10%' }, { l: '20%', t: '50%' },
        ].map((s, i) => (
          <span key={i} className="absolute h-1 w-1 rounded-full bg-cream/40 animate-twinkle" style={{ left: s.l, top: s.t, animationDelay: `${i * 0.5}s` }} />
        ))}
      </div>

      <div className="mt-6 space-y-4 text-center">
        {DISTANCE_LINES.map((l, i) => (
          <p
            key={i}
            className={`font-display text-lg italic leading-snug transition-all duration-700 sm:text-xl ${
              i < visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            } ${i === 3 ? 'text-blush-200' : i === 4 ? 'text-cream/70' : 'text-cream/90'}`}
          >
            {l}
          </p>
        ))}
      </div>

      {visible >= DISTANCE_LINES.length && (
        <div className="mt-7 text-center animate-fadeIn">
          {closer ? (
            <p className="font-display text-xl italic text-blush-300">See? Not so far.</p>
          ) : (
            <button
              onClick={() => setCloser(true)}
              className="group inline-flex items-center gap-2 rounded-full border border-blush-300/40 bg-blush-500/10 px-6 py-3 font-sans text-sm text-blush-100 transition-all duration-300 hover:border-blush-300/70 hover:bg-blush-500/20 hover:text-white active:scale-95"
            >
              Someday <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Interactive room scene ---------- */

type Scene = { id: string; icon: typeof Coffee; label: string; msg: string; x: string; y: string };

const SCENES: Scene[] = [
  { id: 'coffee', icon: Coffee, label: 'Coffee', msg: "We'd probably say we're going for coffee and somehow stay there for three hours.", x: '18%', y: '30%' },
  { id: 'movie', icon: Film, label: 'Movie', msg: "We'd spend more time talking than watching. And neither of us would mind.", x: '72%', y: '28%' },
  { id: 'sofa', icon: Sofa, label: 'Sofa', msg: "The official headquarters of doing absolutely nothing together.", x: '50%', y: '58%' },
  { id: 'window', icon: Moon, label: 'Window', msg: "Finally, no screen between us. Just a window, and you.", x: '86%', y: '62%' },
  { id: 'music', icon: Headphones, label: 'Music', msg: "You'd play something, I'd pretend to hate it, I'd secretly love it.", x: '32%', y: '70%' },
  { id: 'phone', icon: Phone, label: 'Phone', msg: "Probably unnecessary because you'd be sitting right next to me.", x: '60%', y: '38%' },
  { id: 'seats', icon: Heart, label: 'Two seats', msg: "This one is my favorite. Just us, sitting next to each other, finally.", x: '44%', y: '40%' },
];

function RoomScene() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const [active, setActive] = useState<string | null>(null);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const activeScene = SCENES.find((s) => s.id === active);

  const open = (id: string) => {
    setActive(id);
    setVisited((prev) => new Set(prev).add(id));
  };

  return (
    <div ref={ref} className={`reveal ${shown ? 'in' : ''} mt-12`}>
      <p className="text-center font-display text-2xl text-cream sm:text-3xl">If We Were Together Right Now</p>
      <p className="mt-1 text-center font-sans text-xs text-cream/50">Tap around the room. Find the little scenes.</p>

      <div className="relative mx-auto mt-6 aspect-[4/3] w-full max-w-lg overflow-hidden rounded-3xl border border-cream/10 bg-gradient-to-b from-navy-800/60 to-navy-900/80">
        {/* ambient room gradient */}
        <div aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(60% 50% at 50% 40%, rgba(247,106,140,0.12), transparent 70%)' }} />
        {/* floor line */}
        <div aria-hidden className="absolute bottom-[18%] left-0 right-0 h-px bg-cream/10" />
        {/* window glow */}
        <div aria-hidden className="absolute right-[8%] top-[12%] h-16 w-20 rounded-lg border border-gold-400/20 bg-gold-300/5" />

        {SCENES.map((s) => {
          const Icon = s.icon;
          const isVisited = visited.has(s.id);
          return (
            <button
              key={s.id}
              onClick={() => open(s.id)}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: s.x, top: s.y }}
              aria-label={s.label}
            >
              <span className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 sm:h-12 sm:w-12 ${
                active === s.id
                  ? 'border-blush-300 bg-blush-500/25 shadow-[0_0_16px_4px_rgba(247,106,140,0.4)]'
                  : 'border-cream/15 bg-navy-800/70 hover:border-blush-300/50 hover:bg-blush-500/15'
              }`}>
                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${isVisited ? 'text-blush-300' : 'text-cream/70'}`} aria-hidden />
              </span>
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-sans text-[9px] uppercase tracking-widest2 text-cream/40 opacity-0 transition-opacity group-hover:opacity-100">
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* progress of discovered scenes */}
      <div className="mt-3 flex items-center justify-center gap-1.5">
        {SCENES.map((s) => (
          <span key={s.id} className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${visited.has(s.id) ? 'bg-blush-400' : 'bg-cream/15'}`} />
        ))}
      </div>

      {/* active scene message */}
      {activeScene && (
        <div className="mt-5 animate-fadeUp">
          <div className="glass-strong relative mx-auto max-w-md rounded-2xl p-5 text-center">
            <button
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute right-3 top-3 text-cream/40 hover:text-cream"
            >
              <X className="h-4 w-4" />
            </button>
            <activeScene.icon className="mx-auto mb-2 h-5 w-5 text-blush-300" aria-hidden />
            <p className="font-sans text-[10px] uppercase tracking-widest2 text-blush-300/70">{activeScene.label}</p>
            <p className="mt-2 font-hand text-lg leading-snug text-cream/90">{activeScene.msg}</p>
          </div>
        </div>
      )}

      {visited.size === SCENES.length && !activeScene && (
        <p className="mt-5 text-center font-display text-lg italic text-blush-200 animate-fadeIn">
          That's the room. Now imagine it for real.
        </p>
      )}
    </div>
  );
}

/* ---------- Chapter ---------- */

export default function ChapterDistance() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <SectionShell id="ch5">
      <Glow className="top-10 right-10 h-52 w-52" color="burgundy" />
      <Glow className="bottom-10 left-10 h-44 w-44" color="gold" />
      <div ref={ref} className="text-center">
        <Eyebrow>Chapter 05 — Distance</Eyebrow>
        <h2 className={`reveal ${shown ? 'in' : ''} font-display text-4xl font-light text-cream sm:text-6xl`}>
          The Distance
        </h2>
        <p className={`reveal ${shown ? 'in' : ''} mx-auto mt-5 max-w-lg font-sans text-sm leading-relaxed text-cream/70 sm:text-base`} style={{ animationDelay: '140ms' }}>
          We're in two different places. That's just how it is right now. But the distance doesn't
          get the final say.
        </p>

        <Divider className="my-8" />
        <StarMap />
        <Divider className="my-10" />
        <RoomScene />

        <div className={`reveal ${shown ? 'in' : ''} mt-10 flex flex-col items-center gap-3`} style={{ animationDelay: '400ms' }}>
          <ContinueButton href="#ch6">Keep going</ContinueButton>
          <span className="flex items-center gap-1 font-sans text-[10px] uppercase tracking-widest2 text-cream/30">
            <ArrowDown className="h-3 w-3" /> our future
          </span>
        </div>
      </div>
    </SectionShell>
  );
}
