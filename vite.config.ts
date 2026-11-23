import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

const isSingleFile = process.env.SINGLE_FILE === '1';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    ...(isSingleFile ? [viteSingleFile()] : []),
  ],
  ...(!isSingleFile
    ? {
        build: {
          rollupOptions: {
            output: {
              manualChunks(id: string) {
                if (id.includes('node_modules')) {
                  if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) {
                    return 'vendor-react';
                  }
                  if (id.includes('/motion/') || id.includes('/framer-motion/') || id.includes('/lucide-react/')) {
                    return 'vendor-ui';
                  }
                  return 'vendor-misc';
                }
                if (
                  id.includes('/src/subjects/english/spellingSets') ||
                  id.includes('/src/subjects/english/spellingTypes') ||
                  id.includes('/src/subjects/english/englishChapter')
                ) {
                  return 'subject-english-phase5';
                }
                if (
                  id.includes('/src/subjects/english/rootFamilies') ||
                  id.includes('/src/subjects/english/grammarSets') ||
                  id.includes('/src/subjects/english/rootEngine')
                ) {
                  return 'subject-english-phase4';
                }
                if (id.includes('/src/subjects/english/')) return 'subject-english';
                if (id.includes('/src/subjects/chinese/chapterStories')) return 'subject-chinese-chapters';
                if (
                  id.includes('/src/subjects/chinese/measureSets') ||
                  id.includes('/src/subjects/chinese/idiomContextSets') ||
                  id.includes('/src/subjects/chinese/measureIdiomSets')
                ) {
                  return 'subject-chinese-phase4';
                }
                if (id.includes('/src/subjects/chinese/')) return 'subject-chinese';
                if (id.includes('/src/subjects/math/')) return 'subject-math';
                if (
                  id.includes('/src/ui/artwork/BossArt') ||
                  id.includes('/src/ui/artwork/CritterRoomArt')
                ) {
                  return 'artwork-phase4';
                }
                if (id.includes('/src/ui/artwork/')) return 'artwork-svg';
                if (
                  id.includes('/src/ui/views/BossBattleView') ||
                  id.includes('/src/ui/views/FishingGameView') ||
                  id.includes('/src/ui/views/CafeGameView') ||
                  id.includes('/src/ui/views/BlitzView')
                ) {
                  return 'views-arcade';
                }
                return undefined;
              },
            },
          },
        },
      }
    : {}),
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
