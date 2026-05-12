import { describe, it, expect, vi, beforeEach } from 'vitest';

import { initLogger, log } from '../src/index';

beforeEach(() => {
	vi.restoreAllMocks();
});

describe('initLogger', () => {
	it('accepts service option', () => {
		expect(() => {
			initLogger({ service: 'test-app' });
		}).not.toThrow();
	});

	it('accepts drain option', () => {
		const drain = vi.fn();

		expect(() => {
			initLogger({ drain, silent: true });
		}).not.toThrow();
	});

	it('accepts minLevel option', () => {
		expect(() => {
			initLogger({ minLevel: 'warn' });
		}).not.toThrow();
	});
});

describe('log', () => {
	it('exposes info, warn, error, debug methods', () => {
		expect(typeof log.info).toBe('function');
		expect(typeof log.warn).toBe('function');
		expect(typeof log.error).toBe('function');
		expect(typeof log.debug).toBe('function');
	});

	it('accepts tagged form (tag, message)', () => {
		expect(() => {
			log.info('test', 'hello');
		}).not.toThrow();
	});

	it('accepts object form', () => {
		expect(() => {
			log.info({ action: 'test', value: 42 });
		}).not.toThrow();
	});
});

describe('drain integration', () => {
	it('routes events through a configured drain', async () => {
		const drain = vi.fn();

		initLogger({ drain, silent: true, service: 'drain-test' });

		log.info('test', 'hello from drain');

		await new Promise((r) => setTimeout(r, 50));

		expect(drain).toHaveBeenCalled();
	});
});
