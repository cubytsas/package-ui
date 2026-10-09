import { createElement as h } from "react";
import { safeHref } from "../link.js";
import { cx } from "../index.js";
import { renderIcon, useLinkClick } from "./shared.js";

export function ListItem({
  icon,
  label,
  description,
  trailing,
  tone,
  selected,
  active,
  href,
  external,
  newTab,
  onClick,
  disabled,
  role,
  className,
  ...rest
}) {
  const handleLinkClick = useLinkClick({ href, external, newTab, onClick, disabled });
  const resolvedHref = safeHref(href);
  const tag = resolvedHref && !disabled ? "a" : onClick || role || (disabled && resolvedHref) ? "button" : "div";
  const props = {
    ...rest,
    role,
    className: cx("cubyt-list-item", tone === "danger" && "cubyt-list-item--danger", className),
    "data-active": active || undefined,
    ...(role === "option" ? { "aria-selected": !!selected } : {}),
    ...(role === "menuitemradio" || role === "radio" || role === "checkbox" || role === "menuitemcheckbox"
      ? { "aria-checked": !!selected }
      : {}),
  };
  if (tag === "a") {
    Object.assign(props, {
      href: resolvedHref,
      target: newTab ? "_blank" : undefined,
      rel: newTab ? "noopener noreferrer" : undefined,
      onClick: handleLinkClick,
    });
  } else if (tag === "button") {
    Object.assign(props, { type: "button", disabled: disabled || undefined, onClick: disabled ? undefined : onClick });
  }

  return h(
    tag,
    props,
    icon ? h("span", { className: "cubyt-list-item__icon" }, renderIcon(icon, 16)) : null,
    h(
      "span",
      { className: "cubyt-list-item__copy" },
      h("span", { className: "cubyt-list-item__label" }, label),
      description
        ? h("span", { className: "cubyt-list-item__description" }, description)
        : null,
    ),
    trailing !== undefined || selected
      ? h(
          "span",
          { className: "cubyt-list-item__trailing" },
          trailing,
          selected && trailing === undefined ? h(Icon, { name: "check", size: 16 }) : null,
        )
      : null,
  );
}
