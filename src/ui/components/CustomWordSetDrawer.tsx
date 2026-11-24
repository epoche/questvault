import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Sparkles, X } from 'lucide-react';
import type { CustomWordSetRecord } from '../../core/types';
import { parseCustomChineseList } from '../../subjects/chinese/chineseCustomParser';
import { parseCustomWordList } from '../../subjects/english/customParser';

interface CustomWordSetDrawerProps {
  open: boolean;
  subjectId: 'english' | 'chinese';
  onClose: () => void;
  onSaveAndPlay: (record: CustomWordSetRecord) => void;
}

const SAMPLE_ENGLISH_LIST = `cautious - careful to avoid danger | Be cautious on slippery rocks.
shimmer - shine with a soft glow | Moonlight made the lake shimmer.
boulder - a very large rock | Hikers rested beside a giant boulder.
fragile - easily broken | Hold the fragile glass butterfly gently.
rescue - save from danger | The lifeguard swam fast to rescue the pup.`;

const SAMPLE_CHINESE_LIST = `觀察、勇敢、森林、彩虹、猶豫`;

export const CustomWordSetDrawer: React.FC<CustomWordSetDrawerProps> = ({
  open,
  subjectId,
  onClose,
  onSaveAndPlay,
}) => {
  const isChinese = subjectId === 'chinese';
  const [title, setTitle] = useState(isChinese ? '第 12 週中文生字' : 'Week 12 School Vocab');
  const [rawText, setRawText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTitle(isChinese ? '第 12 週中文生字' : 'Week 12 School Vocab');
      setRawText('');
      setErrorMsg(null);
    }
  }, [open, isChinese]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const livePreview = useMemo(() => {
    if (!rawText.trim()) return null;
    return isChinese
      ? parseCustomChineseList(title, rawText)
      : parseCustomWordList(title, rawText);
  }, [title, rawText, isChinese]);

  if (!open) return null;

  const handleSubmit = () => {
    const parsed = isChinese
      ? parseCustomChineseList(title, rawText)
      : parseCustomWordList(title, rawText);
    if (!parsed.ok) {
      setErrorMsg(parsed.error);
      return;
    }
    setErrorMsg(null);
    onSaveAndPlay(parsed.record);
    setRawText('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isChinese ? '匯入中文學校生字表' : 'Import School Words'}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#1C1917]/55 backdrop-blur-xs p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-t-3xl sm:rounded-3xl border-2 border-[#1C1917] bg-[#FAF7F2] p-5 sm:p-6 shadow-2xl max-h-[90dvh] overflow-y-auto"
        style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-[#1C1917]">
              {isChinese ? '匯入中文學校生字表' : 'Import School Words'}
            </h2>
            <p className="mt-1 text-sm text-[#57534E]">
              {isChinese ? (
                <>
                  直接貼中文生詞（如 <code className="bg-[#F3EFE7] px-1 rounded">觀察、勇敢、森林</code>）或每行{' '}
                  <code className="bg-[#F3EFE7] px-1 rounded">詞彙 - 解釋</code>。
                </>
              ) : (
                <>
                  Paste plain words (<code className="bg-[#F3EFE7] px-1 rounded">cautious, shimmer, boulder</code>) or{' '}
                  <code className="bg-[#F3EFE7] px-1 rounded">word - meaning</code> lines.
                </>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close importer"
            className="qv-btn inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E5DFD3] bg-white text-[#57534E]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#1C1917] mb-1.5">
              {isChinese ? '生字表名稱' : 'Word Set Title'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isChinese ? '例如：中文學校第 12 課' : 'e.g., Ms. Miller Week 14'}
              className="w-full rounded-2xl border-2 border-[#E5DFD3] bg-white px-4 py-2.5 text-base text-[#1C1917] font-medium focus:border-[#2563EB] focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label className="block text-sm font-bold text-[#1C1917]">
                {isChinese ? '詞彙清單（3–12 個詞）' : 'Words (3–12 words)'}
              </label>
              <button
                type="button"
                onClick={() => {
                  setRawText(isChinese ? SAMPLE_CHINESE_LIST : SAMPLE_ENGLISH_LIST);
                  setErrorMsg(null);
                }}
                className="qv-btn inline-flex min-h-[36px] items-center gap-1 rounded-full bg-[#EFF6FF] px-3.5 py-1.5 text-xs font-extrabold text-[#1D4ED8]"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {isChinese ? '載入範例' : 'Load Sample'}
              </button>
            </div>
            <textarea
              rows={5}
              value={rawText}
              onChange={(e) => {
                setRawText(e.target.value);
                setErrorMsg(null);
              }}
              placeholder={
                isChinese
                  ? '觀察、勇敢、森林、彩虹、猶豫\n— 或 —\n觀察 - 專心仔細看 | 我們用放大鏡觀察蝴蝶。'
                  : 'cautious, shimmer, boulder, fragile, rescue\n— or —\nreluctant - not wanting to | Our dog was reluctant in the rain.'
              }
              className="w-full rounded-2xl border-2 border-[#E5DFD3] bg-white p-3.5 text-base text-[#1C1917] leading-relaxed focus:border-[#2563EB] focus:outline-none"
            />
            <p className="mt-1.5 text-xs text-[#57534E]">
              {isChinese
                ? '純貼生詞會自動比對內建詞庫補上解釋與注音；也能自行寫「詞彙 - 解釋」。'
                : 'Plain words auto-fill meanings when known; add word - meaning anytime for custom clues.'}
            </p>
          </div>

          {livePreview?.ok && (
            <div className="space-y-2">
              <div className="rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] px-4 py-3 text-sm text-[#065F46]">
                <span className="font-bold">{isChinese ? '準備好了！' : 'Ready!'}</span>{' '}
                <span className="font-extrabold tabular-nums">{livePreview.record.words.length}</span>{' '}
                {isChinese ? '個生詞：' : 'words: '}
                <span className="font-semibold">
                  {livePreview.record.words.map((w) => w.word).join(isChinese ? '、' : ', ')}
                </span>
                {livePreview.autoFilledCount > 0 && (
                  <span className="block mt-0.5 text-xs text-[#047857]">
                    {isChinese
                      ? `已自動補齊 ${livePreview.autoFilledCount} 個詞彙的解釋／注音。`
                      : `Auto-filled meanings for ${livePreview.autoFilledCount} plain word${livePreview.autoFilledCount === 1 ? '' : 's'}.`}
                  </span>
                )}
              </div>
              {'unmatchedWords' in livePreview && livePreview.unmatchedWords.length > 0 && (
                <div className="rounded-2xl border border-[#FCD34D] bg-[#FFFBEB] px-4 py-2.5 text-xs font-semibold text-[#92400E]">
                  提示：「{livePreview.unmatchedWords.join('、')}」不在內建詞庫中，建議加上「- 解釋」（例如：
                  {livePreview.unmatchedWords[0]} - 簡短意思），測驗題目會更清楚！
                </div>
              )}
            </div>
          )}

          {(errorMsg || (livePreview && !livePreview.ok)) && (
            <div className="rounded-2xl border border-[#FECDD3] bg-[#FFF1F2] px-4 py-3 text-sm font-medium text-[#BE123C]">
              {errorMsg ?? (livePreview && !livePreview.ok ? livePreview.error : '')}
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="qv-btn min-h-[44px] rounded-2xl border border-[#E5DFD3] bg-white px-4 py-2.5 text-sm font-bold text-[#57534E]"
            >
              {isChinese ? '取消' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={rawText.trim().length > 0 && livePreview !== null && !livePreview.ok}
              className="qv-btn inline-flex min-h-[44px] items-center gap-2 rounded-2xl border-2 border-[#1C1917] bg-[#2563EB] px-5 py-2.5 font-display text-sm font-extrabold text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
              {isChinese ? '儲存並開始' : 'Save & Play'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
