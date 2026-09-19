## Context

The character builder currently tracks stat allocations through the SP system (29 SP at level 30). The Boulder Circle quest provides an optional +1 stat point that is independent of this system. The bonus must be tracked separately, displayed in the right sidebar, and included in exports.

Key constraints:

- SP counter stays at 29 (bonus is separate)
- Bonus bypasses MAX_STAT cap of 30 (allows 31)
- Bonus persists across character changes
- Full reset clears the bonus
- Backward compatible with existing shared URLs

## Goals / Non-Goals

**Goals:**

- Add `boulderCircleStat` field to `BuildState` to track bonus allocation
- Create "Extras" section in right sidebar with dropdown for bonus allocation
- Include bonus state in URL sharing
- Include bonus information in AI prompt output
- Maintain backward compatibility with existing shared builds

**Non-Goals:**

- Modify left sidebar stat display (bonus is separate)
- Add multiple quest extras (only Boulder Circle for now)
- Modify the SP/AP counter display
- Change the normal stat allocation flow

## Decisions

### Decision 1: State Model

**Choice**: Add `boulderCircleStat: StatKey | null` to `BuildState`

**Rationale**: This is the simplest representation. A null value means unallocated, a StatKey means allocated to that stat. No separate boolean needed.

**Alternatives considered**:

- Separate `boulderCircleBonus: boolean` + `boulderCircleStat: StatKey | null`: More verbose, no additional benefit
- Store in character data: Wrong semantics (quest is optional, not character-specific)

### Decision 2: UI Placement

**Choice**: New "Extras" section in right sidebar, below Route, always visible

**Rationale**: Separates the bonus from the main stat allocation system. Keeps the left sidebar unchanged. The dropdown provides a clean way to allocate/deallocate.

**Alternatives considered**:

- Checkbox in left sidebar: Would mix the bonus with normal SP system
- Modal dialog: Extra click, less discoverable
- Inline in Route display: Route is for level-by-level actions, bonus is global

### Decision 3: Bonus Allocation Logic

**Choice**: Direct stat modification outside SP system

**Rationale**: The bonus is completely separated from SP. When allocated, it adds +1 to the stat directly without affecting SP. The stat value display in the right sidebar shows the bonus.

**Alternatives considered**:

- Add bonus to SP pool: Would change SP counter (stays at 29)
- Track in stat history: Would mix bonus with normal allocations

### Decision 4: Cap Bypass

**Choice**: Bonus bypasses MAX_STAT of 30

**Rationale**: Matches StoneShard game behavior. The bonus is a separate system that can push stats above the normal cap.

**Alternatives considered**:

- Apply cap: Would prevent legitimate bonus allocation

### Decision 5: Backward Compatibility

**Choice**: Missing `boulderCircleStat` in URL = null (unallocated)

**Rationale**: Existing shared builds don't have this field. Treating it as null ensures they work correctly.

**Alternatives considered**:

- Reject builds without field: Would break existing shared URLs

## Risks / Trade-offs

**Risk**: Stat display confusion

- **Mitigation**: Bonus is clearly shown in the right sidebar "Extras" section. Left sidebar remains unchanged.

**Risk**: URL sharing complexity

- **Mitigation**: Field is optional during deserialization. Missing fields default to null.

**Risk**: Future quest extras

- **Mitigation**: Current design is extensible. Can add more fields to BuildState for future quest rewards.

**Risk**: Dropdown UX

- **Mitigation**: Simple dropdown with clear labels. Immediate allocation on selection.
