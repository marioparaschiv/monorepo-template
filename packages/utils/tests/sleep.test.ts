import { describe, it, expect, vi } from 'vitest';

import sleep from '../src/sleep';

describe('sleep', () => {
	it('resolves after the specified delay', async () => {
		vi.useFakeTimers();

		let resolved = false;

		sleep(100).then(() => {
			resolved = true;
		});

		expect(resolved).toBe(false);

		vi.advanceTimersByTime(100);
		await vi.runAllTimersAsync();

		expect(resolved).toBe(true);

		vi.useRealTimers();
	});

	it('resolves with zero timeout', async () => {
		vi.useFakeTimers();

		let resolved = false;

		sleep(0).then(() => {
			resolved = true;
		});

		vi.advanceTimersByTime(0);
		await vi.runAllTimersAsync();

		expect(resolved).toBe(true);

		vi.useRealTimers();
	});

	it('handles concurrent sleeps independently', async () => {
		vi.useFakeTimers();

		const order: number[] = [];

		sleep(100).then(() => {
			order.push(2);
		});
		sleep(50).then(() => {
			order.push(1);
		});

		await vi.advanceTimersByTimeAsync(50);
		expect(order).toEqual([1]);

		await vi.advanceTimersByTimeAsync(50);
		expect(order).toEqual([1, 2]);

		vi.useRealTimers();
	});
});
