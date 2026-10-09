import { createElement as h, useEffect, useRef, useState } from "react";
import { copyText, cx } from "../index.js";
import { IconButton } from "./button.js";

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
