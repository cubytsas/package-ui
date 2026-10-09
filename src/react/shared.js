import { createElement as h, Fragment } from "react";
import { cx } from "../index.js";
import { followLink, isModifiedClick } from "../link.js";
import { Icon } from "./icon.js";

export const renderIcon = (icon, size = 14, key) =>
  typeof icon === "string"
    ? h(Icon, { key, name: icon, size })
    : icon
      ? h(Fragment, { key }, icon)
      : null;

export function useLinkClick({ href, external, replace, newTab, onClick, disabled }) {
  return (event) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
    if (!href || newTab || isModifiedClick(event)) return;
    event.preventDefault();
    followLink({ href, external, replace });
  };
}
