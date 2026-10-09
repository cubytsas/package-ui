import { createElement as h, Fragment } from "react";
import { safeHref } from "../link.js";
import { cx } from "../index.js";
import { renderIcon, useLinkClick } from "./shared.js";
import { Spinner } from "./spinner.js";

export function Button({
  variant = "primary",
  size = "md",
  block = false,
  loading = false,
  icon,
  iconEnd,
  href,
  external,
  replace,
  newTab,
  disabled,
  className,
  children,
  onClick,
  type = "button",
  ...rest
}) {
  const classes = cx(
    "cubyt-btn",
    `cubyt-btn--${variant}`,
    size !== "md" && `cubyt-btn--${size}`,
    block && "cubyt-btn--block",
    className,
  );
  const content = [
    loading ? h(Spinner, { key: "spinner", size: 14 }) : null,
    renderIcon(icon, 14, "icon"),
    h(Fragment, { key: "label" }, children),
    renderIcon(iconEnd, 14, "icon-end"),
  ];
  const handleLinkClick = useLinkClick({ href, external, replace, newTab, onClick, disabled: loading });
  const resolvedHref = safeHref(href);

  if (href && resolvedHref && !disabled) {
    return h(
      "a",
      {
        ...rest,
        className: classes,
        href: resolvedHref,
        target: newTab ? "_blank" : undefined,
        rel: newTab ? "noopener noreferrer" : undefined,
        "data-loading": loading || undefined,
        "aria-disabled": loading || undefined,
        "aria-busy": loading || undefined,
        onClick: handleLinkClick,
      },
      ...content,
    );
  }

  // A loading button stays focusable (aria-disabled) so focus is not dropped to <body>.
  const inert = loading && !disabled;
  return h(
    "button",
    {
      ...rest,
      type,
      className: classes,
      disabled: disabled || undefined,
      "aria-disabled": inert || undefined,
      "aria-busy": loading || undefined,
      "data-loading": loading || undefined,
      onClick: inert ? (event) => event.preventDefault() : onClick,
    },
    ...content,
  );
}

export function IconButton({
  icon,
  label,
  variant,
  size = "md",
  className,
  type = "button",
  ...rest
}) {
  return h(
    "button",
    {
      ...rest,
      type,
      "aria-label": label,
      title: rest.title ?? label,
      className: cx(
        "cubyt-icon-btn",
        variant && `cubyt-icon-btn--${variant}`,
        size === "lg" && "cubyt-icon-btn--lg",
        className,
      ),
    },
    renderIcon(icon, size === "lg" ? 18 : 16),
  );
}
