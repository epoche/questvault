import type { CustomWordInput, CustomWordSetRecord } from '../../core/types';
import type { TargetWord, WordSet } from './types';
import { getAllBuiltinTargetWords } from './wordSets';

export type ParseCustomListResult =
  | { ok: true; record: CustomWordSetRecord; wordSet: WordSet; autoFilledCount: number }
  | { ok: false; error: string };

const EXTRA_SCHOOL_GLOSSARY: Record<string, { definition: string; example?: string }> = {
  shimmer: {
    definition: 'shine with a soft, trembling light',
    example: 'Moonlight made the quiet lake shimmer like silver.',
  },
  boulder: {
    definition: 'a very large, heavy rock',
    example: 'Hikers rested beside a mossy boulder along the canyon trail.',
  },
  glimpse: {
    definition: 'a quick or brief look at something',
    example: 'We caught a quick glimpse of a dolphin leaping near the boat.',
  },
  swift: {
    definition: 'moving very fast and smoothly',
    example: 'A swift hawk zoomed over the sunny meadow.',
  },
  drenched: {
    definition: 'completely soaked with water',
    example: 'Without an umbrella, we got drenched walking home in the storm.',
  },
  startled: {
    definition: 'suddenly surprised or mildly scared',
    example: 'The loud thunderclap startled the napping kitten.',
  },
  frantic: {
    definition: 'hurried and very worried',
    example: 'Leo made a frantic search for his missing soccer cleat.',
  },
  meadow: {
    definition: 'a grassy open field with wildflowers',
    example: 'Butterflies floated across the sunny meadow after lunch.',
  },
  harbor: {
    definition: 'a sheltered part of the sea where boats dock safely',
    example: 'Colorful sailboats rocked gently inside the calm harbor.',
  },
  ancient: {
    definition: 'very old from a long time ago',
    example: 'Explorers discovered an ancient stone doorway in the jungle.',
  },
  blizzard: {
    definition: 'a heavy snowstorm with strong, icy wind',
    example: 'School closed early before the winter blizzard arrived.',
  },
  compass: {
    definition: 'a tool that always points north to help you find your way',
    example: 'Maya checked her pocket compass before turning onto the forest path.',
  },
};

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isValidVocabWord(word: string): boolean {
  // Reject single-letter noise ("a", "b") or pure punctuation/digits
  const letters = word.replace(/[^A-Za-z]/g, '');
  return letters.length >= 2 && /^[A-Za-z][A-Za-z' -]{1,30}$/.test(word);
}

export function customRecordToWordSet(record: CustomWordSetRecord): WordSet {
  const words: TargetWord[] = record.words.map((item) => {
    const wordPattern = new RegExp(`\\b${escapeRegex(item.word)}\\b`, 'i');
    const hasWordInExample = Boolean(item.example && wordPattern.test(item.example));
    const blanked =
      hasWordInExample && item.example
        ? item.example.replace(wordPattern, '___')
        : `Which word means "${item.definition}"?`;
    return {
      word: item.word,
      tier: 3,
      partOfSpeech: 'word',
      plainBridge: item.definition,
      definition: item.definition,
      contextSentence: blanked,
      sprintSentence: blanked,
      upgradeBefore: 'Pick the word meaning: ',
      upgradePlainSpan: item.definition,
      upgradeAfter: '',
      tip: item.example ? `Example: ${item.example}` : undefined,
    };
  });

  return {
    id: record.id,
    subjectId: 'english',
    tier: 3,
    title: record.title,
    shortTag: `${words.length} Words`,
    accentHex: '#0D9488',
    bgHex: '#F0FDFA',
    emblemCollectibleId: 'magic-quill-sprite',
    isCustom: true,
    forgeScenario: `Use 1 word from "${record.title}" in a fun sentence!`,
    starterChips: ['In my story today, ', 'Yesterday at school, I ', 'My favorite sentence with this word is when '],
    words,
  };
}

export function parseCustomWordList(
  rawTitle: string,
  rawText: string,
): ParseCustomListResult {
  const title = rawTitle.trim() || 'My Custom Word Set';
  const builtinLookup = getAllBuiltinTargetWords();

  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const parsedWords: CustomWordInput[] = [];
  const seen = new Set<string>();
  let autoFilledCount = 0;

  const tryAddPlainWord = (rawToken: string) => {
    const cleaned = rawToken.replace(/^(?:\d+[.)]\s*|[-•*]\s+)/, '').trim();
    if (!isValidVocabWord(cleaned)) return;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);

    const builtin = builtinLookup.get(key);
    if (builtin) {
      autoFilledCount += 1;
      parsedWords.push({
        word: cleaned,
        definition: builtin.word.definition,
        example: builtin.word.contextSentence.replace('___', cleaned),
      });
      return;
    }

    const extra = EXTRA_SCHOOL_GLOSSARY[key];
    if (extra) {
      autoFilledCount += 1;
      parsedWords.push({
        word: cleaned,
        definition: extra.definition,
        ...(extra.example ? { example: extra.example } : {}),
      });
      return;
    }

    autoFilledCount += 1;
    parsedWords.push({
      word: cleaned,
      definition: `school vocabulary word (${cleaned})`,
    });
  };

  for (const line of lines) {
    const cleaned = line.replace(/^(?:\d+[.)]\s*|[-•*]\s+)/, '').trim();
    if (!cleaned) continue;

    const [mainPart, examplePart] = cleaned.split('|').map((s) => s.trim());
    // Format 1: "word - definition" (tab, em-dash, en-dash, colon, or spaced hyphen)
    const match = mainPart.match(/^([A-Za-z][A-Za-z' -]{1,30}?)(?:\s*(?:\t|—|–|:)\s*|\s+-\s+)(.+)$/);
    if (match) {
      const word = match[1].trim();
      const definition = match[2].trim();
      const key = word.toLowerCase();

      if (!isValidVocabWord(word) || definition.length < 2 || seen.has(key)) continue;
      seen.add(key);

      parsedWords.push({
        word,
        definition,
        ...(examplePart ? { example: examplePart } : {}),
      });
      continue;
    }

    // Format 2: Plain word list (comma-separated or single word per line)
    if (cleaned.includes(',') || cleaned.includes(';')) {
      for (const token of cleaned.split(/[,;]+/)) {
        tryAddPlainWord(token);
      }
    } else if (/^[A-Za-z][A-Za-z'-]{1,24}$/.test(cleaned)) {
      tryAddPlainWord(cleaned);
    }
  }

  if (parsedWords.length < 3) {
    return {
      ok: false,
      error:
        'Please include at least 3 unique words (2+ letters each) — either "word - meaning" per line or a plain word list like "cautious, shimmer, boulder".',
    };
  }

  const record: CustomWordSetRecord = {
    id: `custom-en-${Date.now().toString(36)}`,
    subjectId: 'english',
    title,
    createdAt: new Date().toISOString(),
    words: parsedWords.slice(0, 12),
  };

  return {
    ok: true,
    record,
    wordSet: customRecordToWordSet(record),
    autoFilledCount,
  };
}
