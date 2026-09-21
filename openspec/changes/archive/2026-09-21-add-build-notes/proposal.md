## Why

Users currently share builds via URL or AI prompt with no way to attach context. A build is just stats and abilities -- there's no place to explain intent, rotation notes, gear priorities, or authorship. Adding a "Notes" section lets users annotate their builds with free-text commentary that travels with the shared URL and AI prompt.

## What Changes

- Add a `notes` field to `BuildState` containing `buildName`, `author`, and `content` (all optional strings, max 50/50/1000 chars).
- Add a Notes section in the right sidenav below Boulder Circle, showing a preview or "No notes for this build" italic text. The entire section acts as the click target to open the modal.
- Add a centered modal for editing notes with: Build Name and Author inputs (top row), auto-expanding textarea (body), character counter and Save/Close buttons (bottom row).
- Save persists to `BuildState` on Save click. Close discards changes. Close with unsaved changes triggers a confirmation popover with Confirm and Cancel options.
- Add a tooltip on the Notes icon: "Author notes about this build".
- Notes are included in URL serialization (gzip-compressed) and AI prompt output (new `## Notes` section).
- Backward-compatible: existing shared URLs without `notes` restore correctly (notes default to empty).

## Bug Fixes

1. The entire Notes section (icon, label, preview) must be the click target that opens the modal, not just the title.
2. Close button must discard changes (not save like Save button does).
3. Close confirmation popover must have two options: Confirm (saves and closes) and Cancel (closes popover only, keeps modal open).
4. Reduce content character limit from 5000 to 1000.
5. Add tooltip to the Notes icon: "Author notes about this build".
6. Modal must not close when selecting text inside and releasing the mouse outside; only a click outside should close it.

## Capabilities

### New Capabilities

- `build-notes`: Free-text notes system for character builds -- modal editor, sidebar preview, data model, and integration with URL sharing and AI prompt export.

### Modified Capabilities

- `extras-display`: Add a Notes section below Boulder Circle in the right sidenav with full-section click target and icon tooltip.
- `url-sharing`: Extend serialization to include `notes` field; update validation for backward compatibility.
- `ai-prompt-export`: Add a `## Notes` section to the generated markdown prompt when notes exist.

## Impact

- **Data model**: `BuildState` interface gains a `notes` object. All consumers of `BuildState` (stores, services, URL share, AI prompt) must handle the new field.
- **URL length**: Gzip-compressed notes add minimal overhead (text compresses well). 1000 chars of notes adds <1KB compressed, well within browser URL limits.
- **Components**: New `NotesModalComponent`. Modifications to `ExtrasDisplayComponent` and `AppComponent` (modal rendering).
- **Dependencies**: Uses existing `@angular/cdk` CDKTextareaAutosize for auto-expanding textarea. No new dependencies.
