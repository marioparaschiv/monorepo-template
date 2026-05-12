import type { LoggerConfig, Log, DrainFn, LogLevel, DrainContext } from 'evlog';
import { initLogger as _initLogger, log as _log } from 'evlog';

type LoggerOptions = {
	service?: string;
	pretty?: boolean;
	silent?: boolean;
	minLevel?: LogLevel;
	drain?: DrainFn;
};

type Logger = {
	info(tag: string, message: string): void;
	info(event: Record<string, unknown>): void;
	warn(tag: string, message: string): void;
	warn(event: Record<string, unknown>): void;
	error(tag: string, message: string): void;
	error(event: Record<string, unknown>): void;
	debug(tag: string, message: string): void;
	debug(event: Record<string, unknown>): void;
};

function initLogger(options: LoggerOptions = {}): void {
	const config: LoggerConfig = {
		pretty: options.pretty,
		silent: options.silent,
		minLevel: options.minLevel,
		drain: options.drain,
	};

	if (options.service) {
		config.env = { service: options.service };
	}

	_initLogger(config);
}

export type { Logger, LoggerOptions, LoggerConfig, Log, DrainFn, LogLevel, DrainContext };
export { initLogger, _log as log };
