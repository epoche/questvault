import type { DifficultyTier, SubjectId, WordMasteryRecord } from './types';

export type MasteryStatus = 'tricky' | 'learning' | 'mastered';

export interface WordOutcomeInput {
  word: string;
  subjectId?: SubjectId;
  tier: DifficultyTier;
  outcome: 'clean' | 'missed' | 'writing';
  nowIso?: string;
}

export function getMasteryKey(word: string, subjectId: SubjectId = 'english'): string {
  const normalized = word.trim().toLowerCase();
  return subjectId === 'english' ? normalized : `${subjectId}:${normalized}`;
}

export function filterMasteryBySubject(
  mastery: Record<string, WordMasteryRecord>,
  subjectId: SubjectId,
): Record<string, WordMasteryRecord> {
  const filtered: Record<string, WordMasteryRecord> = {};
  for (const [k, rec] of Object.entries(mastery)) {
    const recSubject: SubjectId = rec.subjectId ?? 'english';
    if (recSubject === subjectId) {
      filtered[k] = rec;
    }
  }
  return filtered;
}

export const SRS_INTERVAL_DAYS = [1, 3, 7, 21] as const;

function addDaysIso(baseIso: string, days: number): string {
  const ms = Date.parse(baseIso);
  const start = Number.isFinite(ms) ? ms : Date.now();
  return new Date(start + days * 24 * 60 * 60 * 1000).toISOString();
}

export function recordWordOutcome(
  current: Record<string, WordMasteryRecord>,
  input: WordOutcomeInput,
): Record<string, WordMasteryRecord> {
  const trimmed = input.word.trim();
  if (!trimmed) return current;

  const subjectId: SubjectId = input.subjectId ?? 'english';
  const key = getMasteryKey(trimmed, subjectId);
  const now = input.nowIso ?? new Date().toISOString();
  const prev = current[key] ?? {
    word: trimmed,
    subjectId,
    tier: input.tier,
    seen: 0,
    correctFirstTry: 0,
    missed: 0,
    usedInWriting: 0,
    lastSeenAt: now,
    srsLevel: 0,
  };

  const prevSrs = prev.srsLevel ?? 0;
  let nextSrsLevel = prevSrs;
  let nextReviewAt = prev.nextReviewAt;

  if (input.outcome === 'missed') {
    nextSrsLevel = 0;
    nextReviewAt = now;
  } else {
    nextSrsLevel = Math.min(SRS_INTERVAL_DAYS.length, prevSrs + 1);
    const intervalDays = SRS_INTERVAL_DAYS[Math.min(nextSrsLevel - 1, SRS_INTERVAL_DAYS.length - 1)];
    nextReviewAt = addDaysIso(now, intervalDays);
  }

  const next: WordMasteryRecord = {
    ...prev,
    subjectId,
    tier: input.tier,
    seen: prev.seen + 1,
    correctFirstTry: prev.correctFirstTry + (input.outcome === 'clean' ? 1 : 0),
    missed: prev.missed + (input.outcome === 'missed' ? 1 : 0),
    usedInWriting: prev.usedInWriting + (input.outcome === 'writing' ? 1 : 0),
    lastSeenAt: now,
    srsLevel: nextSrsLevel,
    nextReviewAt,
    ...(input.outcome === 'missed' ? { lastMissedAt: now } : {}),
  };

  return {
    ...current,
    [key]: next,
  };
}

export function isItemDueForReview(
  record: WordMasteryRecord,
  nowIso: string = new Date().toISOString(),
): boolean {
  const nowMs = Date.parse(nowIso);
  if (!Number.isFinite(nowMs)) return false;

  if (record.nextReviewAt) {
    const dueMs = Date.parse(record.nextReviewAt);
    if (Number.isFinite(dueMs)) return dueMs <= nowMs;
  }
  // Legacy v1 records without nextReviewAt: due if missed or last seen >= 24h ago
  if (record.missed > 0 && record.correctFirstTry < record.missed + 2) return true;
  const lastMs = Date.parse(record.lastSeenAt);
  if (Number.isFinite(lastMs)) {
    return nowMs - lastMs >= 24 * 60 * 60 * 1000;
  }
  return false;
}

export function getDueReviewItems(
  mastery: Record<string, WordMasteryRecord>,
  subjectId?: SubjectId,
  nowIso: string = new Date().toISOString(),
): WordMasteryRecord[] {
  const scoped = subjectId ? filterMasteryBySubject(mastery, subjectId) : mastery;
  return Object.values(scoped)
    .filter((rec) => isItemDueForReview(rec, nowIso))
    .sort((a, b) => {
      const aDue = Date.parse(a.nextReviewAt ?? a.lastSeenAt) || 0;
      const bDue = Date.parse(b.nextReviewAt ?? b.lastSeenAt) || 0;
      return (a.srsLevel ?? 0) - (b.srsLevel ?? 0) || aDue - bDue;
    });
}

export function classifyWordMastery(record: WordMasteryRecord): MasteryStatus {
  const isMath = record.subjectId === 'math';
  if (
    record.correctFirstTry >= 2 &&
    (isMath || record.usedInWriting >= 1 || record.correctFirstTry >= 3) &&
    record.correctFirstTry >= record.missed * 2 + 2
  ) {
    return 'mastered';
  }
  if (record.missed > 0 && record.correctFirstTry < record.missed + 2) {
    return 'tricky';
  }
  return 'learning';
}

export function getTrickyWords(
  mastery: Record<string, WordMasteryRecord>,
  subjectId?: SubjectId,
): WordMasteryRecord[] {
  const scoped = subjectId ? filterMasteryBySubject(mastery, subjectId) : mastery;
  return Object.values(scoped)
    .filter((rec) => classifyWordMastery(rec) === 'tricky')
    .sort((a, b) => b.missed - a.missed || a.correctFirstTry - b.correctFirstTry);
}

export function getLearningWords(
  mastery: Record<string, WordMasteryRecord>,
  subjectId?: SubjectId,
): WordMasteryRecord[] {
  const scoped = subjectId ? filterMasteryBySubject(mastery, subjectId) : mastery;
  return Object.values(scoped)
    .filter((rec) => classifyWordMastery(rec) === 'learning')
    .sort((a, b) => b.seen - a.seen);
}

export function getMasteredWords(
  mastery: Record<string, WordMasteryRecord>,
  subjectId?: SubjectId,
): WordMasteryRecord[] {
  const scoped = subjectId ? filterMasteryBySubject(mastery, subjectId) : mastery;
  return Object.values(scoped)
    .filter((rec) => classifyWordMastery(rec) === 'mastered')
    .sort((a, b) => b.correctFirstTry - a.correctFirstTry);
}

export interface TierAccuracyRow {
  tier: DifficultyTier;
  practicedWords: number;
  totalWords: number;
  masteredWords: number;
  coveragePct: number;
  attempts: number;
  cleanHits: number;
  accuracyPct: number | null;
}

export function getTierAccuracySummary(
  mastery: Record<string, WordMasteryRecord>,
  totalWordsByTier: Record<DifficultyTier, number> = { 1: 15, 2: 15, 3: 20, 4: 10 },
  subjectId?: SubjectId,
): TierAccuracyRow[] {
  const scoped = subjectId ? filterMasteryBySubject(mastery, subjectId) : mastery;
  const tiers: DifficultyTier[] = [1, 2, 3, 4];
  return tiers.map((tier) => {
    const records = Object.values(scoped).filter((r) => r.tier === tier);
    const cleanHits = records.reduce((s, r) => s + r.correctFirstTry, 0);
    const misses = records.reduce((s, r) => s + r.missed, 0);
    const attempts = cleanHits + misses;
    const totalWords = Math.max(1, totalWordsByTier[tier] ?? 15);
    const practicedWords = Math.min(totalWords, records.length);
    const masteredWords = records.filter((r) => classifyWordMastery(r) === 'mastered').length;
    return {
      tier,
      practicedWords,
      totalWords,
      masteredWords,
      coveragePct: Math.round((practicedWords / totalWords) * 100),
      attempts,
      cleanHits,
      accuracyPct: attempts > 0 ? Math.round((cleanHits / attempts) * 100) : null,
    };
  });
}
