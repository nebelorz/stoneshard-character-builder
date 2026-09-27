## 1. Spike and decision

- [ ] 1.1 Document the mapping from each `BonusService` method used by each of the five consumers to its `@models` pure function and required quest data; verify every call has a 1:1 pure equivalent
- [ ] 1.2 Migrate `quests-section` to `QuestDataService` + pure functions without deleting `BonusService`; verify `quests-section.spec.ts` passes
- [ ] 1.3 Record the go/no-go decision for removing `BonusService` based on the spike (diff size, test churn, need for a shared quests accessor)

## 2. Removal path (if go)

- [ ] 2.1 Add `readonly questList = computed(() => this.quests.value() ?? [])` to `QuestDataService`; verify existing data-layer specs pass
- [ ] 2.2 Migrate `build-store.ts` to inject `QuestDataService` and call the pure functions; verify `build-store.spec.ts` passes
- [ ] 2.3 Migrate `ai-prompt.service.ts` and `url-share.service.ts`; verify their specs pass
- [ ] 2.4 Migrate `trait-section` and finish `quests-section`; verify their specs pass
- [ ] 2.5 Move the formula tests from `bonus.service.spec.ts` to a new `bonus.model.spec.ts` as pure tests and confirm the case count is preserved
- [ ] 2.6 Delete `bonus.service.ts` and `bonus.service.spec.ts`; verify a repo grep finds no remaining `BonusService` references

## 3. Fallback path (if no-go)

- [ ] 3.1 Remove the `as ...Pure` aliases in `bonus.service.ts` and call the domain functions directly; verify `bonus.service.spec.ts` passes

## 4. Verification

- [ ] 4.1 Run `npm run lint`, `ng build`, and `npm test`; verify all pass and no `as ...Pure` alias remains
