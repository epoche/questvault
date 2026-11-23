import type { SubjectDescriptor, SubjectId } from './types';

export const SUBJECTS: SubjectDescriptor[] = [
  {
    id: 'english',
    label: 'English ELA',
    shortLabel: 'English',
    gradeTag: 'Grade 4',
    speechLang: 'en-US',
    status: 'active',
    description: 'Tier 2 vocabulary sprints, vivid sentence upgrades, and creative mini-writing.',
  },
  {
    id: 'math',
    label: 'Math',
    shortLabel: 'Math',
    gradeTag: 'Grade 4',
    speechLang: 'en-US',
    status: 'active',
    description: 'Visual fractions, multiplication arrays, area & perimeter, and word problems.',
  },
  {
    id: 'chinese',
    label: 'Chinese 中文',
    shortLabel: '中文',
    gradeTag: '繁體',
    speechLang: 'zh-TW',
    status: 'active',
    description: '繁體中文認字、語音朗讀、詞語升級與短句寫作（可選注音）。',
  },
];

export function getSubjectById(id: SubjectId): SubjectDescriptor {
  return SUBJECTS.find((s) => s.id === id) ?? SUBJECTS[0];
}
