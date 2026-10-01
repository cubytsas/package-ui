# Changelog

All notable changes to `@cubyt/ui` are documented here.

## [1.1.0] - 2026-10-01

### Added

- `Select` for a styled native select control.
- `EmptyState` for consistent first-run and no-results views.
- Repository and component contribution guidance.

### Changed

- Moved `ui.css` under `src/styles/` while preserving the public `@cubyt/ui/ui.css` import.
- Simplified the README to focus on setup and component use.

## [1.0.1] - 2026-09-28

### Changed

- Publish from GitHub Actions with npm provenance attestations linking the package to its source commit and workflow.

## [1.0.0] - 2026-09-28

Initial public release.

### Added

- `ui.css` primitives built on `@cubyt/style` tokens: buttons, icon buttons, fields, inputs, chips, notices, key/value rows, code blocks, list items, spinner, progress bar and keyboard hints, with light and dark mode.
- Refined button hover feedback and added a subtle animated affordance to interactive list items, with reduced-motion support.
- Lucide-compatible inline icon set with string, DOM and React renderers.
- Safe link helpers (`safeHref`, `followLink`, `resolveAction`, `configureLinks`) built on `@cubyt/navigation`.
- React components under `@cubyt/ui/react`.
- TypeScript declarations, explicit package exports and a minimal npm file allowlist.
- MIT license.
