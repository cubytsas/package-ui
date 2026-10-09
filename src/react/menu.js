import { createElement as h, forwardRef } from "react";
import { cx } from "../index.js";

export function MenuPanel({ className, children, ...props }) {
  return h("div", { ...props, className: cx("cubyt-menu", className) }, children);
}

export const MenuOption = forwardRef(function MenuOption(
  { selected = false, className, children, ...props },
  ref,
) {
  return h(
    "button",
    {
      ...props,
      ref,
      type: props.type ?? "button",
      className: cx("cubyt-menu-option", className),
      "data-selected": selected || props["data-selected"] || undefined,
    },
    children,
  );
});
