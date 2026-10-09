import { createElement as h } from "react";
import { cx } from "../index.js";

export function Progress({ value = 0, max = 100, label, indeterminate = false, className }) {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.min(safeMax, value)) : 0;
  const percent = (safeValue / safeMax) * 100;
  return h(
    "div",
    {
      className: cx("cubyt-progress", className),
      role: "progressbar",
      "aria-label": label,
      "aria-valuemin": indeterminate ? undefined : 0,
      "aria-valuemax": indeterminate ? undefined : safeMax,
      "aria-valuenow": indeterminate ? undefined : safeValue,
      "data-indeterminate": indeterminate || undefined,
      style: { "--cubyt-progress": `${percent}%` },
    },
    h("div", { className: "cubyt-progress__bar" }),
  );
}

export function Kbd({ children }) {
  return h("kbd", { className: "cubyt-kbd" }, children);
}
