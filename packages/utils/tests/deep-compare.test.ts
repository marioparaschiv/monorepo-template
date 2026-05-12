import { describe, it, expect } from 'vitest';

import deepCompare from '../src/deep-compare';

describe('deepCompare', () => {
	it('returns true for both null', () => {
		expect(deepCompare(null, null)).toBe(true);
	});

	it('returns true for both undefined', () => {
		expect(deepCompare(undefined, undefined)).toBe(true);
	});

	it('returns false for null vs undefined', () => {
		expect(deepCompare(null, undefined)).toBe(false);
	});

	it('returns false for type mismatches', () => {
		expect(deepCompare(1, '1')).toBe(false);
		expect(deepCompare(true, 1)).toBe(false);
		expect(deepCompare('a', { a: 1 })).toBe(false);
	});

	it('compares primitive numbers', () => {
		expect(deepCompare(1, 1)).toBe(true);
		expect(deepCompare(1, 2)).toBe(false);
	});

	it('compares primitive strings', () => {
		expect(deepCompare('abc', 'abc')).toBe(true);
		expect(deepCompare('abc', 'def')).toBe(false);
	});

	it('compares primitive booleans', () => {
		expect(deepCompare(true, true)).toBe(true);
		expect(deepCompare(true, false)).toBe(false);
	});

	it('compares equal arrays', () => {
		expect(deepCompare([1, 2, 3], [1, 2, 3])).toBe(true);
	});

	it('returns false for arrays with different order', () => {
		expect(deepCompare([1, 2, 3], [3, 2, 1])).toBe(false);
	});

	it('returns false for arrays with different length', () => {
		expect(deepCompare([1, 2], [1, 2, 3])).toBe(false);
	});

	it('compares nested arrays', () => {
		expect(deepCompare([[1, 2], [3]], [[1, 2], [3]])).toBe(true);
		expect(deepCompare([[1, 2], [3]], [[1, 2], [4]])).toBe(false);
	});

	it('compares equal objects', () => {
		expect(deepCompare({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
	});

	it('returns false for objects with different keys', () => {
		expect(deepCompare({ a: 1 }, { b: 1 })).toBe(false);
	});

	it('compares objects regardless of key order', () => {
		expect(deepCompare({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
	});

	it('compares nested objects', () => {
		expect(deepCompare({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } })).toBe(true);
		expect(deepCompare({ a: { b: { c: 1 } } }, { a: { b: { c: 2 } } })).toBe(false);
	});

	it('compares mixed nested structures', () => {
		const a = { x: [1, { y: 'z' }], w: true };
		const b = { x: [1, { y: 'z' }], w: true };

		expect(deepCompare(a, b)).toBe(true);
	});

	it('compares empty containers', () => {
		expect(deepCompare([], [])).toBe(true);
		expect(deepCompare({}, {})).toBe(true);
	});

	it('handles null inside containers', () => {
		expect(deepCompare([null], [null])).toBe(true);
		expect(deepCompare({ a: null }, { a: null })).toBe(true);
	});

	it('returns false for array vs object', () => {
		expect(deepCompare([], {})).toBe(false);
		expect(deepCompare([1], { 0: 1 })).toBe(false);
	});
});
