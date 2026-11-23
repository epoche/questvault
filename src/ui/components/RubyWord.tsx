import React from 'react';

interface RubyWordProps {
  word: string;
  zhuyin?: string;
  showZhuyin: boolean;
  className?: string;
  zhuyinClassName?: string;
}

/**
 * Renders a Traditional Chinese word with optional clean per-character Zhuyin above each character
 * when showZhuyin is toggled on.
 */
export const RubyWord: React.FC<RubyWordProps> = ({
  word,
  zhuyin,
  showZhuyin,
  className = '',
  zhuyinClassName = '',
}) => {
  if (!showZhuyin || !zhuyin || !zhuyin.trim()) {
    return <span className={className}>{word}</span>;
  }

  const chars = Array.from(word);
  const syllables = zhuyin.trim().split(/\s+/);

  if (chars.length === syllables.length) {
    return (
      <span className={`inline-flex items-end gap-1 ${className}`}>
        {chars.map((ch, idx) => (
          <ruby key={`${ch}-${idx}`} className="inline-flex flex-col-reverse items-center leading-none">
            <span>{ch}</span>
            <rt
              className={`text-[11px] font-bold tracking-tight leading-tight pb-0.5 select-none ${zhuyinClassName}`}
            >
              {syllables[idx]}
            </rt>
          </ruby>
        ))}
      </span>
    );
  }

  return (
    <span className={`inline-flex flex-col items-center leading-tight ${className}`}>
      <span className={`text-[11px] font-bold opacity-85 ${zhuyinClassName}`}>{zhuyin}</span>
      <span>{word}</span>
    </span>
  );
};
