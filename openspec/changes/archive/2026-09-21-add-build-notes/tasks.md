## 1. Data Model

- [x] 1.1 Add `notes` field to `BuildState` interface in `build-state.model.ts` with type `{ readonly buildName: string; readonly author: string; readonly content: string }` and verify TypeScript compiles without errors
- [x] 1.2 Add `applySetNotes` method to `BuildStore` that takes a partial notes object and returns a new BuildState, and verify it integrates with existing state management
- [x] 1.3 Add `notes: { buildName: '', author: '', content: '' }` to `resetToCharacter`'s `initialState` in `BuildStore`, and verify a fresh build has empty notes
- [x] 1.4 Add `notes` fallback in `restoreState` so old URLs without `notes` deserialize to empty defaults, and verify old URLs restore correctly

## 2. Notes Modal Component

- [x] 2.1 Create `NotesModalComponent` with modal overlay, Build Name input (maxlength 50), Author input (maxlength 50), auto-expanding textarea via CDK TextareaAutosize (maxlength 5000), character counter, Save and Close buttons, and verify the component renders correctly in isolation
- [x] 2.2 Implement dirty tracking signal that sets to true on any input event and resets on Save, and verify the signal updates on each keystroke
- [x] 2.3 Wire Save button to emit notes data via output signal and Close button to check dirty state before emitting close, and verify both callbacks fire correctly
- [x] 2.4 Add unsaved changes confirmation using ConfirmPopupComponent anchored to Close button growing upward, and verify the popover appears only when dirty
- [x] 2.5 Add CSS styles for the modal: fixed-position overlay with semi-transparent backdrop, centered container, top row with Build Name and Author inputs side by side, auto-expanding textarea, bottom row with character counter on the left and Save/Close buttons on the right, and responsive width constraints

## 3. Right Sidebar Integration

- [x] 3.1 Add Notes button to `extras-display.html` below Boulder Circle row using Phosphor `note-pencil` icon (import `phosphorNote` and register in `provideIcons`), and verify the button appears in the right sidebar
- [x] 3.2 Implement notes preview logic in `ExtrasDisplayComponent`: show "No notes for this build" in italic when empty, truncated content (~80 chars) when notes exist, and verify the preview updates reactively
- [x] 3.3 Wire Notes button click to open the modal via a new `openNotesModal` method, and verify the modal opens centered on screen
- [x] 3.4 Migrate `@HostListener('document:click')` in `extras-display.ts` to the `host` object of the `@Component` decorator, and verify the dropdown still closes on outside click

## 4. App Component Wiring

- [x] 4.0 Add `NotesModalComponent` to `AppComponent` `imports` array in `app.ts`
- [x] 4.1 Add modal state signals (isOpen, currentNotes) to `AppComponent` and render `NotesModalComponent` conditionally in `app.html`, and verify the modal opens and closes
- [x] 4.2 Connect modal Save output to `buildStore.applySetNotes()` and modal Close output to close the modal, and verify notes persist in BuildState after save

## 5. URL Sharing

- [x] 5.1 Update `UrlShareService.isValidBuildState()` to accept optional `notes` field with `{ buildName?: string, author?: string, content?: string }` shape, and verify validation passes for URLs with and without notes
- [x] 5.2 Add default notes fallback in `restoreFromUrl()` when `notes` is missing from deserialized state, and verify old URLs restore correctly with empty notes

## 6. AI Prompt Export

- [x] 6.1 Add `buildNotesSection()` method to `AiPromptService` that generates a "## Notes" section with the intro line "The user provides these notes and insights about this character build:" followed by the notes content, and verify it appears in the generated prompt when notes exist
- [x] 6.2 Omit the Notes section entirely when all notes fields are empty, and verify the prompt has no Notes section for builds without notes

## 7. Bug Fixes

- [x] 7.1 Make entire Notes section the click target: wrap icon, label, and preview in a single clickable element so clicking anywhere opens the modal
- [x] 7.2 Fix Close button to discard changes: Close must NOT save notes to BuildState; only Save should persist
- [x] 7.3 Add Cancel option to Close confirmation popover: the popover must have "Confirm" (saves and closes) and "Cancel" (closes popover only, keeps modal open)
- [x] 7.4 Reduce content maxlength from 5000 to 1000 characters
- [x] 7.5 Add tooltip to Notes icon: "Author notes about this build", matching Boulder Circle tooltip pattern
- [x] 7.6 Fix modal close behavior: use `mousedown` on backdrop instead of `click` to prevent closing when releasing a text selection outside the modal

## 8. Verification

- [x] 8.1 Run `ng build` and verify the application compiles without errors
- [x] 8.2 Manual test: create notes with build name, author, and content, save, verify sidebar preview updates, share via URL, restore from URL, verify notes are present, copy AI prompt, verify Notes section appears
- [x] 8.3 Manual test: verify all 6 bug fixes work correctly (full-section click, Close discards, Cancel in popover, 1000 char limit, icon tooltip, mousedown close behavior)
