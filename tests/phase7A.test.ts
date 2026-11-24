import { describe, expect, it } from 'vitest';
import {
  awardLogicModuleRewards,
  createInitialPlayerState,
  getTodayLogicTokensEarned,
  LOGIC_DAILY_TOKEN_CAP,
} from '../src/core/economy';
import { exportPlayerStateJson, importPlayerStateJson } from '../src/core/repository';
import {
  ALL_11_VALID_CUBE_NETS,
  buildSpatialSession,
  computeUnfoldedHoles,
  generateCubeNetQuestion,
  generateIsoCubesQuestion,
  generatePaperFoldingQuestion,
  generateRotationMirrorQuestion,
  heightsToTopView,
  INVALID_CUBE_NETS,
  isIsoStructureUnambiguous,
  serializeHoles,
  serializeNetCoords,
  serializePatternGrid,
  serializeTopView,
  simulateCubeNetFold,
  sumHeights,
} from '../src/subjects/logic/spatialEngine';

function canonicalNetD4(coords: readonly (readonly [number, number])[]): string {
  const transforms: Array<(r: number, c: number) => [number, number]> = [
    (r, c) => [r, c],
    (r, c) => [r, -c],
    (r, c) => [-r, c],
    (r, c) => [-r, -c],
    (r, c) => [c, r],
    (r, c) => [c, -r],
    (r, c) => [-c, r],
    (r, c) => [-c, -r],
  ];
  return transforms
    .map((fn) => serializeNetCoords(coords.map(([r, c]) => fn(r, c))))
    .sort()[0];
}

function isFourConnected(coords: readonly (readonly [number, number])[]): boolean {
  const set = new Set(coords.map(([r, c]) => `${r},${c}`));
  if (set.size !== coords.length) return false;
  const visited = new Set<string>([`${coords[0][0]},${coords[0][1]}`]);
  const q: [number, number][] = [[coords[0][0], coords[0][1]]];
  while (q.length > 0) {
    const [r, c] = q.shift()!;
    for (const [nr, nc] of [
      [r + 1, c],
      [r - 1, c],
      [r, c + 1],
      [r, c - 1],
    ]) {
      const k = `${nr},${nc}`;
      if (set.has(k) && !visited.has(k)) {
        visited.add(k);
        q.push([nr, nc]);
      }
    }
  }
  return visited.size === coords.length;
}

describe('Phase 7A Layer 1 — Spatial Reasoning Lab (1,000+ Seed Mathematical Verification)', () => {
  it('verifies Rotation & Mirror Flip across 250 seeds: strictly D4-invariant tiles, asymmetric base & 4 distinct option matrices', () => {
    const allowedShapes = new Set(['circle', 'square', 'diamond', 'plus', 'star4']);
    for (let seed = 1; seed <= 250; seed += 1) {
      const q = generateRotationMirrorQuestion(seed * 137);
      expect(q.choices).toHaveLength(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
      expect(q.promptVisual?.kind).toBe('pattern-grid');

      if (q.promptVisual?.kind === 'pattern-grid') {
        for (const row of q.promptVisual.cells) {
          for (const tile of row) {
            if (tile) expect(allowedShapes.has(tile.shape)).toBe(true);
          }
        }
      }

      const sigs = q.choices.map((c) => {
        expect(c.visual?.kind).toBe('pattern-grid');
        if (c.visual?.kind !== 'pattern-grid') return '';
        return serializePatternGrid(c.visual.cells);
      });
      expect(new Set(sigs).size, `Duplicate choice on seed ${seed}`).toBe(4);
      if (q.promptVisual?.kind === 'pattern-grid') {
        expect(sigs[q.correctIndex]).not.toBe(serializePatternGrid(q.promptVisual.cells));
      }
    }
  });

  it('verifies 3D Isometric Cubes & Top View across 250 seeds: monotonic zero-occlusion visibility & exact cube/top-view answers', () => {
    let countRuns = 0;
    let topRuns = 0;
    for (let seed = 1; seed <= 250; seed += 1) {
      const q = generateIsoCubesQuestion(seed * 251);
      expect(q.choices).toHaveLength(4);
      expect(q.promptVisual?.kind).toBe('iso-cubes');
      if (q.promptVisual?.kind !== 'iso-cubes') continue;

      const heights = q.promptVisual.heights;
      expect(
        isIsoStructureUnambiguous(heights),
        `Ambiguous/occluded 3D cube matrix on seed ${seed}`,
      ).toBe(true);

      if (q.id.startsWith('logic-iso-count-')) {
        countRuns += 1;
        const expected = sumHeights(heights);
        const labels = q.choices.map((c) => c.labelEn ?? '');
        expect(new Set(labels).size).toBe(4);
        expect(labels[q.correctIndex]).toBe(`${expected} cubes`);
      } else {
        topRuns += 1;
        const expectedSig = serializeTopView(heightsToTopView(heights));
        const sigs = q.choices.map((c) => {
          expect(c.visual?.kind).toBe('top-view-grid');
          if (c.visual?.kind !== 'top-view-grid') return '';
          return serializeTopView(c.visual.filled);
        });
        expect(new Set(sigs).size, `Duplicate top-view choice on seed ${seed}`).toBe(4);
        expect(sigs[q.correctIndex]).toBe(expectedSig);
      }
    }
    expect(countRuns).toBeGreaterThan(60);
    expect(topRuns).toBeGreaterThan(60);
  });

  it('proves all 11 Cube Nets distinct & valid, all 10 Invalid Nets 4-connected & distinct, and fuzzes 250 seeds with zero duplicate visuals', () => {
    expect(ALL_11_VALID_CUBE_NETS).toHaveLength(11);
    const validD4 = new Set<string>();
    for (let i = 0; i < ALL_11_VALID_CUBE_NETS.length; i += 1) {
      expect(isFourConnected(ALL_11_VALID_CUBE_NETS[i])).toBe(true);
      validD4.add(canonicalNetD4(ALL_11_VALID_CUBE_NETS[i]));
      const res = simulateCubeNetFold(ALL_11_VALID_CUBE_NETS[i]);
      expect(res.valid, `Valid net #${i} failed 3D fold simulator`).toBe(true);
      expect(Object.keys(res.oppositeIndex)).toHaveLength(6);
      for (let f = 0; f < 6; f += 1) {
        const opp = res.oppositeIndex[f];
        expect(opp).not.toBe(f);
        expect(res.oppositeIndex[opp]).toBe(f);
      }
    }
    expect(validD4.size).toBe(11);

    expect(INVALID_CUBE_NETS).toHaveLength(10);
    const invalidD4 = new Set<string>();
    for (let i = 0; i < INVALID_CUBE_NETS.length; i += 1) {
      expect(isFourConnected(INVALID_CUBE_NETS[i]), `Invalid net #${i} not 4-connected`).toBe(true);
      invalidD4.add(canonicalNetD4(INVALID_CUBE_NETS[i]));
      const res = simulateCubeNetFold(INVALID_CUBE_NETS[i]);
      expect(res.valid, `Invalid net #${i} unexpectedly folded validly`).toBe(false);
    }
    expect(invalidD4.size).toBe(10);

    let oppRuns = 0;
    let validRuns = 0;
    for (let seed = 1; seed <= 250; seed += 1) {
      const q = generateCubeNetQuestion(seed * 389);
      expect(q.choices).toHaveLength(4);
      if (q.id.startsWith('logic-net-opp-')) {
        oppRuns += 1;
        expect(q.promptVisual?.kind).toBe('cube-net');
        if (q.promptVisual?.kind !== 'cube-net') continue;
        const coords = q.promptVisual.cells.map((c) => [c.r, c.c] as const);
        const fold = simulateCubeNetFold(coords);
        expect(fold.valid).toBe(true);
        const hi = q.promptVisual.highlightCoord!;
        const targetIdx = coords.findIndex(([r, c]) => r === hi.r && c === hi.c);
        const oppIdx = fold.oppositeIndex[targetIdx];
        const expectedSym = q.promptVisual.cells[oppIdx].symbol!;
        expect(q.choices[q.correctIndex].labelEn).toContain(expectedSym);
        expect(new Set(q.choices.map((c) => c.labelEn)).size).toBe(4);
      } else {
        validRuns += 1;
        let validCount = 0;
        const choiceSigs = new Set<string>();
        q.choices.forEach((choice, idx) => {
          expect(choice.visual?.kind).toBe('cube-net');
          if (choice.visual?.kind !== 'cube-net') return;
          const coords = choice.visual.cells.map((c) => [c.r, c.c] as const);
          choiceSigs.add(serializeNetCoords(coords));
          const isValid = simulateCubeNetFold(coords).valid;
          if (isValid) validCount += 1;
          expect(isValid).toBe(idx === q.correctIndex);
        });
        expect(validCount, `Expected exactly 1 valid net on seed ${seed}`).toBe(1);
        expect(choiceSigs.size, `Duplicate net visual on seed ${seed}`).toBe(4);
      }
    }
    expect(oppRuns).toBeGreaterThan(60);
    expect(validRuns).toBeGreaterThan(60);
  });

  it('verifies Paper Folding & Symmetry across 250 seeds: exact multi-axis reflection + 4 strictly distinct unfolded sheets', () => {
    for (let seed = 1; seed <= 250; seed += 1) {
      const q = generatePaperFoldingQuestion(seed * 523);
      expect(q.choices).toHaveLength(4);
      expect(q.promptVisual?.kind).toBe('paper-fold');
      if (q.promptVisual?.kind !== 'paper-fold') continue;

      const expected = computeUnfoldedHoles(q.promptVisual.folds, q.promptVisual.holes);
      const expectedSig = serializeHoles(expected);

      const sigs = q.choices.map((c) => {
        expect(c.visual?.kind).toBe('paper-fold');
        if (c.visual?.kind !== 'paper-fold') return '';
        return serializeHoles(c.visual.holes);
      });
      expect(new Set(sigs).size, `Duplicate paper-folding option on seed ${seed}`).toBe(4);
      expect(sigs[q.correctIndex]).toBe(expectedSig);
    }
  });

  it('enforces 60% pass bar, 90-token daily Logic Lab cap, stats, and v1 JSON backward compatibility', () => {
    const session = buildSpatialSession('rotation-mirror', 42, 5);
    expect(session).toHaveLength(5);

    const p0 = createInitialPlayerState('Chloe');
    // 2/5 (40%) fails anti-farming bar -> 0 tokens, not marked completed, stats still recorded
    const failRes = awardLogicModuleRewards(p0, 'rotation-mirror', 2, 5, '2026-11-23');
    expect(failRes.tokensAwarded).toBe(0);
    expect(failRes.state.completedLogicModuleIds ?? []).not.toContain('rotation-mirror');
    expect(failRes.state.logicStats?.['rotation-mirror']?.runs).toBe(1);

    // 5/5 perfect clear -> 10 + 15 + 5 = 30 tokens
    const pass1 = awardLogicModuleRewards(failRes.state, 'rotation-mirror', 5, 5, '2026-11-23');
    expect(pass1.tokensAwarded).toBe(30);
    expect(pass1.state.completedLogicModuleIds).toContain('rotation-mirror');

    // Run 3 more perfect clears on same day -> capped strictly at LOGIC_DAILY_TOKEN_CAP (90)
    const pass2 = awardLogicModuleRewards(pass1.state, 'iso-cubes', 5, 5, '2026-11-23');
    const pass3 = awardLogicModuleRewards(pass2.state, 'cube-nets', 5, 5, '2026-11-23');
    const pass4 = awardLogicModuleRewards(pass3.state, 'paper-folding', 5, 5, '2026-11-23');
    expect(pass2.tokensAwarded).toBe(30);
    expect(pass3.tokensAwarded).toBe(30);
    expect(pass4.tokensAwarded).toBe(0);
    expect(pass4.remainingDailyCap).toBe(0);
    expect(getTodayLogicTokensEarned(pass4.state, '2026-11-23')).toBe(LOGIC_DAILY_TOKEN_CAP);

    // v1 JSON roundtrip & sanitization
    const json = exportPlayerStateJson(pass4.state);
    const restored = importPlayerStateJson(json);
    expect(restored.ok).toBe(true);
    if (!restored.ok) return;
    expect(restored.state.completedLogicModuleIds).toHaveLength(4);
    expect(restored.state.logicDailyTokens?.earned).toBe(LOGIC_DAILY_TOKEN_CAP);
    expect(restored.state.logicStats?.['rotation-mirror']?.totalCorrect).toBe(7);

    // Legacy v1 JSON without Logic Lab fields imports cleanly
    const legacy = JSON.parse(json);
    delete legacy.completedLogicModuleIds;
    delete legacy.logicStats;
    delete legacy.logicDailyTokens;
    const restoredLegacy = importPlayerStateJson(JSON.stringify(legacy));
    expect(restoredLegacy.ok).toBe(true);
  });
});
