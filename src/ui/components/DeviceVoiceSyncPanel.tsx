import React, { useEffect, useId, useRef, useState } from 'react';
import {
  Check,
  Copy,
  Download,
  Share,
  Smartphone,
  Sparkles,
  Upload,
  Volume2,
} from 'lucide-react';
import { audioService } from '../../core/audio';
import { decodeSyncCode, encodeSyncCode } from '../../core/syncCode';
import type { PlayerState, SpeechRateMode } from '../../core/types';

interface DeviceVoiceSyncPanelProps {
  player: PlayerState;
  onImportState?: (nextState: PlayerState) => void;
  onRecordBackup?: () => void;
  onChangeSpeechRateMode?: (mode: SpeechRateMode) => void;
  compact?: boolean;
}

export const DeviceVoiceSyncPanel: React.FC<DeviceVoiceSyncPanelProps> = ({
  player,
  onImportState,
  onRecordBackup,
  onChangeSpeechRateMode,
  compact = false,
}) => {
  const pasteInputId = useId();
  const rateMode: SpeechRateMode = player.speechRateMode === 'slow' ? 'slow' : 'normal';
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showRestoreBox, setShowRestoreBox] = useState(false);
  const [pasteInput, setPasteInput] = useState('');
  const [syncNotice, setSyncNotice] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null);
  const busyRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleGenerateCode = async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setSyncNotice(null);
    setCopiedCode(false);
    try {
      const nowIso = new Date().toISOString();
      const code = await encodeSyncCode({ ...player, lastBackupAt: nowIso });
      if (!mountedRef.current) return;
      setGeneratedCode(code);
      onRecordBackup?.();
      let clipboardOk = false;
      try {
        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(code);
          clipboardOk = true;
        }
      } catch {
        clipboardOk = false;
      }
      if (!mountedRef.current) return;
      setCopiedCode(clipboardOk);
      setSyncNotice({
        tone: 'ok',
        text: clipboardOk
          ? `✅ 已產生並複製跨裝置同步短碼（${code.length} 字元）！可透過 Line / AirDrop / 備忘錄貼到另一台 iPad 或電腦還原。`
          : `✅ 已產生跨裝置同步短碼（${code.length} 字元）！請直接選取下方文字框複製。`,
      });
    } catch {
      if (!mountedRef.current) return;
      setSyncNotice({
        tone: 'err',
        text: '產生同步短碼時發生異常，請改用 JSON 備份檔匯出。',
      });
    } finally {
      busyRef.current = false;
    }
  };

  const handleRestoreFromCode = async () => {
    if (busyRef.current || !onImportState) return;
    busyRef.current = true;
    setSyncNotice(null);
    try {
      const res = await decodeSyncCode(pasteInput);
      if (!mountedRef.current) return;
      if (!res.ok) {
        setSyncNotice({ tone: 'err', text: res.error });
        return;
      }
      onImportState(res.state);
      setGeneratedCode(null);
      setCopiedCode(false);
      setPasteInput('');
      setShowRestoreBox(false);
      setSyncNotice({
        tone: 'ok',
        text: `🎉 同步還原成功！已載入「${res.state.displayName}」的進度（${res.state.tokens} Tokens）！`,
      });
    } catch {
      if (!mountedRef.current) return;
      setSyncNotice({
        tone: 'err',
        text: '還原同步短碼時發生異常，請確認短碼完整或改用 JSON 備份檔還原。',
      });
    } finally {
      busyRef.current = false;
    }
  };

  const handleRateChange = (nextMode: SpeechRateMode) => {
    audioService.setSpeechRateMode(nextMode);
    onChangeSpeechRateMode?.(nextMode);
    audioService.playToken();
  };

  return (
    <div className="space-y-4">
      {/* 1. iPad / Safari Natural Voice & Speech Rate Card */}
      <section className="qv-surface rounded-3xl p-4 sm:p-5 space-y-3 border-2 border-[#BFDBFE] bg-[#F8FBFF]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-[#2563EB]" />
            <h3 className="font-display text-base sm:text-lg font-extrabold text-[#1C1917]">
              🔊 語音朗讀與語速（iPad / Safari 優化）
            </h3>
          </div>
          <span className="rounded-full bg-[#EFF6FF] border border-[#93C5FD] px-2.5 py-0.5 text-[11px] font-extrabold text-[#1D4ED8]">
            優先台灣國語 Meijia · 美式 Samantha
          </span>
        </div>

        <p className="text-xs font-semibold text-[#57534E]">
          自動挑選裝置內最自然的繁體中文（台灣）與美式英文語音；若聽音辨字或生字朗讀太快，可切換「慢速練習 0.82×」。
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1 rounded-2xl border border-[#CBD5E1] bg-white p-1">
            <button
              type="button"
              onClick={() => handleRateChange('normal')}
              aria-pressed={rateMode === 'normal'}
              className={`qv-btn min-h-[38px] rounded-xl px-3 py-1 text-xs font-extrabold transition-colors ${
                rateMode === 'normal'
                  ? 'bg-[#2563EB] text-white'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              標準語速 1.0×
            </button>
            <button
              type="button"
              onClick={() => handleRateChange('slow')}
              aria-pressed={rateMode === 'slow'}
              className={`qv-btn min-h-[38px] rounded-xl px-3 py-1 text-xs font-extrabold transition-colors ${
                rateMode === 'slow'
                  ? 'bg-[#059669] text-white'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              慢速練習 0.82×
            </button>
          </div>

          <button
            type="button"
            onClick={() => audioService.speak('Adventure awaits in QuestVault!', 'en-US')}
            className="qv-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border-2 border-[#1C1917] bg-white px-3 py-1.5 text-xs font-extrabold text-[#1C1917]"
          >
            <Volume2 className="h-3.5 w-3.5 text-[#2563EB]" />
            <span>試聽英文</span>
          </button>

          <button
            type="button"
            onClick={() =>
              audioService.speak('歡迎來到 QuestVault，一起開盲盒學中文吧！', 'zh-TW')
            }
            className="qv-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border-2 border-[#1C1917] bg-white px-3 py-1.5 text-xs font-extrabold text-[#1C1917]"
          >
            <Volume2 className="h-3.5 w-3.5 text-[#DB2777]" />
            <span>試聽台灣國語</span>
          </button>
        </div>
      </section>

      {/* 2. Serverless Portable Sync Code (QV1Z / QV1R) */}
      <section className="qv-surface rounded-3xl p-4 sm:p-5 space-y-3 border-2 border-[#C7D2FE] bg-[#F8FAFF]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#4F46E5]" />
            <h3 className="font-display text-base sm:text-lg font-extrabold text-[#1C1917]">
              📱 免伺服器跨裝置同步短碼（QV1）
            </h3>
          </div>
          <span className="rounded-full bg-[#EEF2FF] border border-[#A5B4FC] px-2.5 py-0.5 text-[11px] font-extrabold text-[#4338CA]">
            零帳號 · 含 FNV-1a 防損毀校驗
          </span>
        </div>

        <p className="text-xs font-semibold text-[#57534E]">
          想把 iPad 的盲盒與闖關進度轉移到另一台裝置？按一下產生同步短碼並傳到新裝置貼上即可還原（自動排除家長 PIN 碼，安全不外洩）。
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void handleGenerateCode()}
            className="qv-btn inline-flex min-h-[42px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-[#4F46E5] px-4 py-2 text-xs sm:text-sm font-extrabold text-white"
          >
            {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copiedCode ? '已複製同步短碼！' : '產生／複製同步短碼'}</span>
          </button>

          {onImportState && (
            <button
              type="button"
              onClick={() => {
                setShowRestoreBox((v) => !v);
                setSyncNotice(null);
              }}
              className="qv-btn inline-flex min-h-[42px] items-center gap-1.5 rounded-2xl border-2 border-[#1C1917] bg-white px-4 py-2 text-xs sm:text-sm font-extrabold text-[#1C1917]"
            >
              <Upload className="h-4 w-4 text-[#059669]" />
              <span>{showRestoreBox ? '收合貼上區' : '貼上同步短碼還原'}</span>
            </button>
          )}
        </div>

        {generatedCode && (
          <div className="space-y-1.5 rounded-2xl border border-[#C7D2FE] bg-white p-3">
            <div className="flex items-center justify-between gap-2 text-[11px] font-extrabold text-[#4338CA]">
              <span>同步短碼（點一下全選複製 · 共 {generatedCode.length} 字元）</span>
              <button
                type="button"
                onClick={() => setGeneratedCode(null)}
                className="text-[#57534E] hover:text-[#1C1917]"
              >
                隱藏
              </button>
            </div>
            <textarea
              readOnly
              aria-label="Generated QuestVault sync code"
              value={generatedCode}
              rows={compact ? 2 : 3}
              onFocus={(e) => e.currentTarget.select()}
              className="w-full rounded-xl border border-[#E5DFD3] bg-[#FAF7F2] p-2.5 font-mono text-[11px] text-[#1C1917] break-all"
            />
          </div>
        )}

        {showRestoreBox && onImportState && (
          <div className="space-y-2 rounded-2xl border-2 border-[#A7F3D0] bg-[#ECFDF5] p-3">
            <label
              htmlFor={pasteInputId}
              className="block text-xs font-extrabold text-[#065F46]"
            >
              貼上從另一台裝置複製的同步短碼（QV1Z:... 或 QV1R:...）：
            </label>
            <textarea
              id={pasteInputId}
              aria-label="Paste QuestVault sync code"
              value={pasteInput}
              onChange={(e) => setPasteInput(e.target.value)}
              placeholder="在此貼上 QV1Z:... 或 QV1R:... 同步短碼"
              rows={3}
              className="w-full rounded-xl border border-[#6EE7B7] bg-white p-2.5 font-mono text-xs text-[#1C1917]"
            />
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => void handleRestoreFromCode()}
                className="qv-btn inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border-2 border-[#1C1917] bg-[#059669] px-4 py-1.5 text-xs font-extrabold text-white"
              >
                <Download className="h-3.5 w-3.5" />
                <span>立即驗證並還原進度</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPasteInput('');
                  setShowRestoreBox(false);
                }}
                className="qv-btn min-h-[40px] rounded-xl border border-[#D1D5DB] bg-white px-3 py-1.5 text-xs font-bold text-[#57534E]"
              >
                取消
              </button>
            </div>
          </div>
        )}

        {syncNotice && (
          <div
            className={`rounded-2xl px-3.5 py-2.5 text-xs font-extrabold ${
              syncNotice.tone === 'ok'
                ? 'border border-[#A7F3D0] bg-[#ECFDF5] text-[#047857]'
                : 'border border-[#FECDD3] bg-[#FFF1F2] text-[#BE123C]'
            }`}
          >
            {syncNotice.text}
          </div>
        )}
      </section>

      {/* 3. iPad Add-to-Home-Screen 3-Step Offline PWA Guide */}
      <section className="qv-surface rounded-3xl p-4 sm:p-5 space-y-3 border-2 border-[#FDE68A] bg-[#FFFDF7]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-[#D97706]" />
            <h3 className="font-display text-base sm:text-lg font-extrabold text-[#1C1917]">
              📲 iPad 加入主畫面（全螢幕 App 體驗 3 步驟）
            </h3>
          </div>
          <span className="rounded-full bg-[#FEF3C7] border border-[#F59E0B] px-2.5 py-0.5 text-[11px] font-extrabold text-[#92400E]">
            免下載商店 · 進度更穩固
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="rounded-2xl border border-[#FDE68A] bg-white p-3 space-y-1">
            <div className="flex items-center gap-1.5 font-display text-xs font-extrabold text-[#B45309]">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#F59E0B] text-white text-[11px]">
                1
              </span>
              <Share className="h-3.5 w-3.5" />
              <span>點選 Safari「分享」</span>
            </div>
            <p className="text-[11px] font-semibold text-[#57534E] leading-relaxed">
              用 iPad 內建 Safari 開啟 QuestVault，點選右上角「方框＋向上箭頭」分享按鈕。
            </p>
          </div>

          <div className="rounded-2xl border border-[#FDE68A] bg-white p-3 space-y-1">
            <div className="flex items-center gap-1.5 font-display text-xs font-extrabold text-[#B45309]">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#F59E0B] text-white text-[11px]">
                2
              </span>
              <span>選擇「加入主畫面」</span>
            </div>
            <p className="text-[11px] font-semibold text-[#57534E] leading-relaxed">
              選單往下滑點選「加入主畫面（Add to Home Screen）」並按右上角「新增」。
            </p>
          </div>

          <div className="rounded-2xl border border-[#FDE68A] bg-white p-3 space-y-1">
            <div className="flex items-center gap-1.5 font-display text-xs font-extrabold text-[#B45309]">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#F59E0B] text-white text-[11px]">
                3
              </span>
              <span>桌面一鍵全螢幕開玩</span>
            </div>
            <p className="text-[11px] font-semibold text-[#57534E] leading-relaxed">
              之後從 iPad 桌面圖示開啟，沒有網址列干擾，就像專屬學習 App 一樣流暢！
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
