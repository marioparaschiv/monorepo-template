# Monorepo Template

An opinionated TypeScript monorepo starter with modern tooling. Built for fast iteration on Node.js services.

## What's included

**Packages:**

- `@project/logger` - Structured logging powered by [evlog](https://evlog.dev). File drain (NDJSON), pipeline batching with retry, and pretty console output in dev.
- `@project/utils` - Zero-dependency utilities: `uuid` (v4/v7), `sleep`, `debounce`, `deepCompare`, `binarySearch`, `hash`, `raceTimeout`.
- `@project/env` - Typed environment variable validation with Zod. Call `createEnv({ schema })` once, get a fully typed config object.

**Tooling:**

- [oxlint](https://oxc.rs/docs/guide/usage/linter) + [oxfmt](https://oxc.rs/docs/guide/usage/formatter) - Rust-based linting and formatting
- [tsdown](https://tsdown.dev) - ESM bundling for packages
- [tsgo](https://github.com/nicolo-ribaudo/tsgo) - Native TypeScript type checking
- [vitest](https://vitest.dev) - Test runner with coverage
- [husky](https://typicode.github.io/husky) + [commitlint](https://commitlint.js.org) - Angular commit convention enforcement
- [@total-typescript/ts-reset](https://github.com/total-typescript/ts-reset) - Stricter built-in types

**CI:**

- GitHub Actions (typecheck, test, coverage)

## Getting started

```bash
# Clone and rename
git clone <this-repo> my-project
cd my-project

# Find-replace the package scope
# Replace @project with @yourscope across the repo

# Install
pnpm install

# Run all dev servers
pnpm dev

# Run tests
pnpm test
```

## Project structure

```
.
├── apps/
│   └── example/          # Starter app demonstrating all packages
├── packages/
│   ├── logger/           # Structured logging (evlog)
│   ├── utils/            # Common utilities
│   └── env/              # Typed env validation (Zod)
├── scripts/              # Custom oxlint plugin
├── .oxlintrc.json        # Linter config with custom rules
├── .oxfmtrc.json         # Formatter config
├── tsconfig.base.json    # Shared TypeScript config
└── vitest.config.ts      # Root test config
```

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start all app dev servers |
| `pnpm build` | Build packages, then apps |
| `pnpm test` | Run all tests |
| `pnpm test:coverage` | Run tests with coverage |
| `pnpm typecheck` | Type check all packages and apps |
| `pnpm lint` | Lint with oxlint |
| `pnpm fmt` | Format with oxfmt |
| `pnpm fmt:check` | Check formatting |

## Custom lint rules

Three project-specific rules in `scripts/oxlint-plugin.js`:

- **`project/no-call-as-argument`** - Extract nested function calls into named variables.
- **`project/require-block-except-empty-return`** - Require braces on if/else bodies (bare `return;` and `return null;` are exempt).
- **`project/no-foreach`** - Use `for...of` instead of `.forEach()`.

## Usage examples

### Logger

```typescript
import { initLogger, log } from '@project/logger';
import { createFsDrain } from '@project/logger/fs';
import { createDrainPipeline } from '@project/logger/pipeline';
import type { DrainContext } from '@project/logger';

const pipeline = createDrainPipeline<DrainContext>({ batch: { size: 50 } });
const fsDrain = pipeline(createFsDrain({ dir: '.logs', maxFiles: 7 }));

initLogger({
  service: 'my-api',
  pretty: true,
  minLevel: 'debug',
  drain: fsDrain,
});

log.info('Server', 'Listening on port 3000');
log.error('Database', 'Connection failed');
log.info({ action: 'request', method: 'POST', path: '/api/users', duration: '42ms' });
```

### Utils

```typescript
import { uuidv7, sleep, debounce, raceTimeout } from '@project/utils';

const id = uuidv7();

await sleep(100);

const search = debounce(query => fetch(`/search?q=${query}`), 300);

const result = await raceTimeout(fetch('/slow'), 5000, 'Request timed out');
```

### Env

```typescript
import { createEnv } from '@project/env';
import { z } from 'zod';

const env = createEnv({
  schema: z.object({
    DATABASE_URL: z.string().url(),
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  }),
});

// env.DATABASE_URL - string (validated)
// env.PORT - number (coerced + defaulted)
// env.NODE_ENV - 'development' | 'production' | 'test'
```

## Requirements

- Node.js >= 24
- pnpm >= 11

## License

MIT
