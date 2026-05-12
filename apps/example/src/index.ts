import { z } from 'zod';

import { createDrainPipeline } from '@project/logger/pipeline';
import type { DrainContext } from '@project/logger';
import { createFsDrain } from '@project/logger/fs';
import { initLogger, log } from '@project/logger';
import { createEnv } from '@project/env';
import { uuidv7 } from '@project/utils';

const env = createEnv({
	schema: z.object({
		NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
		PORT: z.coerce.number().default(3000),
		LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('debug'),
	}),
});

const pipeline = createDrainPipeline<DrainContext>({ batch: { size: 20, intervalMs: 3000 } });
const fsDrain = pipeline(createFsDrain({ dir: '.logs', maxFiles: 7 }));

initLogger({
	service: 'example',
	pretty: env.NODE_ENV === 'development',
	minLevel: env.LOG_LEVEL,
	drain: fsDrain,
});

const requestId = uuidv7();

log.info('Example', `Starting in ${env.NODE_ENV} mode on port ${env.PORT}`);
log.debug('Example', `Request ID: ${requestId}`);
log.info('Database', 'Connection pool initialized');
log.info({ action: 'ready', service: 'example', requestId });

process.on('beforeExit', () => fsDrain.flush());
