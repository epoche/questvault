import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * iPad / iOS Safari & PWA virtual keyboard safe-area helper.
 * Tracks `window.visualViewport` keyboard height (safely guarded for strict sandboxes)
 * and keeps the focused input smoothly scrolled above the on-screen keyboard with
 * sufficient bottom scroll room.
 */
export function useKeyboardSafeArea() {
  const [isFocused, setIsFocused] = useState(false);
  const [keyboardInsetPx, setKeyboardInsetPx] = useState(0);
  const scrollTimerRef = useRef<number | null>(null);
  const blurTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let vv: VisualViewport | null = null;
    try {
      vv = window.visualViewport ?? null;
    } catch {
      vv = null;
    }
    if (!vv) return;

    const updateInset = () => {
      try {
        if (!vv) return;
        // Ignore pinch-zoom resizing so bottom padding stays stable
        if (typeof vv.scale === 'number' && vv.scale > 1.02) return;
        const inset = Math.max(0, Math.round(window.innerHeight - vv.height));
        setKeyboardInsetPx(inset > 80 ? inset : 0);
      } catch {
        // Ignore restricted visualViewport reads
      }
    };

    updateInset();
    try {
      vv.addEventListener('resize', updateInset);
    } catch {
      // Ignore sandbox event restrictions
    }

    return () => {
      try {
        vv?.removeEventListener('resize', updateInset);
      } catch {
        // Ignore cleanup errors
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current !== null) {
        window.clearTimeout(scrollTimerRef.current);
        scrollTimerRef.current = null;
      }
      if (blurTimerRef.current !== null) {
        window.clearTimeout(blurTimerRef.current);
        blurTimerRef.current = null;
      }
    };
  }, []);

  const scrollElementIntoView = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    const doScroll = () => {
      try {
        if (typeof el.scrollIntoView === 'function') {
          el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
      } catch {
        try {
          el.scrollIntoView();
        } catch {
          // Ignore happy-dom / sandbox scrollIntoView limitations
        }
      }
    };

    doScroll();
    if (scrollTimerRef.current !== null) {
      window.clearTimeout(scrollTimerRef.current);
    }
    // Re-center after iPad Safari finishes animating the on-screen keyboard (~280ms)
    scrollTimerRef.current = window.setTimeout(() => {
      scrollTimerRef.current = null;
      doScroll();
    }, 300);
  }, []);

  const handleFocus = useCallback(
    (el: HTMLElement | null) => {
      if (blurTimerRef.current !== null) {
        window.clearTimeout(blurTimerRef.current);
        blurTimerRef.current = null;
      }
      setIsFocused(true);
      scrollElementIntoView(el);
    },
    [scrollElementIntoView],
  );

  const handleBlur = useCallback(() => {
    // Delay collapsing bottom padding by ~220ms so tapping Open Chest / Quick-Start /
    // Insert buttons while the keyboard is open does not shift the button before onClick fires.
    if (blurTimerRef.current !== null) {
      window.clearTimeout(blurTimerRef.current);
    }
    blurTimerRef.current = window.setTimeout(() => {
      blurTimerRef.current = null;
      setIsFocused(false);
    }, 220);
  }, []);

  // Provide generous scrollable space below the card whenever focused on touch/iPad
  // so Safari can always scroll the textarea + checks cleanly above the virtual keyboard.
  const bottomPaddingPx = isFocused ? Math.max(keyboardInsetPx + 140, 320) : 0;

  return {
    isFocused,
    keyboardInsetPx,
    bottomPaddingPx,
    handleFocus,
    handleBlur,
    scrollElementIntoView,
  };
}
