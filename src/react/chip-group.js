import { createElement as h } from "react";
import { cx } from "../index.js";
import { renderIcon } from "./shared.js";

export function ChipGroup({
  options,
  value,
  onChange,
  multiple = false,
  label,
  className,
}) {
  const selected = multiple ? new Set(value ?? []) : value;
  const isSelected = (optionValue) =>
    multiple ? selected.has(optionValue) : selected === optionValue;

  const toggle = (optionValue) => {
    if (!multiple) return onChange?.(optionValue);
    const next = new Set(selected);
    if (next.has(optionValue)) next.delete(optionValue);
    else next.add(optionValue);
    onChange?.([...next]);
  };

  return h(
    "div",
    {
      role: multiple ? "group" : "radiogroup",
      "aria-label": label,
      className: cx("cubyt-chip-group", className),
    },
    options.map((option) =>
      h(
        "button",
        {
          key: option.value,
          type: "button",
          role: multiple ? "checkbox" : "radio",
          "aria-checked": isSelected(option.value),
          disabled: option.disabled,
          className: "cubyt-chip",
          onClick: () => toggle(option.value),
        },
        option.icon ? renderIcon(option.icon) : null,
        option.label,
      ),
    ),
  );
}
