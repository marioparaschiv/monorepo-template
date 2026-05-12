import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: {
		tsconfigPaths: true,
	},
	test: {
		name: 'utils',
		include: ['tests/**/*.test.ts'],
	},
});
