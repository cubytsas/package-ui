import { navigate } from "@cubyt/navigation";
import { redirect, resolveRedirectTarget } from "@cubyt/navigation/redirect";

const linkDefaults = {
  /** @type {((pathname: string) => boolean) | undefined} */
  isInternalRoute: undefined,
  eventName: undefined,
};

/** Configure app-wide link behavior once, e.g. which paths the SPA router owns. */
export function configureLinks(options = {}) {
  Object.assign(linkDefaults, options);
}

/** Return the absolute HTTP(S) URL for `href`, or `undefined` if it is unsafe or invalid. */
export function safeHref(href, base) {
  if (typeof href !== "string" || href.trim() === "") return undefined;
  try {
    return resolveRedirectTarget(href, base).href;
  } catch {
    return undefined;
  }
}

/** True when the URL points to another origin than the current page. */
export function isExternalHref(href) {
  if (typeof window === "undefined") return false;
  const resolved = safeHref(href);
  return !!resolved && new URL(resolved).origin !== window.location.origin;
}

/**
 * Follow a link through `@cubyt/navigation`: SPA routes use the History API,
 * other destinations do a full-page navigation, and unsafe schemes throw.
 */
export function followLink(link) {
  if (typeof window === "undefined") return;
  const { href, external, replace, newTab } = link;
  const target = resolveRedirectTarget(href);

  if (newTab) {
    window.open(target.href, "_blank", "noopener,noreferrer");
    return;
  }
  if (external || replace) {
    redirect(target.href, { replace });
    return;
  }
  navigate(target.href, {
    isInternalRoute: link.isInternalRoute ?? linkDefaults.isInternalRoute,
    eventName: link.eventName ?? linkDefaults.eventName,
  });
}

/**
 * Run an action descriptor. `onClick` runs first; `href` is followed afterwards
 * unless `onClick` returns `false`. Returns the `onClick` result.
 */
export async function resolveAction(action, event) {
  if (!action) return undefined;
  const result = action.onClick ? await action.onClick(event) : undefined;
  if (action.href && result !== false) followLink(action);
  return result;
}

/** True when a click should be left to the browser (new tab, download, etc.). */
export function isModifiedClick(event) {
  return (
    !!event &&
    (event.defaultPrevented ||
      event.button > 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey)
  );
}
