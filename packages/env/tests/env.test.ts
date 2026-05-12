import { describe, it, expect } from 'vitest';
import { z } from 'zod';

import { createEnv } from '../src/index';

describe('createEnv', () => {
	it('parses valid environment variables', () => {
		const env = createEnv({
			schema: z.object({
				PORT: z.coerce.number(),
				NODE_ENV: z.enum(['development', 'production', 'test']),
			}),
			source: { PORT: '3000', NODE_ENV: 'development' },
		});

		expect(env.PORT).toBe(3000);
		expect(env.NODE_ENV).toBe('development');
	});

	it('applies default values', () => {
		const env = createEnv({
			schema: z.object({
				PORT: z.coerce.number().default(8080),
				HOST: z.string().default('localhost'),
			}),
			source: {},
		});

		expect(env.PORT).toBe(8080);
		expect(env.HOST).toBe('localhost');
	});

	it('throws on missing required variables', () => {
		expect(() =>
			createEnv({
				schema: z.object({
					DATABASE_URL: z.string(),
				}),
				source: {},
			}),
		).toThrow('Invalid environment variables');
	});

	it('throws with formatted error messages', () => {
		try {
			createEnv({
				schema: z.object({
					PORT: z.coerce.number().int().positive(),
					DATABASE_URL: z.string().url(),
				}),
				source: { PORT: 'not-a-number', DATABASE_URL: 'not-a-url' },
			});
			expect.unreachable();
		} catch (error) {
			const message = (error as Error).message;

			expect(message).toContain('PORT');
			expect(message).toContain('DATABASE_URL');
		}
	});

	it('uses process.env by default when no source provided', () => {
		const original = process.env.TEST_CREATEENV_VAR;

		process.env.TEST_CREATEENV_VAR = 'hello';

		try {
			const env = createEnv({
				schema: z.object({
					TEST_CREATEENV_VAR: z.string(),
				}),
			});

			expect(env.TEST_CREATEENV_VAR).toBe('hello');
		} finally {
			if (original === undefined) {
				delete process.env.TEST_CREATEENV_VAR;
			} else {
				process.env.TEST_CREATEENV_VAR = original;
			}
		}
	});
});
