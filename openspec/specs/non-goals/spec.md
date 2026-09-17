# non-goals Specification

## Purpose

Explicitly document what this refactoring does NOT intend to change.

## Non-Goals

### Game rules and static game data

This refactoring does NOT change any game rules, ability prerequisites, stat constraints, level restrictions, or static game data (characters, abilities, trees). These are sourced from the game and remain unchanged.

### URL sharing format

This refactoring does NOT change the URL sharing format. The gzip-compressed base64url format is stable and backward compatible.

### User-facing behavior

This refactoring does NOT change any observable user-facing behavior. All interactions, states, and visual outcomes remain identical.

### Visual identity of Stoneshard-specific components

This refactoring does NOT change the visual appearance of ability trees, stat controls, character selectors, or other Stoneshard-specific UI. The purple-tinted color palette, typography, and game aesthetic are preserved.

### Introducing routing

This refactoring does NOT introduce Angular Router. The application is a single-page application without routes.

### Adding a state management library

This refactoring does NOT introduce NgRx, Akita, or any external state management library. State is managed with Angular signals and service-based stores.

### Unnecessary architectural abstractions

This refactoring does NOT introduce repository patterns, use-case layers, or other architectural abstractions that are not justified by the application's complexity.

### Unnecessary RxJS

This refactoring does NOT introduce new RxJS usage where Angular signals or httpResource provide a simpler solution. Existing correct RxJS usage may be retained.

### Unnecessary UI wrappers

This refactoring does NOT wrap custom Stoneshard UI components in external UI framework components without a concrete architectural reason.

### Premature zoneless migration

This refactoring does NOT remove Zone.js or migrate to zoneless Angular. That is a separate future consideration.

### New features

This refactoring does NOT add new features, capabilities, or user-facing functionality. It is purely a structural improvement.

### Performance optimization

This refactoring does NOT optimize performance unless a concrete performance issue is identified and addressed as part of the structural improvement.
