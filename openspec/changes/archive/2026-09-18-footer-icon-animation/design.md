## Context

The project uses Angular animations (see `src/app/shared/animations/fade.ts` for existing patterns). The footer component has 4 icons that need hover feedback. The animation must be reusable across the app.

## Goals / Non-Goals

**Goals:**

- Create a reusable hover animation (zoom + jiggle) using Angular animations
- Provide both animation trigger and directive approaches for flexibility
- Ensure GPU-accelerated rendering via CSS transforms
- Keep animation subtle and performant (under 300ms)

**Non-Goals:**

- Animating non-icon elements
- Complex multi-step animations
- Animation configuration options (speed, intensity) - keep it simple for now

## Decisions

### 1. Animation Trigger vs Directive

**Decision**: Provide both an Angular animation trigger and a standalone directive.

**Rationale**:

- Animation triggers are idiomatic Angular and work well when the component already uses `@Component({ animations: [...] })`
- Directives are simpler for components that don't want to deal with Angular animation boilerplate
- Having both gives consumers flexibility

**Alternatives considered**:

- Directive only: Rejected because animation triggers are more Angular-idiomatic
- Trigger only: Rejected because directives are simpler for one-off usage

### 2. Animation Implementation

**Decision**: Use Angular's `trigger('iconHover', [...])` with `:enter`/`:leave` transitions triggered by a boolean state.

**Rationale**:

- Follows existing pattern in `fade.ts`
- Uses CSS transforms (scale, rotate) for GPU acceleration
- Clean enter/leave transitions

**Alternatives considered**:

- Pure CSS hover: Rejected because Angular animations integrate better with the framework's change detection
- Keyframe animation: Rejected because Angular transitions provide better control

### 3. Jiggle Implementation

**Decision**: Use a multi-step rotation animation (-3deg → 3deg → 0deg) on hover.

**Rationale**:

- Creates a natural "jiggle" feel
- Completes quickly (300ms total)
- Returns to neutral state for clean mouse-leave transition

**Alternatives considered**:

- Single rotation: Rejected because it feels more like a tilt than a jiggle
- Continuous oscillation: Rejected because it would be distracting

## Risks / Trade-offs

- **Risk**: Animation may feel too prominent for some users → **Mitigation**: Keep scale and rotation values subtle (1.1x, ±3deg)
- **Risk**: Multiple icons animating simultaneously may be distracting → **Mitigation**: Each icon animates independently on its own hover
- **Trade-off**: Providing both trigger and directive adds maintenance surface → **Acceptable**: The directive can delegate to the trigger internally
