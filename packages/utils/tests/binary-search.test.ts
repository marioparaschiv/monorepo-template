import { describe, it, expect } from 'vitest';

import binarySearch from '../src/binary-search';

describe('binarySearch', () => {
	it('returns 0 for empty array', () => {
		expect(binarySearch([], () => 0)).toBe(0);
	});

	it('single element - target less than element', () => {
		expect(binarySearch([5], (el) => el - 3)).toBe(0);
	});

	it('single element - target greater than element', () => {
		expect(binarySearch([5], (el) => el - 8)).toBe(1);
	});

	it('single element - target equal to element', () => {
		expect(binarySearch([5], (el) => el - 5)).toBe(0);
	});

	it('inserts at start', () => {
		const arr = [10, 20, 30];

		expect(binarySearch(arr, (el) => el - 5)).toBe(0);
	});

	it('inserts at end', () => {
		const arr = [10, 20, 30];

		expect(binarySearch(arr, (el) => el - 35)).toBe(3);
	});

	it('inserts in middle', () => {
		const arr = [1, 3, 5, 7, 9];

		expect(binarySearch(arr, (el) => el - 6)).toBe(3);
	});

	it('handles duplicates', () => {
		const arr = [1, 3, 3, 3, 5];
		const idx = binarySearch(arr, (el) => el - 3);

		expect(idx).toBeGreaterThanOrEqual(1);
		expect(idx).toBeLessThanOrEqual(3);
	});

	it('works with descending order via adjusted compareFn', () => {
		const arr = [9, 7, 5, 3, 1];
		const idx = binarySearch(arr, (el) => 6 - el);

		expect(idx).toBe(2);
	});

	it('passes index to compareFn', () => {
		const arr = [10, 20, 30];
		const indices: number[] = [];

		binarySearch(arr, (el, idx) => {
			indices.push(idx);

			return el - 25;
		});
		expect(indices.length).toBeGreaterThan(0);

		for (const idx of indices) {
			expect(idx).toBeGreaterThanOrEqual(0);
			expect(idx).toBeLessThan(arr.length);
		}
	});
});
