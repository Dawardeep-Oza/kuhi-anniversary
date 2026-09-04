import { useEffect, useRef, useState } from 'react';
import Starfield from './components/Starfield';
import CursorGlow from './components/CursorGlow';
import MusicControl from './components/MusicControl';
import ProgressDots from './components/ProgressDots';
import SecretStar from './components/SecretStar';
import Opening from './components/Opening';
import ChapterUs from './components/chapters/ChapterUs';
import ChapterLittleThings from './components/chapters/ChapterLittleThings';
import ChapterChaos from './components/chapters/ChapterChaos';
import ChapterForKuhi from './components/chapters/ChapterForKuhi';
import ChapterDistance from './components/chapters/ChapterDistance';
import ChapterFuture from './components/chapters/ChapterFuture';
import ChapterLast from './components/chapters/ChapterLast';
import BonusHub from './components/bonus/BonusHub';

const CHAPTER_IDS = ['ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6', 'ch7'];

export default function App() {
  const [entered, setEntered] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [active, setActive] = useState(0);
  const mainRef = useRef<HTMLDivElement | null>(null);

  const handleEnter = () => {
    setLeaving(true);
    window.setTimeout(() => {
      setEntered(true);
      setLeaving(false);
      window.scrollTo({ top: 0 });
    }, 900);
  };

  useEffect(() => {
    if (!entered) return;
    const observers: IntersectionObserver[] = [];
    CHAPTER_IDS.forEach((id, idx) => {
      const el = document.getElementById(id);
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setActive(idx + 1);
          });
        },
        { threshold: 0.35 }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [entered]);

  return (
    <div className="relative min-h-[100svh] w-full overflow-x-hidden bg-navy-950">
      {/* ambient gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(120% 80% at 50% -10%, rgba(143,42,68,0.22) 0%, rgba(6,9,18,0) 45%), radial-gradient(80% 60% at 85% 110%, rgba(212,168,74,0.07) 0%, rgba(6,9,18,0) 50%), radial-gradient(70% 50% at 10% 50%, rgba(247,106,140,0.06) 0%, rgba(6,9,18,0) 55%)',
        }}
      />
      <Starfield />
      <CursorGlow />

      {!entered && (
        <div className={`transition-all duration-700 ${leaving ? 'scale-110 opacity-0 blur-md' : 'scale-100 opacity-100'}`}>
          <Opening onEnter={handleEnter} />
        </div>
      )}

      {entered && (
        <main ref={mainRef} className="relative z-10 animate-fadeIn">
          <ChapterUs />
          <ChapterLittleThings />
          <ChapterChaos />
          <ChapterForKuhi />
          <ChapterDistance />
          <ChapterFuture />
          <ChapterLast />
          <BonusHub />
        </main>
      )}

      <ProgressDots active={active} />
      <MusicControl />
      {entered && <SecretStar />}
    </div>
  );
}