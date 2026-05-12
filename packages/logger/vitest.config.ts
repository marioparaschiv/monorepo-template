import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: {
		tsconfigPaths: true,
	},
	test: {
		name: 'logger',
		include: ['tests/**/*.test.ts'],
	},
});
