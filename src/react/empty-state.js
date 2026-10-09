import { createElement as h, useId } from "react";
import { cx } from "../index.js";
import { renderIcon } from "./shared.js";

export function EmptyState({ icon = "search", title, description, action, className, children }) {
  const titleId = useId();
  return h(
    "section",
    { className: cx("cubyt-empty-state", className), "aria-labelledby": titleId, role: "status" },
    icon ? h("span", { className: "cubyt-empty-state__icon", "aria-hidden": true }, renderIcon(icon, 20)) : null,
    h("h3", { id: titleId, className: "cubyt-empty-state__title" }, title),
    description ? h("p", { className: "cubyt-empty-state__description" }, description) : null,
    action || children
      ? h("div", { className: "cubyt-empty-state__action" }, action ?? children)
      : null,
  );
}
