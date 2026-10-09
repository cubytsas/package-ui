import { createElement as h, Fragment, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cx } from "../index.js";
import { DropdownOptions } from "./dropdown-options.js";
import { useDropdownPosition } from "./dropdown-position.js";
import { useDropdownDismissal } from "./use-dropdown-dismissal.js";

const findEnabledOption = (options, from, direction) => {
  if (!options.length) return -1;
  for (let offset = 0; offset < options.length; offset += 1) {
    const index = (from + direction * offset + options.length * 2) % options.length;
    if (!options[index]?.disabled) return index;
  }
  return -1;
};

/** Accessible custom select with a viewport-aware, reusable options menu. */
export function DropdownSelect({
  value,
  options,
  onChange,
  ariaLabel,
  placeholder = "Seleccionar",
  disabled = false,
  variant = "plain",
  placement = "auto",
  align = "end",
  className,
  triggerClassName,
  menuClassName,
  optionClassName,
  id,
  container,
  ...rest
}) {
  const generatedId = useId();
  const menuId = id ? `${id}-listbox` : `cubyt-select-${generatedId}`;
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, options.findIndex((option) => option.value === value && !option.disabled)),
  );
  const position = useDropdownPosition({ open, triggerRef, menuRef, placement, align });
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;
  const activeOption = options[activeIndex];
  const portalTarget = container
    ?? triggerRef.current?.closest("dialog[open]")
    ?? (typeof document !== "undefined" ? document.body : null);

  const close = (restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus());
  };
  useDropdownDismissal({ open, triggerRef, menuRef, onClose: close });

  const openAt = (index = selectedIndex >= 0 ? selectedIndex : findEnabledOption(options, 0, 1)) => {
    if (disabled || !options.some((option) => !option.disabled)) return;
    setActiveIndex(index >= 0 && !options[index]?.disabled ? index : findEnabledOption(options, 0, 1));
    setOpen(true);
  };
  const selectOption = (option) => {
    if (!option || option.disabled) return;
    onChange?.(option.value, option);
    close(true);
  };
  const onTriggerKeyDown = (event) => {
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) event.preventDefault();
    if (!open) {
      if (["ArrowDown", "Enter", " "].includes(event.key)) openAt();
      else if (event.key === "ArrowUp") openAt(findEnabledOption(options, options.length - 1, -1));
      return;
    }
    if (event.key === "ArrowDown") setActiveIndex((index) => findEnabledOption(options, index + 1, 1));
    else if (event.key === "ArrowUp") setActiveIndex((index) => findEnabledOption(options, index - 1, -1));
    else if (event.key === "Home") setActiveIndex(findEnabledOption(options, 0, 1));
    else if (event.key === "End") setActiveIndex(findEnabledOption(options, options.length - 1, -1));
    else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectOption(activeOption);
    }
  };

  const menu = open && portalTarget
    ? createPortal(
        h(DropdownOptions, {
          options,
          value,
          activeIndex,
          onActiveChange: setActiveIndex,
          onSelect: selectOption,
          menuRef,
          menuId,
          ariaLabel: ariaLabel ?? placeholder,
          menuClassName,
          optionClassName,
          style: {
            top: position.top,
            left: position.left,
            width: position.width || undefined,
            maxHeight: position.maxHeight,
            visibility: position.width ? "visible" : "hidden",
          },
        }),
        portalTarget,
      )
    : null;

  return h(
    Fragment,
    null,
    h(
      "button",
      {
        ...rest,
        ref: triggerRef,
        id,
        type: "button",
        disabled,
        "aria-label": ariaLabel,
        "aria-haspopup": "listbox",
        "aria-expanded": open,
        "aria-controls": menuId,
        "aria-activedescendant": open && activeIndex >= 0 ? `${menuId}-option-${activeIndex}` : undefined,
        className: cx("cubyt-dropdown__trigger", `cubyt-dropdown__trigger--${variant}`, className, triggerClassName),
        "data-open": open || undefined,
        onClick: () => open ? close() : openAt(),
        onKeyDown: onTriggerKeyDown,
      },
      h("span", { className: "cubyt-dropdown__value" }, selectedOption?.label ?? placeholder),
      h("span", { className: "cubyt-dropdown__chevron", "aria-hidden": true }),
    ),
    menu,
  );
}
