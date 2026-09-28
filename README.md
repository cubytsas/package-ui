# @cubyt/ui

Shared Cubyt UI primitives: pill buttons, icon buttons, fields, chips, notices, key/value rows, copyable code, list items, spinners and progress bars, plus a small icon set and safe link helpers built on [`@cubyt/navigation`](https://github.com/CubytsAS/package-navigation).

The styles are plain CSS on top of `@cubyt/style` tokens (light and dark mode included). The core has no framework dependency; React components live under `@cubyt/ui/react`.

## Install

```sh
npm install @cubyt/ui @cubyt/style
```

For local development in this repository:

```sh
npm install ../branding/packages/ui
```

## Styles

```css
@import "@cubyt/style/tokens.css";
@import "@cubyt/ui/ui.css";
```

| Class | Variants |
| --- | --- |
| `.cubyt-btn` | `--primary`, `--secondary`, `--danger`, `--ghost`, `--sm`, `--lg`, `--block`, `[data-loading="true"]` |
| `.cubyt-icon-btn` | `--ghost`, `--overlay`, `--lg` |
| `.cubyt-field`, `.cubyt-input`, `.cubyt-textarea` | `[aria-invalid="true"]`, `.cubyt-input--mono` |
| `.cubyt-chip-group`, `.cubyt-chip` | `[aria-checked="true"]` / `[aria-pressed="true"]` |
| `.cubyt-notice` | `--info`, `--success`, `--warning`, `--danger` |
| `.cubyt-kv`, `.cubyt-code`, `.cubyt-code-grid` | |
| `.cubyt-list`, `.cubyt-list-item` | `--danger`, `[aria-selected]`, `[data-active]` |
| `.cubyt-spinner`, `.cubyt-progress`, `.cubyt-kbd` | `[data-indeterminate="true"]` |

## React

```tsx
import { Button, Field, Input, Notice } from "@cubyt/ui/react";

<Field label="Correo" error={error}>
  <Input type="email" name="email" />
</Field>
<Notice tone="warning" title="Revisa tu DNS">La propagación puede tardar 24h.</Notice>
<Button variant="danger" loading={saving} iconEnd="trash">Eliminar</Button>
<Button href="/es/monitor">Ir al monitor</Button>
```

Available components: `Button`, `IconButton`, `Field`, `Input`, `Textarea`, `ChipGroup`, `Notice`, `KeyValue`, `CodeBlock`, `ListItem`, `Spinner`, `Progress`, `Kbd` and `Icon`.

## Links and actions

Buttons and list items with `href` render a real `<a>` and route clicks through `@cubyt/navigation`: SPA routes use the History API, other destinations do a full-page navigation, and `javascript:`/`data:` URLs are rejected.

```ts
import { configureLinks, resolveAction, safeHref } from "@cubyt/ui";

configureLinks({ isInternalRoute: (path) => /^\/(es|en)\//.test(path) });

await resolveAction({ href: "https://auth.cubyt.co/login", external: true });
safeHref("javascript:alert(1)"); // undefined
```

`resolveAction({ onClick, href })` runs `onClick` first and follows `href` unless `onClick` returns `false`. `newTab: true` opens with `noopener,noreferrer`.

## Icons

`icons`, `iconSvg(name)` (string) and `createIcon(name)` (DOM element) expose a small Lucide-compatible set: `x`, `info`, `alert-triangle`, `alert-circle`, `check`, `check-circle`, `copy`, `chevron-left`, `chevron-right`, `arrow-right`, `play`, `external-link`, `search`, `download` and `trash`. In React, any icon prop also accepts a custom node (for example a `lucide-react` icon).

## Publishing

This package is maintained at [CubytsAS/package-ui](https://github.com/CubytsAS/package-ui). Use its **Publish to npm** GitHub Actions workflow to publish after validating the package contents. The workflow calls the shared organization workflow in [`CubytsAS/.github`](https://github.com/CubytsAS/.github).

The organization must provide an Actions secret named `NPM_TOKEN` with publish access to the `@cubyt` npm scope. Do not commit npm credentials or place them in package files. Increment `version` in `package.json` before publishing; npm versions are immutable. The package supports the published `@cubyt/style` 1.x line and uses its shared light/dark tokens.
