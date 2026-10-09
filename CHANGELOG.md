# Changelog

All notable changes to `@cubyt/ui` are documented here.

## [1.1.0] - 2026-10-09

### Added

- `Select` for a styled native select control.
- `EmptyState` for consistent first-run and no-results views.
- Repository and component contribution guidance.
- Viewport-aware, keyboard-accessible `DropdownSelect` with custom listbox styling and modal-safe portal placement.
- Component styles split into focused CSS modules and React primitives split into per-component modules behind the stable `@cubyt/ui/react` entry point.

### Changed

- Rebased primitives on `@cubyt/style@1.2.0` tokens for themes, spacing, typography, surfaces, hover and selected states.
- Removed list-item hover movement and use a consistent visible hover fill without adding hover borders.
- Updated package peers to the official `@cubyt/style` 1.2.0 release line.

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
