import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Check,
  Copy,
  Download,
  Flame,
  Gift,
  KeyRound,
  Lock,
  Play,
  Plus,
  Printer,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
} from 'lucide-react';
import {
  buildWeeklyReviewChineseSet,
  buildWeeklyReviewEnglishSet,
  computeWeeklyGoalProgress,
  computeWeeklySnapshot,
  createParentGateChallenge,
  formatWeeklyReportText,
  getWeakSpotRadar,
  isBackupOverdue,
  PARENT_PIN_HASH_RE,
  verifyParentPin,
  WEEKLY_REWARD_PRESETS,
} from '../../core/analytics';
import { exportPlayerStateJson } from '../../core/repository';
import type { PlayerState, SubjectId, WeeklyGoalConfig } from '../../core/types';
import { customChineseRecordToWordSet } from '../../subjects/chinese/chineseCustomParser';
import type { ChineseWordSet } from '../../subjects/chinese/types';
import { customRecordToWordSet } from '../../subjects/english/customParser';
import type { WordSet } from '../../subjects/english/types';
import {
  classifyHeatmapCell,
  getFactHeatmapKey,
} from '../../subjects/math/factFluencyEngine';

interface ParentViewProps {
  player: PlayerState;
  onExit: () => void;
  onStartEnglishRun: (wordSet: WordSet) => void;
  onStartChineseRun: (wordSet: ChineseWordSet) => void;
  onOpenCustomImporter: (subjectId: 'english' | 'chinese') => void;
  onDeleteCustomSet: (id: string) => void;
  onSetParentPin: (pin: string | undefined) => void;
  onUpdateWeeklyGoal?: (goal: WeeklyGoalConfig) => void;
  onRedeemWeeklyReward?: (weekKey: string) => void;
  onRecordBackup?: () => void;
}

const GATE_COOLDOWN_SEC = 8;

export const ParentView: React.FC<ParentViewProps> = ({
  player,
  onExit,
  onStartEnglishRun,
  onStartChineseRun,
  onOpenCustomImporter,
  onDeleteCustomSet,
  onSetParentPin,
  onUpdateWeeklyGoal,
  onRedeemWeeklyReward,
  onRecordBackup,
}) => {
  const hasSavedPin = Boolean(
    player.parentPinHash && PARENT_PIN_HASH_RE.test(player.parentPinHash),
  );
  const [unlocked, setUnlocked] = useState(false);
  const [gateMode, setGateMode] = useState<'pin' | 'math'>(() => (hasSavedPin ? 'pin' : 'math'));
  const [challenge, setChallenge] = useState(() => createParentGateChallenge());
  const [mathInput, setMathInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [wrongCount, setWrongCount] = useState(0);
  const [cooldownSec, setCooldownSec] = useState(0);
  const [gateError, setGateError] = useState<string | null>(null);
  const [unlockedViaMathReset, setUnlockedViaMathReset] = useState(false);

  // PIN management inside unlocked Parent Corner
  const [newPinInput, setNewPinInput] = useState('');
  const [pinStatusMsg, setPinStatusMsg] = useState<string | null>(null);

  // Phase 4D: Weekly Goal & Real-World Reward Voucher state
  const [goalEn, setGoalEn] = useState<number>(() => player.weeklyGoal?.enTarget ?? 3);
  const [goalZh, setGoalZh] = useState<number>(() => player.weeklyGoal?.zhTarget ?? 3);
  const [goalMath, setGoalMath] = useState<number>(() => player.weeklyGoal?.mathTarget ?? 3);
  const [goalRewardText, setGoalRewardText] = useState<string>(
    () => player.weeklyGoal?.rewardText ?? WEEKLY_REWARD_PRESETS[0],
  );
  const [goalSavedMsg, setGoalSavedMsg] = useState<string | null>(null);
  const [backupSavedNotice, setBackupSavedNotice] = useState<{
    tone: 'ok' | 'warn';
    text: string;
  } | null>(null);

  const [radarSubject, setRadarSubject] = useState<'all' | SubjectId>('all');
  const [copied, setCopied] = useState(false);
  const [copyFallbackText, setCopyFallbackText] = useState<string | null>(null);

  useEffect(() => {
    if (cooldownSec <= 0) return;
    const t = window.setTimeout(() => setCooldownSec((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearTimeout(t);
  }, [cooldownSec]);

  const snapshot = useMemo(() => computeWeeklySnapshot(player), [player]);
  const weeklyGoalProgress = useMemo(() => computeWeeklyGoalProgress(player), [player]);
  const backupStatus = useMemo(() => isBackupOverdue(player), [player]);
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

  const handleSaveWeeklyGoal = () => {
    const cleanReward = goalRewardText.trim().slice(0, 80) || WEEKLY_REWARD_PRESETS[0];
    const en = Math.max(0, Math.min(14, Math.floor(goalEn)));
    const zh = Math.max(0, Math.min(14, Math.floor(goalZh)));
    const math = Math.max(0, Math.min(14, Math.floor(goalMath)));
    onUpdateWeeklyGoal?.({
      enTarget: en,
      zhTarget: zh,
      mathTarget: math,
      rewardText: cleanReward,
      redeemedWeekKey: player.weeklyGoal?.redeemedWeekKey,
    });
    setGoalSavedMsg(
      en + zh + math === 0
        ? '✅ 已暫停每週目標（首頁進度條已隱藏）。'
        : '✅ 本週目標與獎勵券已儲存！小朋友可在首頁看到即時進度條。',
    );
  };

  const handleQuickExportBackup = () => {
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
      setBackupSavedNotice({ tone: 'ok', text: '✅ JSON 備份檔已下載！本機備份日期已更新。' });
    } catch {
      setBackupSavedNotice({
        tone: 'warn',
        text: '⚠️ 當前沙盒環境限制自動下載，可於「Progress」分頁手動匯出。',
      });
    }
  };

  const registerGateMiss = (msg: string, rotateMath: boolean) => {
    const nextMiss = wrongCount + 1;
    if (nextMiss >= 3) {
      setWrongCount(0);
      setCooldownSec(GATE_COOLDOWN_SEC);
      setGateError(`連續答錯 3 次，請等 ${GATE_COOLDOWN_SEC} 秒後再試！`);
    } else {
      setWrongCount(nextMiss);
      setGateError(msg);
    }
    if (rotateMath) {
      setChallenge(createParentGateChallenge());
      setMathInput('');
    } else {
      setPinInput('');
    }
  };

  const handleSubmitMathGate = () => {
    if (cooldownSec > 0) return;
    const trimmed = mathInput.trim();
    if (!/^-?\d+$/.test(trimmed)) {
      setGateError('請輸入純數字答案喔！');
      return;
    }
    const val = Number.parseInt(trimmed, 10);
    if (val === challenge.answer) {
      setGateError(null);
      setWrongCount(0);
      if (hasSavedPin) setUnlockedViaMathReset(true);
      setUnlocked(true);
    } else {
      registerGateMiss('答案不正確，已換一題新題目，請再試一次！', true);
    }
  };

  const handleSubmitPinGate = () => {
    if (cooldownSec > 0) return;
    if (!/^\d{4}$/.test(pinInput)) {
      setGateError('請輸入 4 位數字 PIN 碼！');
      return;
    }
    if (verifyParentPin(pinInput, player.parentPinHash)) {
      setGateError(null);
      setWrongCount(0);
      setUnlocked(true);
    } else {
      registerGateMiss('PIN 碼不正確，請再試一次（或點下方改用數學題重設）。', false);
    }
  };

  const handleSaveNewPin = () => {
    if (!/^\d{4}$/.test(newPinInput)) {
      setPinStatusMsg('請輸入 4 位數字（例如 0824）！');
      return;
    }
    onSetParentPin(newPinInput);
    setNewPinInput('');
    setUnlockedViaMathReset(false);
    setPinStatusMsg('✅ 已儲存 4 位數家長 PIN 碼！下次可直接快速輸入解鎖。');
  };

  const handleClearPin = () => {
    onSetParentPin(undefined);
    setNewPinInput('');
    setUnlockedViaMathReset(false);
    setPinStatusMsg('已清除 PIN 碼，將恢復使用預設國中數學題解鎖。');
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
            {gateMode === 'pin' ? <Lock className="h-7 w-7" /> : <KeyRound className="h-7 w-7" />}
          </div>

          <div className="space-y-1">
            <h1 className="font-display text-2xl font-extrabold text-[#1C1917]">
              家長檢視室 Parent Corner
            </h1>
            <p className="text-sm font-semibold text-[#57534E]">
              {gateMode === 'pin'
                ? '請輸入您的 4 位數家長 PIN 碼快速進入'
                : '請手打輸入下方國中數學題答案（進入後可自訂 4 位數 PIN 碼）'}
            </p>
          </div>

          {gateMode === 'pin' ? (
            <div className="space-y-3">
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pinInput}
                disabled={cooldownSec > 0}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setPinInput(digits);
                  setGateError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmitPinGate();
                }}
                placeholder="••••"
                aria-label="家長 4 位數 PIN 碼"
                className="w-full rounded-2xl border-2 border-[#1C1917] bg-[#FAF7F2] px-4 py-3.5 text-center font-display text-3xl font-extrabold tracking-[0.5em] text-[#1C1917] tabular-nums focus:bg-white focus:outline-none"
              />

              <button
                type="button"
                disabled={cooldownSec > 0 || pinInput.length < 4}
                onClick={handleSubmitPinGate}
                className={`qv-arcade-btn min-h-[48px] w-full rounded-2xl border-2 font-display text-base font-extrabold ${
                  cooldownSec > 0 || pinInput.length < 4
                    ? 'border-[#DDD5C7] bg-[#EFECE4] text-[#9A948A] cursor-not-allowed'
                    : 'border-[#1C1917] bg-[#2563EB] text-white'
                }`}
                style={cooldownSec === 0 && pinInput.length === 4 ? { borderBottomColor: '#1E3A8A' } : undefined}
              >
                {cooldownSec > 0 ? `請稍候 ${cooldownSec} 秒…` : '解鎖進入'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setGateMode('math');
                  setGateError(null);
                  setMathInput('');
                  setChallenge(createParentGateChallenge());
                }}
                className="text-xs font-extrabold text-[#2563EB] hover:underline"
              >
                忘記 PIN 碼？改用國中數學題解鎖並重設 →
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="rounded-2xl border-2 border-[#E5DFD3] bg-[#FAF7F2] py-4 px-5 space-y-1.5">
                <span className="inline-block rounded-full bg-[#FEF3C7] border border-[#FDE68A] px-2.5 py-0.5 text-[11px] font-extrabold text-[#92400E]">
                  {challenge.categoryLabel}
                </span>
                <div className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1917] tabular-nums">
                  {challenge.prompt}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  value={mathInput}
                  disabled={cooldownSec > 0}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/[^\d-]/g, '').slice(0, 6);
                    setMathInput(cleaned);
                    setGateError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSubmitMathGate();
                  }}
                  placeholder="輸入整數答案"
                  aria-label="數學題答案"
                  className="min-w-0 flex-1 rounded-2xl border-2 border-[#1C1917] bg-white px-4 py-3 text-center font-display text-xl font-extrabold text-[#1C1917] tabular-nums focus:outline-none"
                />
                <button
                  type="button"
                  disabled={cooldownSec > 0}
                  onClick={() => {
                    setChallenge(createParentGateChallenge());
                    setMathInput('');
                    setGateError(null);
                  }}
                  aria-label="換一題數學題"
                  className="qv-btn inline-flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border-2 border-[#E5DFD3] bg-white text-[#57534E]"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              </div>

              <button
                type="button"
                disabled={cooldownSec > 0 || mathInput.trim().length === 0}
                onClick={handleSubmitMathGate}
                className={`qv-arcade-btn min-h-[48px] w-full rounded-2xl border-2 font-display text-base font-extrabold ${
                  cooldownSec > 0 || mathInput.trim().length === 0
                    ? 'border-[#DDD5C7] bg-[#EFECE4] text-[#9A948A] cursor-not-allowed'
                    : 'border-[#1C1917] bg-[#2563EB] text-white'
                }`}
                style={
                  cooldownSec === 0 && mathInput.trim().length > 0
                    ? { borderBottomColor: '#1E3A8A' }
                    : undefined
                }
              >
                {cooldownSec > 0 ? `請稍候 ${cooldownSec} 秒…` : '驗證答案並進入'}
              </button>

              {hasSavedPin && (
                <button
                  type="button"
                  onClick={() => {
                    setGateMode('pin');
                    setGateError(null);
                    setPinInput('');
                  }}
                  className="text-xs font-extrabold text-[#57534E] hover:underline"
                >
                  ← 返回使用 4 位數 PIN 碼登入
                </button>
              )}
            </div>
          )}

          {gateError && (
            <p className="text-xs font-extrabold text-[#DC2626]">{gateError}</p>
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

      {/* Phase 4D: 7-Day Backup Reminder Banner */}
      {(backupStatus.overdue || backupSavedNotice) && (
        <section
          className={`rounded-3xl border-2 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            backupSavedNotice?.tone === 'ok'
              ? 'border-[#10B981] bg-[#ECFDF5]'
              : 'border-[#F59E0B] bg-[#FFFBEB]'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-display text-sm sm:text-base font-extrabold text-[#1C1917]">
              <AlertTriangle
                className={`h-4 w-4 shrink-0 ${
                  backupSavedNotice?.tone === 'ok' ? 'text-[#059669]' : 'text-[#D97706]'
                }`}
              />
              <span>
                {backupSavedNotice
                  ? backupSavedNotice.text
                  : backupStatus.daysSinceBackup === null
                    ? `貼心提醒：孩子已完成 ${player.runHistory.length} 關，尚未建立本機 JSON 備份檔喔！`
                    : `貼心提醒：距離上次匯出備份已經過 ${backupStatus.daysSinceBackup} 天了！`}
              </span>
            </div>
            {!backupSavedNotice && (
              <p className="text-xs font-semibold text-[#92400E]">
                iPad Safari 久未開啟可能清理快取，建議每週順手點一下下載備份檔存進「檔案」或 iCloud。
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleQuickExportBackup}
            className="qv-btn shrink-0 inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#F59E0B] px-4 py-2 text-xs sm:text-sm font-extrabold text-white"
          >
            <Download className="h-4 w-4" />
            <span>一鍵匯出 JSON 備份</span>
          </button>
        </section>
      )}

      {/* Phase 4D: Weekly Goal & Real-World Reward Voucher */}
      <section className="qv-surface rounded-3xl p-5 sm:p-6 space-y-4 border-2 border-[#FDE68A] bg-[#FFFDF8]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-[#D97706]" />
            <h2 className="font-display text-lg font-extrabold text-[#1C1917]">
              🎯 每週目標與真實獎勵券（{weeklyGoalProgress.weekKey}）
            </h2>
          </div>
          {weeklyGoalProgress.enabled && (
            <span className="rounded-full bg-[#FEF3C7] border border-[#F59E0B] px-3 py-1 text-xs font-extrabold text-[#B45309] tabular-nums">
              本週達成：{weeklyGoalProgress.totalDone} / {weeklyGoalProgress.totalTarget} 關（{weeklyGoalProgress.pct}%）
            </span>
          )}
        </div>

        <p className="text-xs sm:text-sm font-semibold text-[#57534E]">
          設定本週（週一至週日）三科有效通關目標與真實世界獎勵！達標後首頁會解鎖專屬兌換券按鈕，由家長於此處核銷。
        </p>

        {/* Subject target steppers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              key: 'en',
              label: 'English 英文目標',
              done: weeklyGoalProgress.enDone,
              val: goalEn,
              setVal: setGoalEn,
              tint: 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1D4ED8]',
            },
            {
              key: 'zh',
              label: '中文・繁體目標',
              done: weeklyGoalProgress.zhDone,
              val: goalZh,
              setVal: setGoalZh,
              tint: 'bg-[#FDF2F8] border-[#FBCFE8] text-[#BE185D]',
            },
            {
              key: 'math',
              label: 'Math 數學目標',
              done: weeklyGoalProgress.mathDone,
              val: goalMath,
              setVal: setGoalMath,
              tint: 'bg-[#ECFDF5] border-[#A7F3D0] text-[#047857]',
            },
          ].map((row) => (
            <div
              key={row.key}
              className={`rounded-2xl border p-3.5 flex items-center justify-between gap-2 ${row.tint}`}
            >
              <div>
                <div className="text-xs font-extrabold">{row.label}</div>
                <div className="text-[11px] font-bold opacity-80 tabular-nums">
                  本週已完成 {row.done} 關
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label={`減少${row.label}`}
                  onClick={() => {
                    row.setVal((v) => Math.max(0, v - 1));
                    setGoalSavedMsg(null);
                  }}
                  className="qv-btn h-8 w-8 rounded-xl border border-[#1C1917]/20 bg-white font-display text-base font-extrabold text-[#1C1917]"
                >
                  −
                </button>
                <span className="w-7 text-center font-display text-lg font-extrabold text-[#1C1917] tabular-nums">
                  {row.val}
                </span>
                <button
                  type="button"
                  aria-label={`增加${row.label}`}
                  onClick={() => {
                    row.setVal((v) => Math.min(14, v + 1));
                    setGoalSavedMsg(null);
                  }}
                  className="qv-btn h-8 w-8 rounded-xl border border-[#1C1917]/20 bg-white font-display text-base font-extrabold text-[#1C1917]"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Real-world reward presets + custom input */}
        <div className="space-y-2">
          <div className="text-xs font-extrabold text-[#1C1917]">
            🎁 達標真實獎勵（點選範本或自行輸入）
          </div>
          <div className="flex flex-wrap gap-1.5">
            {WEEKLY_REWARD_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setGoalRewardText(preset);
                  setGoalSavedMsg(null);
                }}
                className={`qv-btn rounded-full border px-3 py-1 text-xs font-extrabold ${
                  goalRewardText === preset
                    ? 'border-[#1C1917] bg-[#FEF3C7] text-[#92400E]'
                    : 'border-[#E5DFD3] bg-white text-[#57534E]'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              maxLength={80}
              value={goalRewardText}
              onChange={(e) => {
                setGoalRewardText(e.target.value);
                setGoalSavedMsg(null);
              }}
              placeholder="例如：週末喝一杯珍珠奶茶"
              aria-label="本週真實獎勵內容"
              className="flex-1 rounded-xl border-2 border-[#1C1917] bg-white px-3.5 py-2 text-sm font-bold text-[#1C1917] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSaveWeeklyGoal}
              className="qv-btn min-h-[42px] rounded-xl border-2 border-[#1C1917] bg-[#D97706] px-5 py-2 text-xs sm:text-sm font-extrabold text-white"
            >
              儲存每週目標
            </button>
          </div>
          {goalSavedMsg && (
            <p className="text-xs font-extrabold text-[#047857]">{goalSavedMsg}</p>
          )}
        </div>

        {/* Parent-only Reward Voucher Redemption Strip */}
        {weeklyGoalProgress.enabled && weeklyGoalProgress.isMet && (
          <div
            className={`rounded-2xl border-2 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              weeklyGoalProgress.isRedeemed
                ? 'border-[#10B981] bg-[#ECFDF5]'
                : 'border-[#F59E0B] bg-[#FEF3C7]'
            }`}
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 font-display text-sm sm:text-base font-extrabold text-[#1C1917]">
                <Gift className="h-4 w-4 text-[#D97706]" />
                <span>
                  {weeklyGoalProgress.isRedeemed
                    ? `🏆 本週獎勵已於 ${weeklyGoalProgress.weekKey} 核銷兌換！`
                    : `🎉 ${player.displayName} 已達成本週目標！待兌換：${weeklyGoalProgress.rewardText}`}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#57534E]">
                {weeklyGoalProgress.isRedeemed
                  ? '下週一凌晨系統會自動重置本週進度與新獎勵券。'
                  : '確認給孩子真實獎勵後，點擊右側按鈕即可核銷本週兌換券（僅家長室可操作）。'}
              </p>
            </div>
            {!weeklyGoalProgress.isRedeemed && (
              <button
                type="button"
                onClick={() => onRedeemWeeklyReward?.(weeklyGoalProgress.weekKey)}
                className="qv-btn shrink-0 inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#059669] px-4 py-2 text-xs sm:text-sm font-extrabold text-white"
              >
                <Check className="h-4 w-4" />
                <span>核銷本週獎勵券（已兌換）</span>
              </button>
            )}
          </div>
        )}
      </section>

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

        {/* Phase 3 Progress Strip: Radicals + Chapter Stories + Arcade */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="rounded-2xl bg-[#F0FDFA] border border-[#99F6E4] p-3.5">
            <div className="text-xs font-bold text-[#0F766E]">🧩 中文偏旁・量詞 & ⚡ 數學專訓</div>
            <div className="mt-1 font-display text-base font-extrabold text-[#115E59] tabular-nums">
              偏旁 {snapshot.completedRadicalsCount}/{snapshot.totalRadicalsCount} · 量詞{' '}
              {(player.completedMeasureIds ?? []).length}/24 · 句型{' '}
              {(player.completedSentencePatternIds ?? []).length}/16
            </div>
            <div className="mt-0.5 text-[11px] font-semibold text-[#0F766E] tabular-nums">
              數學圖解 {(player.completedBarModelIds ?? []).length}/8 · 12×12 心算精熟{' '}
              {(() => {
                let m = 0;
                for (let a = 2; a <= 12; a += 1) {
                  for (let b = 2; b <= 12; b += 1) {
                    if (classifyHeatmapCell(player.mathFactMastery?.[getFactHeatmapKey(a, b)]) === 'mastered') {
                      m += 1;
                    }
                  }
                }
                return m;
              })()}
              /121 格
            </div>
          </div>

          <div className="rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] p-3.5">
            <div className="text-xs font-bold text-[#6D28D9]">📚 小說閱讀 & 🧬 英文專訓</div>
            <div className="mt-1 font-display text-base font-extrabold text-[#5B21B6] tabular-nums">
              中小說 {snapshot.completedChapterEpisodesCount}/{snapshot.totalChapterEpisodesCount} ·
              英小說 {(player.completedEnglishChapterIds ?? []).length}/20 · 拼字{' '}
              {(player.completedSpellingIds ?? []).length}/16
            </div>
            <div className="mt-0.5 text-[11px] font-semibold text-[#6D28D9] tabular-nums">
              詞根 {(player.completedEnglishRootIds ?? []).length}/16 · 文法{' '}
              {(player.completedGrammarIds ?? []).length}/12 · 中文全系列{' '}
              {snapshot.completedChapterSeriesCount}/{snapshot.totalChapterSeriesCount}
            </div>
          </div>

          <div className="rounded-2xl bg-[#ECFEFF] border border-[#A5F3FC] p-3.5">
            <div className="text-xs font-bold text-[#0E7490]">🕹️ 街機最高紀錄</div>
            <div className="mt-1 text-xs font-extrabold text-[#155E75] space-y-0.5 tabular-nums">
              <div>
                ⚡ Blitz 最佳：
                {Math.max(
                  0,
                  player.blitzHighScores?.english ?? 0,
                  player.blitzHighScores?.math ?? 0,
                  player.blitzHighScores?.chinese ?? 0,
                )}{' '}
                分
              </div>
              <div>
                🧋 Boba Café 最佳：$
                {Math.max(
                  0,
                  player.cafeHighScores?.english ?? 0,
                  player.cafeHighScores?.math ?? 0,
                  player.cafeHighScores?.chinese ?? 0,
                )}
              </div>
              <div>
                🎣 星海釣魚最佳：
                {Math.max(
                  0,
                  player.fishingHighScores?.english ?? 0,
                  player.fishingHighScores?.math ?? 0,
                  player.fishingHighScores?.chinese ?? 0,
                ).toLocaleString()}{' '}
                lbs
              </div>
              <div>
                ⚔️ 夥伴打魔王最佳：
                {Math.max(
                  0,
                  player.bossHighScores?.english ?? 0,
                  player.bossHighScores?.math ?? 0,
                  player.bossHighScores?.chinese ?? 0,
                ).toLocaleString()}{' '}
                分
              </div>
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

      {/* 5. Parent Gate Security & 4-Digit Quick PIN Settings */}
      <section
        className={`qv-surface rounded-3xl p-5 sm:p-6 space-y-4 ${
          unlockedViaMathReset ? 'border-2 border-[#2563EB] bg-[#F0F9FF]' : ''
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#0F766E]" />
            <h2 className="font-display text-lg font-extrabold text-[#1C1917]">
              家長鎖定設定（4 位數快速 PIN 碼）
            </h2>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-extrabold ${
              hasSavedPin
                ? 'bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857]'
                : 'bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E]'
            }`}
          >
            {hasSavedPin ? '已啟用 4 位數 PIN 快速登入' : '目前使用預設國中數學題'}
          </span>
        </div>

        <p className="text-xs sm:text-sm font-semibold text-[#57534E]">
          {unlockedViaMathReset
            ? '您剛才透過國中數學題解鎖！現在可以直接設定新的 4 位數 PIN 碼，或清除舊 PIN 碼改回數學題驗證。'
            : '設定 4 位數專屬 PIN 碼後，下次點開家長檢視室可直接快速輸入解鎖；PIN 碼僅以單向雜湊存於本機瀏覽器，且不會寫入匯出的備份檔。'}
        </p>

        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={newPinInput}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
              setNewPinInput(digits);
              setPinStatusMsg(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveNewPin();
            }}
            placeholder={hasSavedPin ? '輸入新 4 位數 PIN' : '輸入 4 位數 PIN'}
            aria-label="設定新 4 位數家長 PIN 碼"
            className="w-44 rounded-xl border-2 border-[#1C1917] bg-white px-3.5 py-2 text-center font-display text-base font-extrabold tracking-[0.25em] text-[#1C1917] tabular-nums focus:outline-none"
          />
          <button
            type="button"
            disabled={newPinInput.length < 4}
            onClick={handleSaveNewPin}
            className={`qv-btn min-h-[42px] rounded-xl border-2 px-4 py-2 text-xs sm:text-sm font-extrabold ${
              newPinInput.length === 4
                ? 'border-[#1C1917] bg-[#0F766E] text-white'
                : 'border-[#DDD5C7] bg-[#EFECE4] text-[#9A948A] cursor-not-allowed'
            }`}
          >
            {hasSavedPin ? '更新 PIN 碼' : '儲存 PIN 碼'}
          </button>
          {hasSavedPin && (
            <button
              type="button"
              onClick={handleClearPin}
              className="qv-btn min-h-[42px] rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-3.5 py-2 text-xs font-extrabold text-[#DC2626]"
            >
              清除 PIN 碼（改回數學題）
            </button>
          )}
        </div>

        {pinStatusMsg && (
          <p className="text-xs font-extrabold text-[#047857]">{pinStatusMsg}</p>
        )}
      </section>
    </div>
  );
};
