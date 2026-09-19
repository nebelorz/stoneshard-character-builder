## 1. State Model

- [x] 1.1 Add `boulderCircleStat: StatKey | null` field to `BuildState` interface in `build-state.model.ts`
- [x] 1.2 Update `build-store.ts` to initialize `boulderCircleStat: null` in `resetToCharacter()`
- [x] 1.3 Update `build-store.ts` to persist `boulderCircleStat` on character change

## 2. Bonus Allocation Logic

- [x] 2.1 Add `allocateBoulderCircle(stat: StatKey)` method to `build-store.ts`
- [x] 2.2 Add `deallocateBoulderCircle()` method to `build-store.ts`
- [x] 2.3 Add `canAllocateBoulderCircle(stat: StatKey)` computed property to `build-store.ts`

## 3. Right Sidebar Extras Section

- [x] 3.1 Create new `extras-display` component in `features/build/components/`
- [x] 3.2 Implement dropdown UI with options: "-", "+1 STR", "+1 AGI", "+1 PER", "+1 VIT", "+1 WIL"
- [x] 3.3 Connect dropdown to `build-store.ts` allocation methods
- [x] 3.4 Add `app-extras-display` to `right-sidenav.html` below Route section

## 4. Right Sidebar Styling

- [x] 4.1 Style the Extras section to match existing Route section design
- [x] 4.2 Style the dropdown to match existing UI components

## 5. URL Sharing

- [x] 5.1 Update `url-share.service.ts` `isValidBuildState()` to handle `boulderCircleStat` field
- [x] 5.2 Verify `boulderCircleStat` is included in serialized JSON (automatic)

## 6. AI Prompt Export

- [x] 6.1 Update `ai-prompt.service.ts` to include Boulder Circle info in Character section
- [x] 6.2 Format as "| Boulder Circle | +1 [STAT] |" or "| Boulder Circle | Not allocated |"

## 7. Stat Allocation Integration

- [x] 7.1 Update `stat-store.ts` `canIncrementStat()` to account for bonus stat cap bypass
- [x] 7.2 Verify bonus stat value is correctly displayed in right sidebar

## 8. Reset Integration

- [x] 8.1 Update `build-store.ts` `reset()` to clear `boulderCircleStat` to null
- [x] 8.2 Verify full reset clears bonus allocation

## 9. Testing

- [x] 9.1 Add unit tests for `allocateBoulderCircle()` and `deallocateBoulderCircle()`
- [x] 9.2 Add unit tests for `canAllocateBoulderCircle()`
- [x] 9.3 Add integration test for bonus persistence across character changes
- [x] 9.4 Add integration test for bonus clearing on full reset
- [x] 9.5 Verify URL sharing with and without bonus state
