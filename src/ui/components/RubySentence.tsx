import React from 'react';

const CJK_CHAR_RE = /[\u4E00-\u9FFF]/;
const TRAILING_PUNCT_RE = /^[，。！？、；：」』）\s]$/;

interface RubySentenceProps {
  text: string;
  zhuyin?: string;
  showZhuyin: boolean;
  className?: string;
  zhuyinClassName?: string;
}

/**
 * Renders a Traditional Chinese sentence with optional Taiwan MOE per-character Zhuyin
 * aligned 1-to-1 with every CJK Han character, keeping trailing punctuation bound to
 * the preceding character so punctuation never wraps orphaned onto a new line.
 */
export const RubySentence: React.FC<RubySentenceProps> = ({
  text,
  zhuyin,
  showZhuyin,
  className = '',
  zhuyinClassName = 'text-[#92400E]',
}) => {
  if (!showZhuyin || !zhuyin || !zhuyin.trim()) {
    return <span className={className}>{text}</span>;
  }

  const chars = Array.from(text);
  const syllables = zhuyin.trim().split(/\s+/);
  const cjkCount = chars.filter((ch) => CJK_CHAR_RE.test(ch)).length;

  if (cjkCount !== syllables.length) {
    return <span className={className}>{text}</span>;
  }

  // Group each CJK char with any immediate trailing punctuation so 。/， never orphan on a new line
  const groups: { ch: string; syl?: string; trailing: string }[] = [];
  let sylIdx = 0;

  for (const ch of chars) {
    if (CJK_CHAR_RE.test(ch)) {
      groups.push({ ch, syl: syllables[sylIdx], trailing: '' });
      sylIdx += 1;
    } else if (
      TRAILING_PUNCT_RE.test(ch) &&
      groups.length > 0 &&
      Boolean(groups[groups.length - 1].syl)
    ) {
      groups[groups.length - 1].trailing += ch;
    } else {
      groups.push({ ch, trailing: '' });
    }
  }

  return (
    <span className={`inline-flex flex-wrap items-end gap-y-2 ${className}`}>
      {groups.map((g, idx) =>
        g.syl ? (
          <span key={`g-${idx}`} className="inline-flex items-end whitespace-nowrap">
            <ruby className="inline-flex flex-col-reverse items-center mx-[1px] leading-none">
              <span className="leading-none">{g.ch}</span>
              <rt
                className={`text-[10px] font-bold tracking-tight leading-tight pb-0.5 select-none whitespace-nowrap ${zhuyinClassName}`}
              >
                {g.syl}
              </rt>
            </ruby>
            {g.trailing && <span className="leading-none">{g.trailing}</span>}
          </span>
        ) : (
          <span key={`p-${idx}`} className="leading-none">
            {g.ch}
            {g.trailing}
          </span>
        ),
      )}
    </span>
  );
};
