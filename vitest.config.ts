import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@shared': resolve(__dirname, 'src/app/shared'),
      '@features': resolve(__dirname, 'src/app/features'),
      '@features/build/services': resolve(__dirname, 'src/app/features/build/services/index.ts'),
      '@features/character/services': resolve(
        __dirname,
        'src/app/features/character/services/index.ts',
      ),
      '@features/ability-trees/services': resolve(
        __dirname,
        'src/app/features/ability-trees/services/index.ts',
      ),
      '@models': resolve(__dirname, 'src/app/models/index.ts'),
      '@layout': resolve(__dirname, 'src/app/layout'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    setupFiles: ['src/test-setup.ts'],
  },
});
