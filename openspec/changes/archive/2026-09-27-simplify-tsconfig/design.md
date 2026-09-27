## Context

See `proposal.md` - Why. The project uses TypeScript 6.0.3. In that compiler, `baseUrl` is flagged with a deprecation error (`_tsc.js` gates it behind `ignoreDeprecations`), and the current setup works only because `tsconfig.app.json:7` and `tsconfig.spec.json:7` both set `"ignoreDeprecations": "6.0"`. The `baseUrl` itself lives in `tsconfig.paths.json` (a file created earlier solely to hold `baseUrl` + `paths`), which both project configs extend via an array `extends`. Two aliases have zero consumers: the bare `@shared` (its target `src/app/shared/index.ts` does not exist) and `@models/*` (only the `@models` barrel is imported).

## Goals / Non-Goals

**Goals:**

- Remove the `baseUrl` deprecation and its `ignoreDeprecations` workarounds.
- Collapse the alias definition into the root `tsconfig.json` so there is one file and one `extends` edge.
- Remove dead aliases while keeping every live alias resolving identically.

**Non-Goals:**

- No change to alias names used by application code, to `angular.json`, or to `vitest.config.ts`'s plugin wiring.
- No change to per-project options (`include`, `exclude`, `types`) or to build/test behavior.
- Not upgrading TypeScript.

## Decisions

### D1 - Move `paths` into the root `tsconfig.json` and delete `tsconfig.paths.json`

`tsconfig.app.json` and `tsconfig.spec.json` already extend the root, so the alias map belongs there. This removes the second `extends` entry (array extends) and one file. Alternatives: (a) keep `tsconfig.paths.json` but drop `baseUrl` - fewer edits, but keeps an unnecessary file and indirection; (b) keep `baseUrl` + `ignoreDeprecations` - rejected, it breaks at TS 7.0.

### D2 - Drop `baseUrl` and rewrite path targets relative to the declaring config

Without `baseUrl`, each `paths` target is resolved relative to the config file that declares it (the repo root here), so targets become `./src/app/...` instead of `app/...`. This is the documented `baseUrl` migration. Alternative: declare `${configDir}/src/...` - portable but noisier; the config lives at the repo root, so `./src/...` is simpler.

### D3 - Remove `ignoreDeprecations` from both project configs

The flag existed only to silence the `baseUrl` error. Once `baseUrl` is gone it is dead config. Verified by running `tsc --noEmit` on both configs.

### D4 - Prune the dead aliases

Remove the bare `@shared` entry (0 imports, missing target file) and the `@models/*` subpath entry (0 imports). Keep `@features/build/services`, which is consumed once by `src/app/app.ts:15` and whose `index.ts` exists.

## Risks / Trade-offs

- [Alias resolution changes without `baseUrl`] → rewrite targets as `./src/...` and verify with `npx tsc --showConfig -p tsconfig.spec.json` plus the full test suite and `ng build`.
- [`vite-tsconfig-paths` resolves a different config] → it reads `tsconfig.spec.json`, which extends the root where `paths` now live; confirm via `npm test`.
- [Editor language server caches old config] → re-run `tsc` and restart the Angular language service after the change.
- [Removing `@models/*` or `@shared` could break an ungrepped import] → the pre-change grep shows zero consumers; re-grep after the edit.

## Migration Plan

1. Move the `paths` map into `tsconfig.json` with `./src/...` targets; verify resolution.
2. Delete `tsconfig.paths.json` and drop the second `extends` entry from both project configs.
3. Remove `ignoreDeprecations` from both project configs.
4. Remove the dead aliases.
5. Run `npm run lint`, `ng build`, and `npm test`.

Rollback: restore the four config files from git; no application code changes are involved.
