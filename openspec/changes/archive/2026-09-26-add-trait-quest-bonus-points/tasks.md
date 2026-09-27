# Tasks: add-trait-quest-bonus-points

## 1. Data and Models

- [x] 1.1 Add `traitGains` arrays to the affected characters in `src/assets/data/characters.json` (Velmir bosses: 2 points per row, unbounded; Jorgrim trophies: max 5; Dirwin dens: max 3 plus Survival derived AP; Mahir distinct-trees derived AP) and add the `traitGains` type plus data guard to the character model; verify `npm test` passes existing character data tests and new guard tests
- [x] 1.2 Create `src/assets/data/quests.json` with the `boulder-circle` quest entry (1 SP slot, label, tooltip text) and a data guard; verify with unit tests for the guard
- [x] 1.3 Add the `BonusSlot` type (`{sourceId, index, stat: StatKey | null}`) and an optional `bonusSlots` field to `BuildState` alongside the existing `boulderCircleStat` (temporary bridge so the build stays green), defaulting to empty in `resetToCharacter`, `selectCharacter`, and `restoreState`; verify `npm run build` and `npm test` pass with all existing specs unchanged

## 2. Bonus Service and Store Logic

- [x] 2.1 Create the bonus service: read gain/quest config for the selected character, expose bounded slot lists from config, unbounded stepper logic (starts at zero rows, appends 2 slots per boss, ceiling 10 bosses / 20 rows, claimed rows persisted as null-stat entries), and allocate/deallocate/reallocate operations (bounded deallocation removes the entry; unbounded deallocation sets stat to null; stepper row removal deletes the row's entries); verify with unit tests for each operation
- [x] 2.2 Implement the derived AP formulas (`abilities-per-3` for Dirwin Survival, `distinct-trees-6` capped at 5 for Mahir) as a closed enum of formulas in the bonus service, excluding default abilities (`DEFAULT_ABILITY_IDS`); verify with unit tests covering 0, boundary, and above-boundary ability counts, plus a defaults-excluded case
- [x] 2.3 Update `stat-store.ts`: remove the Boulder Circle cap special case so the increment cap is flat 30 on the route value in `state.stats`; make no other cap/floor changes (route values stay base + statHistory per design D5); verify by updating `stat-store.spec.ts` (remove the 31-cap scenarios) and running `npm test`
- [x] 2.4 Wire derived trait AP into the ability budget: computed `totalAp = ap + derivedTraitAp` used by obtainability checks in `ability-store`, `ap` allowed to go negative down to `0 - derivedTraitAp`, refunds and per-tree reset unchanged; character switch preserves the total budget exactly (`ap_new = totalAp - newDerived`); `restoreState` clamps `ap` up to the derived floor; expose the total and derived values for the AP display; verify by updating `build-store.spec.ts` and `ability-store.spec.ts` (spend derived, refund shrinks budget, Dirwin-Arna-Dirwin round trip preserves total, level-down with negative ap, restore clamp) and running `npm test`
- [x] 2.5 Replace `boulderCircleStat`: switch the build-store Boulder methods to read/write the `boulder-circle` bonus slot, remove `boulderCircleStat` from `BuildState` and update remaining references (extras-display keeps working through the store methods; url-share validation updated in task 4.1); apply persistence semantics (trait slot entries cleared on character switch, quest entries kept, all cleared on reset); verify with `build-store.spec.ts` tests and `npm run build` passing with no references to the removed field

## 3. Left Sidenav Sections

- [x] 3.1 Create the shared `point-slot-row` subcomponent (custom dropdown with colored stat chips, placeholder "-", outside-click close, keyboard and ARIA behavior per design D10: `aria-haspopup="listbox"`, `aria-expanded`, arrow-key navigation, Enter selects, Escape closes and returns focus, single option role), migrating the pattern from `extras-display`; verify with component tests replicating the old dropdown scenarios plus keyboard interaction tests
- [x] 3.2 Create the `trait-section` component: trait name + enriched tooltip with full description on hover, SP slot rows (with the Velmir stepper for unbounded gains), derived AP badge, slim name-only row for characters without gains; verify with component tests for each character shape (Velmir stepper rows, Jorgrim bounded, Dirwin mixed, Arna none)
- [x] 3.3 Create the `quests-section` component driven by `quests.json`: Boulder Circle slot row with info tooltip; verify with component tests
- [x] 3.4 Compose the left sidenav order in `character-panel.html` (selector, level-controls, trait-section, stat-controls, quests-section, character-info) and update `stat-controls` to display `state.stats[stat] + bonusCount(stat)` with bonus contribution markers per stat row; verify with updated component tests asserting merged display values and a dev-server smoke check
- [x] 3.5 Strip the Boulder row and question icon from `extras-display`, rename the section header to "Notes", and adjust the Notes tooltip wording; verify by updating `extras-display` component tests and running `npm test`

## 4. Serialization and AI Prompt

- [x] 4.1 Update `url-share.service.ts`: serialize `bonusSlots` including null-stat claimed rows, validate per design D8 (non-array `bonusSlots` invalidates the payload; malformed entries, out-of-range indexes, duplicates, unknown sources, and other characters' trait sources are dropped individually; `ap` clamped up to the derived floor), and migrate legacy `boulderCircleStat` (stat -> one `boulder-circle` slot, null -> none); verify by adding round-trip, claimed-row round-trip, malformed-entry, and legacy-payload regression tests in `url-share.service.spec.ts`
- [x] 4.2 Update `ai-prompt.service.ts` to render bonus allocations grouped by source, separate from the level route listing, and use merged values (`state.stats + bonusCount`) in the stat summary; verify by updating `ai-prompt.service.spec.ts` and running `npm test`

## 5. Verification

- [x] 5.1 Run `npm run lint` and `npm run build` and resolve all errors; verify both pass clean
- [x] 5.2 Run the full `npm test` suite and confirm all new and updated specs pass
- [x] 5.3 Manual smoke test on the dev server: Velmir VIT 10 + Boulder + 3 trait slots displays VIT 14 with markers; a stat at route 28 with 2 bonus slots (displayed 30) still accepts route increments; Jorgrim 5 trophy slots allocatable; Dirwin Survival abilities shift the derived AP badge and budget, and a Dirwin-Arna-Dirwin switch preserves the total budget; a legacy shared URL restores with the Boulder allocation; a Velmir build with claimed unallocated rows round-trips through share/restore
