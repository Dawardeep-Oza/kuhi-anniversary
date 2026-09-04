import { useEffect, useRef, useState } from 'react';
import { Music, VolumeX } from 'lucide-react';

/**
 * Optional ambient music control. Uses a soft generative tone via WebAudio
 * (no external file, no autoplay) so it works offline and never autoplays.
 * Tap to start a slow ambient pad; tap again to stop.
 */
export default function MusicControl() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    return () => {
      nodesRef.current?.stop();
      ctxRef.current?.close();
    };
  }, []);

  const start = () => {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    const ctx = ctxRef.current ?? new AC();
    ctxRef.current = ctx;
    if (ctx.state === 'suspended') ctx.resume();

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    // soft pad: two detuned sine partials + slow LFO on filter
    const freqs = [196, 261.63, 329.63]; // G3 C4 E4 — soft major
    const oscs = freqs.map((f, i) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      o.detune.value = i * 4;
      const g = ctx.createGain();
      g.gain.value = 0.18 / freqs.length;
      o.connect(g).connect(master);
      o.start();
      return o;
    });

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.05;
    lfo.connect(lfoGain).connect(master.gain);
    lfo.start();

    master.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 2.5);

    nodesRef.current = {
      stop: () => {
        const t = ctx.currentTime;
        master.gain.cancelScheduledValues(t);
        master.gain.linearRampToValueAtTime(0, t + 1.2);
        oscs.forEach((o) => o.stop(t + 1.3));
        lfo.stop(t + 1.3);
      },
    };
  };

  const stop = () => {
    nodesRef.current?.stop();
    nodesRef.current = null;
  };

  const toggle = () => {
    if (on) {
      stop();
      setOn(false);
    } else {
      start();
      setOn(true);
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={on ? 'Pause music' : 'Play music'}
      aria-pressed={on}
      className="glass fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full text-cream/80 transition-all duration-300 hover:scale-105 hover:text-blush-200 active:scale-95 sm:bottom-7 sm:right-7"
    >
      <Music
        className={`h-4 w-4 ${on ? 'animate-pulse text-blush-300' : ''}`}
        aria-hidden
      />
      {on && (
        <span className="absolute inset-0 rounded-full border border-blush-300/40 animate-ping" />
      )}
      <span className="sr-only">{on ? 'Music on' : 'Music off'}</span>
      {on ? null : <VolumeX className="sr-only" />}
    </button>
  );
}
