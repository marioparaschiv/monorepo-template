import { describe, it, expect, vi } from 'vitest';

import debounce from '../src/debounce';

describe('debounce', () => {
	it('calls function after delay', () => {
		vi.useFakeTimers();
		const fn = vi.fn();
		const debounced = debounce(fn, 100);

		debounced();
		expect(fn).not.toHaveBeenCalled();

		vi.advanceTimersByTime(100);
		expect(fn).toHaveBeenCalledOnce();

		vi.useRealTimers();
	});

	it('merges multiple calls into the last one', () => {
		vi.useFakeTimers();
		const fn = vi.fn();
		const debounced = debounce(fn, 100);

		debounced();
		vi.advanceTimersByTime(50);
		debounced();
		vi.advanceTimersByTime(50);
		debounced();
		vi.advanceTimersByTime(100);

		expect(fn).toHaveBeenCalledOnce();

		vi.useRealTimers();
	});

	it('passes arguments correctly', () => {
		vi.useFakeTimers();
		const fn = vi.fn<(_: number, __: string) => void>();
		const debounced = debounce(fn, 50);

		debounced(42, 'hello');
		vi.advanceTimersByTime(50);

		expect(fn).toHaveBeenCalledWith(42, 'hello');

		vi.useRealTimers();
	});

	it('creates independent debounce instances', () => {
		vi.useFakeTimers();
		const fn1 = vi.fn();
		const fn2 = vi.fn();
		const debounced1 = debounce(fn1, 100);
		const debounced2 = debounce(fn2, 100);

		debounced1();
		debounced2();

		vi.advanceTimersByTime(100);

		expect(fn1).toHaveBeenCalledOnce();
		expect(fn2).toHaveBeenCalledOnce();

		vi.useRealTimers();
	});

	it('works with zero delay', () => {
		vi.useFakeTimers();
		const fn = vi.fn();
		const debounced = debounce(fn, 0);

		debounced();
		expect(fn).not.toHaveBeenCalled();

		vi.advanceTimersByTime(0);
		expect(fn).toHaveBeenCalledOnce();

		vi.useRealTimers();
	});
});
