import { createElement as h } from "react";
import { cx } from "../index.js";

export function Spinner({ size = 16, label, className, style }) {
  return h("span", {
    className: cx("cubyt-spinner", className),
    style: { "--cubyt-spinner-size": `${size}px`, ...style },
    role: label ? "status" : undefined,
    "aria-label": label,
    "aria-hidden": label ? undefined : true,
  });
}

/** Link-aware click handler that routes `href` through `@cubyt/navigation`. */
