import {
  Children,
  cloneElement,
  createElement as h,
  Fragment,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { copyText, cx } from "./index.js";
import { icons } from "./icons.js";
import { followLink, isModifiedClick, safeHref } from "./link.js";

const svgAttributeName = (key) =>
  key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

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

const renderIcon = (icon, size = 14, key) =>
  typeof icon === "string"
    ? h(Icon, { key, name: icon, size })
    : icon
      ? h(Fragment, { key }, icon)
      : null;

export function Spinner({ size = 16, label, className, style }) {
  return h("span", {
    className: cx("cubyt-spinner", className),
    style: { "--cubyt-spinner-size": `${size}px`, ...style },
    role: label ? "status" : undefined,
    "aria-label": label,
    "aria-hidden": label ? undefined : true,
  });
}

/** Link-aware click handler that routes `href` through `@cubyt/navigation`. */
function useLinkClick({ href, external, replace, newTab, onClick, disabled }) {
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

/**
 * Label + control + hint/error. A single element child receives `id`,
 * `aria-describedby` and `aria-invalid`; a function child receives those props.
 */
export function Field({
  label,
  hint,
  error,
  required,
  id,
  className,
  children,
}) {
  const generatedId = useId();
  const childId = isValidElement(children) ? children.props.id : undefined;
  const controlId = id ?? childId ?? `cubyt-field-${generatedId}`;
  const hintId = hint && !error ? `${controlId}-hint` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy = cx(
    isValidElement(children) && children.props["aria-describedby"],
    hintId,
    errorId,
  ) || undefined;
  const controlProps = {
    id: controlId,
    ...(required === undefined ? {} : { required }),
    "aria-describedby": describedBy,
    "aria-invalid": error ? true : undefined,
  };
  let control = children;
  if (typeof children === "function") control = children(controlProps);
  else if (isValidElement(children) && Children.count(children) === 1) {
    control = cloneElement(children, {
      ...children.props,
      ...controlProps,
      required: required ?? children.props.required,
      "aria-invalid": error ? true : children.props["aria-invalid"],
    });
  }

  return h(
    "div",
    { className: cx("cubyt-field", className), "data-invalid": error ? true : undefined },
    label
      ? h(
          "label",
          {
            className: "cubyt-field__label",
            htmlFor: controlId,
            "data-required": required || undefined,
          },
          label,
        )
      : null,
    control,
    hint && !error ? h("p", { id: hintId, className: "cubyt-field__hint" }, hint) : null,
    error
      ? h("p", { id: errorId, className: "cubyt-field__error", role: "alert" }, error)
      : null,
  );
}

export function Input({ className, mono, icon, ...rest }) {
  const input = h("input", {
    ...rest,
    className: cx("cubyt-input", mono && "cubyt-input--mono", className),
  });
  if (!icon) return input;
  return h("div", { className: "cubyt-input-wrap" }, renderIcon(icon, 16), input);
}

export function Textarea({ className, ...rest }) {
  return h("textarea", { ...rest, className: cx("cubyt-textarea", className) });
}

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

export function CodeBlock({
  value,
  label,
  masked = false,
  copyLabel = "Copiar",
  copiedLabel = "Copiado",
  revealLabel = "Mostrar",
  hideLabel = "Ocultar",
  onCopy,
  className,
}) {
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(!masked);
  const timer = useRef(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    const ok = await copyText(value);
    if (!ok) return;
    setCopied(true);
    onCopy?.(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };

  return h(
    "div",
    { className: cx("cubyt-code", className) },
    label ? h("span", { className: "cubyt-code__label" }, label) : null,
    h(
      "code",
      {
        className: "cubyt-code__value",
        "data-masked": !revealed || undefined,
      },
      revealed ? value : "•".repeat(Math.min(String(value).length, 24)),
    ),
    masked
      ? h(IconButton, {
          icon: revealed ? "eye-off" : "eye",
          label: revealed ? hideLabel : revealLabel,
          variant: "ghost",
          "aria-pressed": revealed,
          onClick: () => setRevealed((state) => !state),
        })
      : null,
    h(IconButton, {
      icon: copied ? "check" : "copy",
      label: copied ? copiedLabel : copyLabel,
      variant: "ghost",
      onClick: copy,
    }),
    h("span", { className: "cubyt-visually-hidden", "aria-live": "polite" }, copied ? copiedLabel : ""),
  );
}

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

export { cx };
