# Changelog

## V1.9 — Snapshot-Aware Selector Resolution

### Added
- Snapshot-aware selector resolution pipeline
- Multi-snapshot flow-state support
- Scoring-based element matching
- Cross-site selector validation
- Safer extension failure UX
- Harness tests for snapshot parsing, matching, selector resolution, rendering, and generation

### Changed
- Renderer now supports additional selector strategies including `id` and text/button disambiguation
- Snapshot assignment now uses generic flow-state mapping instead of site-specific filename logic
- Assertion mapping centralized into a helper function

### Validated
- SauceDemo login → inventory → add to cart → cart badge assertion
- Herokuapp login → secure area assertion
- Extension valid-flow generation
- Extension junk-input safe failure

### Notes
- Saved HTML snapshots are still used.
- Live DOM capture is planned for a future version.
- SauceDemo and Herokuapp are validation fixtures, not the long-term scope boundary.

## V1.8.1 — Extension Copy Feedback

### Added
- Inline “Copied to clipboard” confirmation in the extension UI
- Brief copy-button disable state to prevent repeated clicks

## V1.8 — Dropdown Semantic Mapping

### Added
- Dropdown action mapping with `selectOption({ label: ... })`
- Dropdown assertion mapping with `toHaveValue(...)`
- Label/value handling for options such as `Option 1` → `1`