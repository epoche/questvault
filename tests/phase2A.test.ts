import { describe, expect, it } from 'vitest';
import {
  craftShinyCollectible,
  createInitialPlayerState,
  openMysteryPack,
} from '../src/core/economy';
import {
  COLLECTIBLES,
  getCollectiblesByPack,
  MYSTERY_PACKS,
  PACK_CATEGORIES,
} from '../src/core/packs';
import { exportPlayerStateJson, importPlayerStateJson } from '../src/core/repository';
import type { PackId } from '../src/core/types';
import { parseCustomChineseList } from '../src/subjects/chinese/chineseCustomParser';
import { buildChineseRun } from '../src/subjects/chinese/chineseEngine';
import { BUILTIN_CHINESE_SETS } from '../src/subjects/chinese/wordSets';
import { PHASE2_CHINESE_SETS } from '../src/subjects/chinese/wordSetsPhase2';
import { buildEnglishRun } from '../src/subjects/english/runEngine';
import { BUILTIN_WORD_SETS } from '../src/subjects/english/wordSets';
import { PHASE2_ENGLISH_SETS } from '../src/subjects/english/wordSetsPhase2';
import { evaluateWritingSubmission } from '../src/subjects/english/writingChecks';
import { PHASE2_COLLECTIBLE_SPECS, renderPhase2Collectible } from '../src/ui/artwork/phase2Collectibles';

const PHASE2_PACK_IDS: PackId[] = [
  'halloween',
  'lunar',
  'winter',
  'midautumn',
  'easter',
  'catcafe',
  'capybara',
  'forest',
  'mochi',
  'cloudsquishy',
  'fairytale',
  'fairyland',
];

describe('Phase 2A Layer 1: 12 New Packs (96 Original SVGs), Copyright Safety & Economy', () => {
  it('ships 12 new packs (96 collectibles) across holidays, pets, and squishy categories with 100% SVG coverage', () => {
    expect(MYSTERY_PACKS).toHaveLength(44);
    expect(COLLECTIBLES).toHaveLength(358);
    expect(PACK_CATEGORIES.find((c) => c.id === 'all')?.label).toBe('All 44');

    let phase2Count = 0;
    for (const packId of PHASE2_PACK_IDS) {
      const items = getCollectiblesByPack(packId);
      expect(items, `Pack ${packId} must have 8 collectibles`).toHaveLength(8);
      expect(items.filter((i) => i.rarity === 'common')).toHaveLength(2);
      expect(items.filter((i) => i.rarity === 'uncommon')).toHaveLength(2);
      expect(items.filter((i) => i.rarity === 'rare')).toHaveLength(1);
      expect(items.filter((i) => i.rarity === 'epic')).toHaveLength(1);
      expect(items.filter((i) => i.rarity === 'legendary')).toHaveLength(1);
      expect(items.filter((i) => i.rarity === 'chroma')).toHaveLength(1);

      for (const item of items) {
        phase2Count += 1;
        expect(PHASE2_COLLECTIBLE_SPECS[item.id], `Missing SVG spec for ${item.id}`).toBeDefined();
        expect(renderPhase2Collectible(item.id), `Null SVG render for ${item.id}`).not.toBeNull();
      }
    }
    expect(phase2Count).toBe(96);
    expect(Object.keys(PHASE2_COLLECTIBLE_SPECS)).toHaveLength(96);
  });

  it('contains zero third-party copyrighted franchise names in packs or collectibles', () => {
    const forbidden = /\b(disney|mickey|minnie|elsa|anna|olaf|frozen|pixar|marvel|simba|stitch|moana|ariel|cinderella|rapunzel|mulan|belle|aladdin|genie|pok[eé]mon|sanrio|hello\s*kitty|squishmallow|dumbo|pikachu|kuromi|cinnamoroll|kirby|snoopy)\b/i;
    for (const p of MYSTERY_PACKS) {
      expect(forbidden.test(`${p.id} ${p.name} ${p.subtitle}`), `Copyright risk in pack ${p.id}`).toBe(false);
    }
    for (const c of COLLECTIBLES) {
      expect(forbidden.test(`${c.id} ${c.name} ${c.tagline}`), `Copyright risk in collectible ${c.id}`).toBe(false);
    }
  });

  it('opens all 12 new packs cleanly, crafts Shiny, and round-trips through v1 JSON backup', () => {
    let state = { ...createInitialPlayerState('Maya'), tokens: 1000 };
    for (const packId of PHASE2_PACK_IDS) {
      const res = openMysteryPack(state, packId, () => 0.5);
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.collectible.packId).toBe(packId);
        state = res.state;
      }
    }

    const shinyTarget = 'mochi-ichigo-daifuku';
    state = { ...state, vault: { ...state.vault, [shinyTarget]: 3 } };
    const crafted = craftShinyCollectible(state, shinyTarget);
    expect(crafted.ok).toBe(true);
    if (crafted.ok) {
      const json = exportPlayerStateJson(crafted.state);
      const restored = importPlayerStateJson(json);
      expect(restored.ok).toBe(true);
      if (restored.ok) {
        expect(restored.state.shinyVault?.[shinyTarget]).toBe(true);
        expect(restored.state.vault[shinyTarget]).toBe(1);
      }
    }
  });
});

describe('Phase 2A Layer 1: Expansion Rules (English + Traditional Chinese)', () => {
  it('validates all 30 Phase 2A English sets (150 words) in Sprint, Upgrade, and Stage 3 Forge writing checks', () => {
    expect(PHASE2_ENGLISH_SETS).toHaveLength(30);
    expect(BUILTIN_WORD_SETS).toHaveLength(80);

    for (const set of PHASE2_ENGLISH_SETS) {
      const run = buildEnglishRun(set, () => 0.37);
      expect(run.sprintQuestions).toHaveLength(5);
      expect(run.upgradeQuestions).toHaveLength(3);
      expect(run.forgePrompt.targetWords).toHaveLength(5);

      for (const q of run.sprintQuestions) {
        expect(new Set(q.choices).size).toBe(4);
        expect(q.choices).toContain(q.correctWord);
      }
      for (const q of run.upgradeQuestions) {
        expect(new Set(q.choices).size).toBe(3);
        expect(q.choices).toContain(q.correctWord);
        expect(q.plainSpan.toLowerCase()).not.toBe(q.correctWord.toLowerCase());
      }
      for (const w of set.words) {
        const sample = `During our adventure today, we saw how ${w.word} really matters to everyone!`;
        expect(
          evaluateWritingSubmission(sample, [w.word]).allPassed,
          `Stage 3 writing failed to match "${w.word}"`,
        ).toBe(true);
      }
    }
  });

  it('validates all 30 Phase 2A Traditional Chinese sets (150 words), 易錯辨析 proofreading safety, and importer auto-fill', () => {
    expect(PHASE2_CHINESE_SETS).toHaveLength(30);
    expect(BUILTIN_CHINESE_SETS).toHaveLength(80);

    const confusableSets = PHASE2_CHINESE_SETS.filter((s) => s.shortTag === '易錯辨析');
    expect(confusableSets.length).toBeGreaterThanOrEqual(5);

    // Strictly Simplified-only characters (186 chars verified outside Big5 / never Taiwan MOE Traditional)
    const strictSimplifiedOnly = /[国学发欢会时为这来进对动说点让给样觉题认谢车马鸟鱼龙风电书画写读问见长门关头义买东乐习亲亿仅从众传伤伦侦侧侨偿储兑兰兴养兽冈军农决况净减凑凤凭凯击凿刘则创删剂剑剥剧劝办务励劲劳势汇匮区医华协单卖卫却历压厌厕厢厦厨县参双变叙叶叹吓吗启响哑哗员呜咏咙团园围图圆场块坚坛坝坞坟坠垄垒垦垫堕壮声壳壶处备够夹夺奖妇妈娇婴婶孙孪宝实宠审宪宫宽宾寻导寿专将尔尝尧尽层届属屡岁岂岗岛峡峦崭]/;

    for (const set of PHASE2_CHINESE_SETS) {
      const run = buildChineseRun(set, () => 0.37);
      expect(run.sprintQuestions).toHaveLength(5);
      expect(run.upgradeQuestions).toHaveLength(3);
      expect(run.forgePrompt.targetWords).toHaveLength(5);

      const setWordStrings = new Set(set.words.map((w) => w.word));

      for (const q of run.sprintQuestions) {
        expect(new Set(q.choices.map((c) => c.word)).size).toBe(4);
        expect(q.choices.map((c) => c.word)).toContain(q.correctWord);
      }
      for (const q of run.upgradeQuestions) {
        expect(new Set(q.choices.map((c) => c.word)).size).toBe(3);
        expect(q.choices.map((c) => c.word)).toContain(q.correctWord);
        expect(q.plainSpan).not.toBe(q.correctWord);
        expect(q.choices.map((c) => c.word)).not.toContain(q.plainSpan);
      }

      if (set.shortTag === '易錯辨析') {
        for (const w of set.words) {
          expect(w.upgradePlainSpan).toBeTruthy();
          expect(setWordStrings.has(w.upgradePlainSpan!), `Confusable typo collides with set word in ${set.id}: ${w.upgradePlainSpan}`).toBe(false);
        }
      }

      for (const w of set.words) {
        const text = `${w.word}${w.plainBridge}${w.contextSentence}${w.sprintSentence}${w.upgradeBefore ?? ''}${w.upgradePlainSpan ?? ''}${w.upgradeAfter ?? ''}`;
        expect(strictSimplifiedOnly.test(text), `Simplified leak in ${w.word}: ${text}`).toBe(false);
      }
    }

    // Importer auto-fills Phase 2 words from expanded 300-word dictionary
    const parsed = parseCustomChineseList('Phase 2 測驗', '外婆、旅行、狐假虎威、神祕、持之以恆');
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.autoFilledCount).toBe(5);
      expect(parsed.unmatchedWords).toEqual([]);
      expect(parsed.record.words.map((w) => w.zhuyin)).toEqual([
        'ㄨㄞˋ ㄆㄛˊ',
        'ㄌㄩˇ ㄒㄧㄥˊ',
        'ㄏㄨˊ ㄐㄧㄚˇ ㄏㄨˇ ㄨㄟ',
        'ㄕㄣˊ ㄇㄧˋ',
        'ㄔˊ ㄓ ㄧˇ ㄏㄥˊ',
      ]);
    }
  });
});
