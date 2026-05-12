import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: ['./src/**/*.ts'],
	outDir: './dist',
	format: 'esm',
	target: 'node26',
	clean: true,
	platform: 'node',
});
