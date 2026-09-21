## Context

The app uses a signal-based architecture with immutable state transitions. `BuildState` is the central data model, serialized to JSON for URL sharing and AI prompt generation. The right sidenav has an Extras section (currently only Boulder Circle) and a Route Display. The app already uses CDK overlay for popovers (Share, AI Prompt, Reset confirm) and has `$button-purple`/`$button-red` color variables.

## Goals / Non-Goals

**Goals:**

- Add editable notes (buildName, author, content) that persist in BuildState
- Provide a clean modal editing experience that doesn't clutter the right sidebar
- Include notes in URL sharing and AI prompt export
- Maintain backward compatibility with existing shared URLs

**Non-Goals:**

- localStorage persistence (notes only live in the URL/BuildState)
- Rich text editing (plain text only)
- Notes versioning or history
- Multiple note entries per build (single notes object)

## Decisions

### 1. Notes as object vs flat fields

**Decision:** Store notes as a nested object `{ buildName, author, content }` within BuildState.

**Rationale:** Groups related fields logically. The alternative (flat `notesBuildName`, `notesAuthor`, `notesContent`) pollutes the top-level state with prefixed fields. The nested approach is cleaner for serialization and future extensibility.

### 2. Modal via CDK overlay vs CSS fixed positioning

**Decision:** Use a CSS `position: fixed` overlay with backdrop, not CDK overlay.

**Rationale:** The existing CDK overlay pattern (used by popovers) is designed for elements positioned relative to a trigger element. The notes modal is centered on screen with no trigger anchor. A simple fixed-position component with a semi-transparent backdrop is cleaner, easier to style, and avoids CDK overlay complexity (template portals, overlay injection, positioning strategies). The modal will be rendered in `AppComponent` similar to how popovers are rendered.

### 3. Auto-expanding textarea via CDK TextareaAutosize

**Decision:** Use `CDKTextareaAutosize` directive from `@angular/cdk/text-field`.

**Rationale:** The project already depends on `@angular/cdk`. CDKTextareaAutosize handles scrollHeight measurement, min/max height, and edge cases (font changes, window resize). Manual DOM manipulation would replicate this logic. The directive is lightweight and well-tested.

### 4. Unsaved changes detection

**Decision:** Track a local `dirty` signal in the modal component. Set to true on any input event in Build Name, Author, or Content fields. Reset on Save.

**Rationale:** Simple signal-based approach consistent with the rest of the app. No need for form control dirty tracking since we're not using Angular reactive forms here. The dirty flag is local to the modal component, not persisted to BuildState.

### 5. Confirmation popover with Confirm and Cancel

**Decision:** Reuse the existing `ConfirmPopupComponent` + `PopoverComponent` pattern for the unsaved changes confirmation, anchored to the Close button. The popover MUST have two options: "Confirm" (saves and closes modal) and "Cancel" (closes popover only, keeps modal open).

**Rationale:** The current implementation only has Confirm, which is ambiguous. Adding Cancel gives users a clear way to dismiss the popover without saving. The existing popover pattern supports multiple action buttons.

### 6. Notes preview truncation

**Decision:** Truncate preview to ~80 characters, appending "..." if longer. If content is empty but buildName exists, show buildName instead.

**Rationale:** 80 chars fits comfortably in the sidebar width without wrapping excessively. Showing buildName as fallback provides meaningful context when content is empty but the build is named.

### 7. Validation approach

**Decision:** Enforce character limits via `maxlength` attribute on inputs/textarea. The `notes` object is always present in BuildState (never null), with empty string defaults. Content max is 1000 chars.

**Rationale:** `maxlength` is the simplest enforcement and works at the DOM level. Server-side validation is not applicable (client-only app). The `notes` object being always present avoids null checks throughout the codebase. 1000 chars is sufficient for build notes while keeping URL length reasonable.

### 8. Full-section click target

**Decision:** The entire Notes section (icon, label, preview) must be the click target. Use a wrapping `<div>` or `<button>` element around all content, with the click handler on the wrapper.

**Rationale:** The current implementation only has the title as clickable, which is unintuitive. Users expect the entire card-like section to be clickable. A wrapper element with `cursor: pointer` provides a clear affordance.

### 9. Modal close on mousedown vs click

**Decision:** Use `mousedown` event on the backdrop instead of `click` to close the modal. This prevents the modal from closing when the user starts a text selection inside the modal and releases outside.

**Rationale:** The `click` event fires on mouseup if mousedown was on the same element. If the user starts selecting text inside the modal and releases outside, a `click` handler on the backdrop would fire. Using `mousedown` ensures the modal only closes when the user explicitly clicks the backdrop, not when releasing a drag.

### 10. Notes icon tooltip

**Decision:** Add a tooltip to the Notes icon matching the Boulder Circle tooltip pattern. The tooltip text is "Author notes about this build".

**Rationale:** Consistency with the existing Boulder Circle icon tooltip. The tooltip provides discoverability for new users.

## Risks / Trade-offs

- **URL length with large notes** -> Gzip compression on natural language text is highly effective (typically 60-80% reduction). 5000 chars of English text compresses to ~1-2KB. Browser URL limits (typically 2000+ chars for the full URL) are not a concern since the compressed payload is a query parameter value, not the full URL. Mitigation: monitor actual compressed sizes in testing.

- **Modal rendering in AppComponent** -> Adding another conditional block to app.html increases component complexity. Mitigation: the modal is a self-contained component; the only wiring in AppComponent is open/close/dirty state, matching the existing popup pattern.

- **Backward compatibility** -> Old URLs without `notes` must restore correctly. Mitigation: `notes` defaults to `{buildName:"", author:"", content:""}` when missing from deserialized state. The `isValidBuildState` guard accepts optional `notes`.

## Migration Plan

No migration needed. This is an additive change:

- New field in BuildState with empty defaults
- New component (NotesModalComponent)
- Modified services (UrlShareService, AiPromptService)
- Backward compatible with existing URLs
