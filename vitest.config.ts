import { defineConfig } from 'vitest/config';

const coverageExclude = ['**/*.d.ts', '**/*.gen.ts', '**/coverage/**', '**/dist/**', '**/fixtures/**', '**/tests/**'];

const config = defineConfig({
	resolve: {
		tsconfigPaths: true,
		conditions: ['development'],
	},
	test: {
		coverage: {
			provider: 'v8',
			reportsDirectory: './coverage',
			reporter: ['text-summary', 'json-summary', 'lcov', 'html'],
			include: ['packages/*/src/**/*.{ts,tsx}', 'apps/*/src/**/*.{ts,tsx}'],
			exclude: coverageExclude,
		},
		projects: ['packages/logger', 'packages/utils', 'packages/env'],
	},
});

export default config;
