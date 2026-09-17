# error-handling Specification

## Purpose

Provide structured error recovery for data fetch failures and global exception handling.

## Requirements

### Requirement: Data fetch error display

The system SHALL display an error component with a retry button when initial data loading fails after all retry attempts, including when the failure occurs during application startup.

#### Scenario: Data load failure

- **WHEN** character data, ability tree data, or ability data fails to load after 3 retries
- **THEN** an error component is displayed with the error message and a "Try Again" button

#### Scenario: Startup failure is not a blank page

- **WHEN** the initial data fetch fails during application startup
- **THEN** the application renders the error component instead of a blank or broken page

#### Scenario: Retry button

- **WHEN** the user clicks "Try Again"
- **THEN** the failed data fetch is retried and the application initializes again

#### Scenario: Retry succeeds

- **WHEN** the user clicks "Try Again" and the retried fetch succeeds
- **THEN** the error component is replaced by the application

### Requirement: Loading state

The system SHALL display a loading indicator while data is being fetched.

#### Scenario: Loading visible

- **WHEN** the app is loading initial data
- **THEN** a loading spinner and "Loading..." text are displayed

### Requirement: Store initialization failure handling

The build store SHALL enter a recoverable error state when its initial data load fails instead of remaining permanently uninitialized.

#### Scenario: Store load fails

- **WHEN** the build store's initial data load fails
- **THEN** the store exposes an initialization error and does not crash downstream consumers

#### Scenario: Store re-initializes on retry

- **WHEN** the user retries after an initialization failure and the load succeeds
- **THEN** the store initializes to a valid state and all build operations become available

### Requirement: Safe state snapshot

The build state snapshot accessor SHALL be safe to call before the store is initialized and SHALL not throw.

#### Scenario: Snapshot before init

- **WHEN** a caller reads the state snapshot while the store is still loading or after a load failure
- **THEN** the caller receives an explicit "not ready" result instead of an exception

#### Scenario: Share action before init

- **WHEN** the user triggers a share action while the store is not initialized
- **THEN** no crash occurs and a toast informs the user the build is not ready

### Requirement: Network error toast

The system SHALL display a toast notification for network-related errors during share/prompt operations.

#### Scenario: Share fails

- **WHEN** the user attempts to share a build and the operation fails
- **THEN** a toast notification appears with "Failed to copy to clipboard"
