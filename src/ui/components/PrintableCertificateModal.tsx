import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Award, Printer, Sparkles, X } from 'lucide-react';
import { buildCertificateSummary } from '../../core/certificate';
import type { PlayerState } from '../../core/types';
import { CollectibleArt } from '../artwork/CollectibleArt';

interface PrintableCertificateModalProps {
  player: PlayerState;
  onClose: () => void;
}

const CornerRosette: React.FC<{ className: string }> = ({ className }) => (
  <svg
    viewBox="0 0 28 28"
    width="26"
    height="26"
    className={`pointer-events-none absolute ${className}`}
    aria-hidden="true"
  >
    <circle cx="14" cy="14" r="12" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.4" />
    <polygon
      points="14,5 16.2,11.8 23,14 16.2,16.2 14,23 11.8,16.2 5,14 11.8,11.8"
      fill="#F59E0B"
    />
  </svg>
);

export const PrintableCertificateModal: React.FC<PrintableCertificateModalProps> = ({
  player,
  onClose,
}) => {
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [printNote, setPrintNote] = useState<string | null>(null);

  const summary = useMemo(() => buildCertificateSummary(player), [player]);

  // Scope print CSS to hide #root while certificate modal is open, and listen for Escape key
  useEffect(() => {
    try {
      document.body.classList.add('qv-printing-certificate');
    } catch {
      // Ignore in restricted environments
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      try {
        document.body.classList.remove('qv-printing-certificate');
      } catch {
        // Ignore in restricted environments
      }
    };
  }, [onClose]);

  const handlePrint = () => {
    setPrintNote(null);
    try {
      window.print();
    } catch {
      setPrintNote(
        lang === 'zh'
          ? '目前沙盒環境不支援自動列印，請使用瀏覽器「列印／另存 PDF」功能即可保存獎狀！'
          : 'Auto-print is restricted in this sandbox. Use your browser’s Print / Save as PDF menu to keep this certificate!',
      );
    }
  };

  const isZh = lang === 'zh';
  const formatQuests = (n: number) => (isZh ? `${n} 關` : `${n} ${n === 1 ? 'Quest' : 'Quests'}`);

  const modalContent = (
    <div
      className="qv-certificate-backdrop fixed inset-0 z-50 flex items-start justify-center bg-[#1C1917]/65 p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={isZh ? '可列印榮譽獎狀' : 'Printable Honor Certificate'}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="qv-certificate-shell w-full max-w-3xl space-y-3 my-auto">
        {/* Top Action Bar (hidden when printing) */}
        <div className="qv-no-print flex flex-wrap items-center justify-between gap-2 rounded-2xl border-2 border-[#1C1917] bg-white px-4 py-2.5 shadow-[0_4px_0_#1C1917]">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-[#D97706]" />
            <span className="font-display text-sm sm:text-base font-extrabold text-[#1C1917]">
              榮譽獎狀 · Printable Certificate
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Bilingual Toggle */}
            <div className="inline-flex rounded-xl border border-[#E5DFD3] bg-[#FAF7F2] p-0.5">
              <button
                type="button"
                onClick={() => setLang('zh')}
                className={`qv-btn rounded-lg px-2.5 py-1 text-xs font-extrabold ${
                  isZh ? 'bg-[#1C1917] text-white' : 'text-[#57534E]'
                }`}
              >
                繁體中文
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`qv-btn rounded-lg px-2.5 py-1 text-xs font-extrabold ${
                  !isZh ? 'bg-[#1C1917] text-white' : 'text-[#57534E]'
                }`}
              >
                English
              </button>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="qv-arcade-btn inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border-2 border-[#1C1917] bg-[#F59E0B] px-3.5 py-1.5 font-display text-xs sm:text-sm font-extrabold text-[#1C1917]"
              style={{ borderBottomColor: '#B45309' }}
            >
              <Printer className="h-4 w-4" />
              <span>{isZh ? '列印 / 另存 PDF' : 'Print / Save PDF'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label={isZh ? '關閉獎狀視窗' : 'Close certificate modal'}
              className="qv-btn inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5DFD3] bg-[#FAF7F2] text-[#57534E]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {printNote && (
          <div className="qv-no-print rounded-2xl border-2 border-[#F59E0B] bg-[#FFFBEB] px-4 py-2 text-xs font-extrabold text-[#92400E]">
            {printNote}
          </div>
        )}

        {/* Actual Printable Certificate Card (pure CSS golden double border + fixed-aspect corner SVG rosettes = zero distortion on any screen or paper) */}
        <div
          id="qv-printable-certificate"
          className="relative rounded-3xl border-4 border-[#B45309] bg-[#FFFDF7] p-3 sm:p-4 shadow-[0_12px_36px_rgba(28,25,23,0.3)]"
        >
          <div className="relative rounded-2xl border-2 border-dashed border-[#F59E0B] px-5 py-10 sm:px-9 sm:py-8">
            <CornerRosette className="left-2.5 top-2.5" />
            <CornerRosette className="right-2.5 top-2.5" />
            <CornerRosette className="left-2.5 bottom-2.5" />
            <CornerRosette className="right-2.5 bottom-2.5" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-5 px-2 sm:px-4">
              {/* Brand Pill */}
              <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#F59E0B] bg-[#FEF3C7] px-4 py-1 text-[11px] sm:text-xs font-extrabold tracking-wide text-[#92400E]">
                <Sparkles className="h-3.5 w-3.5 text-[#D97706] shrink-0" />
                <span>
                  QUESTVAULT ACADEMY · {isZh ? '每週學習榮譽認證' : 'OFFICIAL ACHIEVEMENT AWARD'}
                </span>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#1C1917] tracking-tight">
                  {isZh ? '榮 譽 獎 狀' : 'Certificate of Achievement'}
                </h2>
                <p className="text-xs sm:text-sm font-bold text-[#78716C] max-w-xl mx-auto">
                  {isZh
                    ? '茲證明下列優秀小冒險家在英文、數學與繁體中文學習表現傑出，特頒此狀以資鼓勵！'
                    : 'This certificate is proudly presented in recognition of outstanding effort and bilingual progress to'}
                </p>
              </div>

              {/* Avatar + Student Name + Honor Title */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-1">
                <div className="relative rounded-3xl border-3 border-[#D97706] bg-white p-1.5 shadow-sm">
                  <CollectibleArt
                    id={summary.equippedId}
                    size={78}
                    shiny={summary.equippedIsShiny}
                  />
                </div>
                <div className="text-center sm:text-left">
                  <div className="font-display text-3xl sm:text-4xl font-extrabold text-[#B45309] underline decoration-[#FDE68A] decoration-4 underline-offset-4">
                    {summary.displayName}
                  </div>
                  <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] px-3 py-0.5 text-xs font-extrabold text-[#1D4ED8]">
                    <span>🏅</span>
                    <span>{isZh ? summary.honorTitleZh : summary.honorTitleEn}</span>
                  </div>
                </div>
              </div>

              {/* Weekly 3-Subject Scorecard (1-col on narrow mobile, 3-col on sm+ and print) */}
              <div className="qv-cert-grid-3 w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
                <div className="rounded-2xl border-2 border-[#BFDBFE] bg-[#EFF6FF] px-3 py-2.5">
                  <div className="text-[11px] font-extrabold text-[#1D4ED8]">
                    {isZh ? '本週英文 ELA' : 'English ELA (7d)'}
                  </div>
                  <div className="mt-0.5 font-display text-xl sm:text-2xl font-extrabold text-[#1E3A8A] tabular-nums">
                    {formatQuests(summary.weeklyEnRuns)}
                  </div>
                </div>
                <div className="rounded-2xl border-2 border-[#A7F3D0] bg-[#ECFDF5] px-3 py-2.5">
                  <div className="text-[11px] font-extrabold text-[#047857]">
                    {isZh ? '本週數學 Math' : 'Math Lab (7d)'}
                  </div>
                  <div className="mt-0.5 font-display text-xl sm:text-2xl font-extrabold text-[#065F46] tabular-nums">
                    {formatQuests(summary.weeklyMathRuns)}
                  </div>
                </div>
                <div className="rounded-2xl border-2 border-[#FBCFE8] bg-[#FDF2F8] px-3 py-2.5">
                  <div className="text-[11px] font-extrabold text-[#BE185D]">
                    {isZh ? '本週繁體中文' : 'Chinese (7d)'}
                  </div>
                  <div className="mt-0.5 font-display text-xl sm:text-2xl font-extrabold text-[#9D174D] tabular-nums">
                    {formatQuests(summary.weeklyZhRuns)}
                  </div>
                </div>
              </div>

              {/* Milestones Strip */}
              <div className="w-full flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-xs font-extrabold text-[#44403C]">
                <span className="rounded-xl border border-[#E7E2D8] bg-white px-3 py-1.5 tabular-nums">
                  🔥 {isZh ? `連勝 ${summary.streakDays} 天` : `${summary.streakDays}-Day Streak`}
                </span>
                <span className="rounded-xl border border-[#E7E2D8] bg-white px-3 py-1.5 tabular-nums">
                  🎁 {isZh ? `盲盒 ${summary.vaultOwned} / ${summary.vaultTotal}` : `Vault ${summary.vaultOwned} / ${summary.vaultTotal}`}
                </span>
                {summary.shinyCount > 0 && (
                  <span className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-3 py-1.5 text-[#B45309] tabular-nums">
                    ✨ {isZh ? `閃卡 ${summary.shinyCount} 張` : `${summary.shinyCount} Shiny`}
                  </span>
                )}
                <span className="rounded-xl border border-[#E7E2D8] bg-white px-3 py-1.5 tabular-nums">
                  🏆 {isZh ? `成就 ${summary.achievementsUnlocked} / ${summary.achievementsTotal}` : `Badges ${summary.achievementsUnlocked} / ${summary.achievementsTotal}`}
                </span>
                <span className="rounded-xl border border-[#E7E2D8] bg-white px-3 py-1.5 tabular-nums">
                  🪙 {isZh ? `本週 +${summary.weeklyTokens} Tokens` : `+${summary.weeklyTokens} Tokens (7d)`}
                </span>
              </div>

              {/* Footer: Date + Original Golden Ribbon Seal + Parent Signature */}
              <div className="qv-cert-grid-3 w-full pt-3 grid grid-cols-1 sm:grid-cols-3 items-end gap-4 sm:gap-3 border-t border-[#FDE68A]">
                <div className="text-center">
                  <div className="font-display text-sm font-extrabold text-[#1C1917]">
                    {isZh ? summary.zhDate : summary.enDate}
                  </div>
                  <div className="mt-1 border-t border-[#A8A29E] pt-1 text-[11px] font-bold text-[#78716C]">
                    {isZh ? '頒發日期' : 'Date Awarded'}
                  </div>
                </div>

                {/* Original SVG Golden Wax Ribbon Seal */}
                <div className="flex justify-center">
                  <svg viewBox="0 0 90 90" width="70" height="70" aria-hidden="true">
                    <polygon points="30,58 22,86 38,78 44,86 46,60" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
                    <polygon points="60,58 68,86 52,78 46,86 44,60" fill="#EF4444" stroke="#991B1B" strokeWidth="2" />
                    <circle cx="45" cy="40" r="26" fill="#F59E0B" stroke="#B45309" strokeWidth="3" />
                    <circle cx="45" cy="40" r="20" fill="#FDE047" stroke="#D97706" strokeWidth="2" strokeDasharray="4 3" />
                    <polygon
                      points="45,25 49,35 60,35 51,42 54,53 45,46 36,53 39,42 30,35 41,35"
                      fill="#B45309"
                    />
                  </svg>
                </div>

                <div className="text-center">
                  <div className="h-6" />
                  <div className="mt-1 border-t border-[#A8A29E] pt-1 text-[11px] font-bold text-[#78716C]">
                    {isZh ? '家長簽名見證' : 'Parent Signature'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="qv-no-print text-center text-xs font-semibold text-white/90">
          {isZh
            ? '💡 支援 iPad AirPrint 或瀏覽器「另存 PDF」，列印時會自動隱藏背景與按鈕。'
            : '💡 Works with iPad AirPrint or Save as PDF — buttons and background hide automatically when printing.'}
        </p>
      </div>
    </div>
  );

  if (typeof document !== 'undefined' && document.body) {
    return createPortal(modalContent, document.body);
  }
  return modalContent;
};
