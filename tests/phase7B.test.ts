import { describe, expect, it } from 'vitest';
import { awardLogicModuleRewards, createInitialPlayerState } from '../src/core/economy';
import {
  buildLogicReasoningSession,
  generateBalanceScaleQuestion,
  generateLogicGridQuestion,
  generatePatternMatrixQuestion,
  generateRobotCodingQuestion,
  serializeMatrixCell,
  simulateRobotProgram,
  solve3x3LogicGrid,
  solveBalanceSystem,
} from '../src/subjects/logic/logicReasoningEngine';
import {
  ALL_LOGIC_MODULES,
  LOGIC_REASONING_MODULES,
  type LogicReasoningModuleId,
} from '../src/subjects/logic/logicTypes';

describe('Phase 7B — Logic, Pattern & Coding Lab (1,000+ Mathematical Solver Fuzz Tests)', () => {
  it('exposes 4 Logic Reasoning modules and 8 total Logic & Spatial modules', () => {
    expect(LOGIC_REASONING_MODULES).toHaveLength(4);
    expect(ALL_LOGIC_MODULES).toHaveLength(8);
    expect(new Set(ALL_LOGIC_MODULES.map((m) => m.id)).size).toBe(8);
  });

  it('fuzzes Balance Scale Logic across 250 seeds with independent Gaussian solver + reverse substitution', () => {
    for (let seed = 1; seed <= 250; seed++) {
      const q = generateBalanceScaleQuestion(seed);
      expect(q.choices).toHaveLength(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
      expect(q.promptVisual?.kind).toBe('balance-scale');

      // Ensure 4 distinct choice labels (both EN and ZH)
      const enLabels = new Set(q.choices.map((c) => c.labelEn));
      const zhLabels = new Set(q.choices.map((c) => c.labelZh));
      expect(enLabels.size).toBe(4);
      expect(zhLabels.size).toBe(4);

      if (q.promptVisual?.kind === 'balance-scale') {
        const iconIds = Array.from(
          new Set(
            q.promptVisual.scales.flatMap((s) =>
              [...s.left, ...s.right]
                .filter((i) => i.kind === 'icon')
                .map((i) => i.iconId),
            ),
          ),
        );
        const hasWeights = q.promptVisual.scales.some((s) =>
          [...s.left, ...s.right].some((i) => i.kind === 'weight'),
        );

        const parsedChoiceVal = Number.parseInt(q.choices[q.correctIndex].labelEn ?? '', 10);
        expect(Number.isInteger(parsedChoiceVal)).toBe(true);
        expect(parsedChoiceVal).toBeGreaterThan(0);

        if (hasWeights) {
          const solved = solveBalanceSystem(q.promptVisual.scales, iconIds);
          expect(solved).not.toBeNull();
          const expectedSum = q.promptVisual.askItems.reduce(
            (acc, item) => acc + solved![item.iconId],
            0,
          );
          expect(parsedChoiceVal).toBe(expectedSum);
        } else {
          // Trade scale: identify unit icon from first scale's right pan
          const unitIcon = q.promptVisual.scales[0].right.find((i) => i.kind === 'icon');
          expect(unitIcon).toBeDefined();
          const solved = solveBalanceSystem(
            q.promptVisual.scales,
            iconIds,
            unitIcon!.kind === 'icon' ? unitIcon!.iconId : undefined,
          );
          expect(solved).not.toBeNull();
          const expectedSum = q.promptVisual.askItems.reduce(
            (acc, item) => acc + solved![item.iconId],
            0,
          );
          expect(parsedChoiceVal).toBe(expectedSum);
        }
      }
    }
  });

  it('fuzzes Pattern Matrix across 250 seeds verifying 3x3 structure and 4 pairwise distinct visual cells', () => {
    for (let seed = 1; seed <= 250; seed++) {
      const q = generatePatternMatrixQuestion(seed);
      expect(q.choices).toHaveLength(4);
      expect(q.promptVisual?.kind).toBe('pattern-matrix');
      expect(q.feedbackVisual?.kind).toBe('pattern-matrix');

      if (q.promptVisual?.kind === 'pattern-matrix' && q.feedbackVisual?.kind === 'pattern-matrix') {
        expect(q.promptVisual.cells).toHaveLength(3);
        expect(q.promptVisual.cells[2][2]).toBeNull();
        expect(q.feedbackVisual.solvedCell).toBeDefined();

        const keys = q.choices.map((c) => {
          expect(c.visual?.kind).toBe('matrix-cell');
          return c.visual?.kind === 'matrix-cell' ? serializeMatrixCell(c.visual.cell) : '';
        });
        expect(new Set(keys).size).toBe(4);

        const correctVisual = q.choices[q.correctIndex].visual;
        expect(correctVisual?.kind).toBe('matrix-cell');
        if (correctVisual?.kind === 'matrix-cell') {
          expect(serializeMatrixCell(correctVisual.cell)).toBe(
            serializeMatrixCell(q.feedbackVisual.solvedCell!),
          );
        }
      }
    }
  });

  it('fuzzes 3x3 Logic Deduction Grid across 250 seeds with exhaustive 36-permutation constraint solver', () => {
    // Also verify solver independently on known minimal & under-constrained inputs
    const singleSol = solve3x3LogicGrid([
      { kind: 'person-has-a', personIdx: 0, aIdx: 0, negated: false },
      { kind: 'person-has-a', personIdx: 1, aIdx: 2, negated: true },
      { kind: 'a-with-b', aIdx: 0, bIdx: 1, negated: false },
      { kind: 'person-has-b', personIdx: 2, bIdx: 2, negated: false },
    ]);
    expect(singleSol).toHaveLength(1);

    const ambiguousSol = solve3x3LogicGrid([
      { kind: 'person-has-a', personIdx: 0, aIdx: 0, negated: false },
    ]);
    expect(ambiguousSol.length).toBe(12); // 2 remaining A perms × 6 B perms = 12

    for (let seed = 1; seed <= 250; seed++) {
      const q = generateLogicGridQuestion(seed);
      expect(q.choices).toHaveLength(4);
      expect(new Set(q.choices.map((c) => c.labelEn)).size).toBe(4);
      expect(new Set(q.choices.map((c) => c.labelZh)).size).toBe(4);
      expect(q.promptVisual?.kind).toBe('logic-grid');
      expect(q.feedbackVisual?.kind).toBe('logic-grid');

      if (q.promptVisual?.kind === 'logic-grid' && q.feedbackVisual?.kind === 'logic-grid') {
        expect(q.promptVisual.cluesEn).toHaveLength(4);
        expect(q.promptVisual.cluesZh).toHaveLength(4);
        expect(q.promptVisual.solution).toBeUndefined(); // Anti-spoiler!
        expect(q.feedbackVisual.solution).toHaveLength(3);
        // Check bijection on solution
        const aSet = new Set(q.feedbackVisual.solution!.map((r) => r.aIdx));
        const bSet = new Set(q.feedbackVisual.solution!.map((r) => r.bIdx));
        expect(aSet.size).toBe(3);
        expect(bSet.size).toBe(3);
      }
    }
  });

  it('fuzzes 5x5 Robot Block Coding across 250 seeds verifying state-machine collision-free uniqueness', () => {
    for (let seed = 1; seed <= 250; seed++) {
      const q = generateRobotCodingQuestion(seed);
      expect(q.choices).toHaveLength(4);
      expect(new Set(q.choices.map((c) => c.labelEn)).size).toBe(4);
      expect(new Set(q.choices.map((c) => c.labelZh)).size).toBe(4);
      expect(q.promptVisual?.kind).toBe('robot-grid');
      expect(q.feedbackVisual?.kind).toBe('robot-grid');

      if (q.promptVisual?.kind === 'robot-grid' && q.feedbackVisual?.kind === 'robot-grid') {
        const { size, start, obstacles } = q.promptVisual;
        expect(size).toBe(5);
        expect(q.feedbackVisual.program).toBeDefined();
        expect(q.feedbackVisual.trail).toBeDefined();

        const sim = simulateRobotProgram(size, start, obstacles, q.feedbackVisual.program!);
        expect(sim.crashed).toBe(false);
        expect(sim.end.r).toBeGreaterThanOrEqual(0);
        expect(sim.end.r).toBeLessThan(5);
        expect(sim.end.c).toBeGreaterThanOrEqual(0);
        expect(sim.end.c).toBeLessThan(5);

        if (q.promptVisual.flags) {
          // find-destination mode: 4 distinct open non-start flag coords
          expect(q.promptVisual.flags).toHaveLength(4);
          const coordKeys = new Set(q.promptVisual.flags.map((f) => `${f.r},${f.c}`));
          expect(coordKeys.size).toBe(4);
          const obsSet = new Set(obstacles.map((o) => `${o.r},${o.c}`));
          for (const fl of q.promptVisual.flags) {
            expect(obsSet.has(`${fl.r},${fl.c}`)).toBe(false);
            expect(`${fl.r},${fl.c}`).not.toBe(`${start.r},${start.c}`);
          }
          const correctFlag = q.promptVisual.flags[q.correctIndex];
          expect(correctFlag.r).toBe(sim.end.r);
          expect(correctFlag.c).toBe(sim.end.c);
        } else if (q.promptVisual.star) {
          // pick-program mode: winning program lands on star without crash, and no distractor lands on star
          expect(sim.end.r).toBe(q.promptVisual.star.r);
          expect(sim.end.c).toBe(q.promptVisual.star.c);
          const parseCmd = (token: string) => {
            if (token.includes('×2')) return 'LOOP2_FWD' as const;
            if (token.includes('FWD')) return 'FWD' as const;
            if (token.includes('LEFT')) return 'LEFT' as const;
            return 'RIGHT' as const;
          };
          const star = q.promptVisual.star;
          q.choices.forEach((choice, idx) => {
            const cmds = (choice.labelEn ?? '').split(' → ').map(parseCmd);
            const cSim = simulateRobotProgram(size, start, obstacles, cmds);
            const landsOnStar = !cSim.crashed && cSim.end.r === star.r && cSim.end.c === star.c;
            if (idx === q.correctIndex) {
              expect(landsOnStar).toBe(true);
            } else {
              expect(landsOnStar).toBe(false);
            }
          });
        }
      }
    }
  });

  it('has zero Strawberrys typo and natural Taiwan Traditional Chinese transport wording across 250 seeds', () => {
    for (let seed = 1; seed <= 250; seed++) {
      const bal = generateBalanceScaleQuestion(seed);
      expect(bal.promptEn).not.toContain('Strawberrys');
      const grid = generateLogicGridQuestion(seed);
      if (grid.promptVisual?.kind === 'logic-grid') {
        for (const clue of grid.promptVisual.cluesZh) {
          expect(clue).not.toContain('腳踏車');
          expect(clue).not.toContain('滑板車');
        }
      }
    }
  });

  it('builds 5-question sessions for all 4 Logic Reasoning modules and awards economy rewards', () => {
    let state = createInitialPlayerState('Tester');
    for (const mod of LOGIC_REASONING_MODULES) {
      const qs = buildLogicReasoningSession(mod.id as LogicReasoningModuleId, 4242, 5);
      expect(qs).toHaveLength(5);
      const res = awardLogicModuleRewards(state, mod.id, 5, 5, '2026-11-24');
      state = res.state;
      expect(state.completedLogicModuleIds).toContain(mod.id);
    }
    expect(state.completedLogicModuleIds).toHaveLength(4);
    expect(state.logicDailyTokens?.earned).toBe(90); // Capped at 90/day!
  });
});
