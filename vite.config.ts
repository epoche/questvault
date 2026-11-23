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
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
