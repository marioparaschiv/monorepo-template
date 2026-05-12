import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: ['./src/index.ts', './src/fs.ts', './src/pipeline.ts'],
	outDir: './dist',
	format: 'esm',
	target: 'node26',
	clean: true,
	platform: 'node',
});
