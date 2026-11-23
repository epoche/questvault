import { describe, expect, it } from 'vitest';
import { createInitialPlayerState } from '../src/core/economy';
import { getCollectibleById } from '../src/core/packs';
import { exportPlayerStateJson, importPlayerStateJson } from '../src/core/repository';
import { BUILTIN_CHAPTER_SERIES } from '../src/subjects/chinese/chapterStories';
import {
  BUILTIN_SENTENCE_PATTERN_SETS,
  getSentencePatternSetsByTier,
} from '../src/subjects/chinese/sentencePatternSets';

const VALID_ZHUYIN_SYL = /^(?:˙)?[ㄅ-ㄩ]{1,3}[ˊˇˋ]?$/;
const TRUE_SIMPLIFIED_RE =
  /[国学车书说话读听写画见贝风飞马鸟鱼龙长门问间开关时电云雨雪花草树木林森爱乐欢发这那为从进过还对错说认让给请谢谢样体实气产场厂广应庆历压厌厅厕厨厦双变叠只台号叶叹吓吗吧呢啊啦喂喝吃听员园圆图团围国坚块坏坛坝坟坠坡垫垦墙增声处备复够头夸夹夺奋奖妆妇妈妹姐姑姓委姿威娃娘婆婚婴孙宁宅宇守安完宏宗官定宛宜实审客宣室宫害家容宽宾宿寂寄密富寒察寡寝实宝]/;

// Strict Simplified-only subset (characters that NEVER exist in Taiwan Traditional Chinese)
const STRICT_SIMPLIFIED_ONLY_RE =
  /[这为发点气让们个时说语读记纸练组线结银铁钟镜针课请访纺红蓝画体乐车马风鱼鸟龙龟爱学国来对关开见觉亲听头买卖边远进还过动写书贝飞长门问间电云欢从错认给谢样实产场厂广应庆历压厌厅厕厨厦双变叠叶叹吓吗员园圆图团围坚块坏坛坝坟坠坡垫垦墙增声处备复够夸夹夺奋奖妆妇妈婴孙宁审宽宾宝么会]/;

function assertZhuyinAligned(text: string, zhuyin: string, label: string): void {
  const cjk = text.match(/[\u4E00-\u9FFF]/g) ?? [];
  const syls = zhuyin.trim().length === 0 ? [] : zhuyin.trim().split(/\s+/);
  expect(syls.length, `${label}: CJK=${cjk.length} vs Zhuyin=${syls.length} (${text} / ${zhuyin})`).toBe(
    cjk.length,
  );
  for (const s of syls) {
    expect(VALID_ZHUYIN_SYL.test(s), `${label}: invalid MOE Zhuyin "${s}"`).toBe(true);
    expect(s.includes('一'), `${label}: CJK 一 used instead of Zhuyin ㄧ`).toBe(false);
  }
}

describe('Phase 5C Layer 1 — Chinese Sentence Pattern Lab (16 Sets / 80 Qs)', () => {
  it('ships 16 sets (4 per tier × 5 items = 80 items) with unique IDs and valid emblems', () => {
    expect(BUILTIN_SENTENCE_PATTERN_SETS).toHaveLength(16);
    for (const tier of [1, 2, 3, 4] as const) {
      expect(getSentencePatternSetsByTier(tier)).toHaveLength(4);
    }

    const setIds = new Set<string>();
    const itemIds = new Set<string>();
    const targets = new Set<string>();

    for (const set of BUILTIN_SENTENCE_PATTERN_SETS) {
      expect(setIds.has(set.id)).toBe(false);
      setIds.add(set.id);
      expect(getCollectibleById(set.emblemCollectibleId)).toBeDefined();
      expect(set.items).toHaveLength(5);

      for (const item of set.items) {
        expect(itemIds.has(item.id)).toBe(false);
        itemIds.add(item.id);
        expect(targets.has(item.reorderTarget)).toBe(false);
        targets.add(item.reorderTarget);

        // Stage 1 choices
        expect(item.fillChoices).toHaveLength(4);
        expect(new Set(item.fillChoices).size).toBe(4);
        expect(item.fillChoices).toContain(item.fillAnswer);

        // Stage 2 chunks exact match
        expect(item.reorderChunks.length).toBeGreaterThanOrEqual(4);
        expect(item.reorderChunks.length).toBeLessThanOrEqual(5);
        expect(item.reorderChunks.join('')).toBe(item.reorderTarget);
        expect(item.reorderChunksZhuyin).toHaveLength(item.reorderChunks.length);

        // 1:1 MOE Zhuyin alignment
        assertZhuyinAligned(item.fillPrompt, item.fillPromptZhuyin, `${item.id}.fillPrompt`);
        assertZhuyinAligned(item.fillAnswer, item.fillAnswerZhuyin, `${item.id}.fillAnswer`);
        assertZhuyinAligned(item.reorderTarget, item.reorderTargetZhuyin, `${item.id}.reorderTarget`);
        item.reorderChunks.forEach((ch, idx) => {
          assertZhuyinAligned(ch, item.reorderChunksZhuyin[idx], `${item.id}.chunk[${idx}]`);
        });
        expect(item.reorderChunksZhuyin.join(' ')).toBe(item.reorderTargetZhuyin);

        // Zero Simplified Chinese
        const fullStr = `${set.title}${set.subtitle}${item.patternLabel}${item.fillPrompt}${item.fillAnswer}${item.fillChoices.join('')}${item.reorderTarget}${item.explanation}`;
        expect(STRICT_SIMPLIFIED_ONLY_RE.test(fullStr), `${item.id} has Simplified char`).toBe(false);
      }
    }

    expect(itemIds.size).toBe(80);
  });

  it('includes 4 Season 2 Chinese Chapter Story Series (20 episodes / 60 questions) inside BUILTIN_CHAPTER_SERIES', () => {
    const s2Ids = ['ch-s2-shilin', 'ch-s2-yushan', 'ch-s2-inventors', 'ch-s2-rainbow-oven'];
    for (const id of s2Ids) {
      const series = BUILTIN_CHAPTER_SERIES.find((s) => s.id === id);
      expect(series, `Missing Season 2 series ${id}`).toBeDefined();
      expect(series!.episodes).toHaveLength(5);
      for (const ep of series!.episodes) {
        const text = `${ep.title}${ep.sentences.join('')}${ep.questions.map((q) => q.prompt + q.choices.join('') + q.explanation).join('')}`;
        expect(STRICT_SIMPLIFIED_ONLY_RE.test(text), `${ep.id} contains Simplified char`).toBe(false);
      }
    }
    expect(TRUE_SIMPLIFIED_RE).toBeDefined();
  });

  it('preserves completedSentencePatternIds cleanly through v1 JSON export/import roundtrip', () => {
    const base = createInitialPlayerState('Mia');
    const rich = {
      ...base,
      completedSentencePatternIds: ['zh-sp-t1-cause', 'zh-sp-t4-simile'],
    };
    const json = exportPlayerStateJson(rich);
    const restored = importPlayerStateJson(json);
    expect(restored.ok).toBe(true);
    if (!restored.ok) return;
    expect(restored.state.completedSentencePatternIds).toEqual([
      'zh-sp-t1-cause',
      'zh-sp-t4-simile',
    ]);
  });
});
