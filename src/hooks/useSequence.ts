import { useEffect, useRef, useState } from 'react';

/**
 * Reveals an array of text lines one at a time with a delay.
 * Each line fades/slides in. Returns the number of lines shown so far
 * and a flag once all are visible.
 *
 * The `lines` array is stored in a ref so that callers passing a new
 * array reference each render (e.g. `lines.map(...)`) don't trigger an
 * effect restart that would reset the sequence to zero.
 */
export function useSequence(lines: string[], baseDelay = 900, stepDelay = 1400) {
  const [count, setCount] = useState(0);
  const linesRef = useRef(lines);
  linesRef.current = lines;

  // Restart the sequence only when the actual content or timing changes,
  // not when the caller passes a new array reference with the same content.
  const signature = lines.join('\u0000');

  useEffect(() => {
    setCount(0);
    const timers: number[] = [];
    const current = linesRef.current;
    current.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => setCount(i + 1), baseDelay + i * stepDelay)
      );
    });
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, baseDelay, stepDelay]);

  const done = count >= linesRef.current.length;
  return { count, done };
}
