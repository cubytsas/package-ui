import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  Button,
  ChipGroup,
  CodeBlock,
  Field,
  Input,
  KeyValue,
  ListItem,
  Notice,
  Progress,
} from "../src/react.js";

const render = (element) => renderToStaticMarkup(element);

test("Button renders variants, loading state and safe links", () => {
  assert.match(render(h(Button, { variant: "danger" }, "Borrar")), /cubyt-btn--danger/);
  const loading = render(h(Button, { loading: true }, "Guardar"));
  assert.match(loading, /data-loading="true"[^>]*>.*cubyt-spinner/);
  assert.match(loading, /aria-disabled="true"/);
  assert.doesNotMatch(loading, /\sdisabled=""/);
  assert.match(render(h(Button, { loading: true, disabled: true }, "Guardar")), /\sdisabled=""/);
  const loadingLink = render(h(Button, { href: "/app", loading: true }, "Cargando"));
  assert.match(loadingLink, /<a[^>]+aria-disabled="true"[^>]+aria-busy="true"/);
  assert.match(
    render(h(Button, { href: "https://cubyt.co/docs", newTab: true }, "Docs")),
    /<a[^>]+href="https:\/\/cubyt.co\/docs"[^>]+target="_blank"[^>]+rel="noopener noreferrer"/,
  );
  const unsafe = render(h(Button, { href: "javascript:alert(1)" }, "X"));
  assert.match(unsafe, /^<button/);
  assert.doesNotMatch(unsafe, /javascript:/);
});

test("Field wires label, hint and error to the control", () => {
  const html = render(
    h(Field, { label: "Correo", error: "Requerido", id: "email" }, h(Input, { type: "email" })),
  );
  assert.match(html, /<label[^>]+for="email"/);
  assert.match(html, /<input[^>]+id="email"/);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /aria-describedby="email-error"/);
  assert.match(html, /role="alert"/);
  const existingId = render(
    h(Field, { label: "Nombre", hint: "Pista" }, h(Input, { id: "custom", "aria-describedby": "help" })),
  );
  assert.match(existingId, /for="custom"/);
  assert.match(existingId, /id="custom"/);
  assert.match(existingId, /aria-describedby="help custom-hint"/);
});

test("ChipGroup exposes radio semantics", () => {
  const html = render(
    h(ChipGroup, {
      options: [
        { value: "admin", label: "Admin" },
        { value: "member", label: "Miembro" },
      ],
      value: "admin",
    }),
  );
  assert.match(html, /role="radiogroup"/);
  assert.match(html, /role="radio" aria-checked="true"/);
  assert.match(html, /role="radio" aria-checked="false"/);
});

test("Data display components render", () => {
  assert.match(render(h(Notice, { tone: "danger", title: "Ojo" }, "Texto")), /cubyt-notice--danger/);
  assert.match(
    render(h(KeyValue, { items: [{ label: "IP", value: "1.1.1.1", mono: true }] })),
    /<dt class="cubyt-kv__key">IP<\/dt>/,
  );
  const masked = render(h(CodeBlock, { value: "ABCD", masked: true }));
  assert.match(masked, /data-masked="true"/);
  assert.match(masked, /aria-label="Mostrar"/);
  assert.match(masked, /aria-pressed="false"/);
  assert.match(render(h(ListItem, { label: "Eliminar", tone: "danger", onClick() {} })), /^<button/);
  const disabledLink = render(h(ListItem, { label: "Bloqueado", href: "/settings", disabled: true }));
  assert.match(disabledLink, /^<button[^>]+disabled=""/);
  assert.doesNotMatch(disabledLink, /href=/);
  assert.match(render(h(Progress, { value: 40 })), /aria-valuenow="40"/);
  const invalidProgress = render(h(Progress, { value: Number.NaN, max: 0 }));
  assert.match(invalidProgress, /aria-valuemax="100"/);
  assert.match(invalidProgress, /aria-valuenow="0"/);
});
