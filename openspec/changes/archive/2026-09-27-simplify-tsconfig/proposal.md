## Why

TypeScript 6.0 deprecates `baseUrl` (removal slated for TS 7.0). The current configuration only compiles because `tsconfig.app.json` and `tsconfig.spec.json` both silence the error with `"ignoreDeprecations": "6.0"`, and the deprecated `baseUrl` lives in a separate `tsconfig.paths.json` that exists only to hold `baseUrl` + `paths`. Two alias entries are also unreachable/dead. This is avoidable config surface.

## What Changes

- Move the `compilerOptions.paths` map from `tsconfig.paths.json` into the root `tsconfig.json`, which `tsconfig.app.json` and `tsconfig.spec.json` already extend, and delete `tsconfig.paths.json`.
- Drop `baseUrl` and rewrite the path targets relative to the config file (`./src/app/...`), so aliases keep resolving without `baseUrl`.
- Remove `"ignoreDeprecations": "6.0"` from both `tsconfig.app.json` and `tsconfig.spec.json`; the deprecation no longer applies.
- Remove dead aliases: the bare `@shared` entry (its target `src/app/shared/index.ts` does not exist and nothing imports it) and the `@models/*` subpath entry (only the `@models` barrel is used).
- Keep the live aliases: `@shared/*`, `@core/*`, `@core/state`, `@core/data`, `@features/*`, `@features/build/services`, `@models`, `@layout/*`.
- **BREAKING** internal-only: no runtime behavior change; module resolution results are identical.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `architecture`: the "Single source of truth for module resolution configuration" requirement is updated to enumerate the actual aliases (dropping `@models/*`) and to require compiler options that are free of deprecated settings.

## Impact

- Config: `tsconfig.json` (gains `paths`), `tsconfig.app.json` and `tsconfig.spec.json` (drop `ignoreDeprecations` and the second `extends` entry), `tsconfig.paths.json` (deleted).
- Unchanged: `vitest.config.ts` still points `vite-tsconfig-paths` at `tsconfig.spec.json`; `angular.json` still uses `tsconfig.app.json`.
