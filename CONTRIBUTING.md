# Contributing

## Repository layout

- `src/` contains framework-independent utilities and React primitives.
- `src/styles/ui.css` contains the published component styles.
- `types/` contains the public TypeScript declarations.
- `tests/` covers component markup, links, and accessibility wiring.
- `README.md` documents consumer usage; `CHANGELOG.md` records package changes.

## Component conventions

- Prefer native HTML controls and preserve their standard attributes and behavior.
- Give interactive elements visible keyboard focus and disabled/error states.
- Use shared `@cubyt/style` tokens for colors, spacing, and radii.
- Keep React exports, declaration files, CSS classes, and README examples in sync.
- Keep framework-independent helpers out of the React-only export.
