export { createIcon, iconNames, icons, iconSvg } from "./icons.js";
export {
  configureLinks,
  followLink,
  isExternalHref,
  isModifiedClick,
  resolveAction,
  safeHref,
} from "./link.js";

/** Join class names, skipping falsy values. */
export function cx(...values) {
  return values.filter(Boolean).join(" ");
}

/** Copy text to the clipboard, with a fallback for non-secure contexts. */
export async function copyText(text) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* fall through to the legacy path */
    }
  }
  if (typeof document === "undefined") return false;
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.append(field);
  field.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }
  field.remove();
  return copied;
}
