import React, { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  Brain,
  Calculator,
  CheckCircle2,
  Download,
  Flame,
  Languages,
  Sparkles,
  Trophy,
  Upload,
  Volume2,
} from 'lucide-react';
import { audioService } from '../../core/audio';
import {
  getDueReviewItems,
  getLearningWords,
  getMasteredWords,
  getTierAccuracySummary,
  getTrickyWords,
} from '../../core/mastery';
import { exportPlayerStateJson, importPlayerStateJson } from '../../core/repository';
import type { PlayerState, SubjectId } from '../../core/types';
import {
  buildChineseSrsReviewSet,
  buildChineseTrickyRematchSet,
} from '../../subjects/chinese/chineseEngine';
import type { ChineseWordSet } from '../../subjects/chinese/types';
import {
  BUILTIN_CHINESE_SETS,
  CHINESE_TIER_META,
  getChineseTierWordCounts,
} from '../../subjects/chinese/wordSets';
import { buildEnglishSrsReviewSet, buildTrickyRematchWordSet } from '../../subjects/english/runEngine';
import type { WordSet } from '../../subjects/english/types';
import { BUILTIN_WORD_SETS, getTierWordCounts, TIER_META } from '../../subjects/english/wordSets';
import { buildMathSrsReviewSet, buildMathTrickyRematchSet } from '../../subjects/math/mathEngine';
import {
  BUILTIN_MATH_SETS,
  getMathTierSkillCounts,
  MATH_TIER_META,
} from '../../subjects/math/questSets';
import type { MathQuestSet } from '../../subjects/math/types';

interface WritingLogViewProps {
  player: PlayerState;
  activeSubjectId: SubjectId;
  onSelectSubject: (subjectId: SubjectId) => void;
  onImportState: (nextState: PlayerState) => void;
  onRecordBackup?: () => void;
  onStartEnglishRun: (wordSet: WordSet) => void;
  onStartMathRun: (questSet: MathQuestSet) => void;
  onStartChineseRun: (wordSet: ChineseWordSet) => void;
  onGoToQuests: () => void;
}

const SUBJECT_FILTERS: {
  id: SubjectId;
  label: string;
  accent: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'english', label: 'English', accent: '#2563EB', icon: BookOpen },
  { id: 'math', label: 'Math', accent: '#059669', icon: Calculator },
  { id: 'chinese', label: '中文', accent: '#DB2777', icon: Languages },
];

export const WritingLogView: React.FC<WritingLogViewProps> = ({
  player,
  activeSubjectId,
  onSelectSubject,
  onImportState,
  onRecordBackup,
  onStartEnglishRun,
  onStartMathRun,
  onStartChineseRun,
  onGoToQuests,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(activeSubjectId);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [backupNotice, setBackupNotice] = useState<{ tone: 'ok' | 'err'; text: string } | null>(
    null,
  );

  useEffect(() => {
    setSelectedSubject(activeSubjectId);
  }, [activeSubjectId]);

  const handleSubjectSwitch = (subjectId: SubjectId) => {
    setSelectedSubject(subjectId);
    onSelectSubject(subjectId);
  };

  const tierCounts =
    selectedSubject === 'english'
      ? getTierWordCounts()
      : selectedSubject === 'math'
        ? getMathTierSkillCounts()
        : getChineseTierWordCounts();

  const tierMeta =
    selectedSubject === 'english'
      ? TIER_META
      : selectedSubject === 'math'
        ? MATH_TIER_META
        : CHINESE_TIER_META;

  const trickyWords = getTrickyWords(player.wordMastery, selectedSubject);
  const learningWords = getLearningWords(player.wordMastery, selectedSubject);
  const masteredWords = getMasteredWords(player.wordMastery, selectedSubject);
  const dueSrsItems = getDueReviewItems(player.wordMastery, selectedSubject);
  const tierSummary = getTierAccuracySummary(player.wordMastery, tierCounts, selectedSubject);

  const bossDate =
    player.subjectBossRematchDate?.[selectedSubject] ??
    (selectedSubject === 'english' ? player.lastBossRematchDate : undefined);

  const enRematch =
    selectedSubject === 'english'
      ? buildTrickyRematchWordSet(player.wordMastery, BUILTIN_WORD_SETS, bossDate)
      : null;
  const mathRematch =
    selectedSubject === 'math'
      ? buildMathTrickyRematchSet(player.wordMastery, BUILTIN_MATH_SETS, bossDate)
      : null;
  const zhRematch =
    selectedSubject === 'chinese'
      ? buildChineseTrickyRematchSet(player.wordMastery, BUILTIN_CHINESE_SETS, bossDate)
      : null;

  const enSrs =
    selectedSubject === 'english'
      ? buildEnglishSrsReviewSet(player.wordMastery, BUILTIN_WORD_SETS)
      : null;
  const mathSrs =
    selectedSubject === 'math'
      ? buildMathSrsReviewSet(player.wordMastery, BUILTIN_MATH_SETS)
      : null;
  const zhSrs =
    selectedSubject === 'chinese'
      ? buildChineseSrsReviewSet(player.wordMastery, BUILTIN_CHINESE_SETS)
      : null;

  const hasRematch = Boolean(enRematch || mathRematch || zhRematch);
  const hasSrs = Boolean(enSrs || mathSrs || zhSrs);
  const streakDays = player.streakDays ?? 0;
  const blitzBest = player.blitzHighScores?.[selectedSubject] ?? 0;

  const filteredWritingLog = player.writingLog.filter((entry) =>
    selectedSubject === 'math' ? true : entry.subjectId === selectedSubject,
  );

  const speechLang = selectedSubject === 'chinese' ? 'zh-TW' : 'en-US';
  const unitLabel = selectedSubject === 'math' ? 'skills' : selectedSubject === 'chinese' ? '詞' : 'words';

  const handleExport = () => {
    try {
      const nowIso = new Date().toISOString();
      const json = exportPlayerStateJson({ ...player, lastBackupAt: nowIso });
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `questvault-backup-${player.displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.json`;
      a.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      onRecordBackup?.();
      setBackupNotice({ tone: 'ok', text: 'Backup saved! Restore anytime on any iPad or Chromebook.' });
    } catch {
      setBackupNotice({
        tone: 'err',
        text: 'Export is restricted in this sandbox browser. Please open QuestVault directly in Safari/Chrome to save a backup.',
      });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const res = importPlayerStateJson(text);
    if (!res.ok) {
      setBackupNotice({ tone: 'err', text: res.error });
    } else {
      onImportState(res.state);
      setBackupNotice({
        tone: 'ok',
        text: `Restored ${res.state.displayName}'s Vault (${res.state.tokens} Tokens)!`,
      });
    }
    e.target.value = '';
  };

  const isZh = selectedSubject === 'chinese';

  return (
    <div className="space-y-7">
      {/* Parent & Player Multi-Subject Mastery Tracker */}
      <section className="qv-surface rounded-3xl p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <h1 className="font-display text-2xl font-extrabold text-[#1C1917]">
              {isZh ? '學習進度與常錯詞彙' : 'Progress & Tricky Items'}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1 rounded-2xl border border-[#E5DFD3] bg-[#F3EFE7] p-1">
                {SUBJECT_FILTERS.map((subj) => {
                  const Icon = subj.icon;
                  const active = selectedSubject === subj.id;
                  return (
                    <button
                      key={subj.id}
                      type="button"
                      onClick={() => handleSubjectSwitch(subj.id)}
                      className={`qv-btn inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-extrabold transition-colors ${
                        active ? 'text-white shadow-xs' : 'text-[#57534E] hover:text-[#1C1917]'
                      }`}
                      style={active ? { backgroundColor: subj.accent } : undefined}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{subj.label}</span>
                    </button>
                  );
                })}
              </div>

              <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF7ED] border border-[#FED7AA] px-2.5 py-1 text-xs font-extrabold text-[#C2410C] tabular-nums">
                <Flame className="h-3.5 w-3.5 fill-current" />
                {isZh ? `連勝 ${streakDays} 天` : `${streakDays}d Streak`}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F5F3FF] border border-[#DDD6FE] px-2.5 py-1 text-xs font-extrabold text-[#6D28D9] tabular-nums">
                <Trophy className="h-3.5 w-3.5" />
                {isZh ? `街機最高：${blitzBest}` : `Blitz Best: ${blitzBest}`}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F0F9FF] border border-[#BAE6FD] px-2.5 py-1 text-xs font-extrabold text-[#0369A1] tabular-nums">
                <Brain className="h-3.5 w-3.5" />
                {dueSrsItems.length > 0 && dueSrsItems.length < 3
                  ? isZh
                    ? `到期複習：${dueSrsItems.length}（滿 3 題解鎖）`
                    : `SRS Due: ${dueSrsItems.length} (Unlocks at 3)`
                  : isZh
                    ? `到期複習：${dueSrsItems.length}`
                    : `SRS Due: ${dueSrsItems.length}`}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {hasSrs && (
              <button
                type="button"
                onClick={() => {
                  if (enSrs) onStartEnglishRun(enSrs);
                  else if (mathSrs) onStartMathRun(mathSrs);
                  else if (zhSrs) onStartChineseRun(zhSrs);
                }}
                className="qv-btn inline-flex items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#0284C7] px-4 py-2 font-display text-sm font-extrabold text-white"
              >
                <Brain className="h-4 w-4" />
                <span>{isZh ? `記憶曲線複習 (${dueSrsItems.length})` : `SRS Review (${dueSrsItems.length})`}</span>
              </button>
            )}
            {hasRematch && (
              <button
                type="button"
                onClick={() => {
                  if (enRematch) onStartEnglishRun(enRematch);
                  else if (mathRematch) onStartMathRun(mathRematch);
                  else if (zhRematch) onStartChineseRun(zhRematch);
                }}
                className="qv-btn inline-flex items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#E11D48] px-4 py-2 font-display text-sm font-extrabold text-white"
              >
                <Flame className="h-4 w-4 fill-current" />
                <span>{isZh ? '錯詞魔王戰 (1.5×)' : 'Practice Tricky (1.5×)'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Visual 4-Tier Coverage + Accuracy Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 tabular-nums">
          {tierSummary.map((row) => {
            const meta = tierMeta[row.tier];
            return (
              <div
                key={row.tier}
                className="rounded-2xl p-3.5 border border-[#E7E2D8]"
                style={{ backgroundColor: meta.bgHex }}
              >
                <div className="text-xs font-extrabold" style={{ color: meta.colorHex }}>
                  {meta.shortLabel}
                </div>
                <div className="mt-1 font-display text-xl font-extrabold text-[#1C1917]">
                  {row.practicedWords}/{row.totalWords}{' '}
                  <span className="text-xs font-bold text-[#57534E]">{unitLabel}</span>
                </div>
                <div className="text-xs font-bold text-[#57534E]">
                  {row.accuracyPct !== null
                    ? isZh
                      ? `首次正確率 ${row.accuracyPct}%`
                      : `${row.accuracyPct}% clean`
                    : isZh
                      ? '尚未開始'
                      : 'Not started'}
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-white overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${row.coveragePct}%`,
                      backgroundColor: meta.colorHex,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* All 3 Mastery Buckets: Needs Practice / Learning / Mastered */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-[#FECDD3] bg-[#FFF1F2]/70 p-4 space-y-2.5">
            <h2 className="font-display text-base font-extrabold text-[#BE123C]">
              {isZh ? `待加強 (${trickyWords.length})` : `Needs Practice (${trickyWords.length})`}
            </h2>
            {trickyWords.length === 0 ? (
              <p className="text-sm text-[#881337]/75">
                {isZh ? '目前沒有常錯詞彙，繼續保持！' : 'No tricky items yet — keep playing!'}
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {trickyWords.slice(0, 15).map((rec) => (
                  <button
                    key={rec.word}
                    type="button"
                    onClick={() => audioService.speak(rec.word, speechLang)}
                    className="qv-btn inline-flex items-center gap-1.5 rounded-full border border-[#FDA4AF] bg-white px-3 py-1 text-xs font-extrabold text-[#BE123C] tabular-nums"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                    <span>{rec.word}</span>
                    <span className="rounded-full bg-[#FFE4E6] px-1.5 py-0.2 text-[10px]">
                      {rec.missed}×
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF]/70 p-4 space-y-2.5">
            <h2 className="font-display text-base font-extrabold text-[#1D4ED8]">
              {isZh ? `練習中 (${learningWords.length})` : `Learning (${learningWords.length})`}
            </h2>
            {learningWords.length === 0 ? (
              <p className="text-sm text-[#1E3A8A]/75">
                {isZh
                  ? '練習過一次的詞語會顯示在這裡，朝精熟邁進！'
                  : 'Items practiced once appear here on their way to Mastered.'}
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {learningWords.slice(0, 15).map((rec) => (
                  <button
                    key={rec.word}
                    type="button"
                    onClick={() => audioService.speak(rec.word, speechLang)}
                    className="qv-btn inline-flex items-center gap-1 rounded-full border border-[#93C5FD] bg-white px-3 py-1 text-xs font-extrabold text-[#1D4ED8]"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>{rec.word}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5]/70 p-4 space-y-2.5">
            <h2 className="font-display text-base font-extrabold text-[#047857]">
              {isZh ? `已精熟 (${masteredWords.length})` : `Mastered (${masteredWords.length})`}
            </h2>
            {masteredWords.length === 0 ? (
              <p className="text-sm text-[#065F46]/75">
                {selectedSubject === 'math'
                  ? 'Solve skills cleanly twice to master them!'
                  : isZh
                    ? '連續兩次答對並在造句中成功使用即可精熟！'
                    : 'Answer cleanly twice and use in a sentence to master!'}
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {masteredWords.slice(0, 15).map((rec) => (
                  <button
                    key={rec.word}
                    type="button"
                    onClick={() => audioService.speak(rec.word, speechLang)}
                    className="qv-btn inline-flex items-center gap-1 rounded-full border border-[#6EE7B7] bg-white px-3 py-1 text-xs font-extrabold text-[#047857]"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{rec.word}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Writing Log (English & Chinese) */}
      {selectedSubject !== 'math' && (
      <section className="space-y-3">
        <h2 className="font-display text-xl font-extrabold text-[#1C1917]">
          {isZh ? `造句紀錄 (${filteredWritingLog.length})` : `Writing Log (${filteredWritingLog.length})`}
        </h2>

        {filteredWritingLog.length === 0 ? (
          <div className="qv-surface rounded-3xl p-6 text-center space-y-3">
            <p className="font-display text-lg font-extrabold">
              {isZh ? '還沒有造句紀錄！' : 'No sentences yet!'}
            </p>
            <button
              type="button"
              onClick={onGoToQuests}
              className="qv-btn inline-flex items-center gap-2 rounded-2xl border-2 border-[#1C1917] bg-[#2563EB] px-5 py-2.5 font-display text-sm font-extrabold text-white"
            >
              <BookOpen className="h-4 w-4" />
              <span>{isZh ? '開始闖關' : 'Start a Run'}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredWritingLog.map((entry) => (
              <article key={entry.id} className="qv-surface rounded-3xl p-4 sm:p-5 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#F3EFE7] px-2.5 py-0.5 text-[11px] font-extrabold text-[#57534E]">
                      {entry.subjectId === 'chinese' ? '中文' : 'English'}
                    </span>
                    <span className="font-display text-sm font-extrabold">{entry.questSetTitle}</span>
                    {entry.targetWords.map((w) => (
                      <span
                        key={w}
                        className="rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-xs font-extrabold text-[#047857]"
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      audioService.speak(
                        entry.sentence,
                        entry.subjectId === 'chinese' ? 'zh-TW' : 'en-US',
                      )
                    }
                    aria-label="Read sentence aloud"
                    className="qv-btn inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E7E2D8] bg-[#FAF7F2] text-[#2563EB]"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-base font-semibold text-[#1C1917]">“{entry.sentence}”</p>
              </article>
            ))}
          </div>
        )}
      </section>
      )}

      {/* Compact Shared Backup Bar */}
      <section className="qv-surface rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="font-display text-base font-extrabold text-[#1C1917]">
          {isZh ? '進度備份（JSON · 三科共用）' : 'Vault Backup (JSON · All 3 Subjects)'}
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExport}
            className="qv-btn inline-flex min-h-[42px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-white px-4 py-2 text-sm font-extrabold"
          >
            <Download className="h-4 w-4 text-[#2563EB]" />
            <span>{isZh ? '匯出備份' : 'Export'}</span>
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="qv-btn inline-flex min-h-[42px] items-center gap-1.5 rounded-2xl border border-[#E7E2D8] bg-[#F3EFE7] px-4 py-2 text-sm font-bold"
          >
            <Upload className="h-4 w-4" />
            <span>{isZh ? '還原備份' : 'Restore'}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </section>

      {backupNotice && (
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm font-semibold ${
            backupNotice.tone === 'ok' ? 'bg-[#ECFDF5] text-[#047857]' : 'bg-[#FFF1F2] text-[#BE123C]'
          }`}
        >
          {backupNotice.text}
        </div>
      )}
    </div>
  );
};
