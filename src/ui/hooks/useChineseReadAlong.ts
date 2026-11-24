import { useCallback, useEffect, useRef, useState } from 'react';
import { audioService } from '../../core/audio';

/**
 * Reusable interactive Chinese sentence tap-to-read + sequential auto read-along hook.
 * Guarantees strict cleanup (stopSpeech + timer clear + runId invalidation) on passage/episode
 * switch or component unmount, and degrades safely in muted/headless/sandboxed environments.
 */
export function useChineseReadAlong(
  sentences: readonly string[],
  contextKey: string,
  enabled = true,
) {
  const [activeSentenceIdx, setActiveSentenceIdx] = useState<number | null>(null);
  const [isAutoReading, setIsAutoReading] = useState(false);

  const runIdRef = useRef(0);
  const stepTimerRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const sentencesRef = useRef(sentences);
  sentencesRef.current = sentences;

  const clearStepTimer = useCallback(() => {
    if (stepTimerRef.current !== null) {
      window.clearTimeout(stepTimerRef.current);
      stepTimerRef.current = null;
    }
  }, []);

  const stopReadAlong = useCallback(() => {
    runIdRef.current += 1;
    clearStepTimer();
    audioService.stopSpeech();
    if (mountedRef.current) {
      setIsAutoReading(false);
      setActiveSentenceIdx(null);
    }
  }, [clearStepTimer]);

  // Stop & reset cleanly whenever contextKey changes (next passage, episode change, step switch)
  // or when disabled/unmounted.
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      runIdRef.current += 1;
      clearStepTimer();
      audioService.stopSpeech();
    };
  }, [contextKey, enabled, clearStepTimer]);

  // Reset visual highlight state on context switch
  useEffect(() => {
    setIsAutoReading(false);
    setActiveSentenceIdx(null);
  }, [contextKey, enabled]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const speakSentence = useCallback(
    (index: number) => {
      if (!enabled) return;
      const list = sentencesRef.current;
      if (index < 0 || index >= list.length) return;
      runIdRef.current += 1;
      const myRun = runIdRef.current;
      clearStepTimer();
      setIsAutoReading(false);
      setActiveSentenceIdx(index);

      audioService.speak(list[index], 'zh-TW', 0.94, {
        onEnd: () => {
          if (!mountedRef.current || runIdRef.current !== myRun) return;
          setActiveSentenceIdx(null);
        },
        onError: () => {
          // Keep warm-yellow highlight on tapped sentence in muted/sandbox mode for reading focus
          if (!mountedRef.current || runIdRef.current !== myRun) return;
          setIsAutoReading(false);
        },
        onCancel: () => {
          if (!mountedRef.current || runIdRef.current !== myRun) return;
          clearStepTimer();
          setIsAutoReading(false);
          setActiveSentenceIdx(null);
        },
      });
    },
    [clearStepTimer, enabled],
  );

  const toggleAutoReadAlong = useCallback(() => {
    if (!enabled) return;
    if (isAutoReading) {
      stopReadAlong();
      return;
    }
    const list = sentencesRef.current;
    if (list.length === 0) return;

    runIdRef.current += 1;
    const myRun = runIdRef.current;
    clearStepTimer();
    setIsAutoReading(true);

    const speakStep = (idx: number) => {
      if (!mountedRef.current || runIdRef.current !== myRun) return;
      const currentList = sentencesRef.current;
      if (idx >= currentList.length) {
        setIsAutoReading(false);
        setActiveSentenceIdx(null);
        return;
      }
      setActiveSentenceIdx(idx);
      audioService.speak(currentList[idx], 'zh-TW', 0.94, {
        onEnd: () => {
          if (!mountedRef.current || runIdRef.current !== myRun) return;
          if (idx + 1 >= sentencesRef.current.length) {
            setIsAutoReading(false);
            setActiveSentenceIdx(null);
            return;
          }
          stepTimerRef.current = window.setTimeout(() => {
            stepTimerRef.current = null;
            speakStep(idx + 1);
          }, 260);
        },
        onError: () => {
          if (!mountedRef.current || runIdRef.current !== myRun) return;
          clearStepTimer();
          setIsAutoReading(false);
        },
        onCancel: () => {
          if (!mountedRef.current || runIdRef.current !== myRun) return;
          clearStepTimer();
          setIsAutoReading(false);
          setActiveSentenceIdx(null);
        },
      });
    };

    speakStep(0);
  }, [clearStepTimer, enabled, isAutoReading, stopReadAlong]);

  return {
    activeSentenceIdx,
    isAutoReading,
    speakSentence,
    toggleAutoReadAlong,
    stopReadAlong,
  };
}
