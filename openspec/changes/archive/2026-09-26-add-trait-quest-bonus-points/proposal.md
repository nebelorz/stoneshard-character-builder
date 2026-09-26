# Proposal: add-trait-quest-bonus-points

## Why

Character traits in Stoneshard grant extra Stat Points (SP) and Ability Points (AP) outside of level-ups (Jorgrim's trophies, Dirwin's dens and Survival abilities, Velmir's bosses, Mahir's per-tree AP), but the builder cannot represent or allocate them - only the Boulder Circle quest exists, hardcoded as `boulderCircleStat` in the right sidenav. Players planning Jorgrim or Dirwin builds have no way to record where those trait points go.

## What Changes

- Introduce a unified **bonus points** system: any SP/AP granted outside a level-up (character trait gains, quest rewards) is represented as a point _slot_ that the user allocates directly.
- **BREAKING**: `BuildState.boulderCircleStat` is replaced by `bonusSlots` (a list of `{sourceId, index, stat}` allocations, where `stat` may be null for claimed-but-unallocated rows of unbounded sources). Shared URLs from before the change are migrated on load (old `boulderCircleStat` maps to one Boulder Circle slot).
- Bonus SP slots apply a **direct +1** to the chosen stat's displayed value (model B2): no interaction with the SP pool, `statHistory`, or the level-route. `state.stats` stays route-only (base + level-up increments); displayed stat values become the sum of route value + bonus slot count.
- Trait AP gains that are _derived_ from the build (Dirwin: 1 AP per 3 learned Survival abilities; Mahir: 1 AP per tree with 6+ abilities learned) are computed automatically and extend the ability budget as `totalAp = ap + derivedTraitAp`; `ap` may go negative down to `0 - derivedTraitAp`. Character switches preserve the total budget exactly, and URL restores clamp `ap` to that floor; no user allocation needed.
- Add a **Trait section** to the left sidenav, placed under the character selector: trait name + full description on hover (enriched tooltip), point-slot allocation for characters whose trait grants SP, and derived AP badges. Characters without point gains show only the trait name + description.
- Add a **Quests section** to the left sidenav, placed after the stats panel: quest point slots (Boulder Circle today) driven by a new quests data file, extensible for future quests.
- Remove the Boulder Circle row from the right sidenav; the Extras section becomes a Notes-only section and is renamed accordingly.
- Route-display annotation of bonus slots is explicitly deferred to a follow-up change (the separate `bonusSlots` state keeps this possible without data pollution).

## Capabilities

### New Capabilities

- `bonus-points`: The unified bonus point model - bonus slot state (including null-stat claimed rows), trait gain configuration (SP slots + derived AP formulas), quest configuration, direct stat grants, cap/floor separation from route spending, derived AP in the ability budget (with switch/restore budget preservation), and the left-sidenav Trait and Quests sections.

### Modified Capabilities

- `quest-extras`: Boulder Circle stops being a bespoke state field and cap-raise mechanic; it becomes a data-driven quest entry granting a direct +1 stat point through the unified bonus slots system.
- `extras-display`: The Boulder Circle dropdown and question-icon requirements are removed; the section becomes Notes-only and is renamed.
- `stat-allocation`: Route stat values stay route-only (base + statHistory); increment caps flat at 30 on the route value (Boulder special case removed); route decrements can never consume bonus points; displayed stat values include bonus increments with markers.
- `url-sharing`: Serialization replaces `boulderCircleStat` with `bonusSlots` (including claimed null-stat rows); previously shared URLs continue to work via migration; restore validation drops malformed slot entries individually and clamps `ap` to the derived floor.
- `invariants`: The stat-constraint and internal-consistency invariants are updated for direct bonus grants (displayed values may exceed 30) and the derived-AP budget representation (negative `ap` with a never-negative total).
- `resource-display`: The AP bar shows the total budget (level AP + derived AP) with the fill anchored to the 31-point level budget and a derived-portion badge.
- `ui-accessibility`: The extracted point-slot dropdown follows the selector dropdown keyboard/ARIA pattern, and stepper controls get descriptive accessible names.

## Impact

- **Data**: `src/assets/data/characters.json` (new structured `traitGains` per character), new `src/assets/data/quests.json`.
- **Models**: `build-state.model.ts` (replace `boulderCircleStat` with `bonusSlots`), `character.model.ts` (trait gains types).
- **Services**: `build-store.ts`, `stat-store.ts` (remove the Boulder special case; route values unchanged), new bonus service; `ability-store.ts` total-budget obtainability checks; `url-share.service.ts` (validation rules + legacy migration + ap clamp); `ai-prompt.service.ts` (render bonus allocations, merged stat summary).
- **Components**: new `trait-section`, `quests-section`, shared `point-slot-row` in `features/character/components`; `extras-display` stripped to Notes; `character-panel` composition; `stat-controls` merged display values and bonus markers.
- **Tests**: spec updates for build-store, stat-store, level-store, url-share, ai-prompt, extras-display, and the new components.
