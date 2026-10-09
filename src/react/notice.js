import { createElement as h } from "react";
import { cx } from "../index.js";
import { renderIcon } from "./shared.js";

const noticeIcons = {
  info: "info",
  success: "check-circle",
  warning: "alert-triangle",
  danger: "alert-triangle",
};

export function Notice({ tone = "info", title, icon, className, children }) {
  return h(
    "div",
    {
      className: cx("cubyt-notice", `cubyt-notice--${tone}`, className),
      role: tone === "danger" || tone === "warning" ? "alert" : "note",
    },
    icon === false
      ? null
      : h("span", { className: "cubyt-notice__icon" }, renderIcon(icon ?? noticeIcons[tone], 18)),
    h(
      "div",
      { className: "cubyt-notice__body" },
      title ? h("p", { className: "cubyt-notice__title" }, title) : null,
      children ? h("div", { className: "cubyt-notice__text" }, children) : null,
    ),
  );
}
