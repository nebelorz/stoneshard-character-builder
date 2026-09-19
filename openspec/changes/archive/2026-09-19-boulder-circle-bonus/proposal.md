## Why

StoneShard features an optional quest called "Boulder Circle" that grants +1 stat point upon completion. Players can complete this quest at any level, and the bonus stat point is independent of the normal level-based SP system (level 30 = 29 SP + 31 AP). Currently, the character builder has no way to account for this bonus, forcing players to mentally track it outside the tool. Adding support for this quest reward allows players to plan complete builds that include the Boulder Circle bonus.

## What Changes

- Add `boulderCircleStat: StatKey | null` field to `BuildState` to track which stat received the bonus
- Add an "Extras" section in the right sidebar (below Route) with a dropdown to allocate the bonus stat point
- The dropdown displays "-" when unallocated and "+1 [STAT]" when allocated
- Selecting a stat from the dropdown immediately allocates the bonus; selecting "-" deallocates it
- The bonus stat point is completely separated from the SP system (SP counter stays at 29)
- The bonus bypasses the MAX_STAT cap of 30, allowing a stat to reach 31
- The bonus persists across character changes (like pinned trees)
- A full build reset clears the bonus allocation
- URL sharing includes the bonus state for recipient visibility
- AI prompt output includes Boulder Circle allocation information

## Capabilities

### New Capabilities

- `quest-extras`: Manages optional quest reward allocations (Boulder Circle bonus) that are independent of the normal SP/AP system, including state tracking, UI display, and export integration

### Modified Capabilities

- `stat-allocation`: The bonus stat point bypasses the 30-point cap, allowing stats to reach 31 when the bonus is allocated to that stat
- `url-sharing`: The serialized build state must include `boulderCircleStat` for backward-compatible sharing
- `ai-prompt-export`: The AI prompt must include Boulder Circle allocation information in the character section

## Impact

- **State Model**: `BuildState` interface gains a new optional field
- **Build Store**: Initialization and reset logic must handle the new field
- **Right Sidebar**: New "Extras" section with dropdown component
- **Stat Display**: No changes to left sidebar stat values (bonus is separate)
- **URL Sharing**: Serialization and validation must handle new field
- **AI Prompt**: Template output includes bonus information
- **Backward Compatibility**: Existing shared builds without the field treated as unallocated
