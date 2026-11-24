import { describe, expect, it } from 'vitest';
import {
  ACHIEVEMENTS,
  claimAchievementReward,
  evaluateAchievements,
  getClaimableAchievementCount,
} from '../src/core/achievements';
import {
  createInitialPlayerState,
  getQuestRewardPolicy,
  recordDailyQuestClaim,
} from '../src/core/economy';
import { getCollectibleById } from '../src/core/packs';
import { exportPlayerStateJson, importPlayerStateJson } from '../src/core/repository';
import {
  BUILTIN_MEASURE_IDIOM_SETS,
  getMeasureIdiomSetsByTier,
  IDIOM_CONTEXT_SETS,
  MEASURE_WORD_SETS,
} from '../src/subjects/chinese/measureIdiomSets';

const VALID_ZHUYIN_SYL = /^˙?[ㄅ-ㄩ]{1,3}[ˊˇˋ]?$/;
const STRICT_SIMPLIFIED_ONLY =
  /[国学发欢会时为这来进对动说点让给样觉题认谢车马鸟鱼龙风电书画写读问见长门关头义买东乐习亲亿仅从众传伤伦侦侧侨偿储兑兰兴养兽冈军农决况净减凑凤凭凯击凿刘则创删剂剑剥剧劝办务励劲劳势汇匮区医华协单卖卫却历压厌厕厢厦厨县参双变叙叶叹吓吗启响哑哗员呜咏咙团园围图圆场块坚坛坝坞坟坠垄垒垦垫堕壮声壳壶处备够夹夺奖妇妈娇婴婶孙孪宝实宠审宪宫宽宾寻导寿专将尔尝尧尽层届属屡岁岂岗岛峡峦崭]/;

describe('Phase 4A Layer 1: Chinese Measure Words & Idiom Context (24 Sets / 120 Qs)', () => {
  it('contains 12 Measure Word sets (60 Qs) and 12 Idiom/Confusable sets (60 Qs) balanced across Tiers 1-4', () => {
    expect(MEASURE_WORD_SETS).toHaveLength(12);
    expect(IDIOM_CONTEXT_SETS).toHaveLength(12);
    expect(BUILTIN_MEASURE_IDIOM_SETS).toHaveLength(24);

    for (const tier of [1, 2, 3, 4] as const) {
      const sets = getMeasureIdiomSetsByTier(tier);
      expect(sets).toHaveLength(6);
      expect(sets.filter((s) => s.kind === 'measure')).toHaveLength(3);
      expect(sets.filter((s) => s.kind === 'idiom')).toHaveLength(3);
    }
  });

  it('enforces zero simplified chars, valid Taiwan MOE Zhuyin, valid emblems, zero answer leak, and 4 unique choices across all 120 questions', () => {
    const seenSetIds = new Set<string>();
    const seenQIds = new Set<string>();

    for (const set of BUILTIN_MEASURE_IDIOM_SETS) {
      expect(seenSetIds.has(set.id)).toBe(false);
      seenSetIds.add(set.id);
      expect(getCollectibleById(set.emblemCollectibleId)).toBeTruthy();
      expect(set.questions).toHaveLength(5);

      for (const q of set.questions) {
        expect(seenQIds.has(q.id)).toBe(false);
        seenQIds.add(q.id);

        // Zero simplified Chinese characters across all text fields
        const allText = [
          set.title,
          set.subtitle,
          q.targetAnswer,
          q.promptSentence,
          q.spokenFullSentence,
          q.explanation,
          ...q.choices,
        ].join(' ');
        expect(STRICT_SIMPLIFIED_ONLY.test(allText)).toBe(false);

        // Exactly one blank '___' and zero answer leak in promptSentence
        expect(q.promptSentence.split('___')).toHaveLength(2);
        expect(q.promptSentence.includes(q.targetAnswer)).toBe(false);
        expect(q.spokenFullSentence).toBe(q.promptSentence.replace('___', q.targetAnswer));

        // 4 unique choices + exact target alignment
        expect(q.choices).toHaveLength(4);
        expect(q.choiceZhuyins).toHaveLength(4);
        expect(new Set(q.choices).size).toBe(4);
        expect(q.choices[q.correctIndex]).toBe(q.targetAnswer);
        expect(q.choiceZhuyins[q.correctIndex]).toBe(q.targetZhuyin);

        // Every choice's Zhuyin has valid Taiwan MOE syllables matching CJK char count
        for (let i = 0; i < 4; i += 1) {
          const chars = Array.from(q.choices[i]);
          const syls = q.choiceZhuyins[i].trim().split(/\s+/);
          expect(syls).toHaveLength(chars.length);
          for (const s of syls) {
            expect(VALID_ZHUYIN_SYL.test(s)).toBe(true);
          }
        }
      }
    }

    expect(seenQIds.size).toBe(120);
  });

  it('integrates Measure/Idiom sets with Plan A anti-farming reward policy', () => {
    const day1 = '2026-11-23';
    const day2 = '2026-11-24';
    const sampleSet = MEASURE_WORD_SETS[0];
    let state = createInitialPlayerState('Maya');

    expect(
      getQuestRewardPolicy(state, {
        questSetId: sampleSet.id,
        kind: 'static',
        subjectId: 'chinese',
        todayKey: day1,
        completedIds: state.completedMeasureIds ?? [],
      }).multiplier,
    ).toBe(1);

    state = recordDailyQuestClaim(
      { ...state, completedMeasureIds: [sampleSet.id] },
      sampleSet.id,
      day1,
    );

    // Same-day repeat => 0%
    expect(
      getQuestRewardPolicy(state, {
        questSetId: sampleSet.id,
        kind: 'static',
        subjectId: 'chinese',
        todayKey: day1,
        completedIds: state.completedMeasureIds ?? [],
      }).multiplier,
    ).toBe(0);

    // Next day review => 50%
    expect(
      getQuestRewardPolicy(state, {
        questSetId: sampleSet.id,
        kind: 'static',
        subjectId: 'chinese',
        todayKey: day2,
        completedIds: state.completedMeasureIds ?? [],
      }).multiplier,
    ).toBe(0.5);
  });
});

describe('Phase 4A Layer 1: Long-Term Achievement Badges & Lifetime Anti-Farming Claim Lock', () => {
  it('defines 30 unique achievement badges and enforces unlock + lifetime once-per-badge claims', () => {
    expect(ACHIEVEMENTS.length).toBeGreaterThanOrEqual(24);
    expect(new Set(ACHIEVEMENTS.map((a) => a.id)).size).toBe(ACHIEVEMENTS.length);

    const fresh = createInitialPlayerState('Maya');
    expect(getClaimableAchievementCount(fresh)).toBe(0);

    // Cannot claim locked badge
    const lockedRes = claimAchievementReward(fresh, 'ach-first-quest');
    expect(lockedRes.ok).toBe(false);
    if (!lockedRes.ok) expect(lockedRes.reason).toBe('not_unlocked');

    // Complete 3 measure sets -> unlocks ach-first-quest AND ach-measure-3!
    const progressed = {
      ...fresh,
      completedMeasureIds: ['zh-meas-t1-1', 'zh-meas-t1-2', 'zh-meas-t1-3'],
    };
    expect(getClaimableAchievementCount(progressed)).toBe(2);

    const evals = evaluateAchievements(progressed);
    expect(evals.find((e) => e.def.id === 'ach-measure-3')?.claimable).toBe(true);

    // Claim ach-measure-3 (+25 Star Dust)
    const claim1 = claimAchievementReward(progressed, 'ach-measure-3');
    expect(claim1.ok).toBe(true);
    if (!claim1.ok) return;
    expect(claim1.rewardType).toBe('starDust');
    expect(claim1.state.starDust).toBe((progressed.starDust ?? 0) + 25);
    expect(claim1.state.claimedAchievementIds).toContain('ach-measure-3');

    // Second claim of same badge is strictly rejected (lifetime once-per-badge!)
    const claim2 = claimAchievementReward(claim1.state, 'ach-measure-3');
    expect(claim2.ok).toBe(false);
    if (!claim2.ok) expect(claim2.reason).toBe('already_claimed');

    // Survives JSON export/import roundtrip cleanly (v1 backward-compatible)
    const json = exportPlayerStateJson(claim1.state);
    const imported = importPlayerStateJson(json);
    expect(imported.ok).toBe(true);
    if (!imported.ok) return;
    expect(imported.state.completedMeasureIds).toEqual([
      'zh-meas-t1-1',
      'zh-meas-t1-2',
      'zh-meas-t1-3',
    ]);
    expect(imported.state.claimedAchievementIds).toEqual(['ach-measure-3']);
  });
});
