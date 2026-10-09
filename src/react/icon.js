import { createElement as h } from "react";
import { icons } from "../icons.js";
import { cx } from "../index.js";

function svgAttributeName(name) {
  return name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function Icon({ name, size = 16, className, ...rest }) {
  const nodes = icons[name];
  if (!nodes) return null;
  return h(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": true,
      focusable: false,
      className: cx("cubyt-icon", className),
      ...rest,
    },
    nodes.map(([tag, attributes], index) =>
      h(tag, {
        key: index,
        ...Object.fromEntries(
          Object.entries(attributes).map(([key, value]) => [
            svgAttributeName(key),
            value,
          ]),
        ),
      }),
    ),
  );
}
