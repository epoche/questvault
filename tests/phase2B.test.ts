import { describe, expect, it } from 'vitest';
import {
  buildWeeklyReviewChineseSet,
  buildWeeklyReviewEnglishSet,
  computeWeeklySnapshot,
  createParentGateChallenge,
  formatWeeklyReportText,
  getWeakSpotRadar,
} from '../src/core/analytics';
import { createInitialPlayerState } from '../src/core/economy';
import { recordWordOutcome } from '../src/core/mastery';
import { getCollectibleById } from '../src/core/packs';
import { exportPlayerStateJson, importPlayerStateJson } from '../src/core/repository';
import { CHINESE_READING_QUESTS, getChineseReadingByTier } from '../src/subjects/chinese/readingQuests';
import { ENGLISH_READING_QUESTS, getEnglishReadingByTier } from '../src/subjects/english/readingQuests';

const CJK_CHAR_RE = /[\u4E00-\u9FFF]/;
const VALID_ZHUYIN_SYL = /^˙?[ㄅ-ㄩ]{1,3}[ˊˇˋ]?$/;
const STRICT_SIMPLIFIED_ONLY =
  /[国学发欢会时为这来进对动说点让给样觉题认谢车马鸟鱼龙风电书画写读问见长门关头义买东乐习亲亿仅从众传伤伦侦侧侨偿储兑兰兴养兽冈军农决况净减凑凤凭凯击凿刘则创删剂剑剥剧劝办务励劲劳势汇匮区医华协单卖卫却历压厌厕厢厦厨县参双变叙叶叹吓吗启响哑哗员呜咏咙团园围图圆场块坚坛坝坞坟坠垄垒垦垫堕壮声壳壶处备够夹夺奖妇妈娇婴婶孙孪宝实宠审宪宫宽宾寻导寿专将尔尝尧尽层届属屡岁岂岗岛峡峦崭]/;

function countCjk(text: string): number {
  return Array.from(text).filter((ch) => CJK_CHAR_RE.test(ch)).length;
}

function assertZhuyinAligned(text: string, zhuyin: string, label: string) {
  const syls = zhuyin.trim().split(/\s+/);
  expect(syls.length, `Zhuyin count mismatch in ${label}: "${text}" vs "${zhuyin}"`).toBe(
    countCjk(text),
  );
  for (const s of syls) {
    expect(VALID_ZHUYIN_SYL.test(s), `Illegal Zhuyin "${s}" in ${label}`).toBe(true);
  }
}

describe('Phase 2B Layer 1: English & Traditional Chinese Story Quests (32 Passages / 96 Questions)', () => {
  it('validates all 8 English Story Quest sets (16 passages / 48 questions)', () => {
    expect(ENGLISH_READING_QUESTS).toHaveLength(8);
    for (const tier of [1, 2, 3, 4] as const) {
      expect(getEnglishReadingByTier(tier)).toHaveLength(2);
    }

    const seenSetIds = new Set<string>();
    const seenPassageIds = new Set<string>();
    const seenQIds = new Set<string>();
    const idxCounts = [0, 0, 0, 0];

    for (const set of ENGLISH_READING_QUESTS) {
      expect(seenSetIds.has(set.id)).toBe(false);
      seenSetIds.add(set.id);
      expect(getCollectibleById(set.emblemCollectibleId)).toBeDefined();
      expect(set.passages).toHaveLength(2);

      for (const p of set.passages) {
        expect(seenPassageIds.has(p.id)).toBe(false);
        seenPassageIds.add(p.id);
        expect(p.sentences.length).toBeGreaterThanOrEqual(2);
        expect(p.sentences.length).toBeLessThanOrEqual(4);
        expect(p.spotlightVocab.length).toBeGreaterThanOrEqual(2);
        expect(p.questions).toHaveLength(3);

        for (const q of p.questions) {
          expect(seenQIds.has(q.id)).toBe(false);
          seenQIds.add(q.id);
          expect(q.choices).toHaveLength(4);
          expect(new Set(q.choices).size).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThanOrEqual(3);
          expect(q.explanation.trim().length).toBeGreaterThan(8);
          idxCounts[q.correctIndex] += 1;
        }
      }
    }

    expect(seenPassageIds.size).toBe(16);
    expect(seenQIds.size).toBe(48);
    for (const c of idxCounts) {
      expect(c).toBeGreaterThanOrEqual(8);
    }
  });

  it('validates all 8 Chinese Story Quest sets (16 passages / 48 questions): 1-to-1 MOE Zhuyin, zero Simplified, English gist', () => {
    expect(CHINESE_READING_QUESTS).toHaveLength(8);
    for (const tier of [1, 2, 3, 4] as const) {
      expect(getChineseReadingByTier(tier)).toHaveLength(2);
    }

    const seenSetIds = new Set<string>();
    const seenPassageIds = new Set<string>();
    const seenQIds = new Set<string>();
    const idxCounts = [0, 0, 0, 0];

    for (const set of CHINESE_READING_QUESTS) {
      expect(seenSetIds.has(set.id)).toBe(false);
      seenSetIds.add(set.id);
      expect(getCollectibleById(set.emblemCollectibleId)).toBeDefined();
      expect(set.passages).toHaveLength(2);

      for (const p of set.passages) {
        expect(seenPassageIds.has(p.id)).toBe(false);
        seenPassageIds.add(p.id);
        expect(p.sentences.length).toBeGreaterThanOrEqual(2);
        expect(p.sentences.length).toBeLessThanOrEqual(4);
        expect(p.titleZhuyin).toBeTruthy();
        assertZhuyinAligned(p.title, p.titleZhuyin!, `${p.id}.title`);

        expect(p.sentencesZhuyin).toBeDefined();
        expect(p.sentencesZhuyin).toHaveLength(p.sentences.length);
        p.sentences.forEach((sent, i) => {
          assertZhuyinAligned(sent, p.sentencesZhuyin![i], `${p.id}.sent[${i}]`);
        });

        expect(p.englishGist && p.englishGist.trim().length).toBeGreaterThan(10);
        for (const sv of p.spotlightVocab) {
          expect(sv.zhuyin).toBeTruthy();
          assertZhuyinAligned(sv.word, sv.zhuyin!, `${p.id}.vocab.${sv.word}`);
        }

        const allText = [
          set.title,
          p.title,
          ...p.sentences,
          ...p.questions.flatMap((q) => [q.prompt, ...q.choices, q.explanation]),
        ].join('');
        expect(STRICT_SIMPLIFIED_ONLY.test(allText), `Simplified leak in ${p.id}`).toBe(false);

        for (const q of p.questions) {
          expect(seenQIds.has(q.id)).toBe(false);
          seenQIds.add(q.id);
          expect(q.choices).toHaveLength(4);
          expect(new Set(q.choices).size).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThanOrEqual(3);
          idxCounts[q.correctIndex] += 1;

          if (q.choiceZhuyin) {
            expect(q.choiceZhuyin).toHaveLength(4);
            q.choices.forEach((ch, ci) => {
              assertZhuyinAligned(ch, q.choiceZhuyin![ci], `${q.id}.choice[${ci}]`);
            });
          }
        }
      }
    }

    expect(seenPassageIds.size).toBe(16);
    expect(seenQIds.size).toBe(48);
    for (const c of idxCounts) {
      expect(c).toBeGreaterThanOrEqual(8);
    }
  });
});

describe('Phase 2B Layer 1: Parent Corner Analytics, Parent Gate, Weekly Review & v1 Compat', () => {
  it('generates valid multiplication Parent Gate challenges with 4 unique positive choices', () => {
    for (let i = 0; i < 20; i += 1) {
      const ch = createParentGateChallenge(() => (i * 0.13) % 1);
      expect(ch.choices).toHaveLength(4);
      expect(new Set(ch.choices).size).toBe(4);
      expect(ch.choices).toContain(ch.answer);
      expect(ch.choices.every((n) => n > 0)).toBe(true);
    }
  });

  it('computes 7-day Weekly Snapshot accurately, ranks Weak-Spot Radar, and formats Weekly Report', () => {
    const nowIso = '2026-11-23T12:00:00.000Z';
    let state = createInitialPlayerState('Chloe');

    // Empty state produces clean 5-word Weekly Review fallback sets
    expect(buildWeeklyReviewEnglishSet(state).words).toHaveLength(5);
    expect(buildWeeklyReviewChineseSet(state).words).toHaveLength(5);

    // Seed recent runs (within 7d) and 1 old run (>7d)
    state = {
      ...state,
      streakDays: 4,
      runHistory: [
        {
          id: 'r1',
          subjectId: 'english',
          questSetId: 'en-read-t1-pet-club',
          questSetTitle: 'Cozy Pet Adventures',
          tokensEarned: 58,
          maxCombo: 5,
          accuracyPct: 100,
          completedAt: '2026-11-22T10:00:00.000Z',
        },
        {
          id: 'r2',
          subjectId: 'chinese',
          questSetId: 'zh-read-t1-nightmarket',
          questSetTitle: '台灣夜市小旅行',
          tokensEarned: 50,
          maxCombo: 3,
          accuracyPct: 80,
          completedAt: '2026-11-21T10:00:00.000Z',
        },
        {
          id: 'r-old',
          subjectId: 'math',
          questSetId: 'math-t1-arrays',
          questSetTitle: 'Multiply Arrays',
          tokensEarned: 45,
          maxCombo: 4,
          accuracyPct: 50,
          completedAt: '2026-11-01T10:00:00.000Z',
        },
      ],
      writingLog: [
        {
          id: 'w1',
          subjectId: 'chinese',
          questSetId: 'zh-t1-family-kin',
          questSetTitle: '家庭與親人',
          targetWords: ['外婆'],
          sentence: '暑假回台灣時，外婆煮了香噴噴的紅燒牛肉麵。',
          createdAt: '2026-11-22T11:00:00.000Z',
        },
      ],
    };

    let m = state.wordMastery;
    m = recordWordOutcome(m, { word: 'whisper', subjectId: 'english', tier: 1, outcome: 'missed', nowIso });
    m = recordWordOutcome(m, { word: 'whisper', subjectId: 'english', tier: 1, outcome: 'missed', nowIso });
    m = recordWordOutcome(m, { word: '外婆', subjectId: 'chinese', tier: 1, outcome: 'missed', nowIso });
    state = { ...state, wordMastery: m };

    const snap = computeWeeklySnapshot(state, nowIso);
    expect(snap.totalRuns).toBe(2);
    expect(snap.runsBySubject).toEqual({ english: 1, math: 0, chinese: 1 });
    expect(snap.avgAccuracyPct).toBe(90);
    expect(snap.tokensEarned).toBe(108);
    expect(snap.activeDays).toBe(2);
    expect(snap.writingCountThisWeek).toBe(1);

    const enRadar = getWeakSpotRadar(state.wordMastery, 'english', 5);
    expect(enRadar[0].word).toBe('whisper');
    expect(enRadar[0].missed).toBe(2);

    const enReview = buildWeeklyReviewEnglishSet(state);
    expect(enReview.words).toHaveLength(5);
    expect(enReview.words[0].word).toBe('whisper');

    const zhReview = buildWeeklyReviewChineseSet(state);
    expect(zhReview.words).toHaveLength(5);
    expect(zhReview.words[0].word).toBe('外婆');

    const report = formatWeeklyReportText(state, nowIso);
    expect(report).toContain('Chloe');
    expect(report).toContain('whisper（錯 2 次）');
    expect(report).toContain('外婆（錯 1 次）');

    // v1 JSON backup round-trip preserves Story Quest runs cleanly
    const restored = importPlayerStateJson(exportPlayerStateJson(state));
    expect(restored.ok).toBe(true);
    if (restored.ok) {
      expect(restored.state.runHistory[0].questSetId).toBe('en-read-t1-pet-club');
    }
  });
});
