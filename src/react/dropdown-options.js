import { createElement as h, useEffect } from "react";
import { cx } from "../index.js";
import { Icon } from "./icon.js";

export function DropdownOptions({
  options,
  value,
  activeIndex,
  onActiveChange,
  onSelect,
  menuRef,
  menuId,
  ariaLabel,
  menuClassName,
  optionClassName,
  style,
}) {
  useEffect(() => {
    menuRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, menuRef]);

  return h(
    "div",
    {
      ref: menuRef,
      id: menuId,
      role: "listbox",
      "aria-label": ariaLabel,
      className: cx("cubyt-dropdown__menu", menuClassName),
      style,
    },
    options.map((option, index) => {
      const selected = option.value === value;
      return h(
        "div",
        {
          key: option.value,
          id: `${menuId}-option-${index}`,
          role: "option",
          "aria-selected": selected,
          "aria-disabled": option.disabled || undefined,
          "data-active": index === activeIndex || undefined,
          "data-selected": selected || undefined,
          className: cx("cubyt-dropdown__option", optionClassName),
          onPointerMove: () => !option.disabled && onActiveChange(index),
          onClick: () => onSelect(option),
        },
        option.label,
        selected ? h(Icon, { name: "check", size: 15, className: "cubyt-dropdown__check" }) : null,
      );
    }),
  );
}
