## 1. Consolidate path configuration

- [ ] 1.1 Move the `compilerOptions.paths` map from `tsconfig.paths.json` into the root `tsconfig.json` and remove `baseUrl`, rewriting each target relative to the config (e.g. `./src/app/shared/*`); verify `npx tsc --showConfig -p tsconfig.spec.json` lists the paths and no `baseUrl`
- [ ] 1.2 Delete `tsconfig.paths.json` and drop `./tsconfig.paths.json` from the `extends` arrays of `tsconfig.app.json` and `tsconfig.spec.json`; verify no config references the deleted file
- [ ] 1.3 Remove `"ignoreDeprecations": "6.0"` from `tsconfig.app.json` and `tsconfig.spec.json`; verify `npx tsc -p tsconfig.app.json --noEmit` and `npx tsc -p tsconfig.spec.json --noEmit` report no deprecation error
- [ ] 1.4 Remove the dead `@shared` (bare) and `@models/*` alias entries; verify a repo grep finds zero imports for both and that `@models`, `@shared/*`, `@core/*`, `@features/*`, and `@layout/*` still resolve

## 2. Verification

- [ ] 2.1 Run `npm test`; verify alias-based imports resolve in vitest via `vite-tsconfig-paths`
- [ ] 2.2 Run `npm run lint` and `ng build`; verify both pass and the production build emits no new budget warning
- [ ] 2.3 Grep the repo for `tsconfig.paths` and `ignoreDeprecations`; verify no references remain
