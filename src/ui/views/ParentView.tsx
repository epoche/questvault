import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Check,
  Copy,
  Flame,
  KeyRound,
  Play,
  Plus,
  Printer,
  Sparkles,
  Trash2,
} from 'lucide-react';
import {
  buildWeeklyReviewChineseSet,
  buildWeeklyReviewEnglishSet,
  computeWeeklySnapshot,
  createParentGateChallenge,
  formatWeeklyReportText,
  getWeakSpotRadar,
} from '../../core/analytics';
import type { PlayerState, SubjectId } from '../../core/types';
import { customChineseRecordToWordSet } from '../../subjects/chinese/chineseCustomParser';
import type { ChineseWordSet } from '../../subjects/chinese/types';
import { customRecordToWordSet } from '../../subjects/english/customParser';
import type { WordSet } from '../../subjects/english/types';

interface ParentViewProps {
  player: PlayerState;
  onExit: () => void;
  onStartEnglishRun: (wordSet: WordSet) => void;
  onStartChineseRun: (wordSet: ChineseWordSet) => void;
  onOpenCustomImporter: (subjectId: 'english' | 'chinese') => void;
  onDeleteCustomSet: (id: string) => void;
}

export const ParentView: React.FC<ParentViewProps> = ({
  player,
  onExit,
  onStartEnglishRun,
  onStartChineseRun,
  onOpenCustomImporter,
  onDeleteCustomSet,
}) => {
  const [unlocked, setUnlocked] = useState(false);
  const [challenge, setChallenge] = useState(() => createParentGateChallenge());
  const [gateWrong, setGateWrong] = useState(false);

  const [radarSubject, setRadarSubject] = useState<'all' | SubjectId>('all');
  const [copied, setCopied] = useState(false);
  const [copyFallbackText, setCopyFallbackText] = useState<string | null>(null);

  const snapshot = useMemo(() => computeWeeklySnapshot(player), [player]);
  const weakSpots = useMemo(
    () =>
      getWeakSpotRadar(
        player.wordMastery,
        radarSubject === 'all' ? undefined : radarSubject,
        10,
      ),
    [player.wordMastery, radarSubject],
  );
  const reportText = useMemo(() => formatWeeklyReportText(player), [player]);

  const handleGateChoice = (val: number) => {
    if (val === challenge.answer) {
      setGateWrong(false);
      setUnlocked(true);
    } else {
      setGateWrong(true);
      setChallenge(createParentGateChallenge());
    }
  };

  const handleCopyReport = async () => {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(reportText);
        setCopied(true);
        setCopyFallbackText(null);
        window.setTimeout(() => setCopied(false), 2000);
        return;
      }
    } catch {
      // Fall through to inline copy box in strict sandbox environments
    }
    setCopyFallbackText(reportText);
  };

  const handlePrint = () => {
    try {
      if (typeof window.print === 'function') {
        window.print();
      }
    } catch {
      // Safe no-op in restricted sandbox
    }
  };

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-md space-y-5 py-6">
        <button
          type="button"
          onClick={onExit}
          className="qv-btn inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#E5DFD3] bg-white px-3.5 py-2 text-xs font-extrabold text-[#57534E]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>返回學習主頁</span>
        </button>

        <div className="qv-surface rounded-3xl p-6 sm:p-8 text-center space-y-5">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#1C1917] bg-[#FEF3C7] text-[#B45309]">
            <KeyRound className="h-7 w-7" />
          </div>

          <div className="space-y-1">
            <h1 className="font-display text-2xl font-extrabold text-[#1C1917]">
              家長檢視室 Parent Corner
            </h1>
            <p className="text-sm font-semibold text-[#57534E]">
              請答對下方乘法題即可進入（避免小朋友誤點）
            </p>
          </div>

          <div className="rounded-2xl border-2 border-[#E5DFD3] bg-[#FAF7F2] py-4 px-5 font-display text-3xl font-extrabold text-[#1C1917] tabular-nums">
            {challenge.prompt}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {challenge.choices.map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleGateChoice(num)}
                className="qv-arcade-btn min-h-[54px] rounded-2xl border-2 border-[#1C1917] bg-white font-display text-xl font-extrabold text-[#1C1917] hover:bg-[#EFF6FF] tabular-nums"
                style={{ borderBottomColor: '#1C1917' }}
              >
                {num}
              </button>
            ))}
          </div>

          {gateWrong && (
            <p className="text-xs font-extrabold text-[#DC2626]">
              答錯了，已換一題新的乘法，請再試一次！
            </p>
          )}
        </div>
      </div>
    );
  }

  const enWeeklySet = buildWeeklyReviewEnglishSet(player);
  const zhWeeklySet = buildWeeklyReviewChineseSet(player);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExit}
            className="qv-btn inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#E5DFD3] bg-white px-3.5 py-2 text-xs font-extrabold text-[#57534E]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>離開家長室</span>
          </button>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917]">
              家長檢視室 · {player.displayName}
            </h1>
            <p className="text-xs font-semibold text-[#57534E]">
              近 7 天學習總覽、弱點雷達、每週錯題複習與造句作品集
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyReport}
            className="qv-btn inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border-2 border-[#1C1917] bg-[#EFF6FF] px-3.5 py-2 text-xs font-extrabold text-[#1D4ED8]"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? '已複製週報！' : '複製文字週報'}</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="qv-btn inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#E5DFD3] bg-white px-3.5 py-2 text-xs font-extrabold text-[#1C1917]"
          >
            <Printer className="h-4 w-4" />
            <span>列印週報</span>
          </button>
        </div>
      </div>

      {/* Inline Copy Fallback (for strict sandbox where Clipboard API is disabled) */}
      {copyFallbackText && (
        <div className="qv-surface rounded-2xl p-4 space-y-2 border-2 border-[#2563EB]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#1D4ED8]">
              沙盒環境無法自動存取剪貼簿，請直接選取下方週報文字複製：
            </span>
            <button
              type="button"
              onClick={() => setCopyFallbackText(null)}
              className="text-xs font-extrabold text-[#57534E]"
            >
              關閉
            </button>
          </div>
          <textarea
            readOnly
            value={copyFallbackText}
            rows={7}
            className="w-full rounded-xl border border-[#E5DFD3] bg-[#FAF7F2] p-3 font-mono text-xs text-[#1C1917]"
          />
        </div>
      )}

      {/* 1. Weekly Snapshot */}
      <section className="qv-surface rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-extrabold text-[#1C1917]">
            本週學習總覽（近 7 天）
          </h2>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF7ED] border border-[#FED7AA] px-3 py-1 text-xs font-extrabold text-[#C2410C] tabular-nums">
            <Flame className="h-3.5 w-3.5 fill-current" />
            連勝 {snapshot.streakDays} 天 · 活躍 {snapshot.activeDays} 天
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] p-3.5">
            <div className="text-xs font-bold text-[#1D4ED8]">本週完成關卡</div>
            <div className="mt-1 font-display text-2xl font-extrabold text-[#1E3A8A] tabular-nums">
              {snapshot.totalRuns}
            </div>
            <div className="mt-1 text-[11px] font-semibold text-[#1D4ED8] tabular-nums">
              英 {snapshot.runsBySubject.english} · 數 {snapshot.runsBySubject.math} · 中 {snapshot.runsBySubject.chinese}
            </div>
          </div>

          <div className="rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] p-3.5">
            <div className="text-xs font-bold text-[#047857]">本週平均正確率</div>
            <div className="mt-1 font-display text-2xl font-extrabold text-[#065F46] tabular-nums">
              {snapshot.totalRuns > 0 ? `${snapshot.avgAccuracyPct}%` : '—'}
            </div>
            <div className="mt-1 text-[11px] font-semibold text-[#047857] tabular-nums">
              精熟 {snapshot.masteredWordsCount} / {snapshot.practicedWordsCount} 詞
            </div>
          </div>

          <div className="rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] p-3.5">
            <div className="text-xs font-bold text-[#B45309]">本週賺取 Tokens</div>
            <div className="mt-1 font-display text-2xl font-extrabold text-[#92400E] tabular-nums">
              +{snapshot.tokensEarned}
            </div>
            <div className="mt-1 text-[11px] font-semibold text-[#B45309] tabular-nums">
              目前持有 {player.tokens} Tokens
            </div>
          </div>

          <div className="rounded-2xl bg-[#FDF2F8] border border-[#FBCFE8] p-3.5">
            <div className="text-xs font-bold text-[#BE185D]">本週造句產出</div>
            <div className="mt-1 font-display text-2xl font-extrabold text-[#9D174D] tabular-nums">
              {snapshot.writingCountThisWeek} 句
            </div>
            <div className="mt-1 text-[11px] font-semibold text-[#BE185D] tabular-nums">
              累積 {player.writingLog.length} 篇作品
            </div>
          </div>
        </div>
      </section>

      {/* 2. One-Click Weekly Review Launchers */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="qv-surface rounded-3xl p-5 flex items-center justify-between gap-4 border-2 border-[#BFDBFE]">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#EFF6FF] px-2.5 py-0.5 text-[11px] font-extrabold text-[#1D4ED8]">
              <Sparkles className="h-3 w-3" /> 1.5× Weekly Review
            </span>
            <h3 className="font-display text-lg font-extrabold text-[#1C1917]">
              英文每週錯題複習考
            </h3>
            <p className="text-xs font-semibold text-[#57534E]">
              精選詞：{enWeeklySet.words.map((w) => w.word).join(', ')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onStartEnglishRun(enWeeklySet)}
            className="qv-arcade-btn inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#2563EB] px-4 py-2 font-display text-sm font-extrabold text-white"
            style={{ borderBottomColor: '#1E3A8A' }}
          >
            <Play className="h-4 w-4 fill-current" />
            <span>立即開考</span>
          </button>
        </div>

        <div className="qv-surface rounded-3xl p-5 flex items-center justify-between gap-4 border-2 border-[#FBCFE8]">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FDF2F8] px-2.5 py-0.5 text-[11px] font-extrabold text-[#BE185D]">
              <Sparkles className="h-3 w-3" /> 1.5× 每週特訓
            </span>
            <h3 className="font-display text-lg font-extrabold text-[#1C1917]">
              中文每週錯題複習考
            </h3>
            <p className="text-xs font-semibold text-[#57534E]">
              精選詞：{zhWeeklySet.words.map((w) => w.word).join('、')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onStartChineseRun(zhWeeklySet)}
            className="qv-arcade-btn inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#DB2777] px-4 py-2 font-display text-sm font-extrabold text-white"
            style={{ borderBottomColor: '#9D174D' }}
          >
            <Play className="h-4 w-4 fill-current" />
            <span>立即開考</span>
          </button>
        </div>
      </section>

      {/* 3. Weak-Spot Radar */}
      <section className="qv-surface rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="inline-flex items-center gap-2 font-display text-lg font-extrabold text-[#1C1917]">
            <AlertTriangle className="h-5 w-5 text-[#EA580C]" />
            <span>弱點雷達（最常錯 Top 10）</span>
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {(['all', 'english', 'chinese', 'math'] as const).map((sid) => {
              const label =
                sid === 'all' ? '全部' : sid === 'english' ? 'English' : sid === 'chinese' ? '中文' : 'Math';
              const active = radarSubject === sid;
              return (
                <button
                  key={sid}
                  type="button"
                  onClick={() => setRadarSubject(sid)}
                  className={`qv-btn min-h-[34px] rounded-xl border px-3 py-1 text-xs font-extrabold ${
                    active
                      ? 'border-[#1C1917] bg-[#1C1917] text-white'
                      : 'border-[#E5DFD3] bg-white text-[#57534E]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {weakSpots.length === 0 ? (
          <div className="rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] p-4 text-sm font-bold text-[#047857]">
            目前沒有高頻錯題！小朋友表現非常穩定，可以直接點擊上方「每週錯題複習考」做定期鞏固。
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {weakSpots.map((item) => (
              <div
                key={`${item.subjectId}-${item.word}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-[#E5DFD3] bg-[#FAF7F2] px-4 py-2.5"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-base font-extrabold text-[#1C1917] truncate">
                      {item.word}
                    </span>
                    <span className="rounded-full bg-white border border-[#E5DFD3] px-2 py-0.5 text-[10px] font-extrabold text-[#57534E]">
                      {item.subjectId === 'chinese' ? '中文' : item.subjectId === 'math' ? 'Math' : 'EN'} · T{item.tier}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-[#57534E] tabular-nums">
                    練習 {item.seen} 次 · 首次正確率 {item.accuracyPct}% · SRS Lv.{item.srsLevel}
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-[#FEF2F2] border border-[#FECACA] px-2.5 py-1 text-xs font-extrabold text-[#DC2626] tabular-nums">
                  錯 {item.missed} 次
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Custom Weekly Word Lists Manager + Writing Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="qv-surface rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-lg font-extrabold text-[#1C1917]">
              每週自訂生字表
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onOpenCustomImporter('english')}
                className="qv-btn inline-flex min-h-[36px] items-center gap-1 rounded-xl border border-[#2563EB] bg-[#EFF6FF] px-3 py-1 text-xs font-extrabold text-[#1D4ED8]"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>英文表</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenCustomImporter('chinese')}
                className="qv-btn inline-flex min-h-[36px] items-center gap-1 rounded-xl border border-[#DB2777] bg-[#FDF2F8] px-3 py-1 text-xs font-extrabold text-[#BE185D]"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>中文表</span>
              </button>
            </div>
          </div>

          {player.customWordSets.length === 0 ? (
            <p className="rounded-2xl bg-[#FAF7F2] border border-[#E5DFD3] p-4 text-xs font-semibold text-[#57534E]">
              尚未建立自訂生字表。點擊右上方按鈕即可匯入學校每週英文或中文生字（中文將自動補齊台灣教育部注音！）。
            </p>
          ) : (
            <div className="space-y-2.5">
              {player.customWordSets.map((rec) => (
                <div
                  key={rec.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-[#E5DFD3] bg-[#FAF7F2] px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="font-display text-sm font-extrabold text-[#1C1917] truncate">
                      {rec.title}
                    </div>
                    <div className="text-[11px] font-semibold text-[#57534E] truncate">
                      {rec.subjectId === 'chinese' ? '中文' : 'English'} · {rec.words.map((w) => w.word).join('、')}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        if (rec.subjectId === 'chinese') {
                          onStartChineseRun(customChineseRecordToWordSet(rec));
                        } else {
                          onStartEnglishRun(customRecordToWordSet(rec));
                        }
                      }}
                      className="qv-btn inline-flex min-h-[34px] items-center gap-1 rounded-xl bg-[#2563EB] px-3 py-1 text-xs font-extrabold text-white"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      <span>開玩</span>
                    </button>
                    <button
                      type="button"
                      aria-label={`刪除 ${rec.title}`}
                      onClick={() => onDeleteCustomSet(rec.id)}
                      className="qv-btn inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[#FECACA] bg-white text-[#DC2626]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="qv-surface rounded-3xl p-5 sm:p-6 space-y-4">
          <h2 className="inline-flex items-center gap-2 font-display text-lg font-extrabold text-[#1C1917]">
            <BookOpen className="h-5 w-5 text-[#2563EB]" />
            <span>近期造句作品集（最新 8 篇）</span>
          </h2>

          {player.writingLog.length === 0 ? (
            <p className="rounded-2xl bg-[#FAF7F2] border border-[#E5DFD3] p-4 text-xs font-semibold text-[#57534E]">
              小朋友完成英文或中文 Stage 3 造句寶箱後，句子會自動收錄在這裡讓家長檢閱！
            </p>
          ) : (
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {player.writingLog.slice(0, 8).map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-2xl border border-[#E5DFD3] bg-[#FAF7F2] px-4 py-3 space-y-1"
                >
                  <div className="flex items-center justify-between gap-2 text-[11px] font-extrabold text-[#57534E]">
                    <span>
                      {entry.subjectId === 'chinese' ? '中文' : 'English'} · {entry.questSetTitle}
                    </span>
                    <span className="tabular-nums">{entry.createdAt.slice(0, 10)}</span>
                  </div>
                  <p className="text-sm font-bold text-[#1C1917] leading-relaxed">
                    {entry.sentence}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
