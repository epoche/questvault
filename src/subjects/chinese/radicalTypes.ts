import type { DifficultyTier } from '../../core/types';

export type RadicalFamilyKind = 'phonetic' | 'semantic';

export type RadicalLayout =
  | 'left-right' // radical on left, component on right (e.g. 氵 + 青 = 清)
  | 'right-left' // component on left, radical on right (e.g. 方 + 攵 = 放)
  | 'top-bottom' // radical on top, component on bottom (e.g. 艹 + 莫 = 莫 / 父 + 巴 = 爸)
  | 'bottom-top' // component on top, radical on bottom (e.g. 莫 + 心 = 慕)
  | 'enclose'; // radical encloses/wraps component (e.g. 戶 + 方 = 房)

export interface RadicalCharItem {
  /** Single Traditional Chinese character (Taiwan MOE standard) */
  char: string;
  /** Single-syllable Taiwan MOE Zhuyin (e.g. 'ㄑㄧㄥˇ') */
  zhuyin: string;
  /** Semantic radical component displayed in blue (e.g. '氵', '訁', '木', '忄') */
  radical: string;
  /** Radical friendly name in Traditional Chinese (e.g. '三點水', '言字旁', '木字旁') */
  radicalName: string;
  /** Short meaning of the radical (e.g. '和水、液體有關') */
  radicalMeaning: string;
  /** Phonetic or partner component displayed in amber (e.g. '青', '包', '喬') */
  component: string;
  /** Structural layout of radical + component */
  layout: RadicalLayout;
  /** Common 2-4 char vocabulary word containing `char` (e.g. '請客') */
  sampleWord: string;
  /** Taiwan MOE Zhuyin for `sampleWord`, space-separated 1:1 with chars (e.g. 'ㄑㄧㄥˇ ㄎㄜˋ') */
  sampleWordZhuyin: string;
  /** Short English meaning bridge for US-raised 4th graders */
  englishMeaning: string;
  /** Short child-friendly Traditional Chinese memory tip */
  memoryTip: string;
  /**
   * Context fill-in-the-blank sentence containing exactly one `___` replacing `char`.
   * MUST NOT contain `char` anywhere else in the sentence!
   */
  blankSentence: string;
  /** English gloss of the blank sentence (must not spoil the Chinese char) */
  blankHintEn: string;
}

export interface RadicalFamily {
  id: string;
  tier: DifficultyTier;
  kind: RadicalFamilyKind;
  /** Core shared anchor displayed on the card badge (e.g. '青' or '木') */
  anchor: string;
  /** Short title (e.g. '「青」字聲旁家族' or '「木」字旁森林家族') */
  title: string;
  /** Short subtitle explaining the pattern */
  subtitle: string;
  /** Collectible avatar emblem ID from packs.ts */
  emblemCollectibleId: string;
  /** Exactly 5 distinct Traditional Chinese characters */
  items: RadicalCharItem[];
}
