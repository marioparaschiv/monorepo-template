import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: {
		tsconfigPaths: true,
	},
	test: {
		name: 'env',
		include: ['tests/**/*.test.ts'],
	},
});
