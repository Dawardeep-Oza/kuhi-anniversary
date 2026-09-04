import { useCallback, useEffect, useRef, useState } from 'react';
import BonusEntry from './BonusEntry';
import BonusFireworks from './pages/BonusFireworks';
import BonusFirecracker from './pages/BonusFirecracker';
import BonusMysteryBoxes from './pages/BonusMysteryBoxes';
import BonusBalloons from './pages/BonusBalloons';
import BonusConstellation from './pages/BonusConstellation';
import BonusWifeyMachine from './pages/BonusWifeyMachine';
import BonusCandles from './pages/BonusCandles';
import BonusDontPress from './pages/BonusDontPress';
import BonusInfiniteButton from './pages/BonusInfiniteButton';
import BonusMakeAWish from './pages/BonusMakeAWish';
import BonusFinalShow from './pages/BonusFinalShow';
import BonusSecretExit from './pages/BonusSecretExit';

/**
 * Orchestrates the 12 bonus experiences.
 *
 * -1 = entry screen
 * 0  = fireworks
 * 1  = firecracker
 * 2  = mystery boxes
 * 3  = balloons
 * 4  = constellation
 * 5  = wifey machine
 * 6  = candles
 * 7  = don't press
 * 8  = infinite button
 * 9  = make a wish
 * 10 = final show
 * 11 = secret exit
 */
export default function BonusHub() {
  const [page, setPage] = useState(-1);
  const [transitioning, setTransitioning] = useState(false);

  // Reference to the bonus section itself.
  // We NEVER scroll the entire website to window top.
  const bonusRef = useRef<HTMLDivElement | null>(null);

  const transitionTimeoutRef = useRef<number | null>(null);

  const goNext = useCallback(() => {
    // Prevent multiple clicks while transitioning
    if (transitioning) return;

    setTransitioning(true);

    transitionTimeoutRef.current = window.setTimeout(() => {
      setPage((currentPage) => currentPage + 1);
      setTransitioning(false);
    }, 400);
  }, [transitioning]);

  /*
   * When moving between bonus experiences, keep the user
   * inside the Bonus section.
   *
   * IMPORTANT:
   * We scroll to BonusHub itself, NOT window top.
   *
   * This prevents the website from jumping back to Page 1.
   */
  useEffect(() => {
    if (page < 0) return;

    const scrollToBonusSection = () => {
      const el = bonusRef.current;
      if (!el) return;
      try {
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
      } catch {
        el.scrollIntoView();
      }
    };

    // Wait until the new page has rendered.
    const frame = window.requestAnimationFrame(scrollToBonusSection);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [page]);

  /*
   * Clean up transition timer if BonusHub is unmounted.
   */
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={bonusRef}
      className={`relative min-h-[100svh] transition-opacity duration-300 ${
        transitioning ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {page === -1 && <BonusEntry onEnter={goNext} />}

      {page === 0 && <BonusFireworks onNext={goNext} />}

      {page === 1 && <BonusFirecracker onNext={goNext} />}

      {page === 2 && <BonusMysteryBoxes onNext={goNext} />}

      {page === 3 && <BonusBalloons onNext={goNext} />}

      {page === 4 && <BonusConstellation onNext={goNext} />}

      {page === 5 && <BonusWifeyMachine onNext={goNext} />}

      {page === 6 && <BonusCandles onNext={goNext} />}

      {page === 7 && <BonusDontPress onNext={goNext} />}

      {page === 8 && <BonusInfiniteButton onNext={goNext} />}

      {page === 9 && <BonusMakeAWish onNext={goNext} />}

      {page === 10 && <BonusFinalShow onNext={goNext} />}

      {page === 11 && <BonusSecretExit />}
    </div>
  );
}
