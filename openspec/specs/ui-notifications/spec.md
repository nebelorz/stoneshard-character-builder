# ui-notifications Specification

## Purpose

Provide ephemeral user notifications for transient events and structured error recovery.

## Requirements

### Requirement: Toast notification display

The system SHALL display toast notifications for transient, recoverable errors with a message and auto-dismiss after a configurable duration. Toast notifications SHALL be announced to screen readers via ARIA live regions.

#### Scenario: Toast shown for clipboard failure

- **WHEN** the user clicks a copy button and the clipboard API is unavailable or denied
- **THEN** a toast notification appears with "Failed to copy to clipboard" and auto-dismisses after 3 seconds

#### Scenario: Toast shown for invalid share URL

- **WHEN** the user opens a URL with a corrupted or invalid build parameter
- **THEN** a toast notification appears with "Could not restore build from URL, starting fresh" and auto-dismisses

#### Scenario: Toast auto-dismiss

- **WHEN** a toast notification is displayed
- **THEN** it is automatically removed after its configured duration

#### Scenario: Toast announced to screen readers

- **WHEN** a toast notification appears
- **THEN** screen readers announce the toast message via aria-live="polite"

#### Scenario: Toast has role=status

- **WHEN** a toast is rendered
- **THEN** the toast container has role="status" and aria-live="polite"

### Requirement: Toast notification types

The system SHALL support different toast severity levels (error, warning, info) with distinct visual styling.

#### Scenario: Error toast styling

- **WHEN** an error-level toast is displayed
- **THEN** it uses the project's error color for its background or border

#### Scenario: Info toast styling

- **WHEN** an info-level toast is displayed
- **THEN** it uses a neutral or muted color for its background or border

### Requirement: Global error handler

The system SHALL provide a global ErrorHandler that catches uncaught exceptions and Angular errors, displays a toast notification, and logs the error to the console.

#### Scenario: Uncaught exception caught

- **WHEN** an uncaught JavaScript exception propagates to the global scope
- **THEN** a toast notification appears with a generic message and the error is logged to console.error

### Requirement: HTTP data fetch retry

The system SHALL automatically retry HTTP data fetch failures up to 3 times with exponential backoff before surfacing the error to the user.

#### Scenario: Retry succeeds

- **WHEN** an HTTP data fetch fails on the first attempt
- **THEN** the system retries automatically up to 3 times and succeeds on a later attempt without showing an error

#### Scenario: All retries fail

- **WHEN** all 3 retry attempts fail
- **THEN** the error is surfaced to the user via the ErrorComponent with a retry option

### Requirement: Error component retry callback

The system SHALL allow the ErrorComponent to accept a retry callback so the "Try Again" button can retry the failed operation.

#### Scenario: Retry callback invoked

- **WHEN** the user clicks "Try Again" on the ErrorComponent
- **THEN** the provided retry callback is invoked

#### Scenario: No retry callback provided

- **WHEN** the ErrorComponent is rendered without a retry callback
- **THEN** the "Try Again" button falls back to window.location.reload()

### Requirement: Loading state announcement

The system SHALL announce loading states to screen readers.

#### Scenario: Loading announced

- **WHEN** the loading spinner is displayed
- **THEN** screen readers announce "Loading" via role="status"

#### Scenario: Loading complete announced

- **WHEN** the loading spinner disappears
- **THEN** screen readers announce "Loaded" or the content is announced

### Requirement: Error component alert

The ErrorComponent SHALL use role="alert" for critical error announcements.

#### Scenario: Error announced

- **WHEN** an error message is displayed
- **THEN** screen readers announce the error immediately via role="alert"

### Requirement: Toast announced exactly once

A toast message SHALL be announced to screen readers exactly once when it appears.

#### Scenario: Single announcement

- **WHEN** a toast notification appears
- **THEN** the message is announced to screen readers exactly once

#### Scenario: No duplicate announcement

- **WHEN** a toast notification appears
- **THEN** the message is not announced twice through overlapping mechanisms
