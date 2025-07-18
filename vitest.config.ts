import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      exclude: ['*config.*', 'next-env.d.ts', 'src/sql/tables.sql'],
    },
  },
})
