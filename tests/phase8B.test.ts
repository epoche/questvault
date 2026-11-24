import { describe, expect, it } from 'vitest';
import { COLLECTIBLES } from '../src/core/packs';
import { createInitialPlayerState } from '../src/core/economy';
import { exportPlayerStateJson, importPlayerStateJson } from '../src/core/repository';
import { BUILTIN_LOOK_ALIKE_SETS, getLookAlikeSetsByTier } from '../src/subjects/chinese/lookAlikeSets';
import { BUILTIN_FIGURATIVE_SETS, getFigurativeSetsByTier } from '../src/subjects/english/figurativeSets';

const VALID_ZHUYIN_SYLLABLE_RE = /^˙?[ㄅ-ㄩ]{1,3}[ˊˇˋ]?$/;
const CJK_RE = /[\u4E00-\u9FFF]/g;
// Strict Simplified-only subset (characters that NEVER exist in Taiwan Traditional Chinese)
const STRICT_SIMPLIFIED_RE =
  /[这为发点气让们个时说语读记纸练组线结银铁钟镜针课请访纺红蓝画体乐车马风鱼鸟龙龟爱学国来对关开见觉亲听头买卖边远进还过动写书贝飞长门问间电云欢从错认给谢样实产场厂广应庆历压厌厅厕厨厦双变叠叶叹吓吗员园圆图团围坚块坏坛坝坟坠垫垦墙声处备复够夸夹夺奋奖妆妇妈婴孙宁审宽宾宝么会乌篮辩办厉输决华丽]/;

function countCjk(text: string): number {
  return (text.match(CJK_RE) ?? []).length;
}

describe('Phase 8B — Chinese Look-Alike Hanzi Lab (80 Qs) & English Figurative Language Lab (60 Qs)', () => {
  const validEmblems = new Set(COLLECTIBLES.map((c) => c.id));

  it('ships 16 Chinese Look-Alike sets (4 per tier × 5 Qs = 80 Qs) with 100% MOE Zhuyin 1:1 alignment, 0 Simplified Chinese, and 0 answer leaks', () => {
    expect(BUILTIN_LOOK_ALIKE_SETS).toHaveLength(16);
    for (const tier of [1, 2, 3, 4] as const) {
      expect(getLookAlikeSetsByTier(tier)).toHaveLength(4);
    }

    const setIds = new Set<string>();
    const qIds = new Set<string>();
    let totalQuestions = 0;

    for (const set of BUILTIN_LOOK_ALIKE_SETS) {
      expect(setIds.has(set.id)).toBe(false);
      setIds.add(set.id);
      expect(validEmblems.has(set.emblemCollectibleId)).toBe(true);
      expect(set.twins.length).toBeGreaterThanOrEqual(2);
      expect(set.twins.length).toBeLessThanOrEqual(4);
      expect(set.questions).toHaveLength(5);

      // Check Stage 1 twin cards
      const twinChars = new Set<string>();
      for (const twin of set.twins) {
        expect(Array.from(twin.char)).toHaveLength(1);
        expect(twinChars.has(twin.char)).toBe(false);
        twinChars.add(twin.char);
        expect(VALID_ZHUYIN_SYLLABLE_RE.test(twin.zhuyin.trim())).toBe(true);
        const sampleSyls = twin.sampleZhuyin.trim().split(/\s+/);
        expect(sampleSyls.length).toBe(countCjk(twin.sampleWord));
        for (const s of sampleSyls) {
          expect(VALID_ZHUYIN_SYLLABLE_RE.test(s)).toBe(true);
        }
        expect(STRICT_SIMPLIFIED_RE.test(twin.diffTipZh + twin.radicalCue + twin.sampleWord)).toBe(false);
      }

      // Check Stage 2 context sprint questions
      for (const q of set.questions) {
        totalQuestions += 1;
        expect(qIds.has(q.id)).toBe(false);
        qIds.add(q.id);
        expect(Array.from(q.targetChar)).toHaveLength(1);
        expect(VALID_ZHUYIN_SYLLABLE_RE.test(q.targetZhuyin.trim())).toBe(true);

        // Exactly one ___ blank & zero targetChar leak in promptSentence or englishBridge
        const blankMatches = q.promptSentence.match(/___/g) ?? [];
        expect(blankMatches).toHaveLength(1);
        expect(q.promptSentence.includes(q.targetChar)).toBe(false);
        expect(q.englishBridge.trim().length).toBeGreaterThan(1);
        expect(q.englishBridge.includes(q.targetChar)).toBe(false);
        expect(countCjk(q.englishBridge)).toBe(0);
        expect(q.promptSentence.replace('___', q.targetChar)).toBe(q.spokenFullSentence);

        // Strict 1:1 CJK-to-Zhuyin alignment on promptSentence
        const promptSyls = q.promptZhuyin.trim().split(/\s+/);
        expect(promptSyls.length).toBe(countCjk(q.promptSentence));
        for (const s of promptSyls) {
          expect(VALID_ZHUYIN_SYLLABLE_RE.test(s)).toBe(true);
        }

        // 4 unique single-char choices & valid Zhuyins
        expect(q.choices).toHaveLength(4);
        expect(q.choiceZhuyins).toHaveLength(4);
        expect(new Set(q.choices).size).toBe(4);
        expect(q.choices[q.correctIndex]).toBe(q.targetChar);
        expect(q.choiceZhuyins[q.correctIndex]).toBe(q.targetZhuyin);
        for (let i = 0; i < 4; i++) {
          expect(Array.from(q.choices[i])).toHaveLength(1);
          expect(VALID_ZHUYIN_SYLLABLE_RE.test(q.choiceZhuyins[i].trim())).toBe(true);
        }

        // Zero Simplified Chinese
        const allZh = q.promptSentence + q.spokenFullSentence + q.explanation + q.choices.join('');
        expect(STRICT_SIMPLIFIED_RE.test(allZh)).toBe(false);
      }
    }

    expect(totalQuestions).toBe(80);
  });

  it('ships 12 English Figurative Language & Context Clues sets (3 per tier × 5 Qs = 60 Qs) with unique choices, valid highlights, and Traditional Chinese tips', () => {
    expect(BUILTIN_FIGURATIVE_SETS).toHaveLength(12);
    for (const tier of [1, 2, 3, 4] as const) {
      expect(getFigurativeSetsByTier(tier)).toHaveLength(3);
    }

    const setIds = new Set<string>();
    const qIds = new Set<string>();
    let totalQuestions = 0;

    for (const set of BUILTIN_FIGURATIVE_SETS) {
      expect(setIds.has(set.id)).toBe(false);
      setIds.add(set.id);
      expect(validEmblems.has(set.emblemCollectibleId)).toBe(true);
      expect(set.questions).toHaveLength(5);

      for (const q of set.questions) {
        totalQuestions += 1;
        expect(qIds.has(q.id)).toBe(false);
        qIds.add(q.id);
        expect(q.choices).toHaveLength(4);
        expect(new Set(q.choices.map((c) => c.trim().toLowerCase())).size).toBe(4);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(4);
        expect(q.passage.trim().length).toBeGreaterThan(8);
        expect(q.question.trim().length).toBeGreaterThan(5);
        expect(q.explanationEn.trim().length).toBeGreaterThan(5);
        expect(q.explanationZh.trim().length).toBeGreaterThan(3);
        expect(STRICT_SIMPLIFIED_RE.test(q.explanationZh)).toBe(false);

        if (q.highlightPhrase && q.highlightPhrase.trim()) {
          expect(q.passage.toLowerCase()).toContain(q.highlightPhrase.trim().toLowerCase());
        }
      }
    }

    expect(totalQuestions).toBe(60);
  });

  it('persists completedLookAlikeIds and completedFigurativeIds with v1 JSON round-trip compatibility', () => {
    const state = {
      ...createInitialPlayerState('Chloe'),
      completedLookAlikeIds: ['zh-la-01', 'zh-la-01', 'zh-la-09'],
      completedFigurativeIds: ['en-fig-01', 'en-fig-07'],
    };
    const json = exportPlayerStateJson(state);
    const parsed = importPlayerStateJson(json);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.state.completedLookAlikeIds).toEqual(['zh-la-01', 'zh-la-09']);
      expect(parsed.state.completedFigurativeIds).toEqual(['en-fig-01', 'en-fig-07']);
    }
  });
});
