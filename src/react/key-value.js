import { createElement as h } from "react";
import { cx } from "../index.js";

export function KeyValue({ items, className }) {
  return h(
    "dl",
    { className: cx("cubyt-kv", className) },
    items.map((item, index) =>
      h(
        "div",
        { key: item.key ?? index, className: "cubyt-kv__row" },
        h("dt", { className: "cubyt-kv__key" }, item.label),
        h(
          "dd",
          { className: cx("cubyt-kv__value", item.mono && "cubyt-kv__value--mono") },
          item.value,
        ),
      ),
    ),
  );
}
