import { Children, cloneElement, createElement as h, isValidElement, useId } from "react";
import { cx } from "../index.js";
import { renderIcon } from "./shared.js";

/** Associates a label, control, description and validation message. */
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

export function Select({ className, children, ...rest }) {
  return h(
    "span",
    { className: "cubyt-select-wrap" },
    h("select", { ...rest, className: cx("cubyt-select", className) }, children),
  );
}

/** Label + control + hint/error. */
