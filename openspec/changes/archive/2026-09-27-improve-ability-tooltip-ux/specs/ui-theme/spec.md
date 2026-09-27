## MODIFIED Requirements

### Requirement: Typography

The system SHALL use non-small-caps typefaces for all text: `IM Fell English` for headings and `Bitter` for body text, applied via font-family variables. Small-caps font variants SHALL NOT be used anywhere. Display headings SHALL be rendered in uppercase, and body text SHALL NOT be forced to uppercase. The font weights the interface uses SHALL be loaded as real weights.

#### Scenario: Headings use game font

- **WHEN** headings or titles are rendered
- **THEN** they use IM Fell English and are displayed in uppercase

#### Scenario: Body text uses readable font

- **WHEN** body text is rendered
- **THEN** it uses Bitter with true lowercase letterforms

#### Scenario: No small-caps face is used

- **WHEN** any text is rendered anywhere in the application
- **THEN** it uses a typeface with true lowercase forms and no small-caps variant

#### Scenario: Required weights are loaded

- **WHEN** text is rendered at regular, semibold, or bold weight
- **THEN** the corresponding real font weight is loaded and the browser does not synthesize it
