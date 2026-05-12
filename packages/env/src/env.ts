import type { z } from 'zod';

type EnvOptions<T extends z.ZodRawShape> = {
	schema: z.ZodObject<T>;
	source?: Record<string, string | undefined>;
};

function createEnv<T extends z.ZodRawShape>(options: EnvOptions<T>): z.infer<z.ZodObject<T>> {
	const source = options.source ?? process.env;
	const result = options.schema.safeParse(source);

	if (!result.success) {
		const formatted = result.error.issues
			.map((issue) => `  ${issue.path.join('.')}: ${issue.message}`)
			.join('\n');

		throw new Error(`Invalid environment variables:\n${formatted}`);
	}

	return result.data;
}

export type { EnvOptions };
export { createEnv };
