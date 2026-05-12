import { describe, it, expect } from 'vitest';

import uuid, { uuidv4, uuidv7 } from '../src/uuid';

const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const UUID_V7_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe('uuidv4', () => {
	it('default export is uuidv4', () => {
		expect(uuid).toBe(uuidv4);
	});

	it('matches v4 UUID format', () => {
		expect(uuidv4()).toMatch(UUID_V4_REGEX);
	});

	it('has length of 36', () => {
		expect(uuidv4()).toHaveLength(36);
	});

	it('has version bit set to 4', () => {
		expect(uuidv4()[14]).toBe('4');
	});

	it('has correct variant bits (8, 9, a, or b)', () => {
		for (let i = 0; i < 100; i++) {
			expect('89ab').toContain(uuidv4()[19]);
		}
	});

	it('generates unique values over 1000 calls', () => {
		const ids = new Set<string>();

		for (let i = 0; i < 1000; i++) ids.add(uuidv4());

		expect(ids.size).toBe(1000);
	});
});

describe('uuidv7', () => {
	it('matches v7 UUID format', () => {
		expect(uuidv7()).toMatch(UUID_V7_REGEX);
	});

	it('has length of 36', () => {
		expect(uuidv7()).toHaveLength(36);
	});

	it('has version bit set to 7', () => {
		expect(uuidv7()[14]).toBe('7');
	});

	it('has correct variant bits (8, 9, a, or b)', () => {
		for (let i = 0; i < 100; i++) {
			expect('89ab').toContain(uuidv7()[19]);
		}
	});

	it('encodes current timestamp in first 48 bits', () => {
		const before = Date.now();
		const id = uuidv7();
		const after = Date.now();

		const tsHex = id.replace(/-/g, '').slice(0, 12);
		const ts = parseInt(tsHex, 16);

		expect(ts).toBeGreaterThanOrEqual(before);
		expect(ts).toBeLessThanOrEqual(after);
	});

	it('sorts chronologically across different timestamps', async () => {
		const a = uuidv7();

		await new Promise((r) => setTimeout(r, 2));
		const b = uuidv7();

		expect(a < b).toBe(true);
	});

	it('generates unique values over 1000 calls', () => {
		const ids = new Set<string>();

		for (let i = 0; i < 1000; i++) ids.add(uuidv7());

		expect(ids.size).toBe(1000);
	});
});
