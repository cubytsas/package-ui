import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { iconSvg, cx, resolveAction, safeHref } from "../src/index.js";

let assigned;
let pushed;

beforeEach(() => {
  assigned = [];
  pushed = [];
  globalThis.window = {
    location: {
      href: "https://app.cubyt.co/es/monitor",
      origin: "https://app.cubyt.co",
      assign: (url) => assigned.push(url),
      replace: (url) => assigned.push(`replace:${url}`),
    },
    history: { pushState: (_state, _title, url) => pushed.push(url) },
    dispatchEvent: () => true,
    scrollTo: () => {},
  };
  globalThis.Event = class {
    constructor(type) {
      this.type = type;
    }
  };
});

afterEach(() => {
  delete globalThis.window;
});

test("safeHref rejects executable schemes and resolves relative paths", () => {
  assert.equal(safeHref("javascript:alert(1)"), undefined);
  assert.equal(safeHref("data:text/html,hi"), undefined);
  assert.equal(safeHref(""), undefined);
  assert.equal(safeHref("/es/perfil"), "https://app.cubyt.co/es/perfil");
});

test("resolveAction uses SPA navigation for internal routes", async () => {
  const { configureLinks } = await import("../src/link.js");
  configureLinks({ isInternalRoute: (path) => path.startsWith("/es/") });
  await resolveAction({ href: "/es/perfil" });
  assert.deepEqual(pushed, ["/es/perfil"]);
  assert.deepEqual(assigned, []);
});

test("resolveAction does a full redirect for external links and respects onClick=false", async () => {
  await resolveAction({ href: "https://auth.cubyt.co/login", external: true });
  assert.deepEqual(assigned, ["https://auth.cubyt.co/login"]);

  let ran = false;
  await resolveAction({
    href: "https://auth.cubyt.co/login",
    onClick: () => {
      ran = true;
      return false;
    },
  });
  assert.equal(ran, true);
  assert.equal(assigned.length, 1);
});

test("resolveAction throws for unsafe hrefs", async () => {
  await assert.rejects(() => resolveAction({ href: "javascript:alert(1)" }), TypeError);
});

test("iconSvg serializes known icons and rejects unknown names", () => {
  const svg = iconSvg("x", { size: 20 });
  assert.match(svg, /^<svg /);
  assert.match(svg, /width="20"/);
  assert.match(svg, /d="M18 6 6 18"/);
  assert.throws(() => iconSvg("nope"), RangeError);
});

test("cx joins truthy class names", () => {
  assert.equal(cx("a", false, undefined, "b", 0, "c"), "a b c");
});
