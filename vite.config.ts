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
                if (
                  id.includes('/src/subjects/chinese/sentencePattern') ||
                  id.includes('/src/subjects/chinese/chapterStoriesSeason2')
                ) {
                  return 'subject-chinese-phase5';
                }
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
                if (id.includes('/src/subjects/logic/')) return 'subject-logic';
                if (
                  id.includes('/src/ui/artwork/BossArt') ||
                  id.includes('/src/ui/artwork/CritterRoomArt')
                ) {
                  return 'artwork-phase4';
                }
                if (id.includes('/src/ui/artwork/phase6Collectibles')) {
                  return 'artwork-phase6-collectibles';
                }
                if (id.includes('/src/ui/artwork/TowerDefenseSvg')) {
                  return 'artwork-phase6';
                }
                if (
                  id.includes('/src/ui/artwork/SpatialVisual') ||
                  id.includes('/src/ui/artwork/LogicVisual')
                ) {
                  return 'artwork-logic';
                }
                if (id.includes('/src/ui/artwork/')) return 'artwork-svg';
                if (
                  id.includes('/src/ui/views/LogicLabView') ||
                  id.includes('/src/ui/views/MixedWarmupView')
                ) {
                  return 'views-logic';
                }
                if (
                  id.includes('/src/ui/views/BossBattleView') ||
                  id.includes('/src/ui/views/FishingGameView') ||
                  id.includes('/src/ui/views/CafeGameView') ||
                  id.includes('/src/ui/views/BlitzView') ||
                  id.includes('/src/ui/views/TowerDefenseView')
                ) {
                  return 'views-arcade';
                }
                if (
                  id.includes('/src/ui/views/MathRunView') ||
                  id.includes('/src/ui/views/MathPlacementView') ||
                  id.includes('/src/ui/views/FactFluencyView') ||
                  id.includes('/src/ui/views/BarModelQuestView')
                ) {
                  return 'views-math';
                }
                if (
                  id.includes('/src/ui/views/RunView') ||
                  id.includes('/src/ui/views/PlacementView') ||
                  id.includes('/src/ui/views/EnglishRootQuestView') ||
                  id.includes('/src/ui/views/GrammarRepairView') ||
                  id.includes('/src/ui/views/SpellingBeeView') ||
                  id.includes('/src/ui/views/EnglishChapterSeriesView')
                ) {
                  return 'views-english';
                }
                if (
                  id.includes('/src/ui/views/ChineseRunView') ||
                  id.includes('/src/ui/views/ChinesePlacementView') ||
                  id.includes('/src/ui/views/ChineseListeningView') ||
                  id.includes('/src/ui/views/RadicalQuestView') ||
                  id.includes('/src/ui/views/MeasureIdiomQuestView') ||
                  id.includes('/src/ui/views/ChapterSeriesView') ||
                  id.includes('/src/ui/views/SentencePatternView')
                ) {
                  return 'views-chinese';
                }
                if (
                  id.includes('/src/ui/views/VaultView') ||
                  id.includes('/src/ui/views/MarketView') ||
                  id.includes('/src/ui/views/ParentView') ||
                  id.includes('/src/ui/views/WritingLogView') ||
                  id.includes('/src/ui/views/ReadingRunView')
                ) {
                  return 'views-secondary';
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
