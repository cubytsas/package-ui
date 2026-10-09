import { cloneElement, createElement as h, isValidElement, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cx } from "../index.js";

const VIEWPORT_MARGIN = 8;
const TOOLTIP_GAP = 8;

function positionTooltip(anchorElement, tooltipElement, placement) {
  const anchor = anchorElement.getBoundingClientRect();
  const tip = tooltipElement.getBoundingClientRect();
  const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
  const viewportHeight = document.documentElement.clientHeight || window.innerHeight;
  const roomAbove = anchor.top - TOOLTIP_GAP - VIEWPORT_MARGIN;
  const roomBelow = viewportHeight - anchor.bottom - TOOLTIP_GAP - VIEWPORT_MARGIN;
  let resolved = placement;

  if (resolved === "auto") resolved = roomBelow >= tip.height || roomBelow >= roomAbove ? "bottom" : "top";
  else if (resolved === "top" && tip.height > roomAbove && roomBelow > roomAbove) resolved = "bottom";
  else if (resolved === "bottom" && tip.height > roomBelow && roomAbove > roomBelow) resolved = "top";

  const targetTop = resolved === "top"
    ? anchor.top - tip.height - TOOLTIP_GAP
    : anchor.bottom + TOOLTIP_GAP;
  const maxTop = Math.max(VIEWPORT_MARGIN, viewportHeight - tip.height - VIEWPORT_MARGIN);
  const targetLeft = anchor.left + anchor.width / 2 - tip.width / 2;
  const maxLeft = Math.max(VIEWPORT_MARGIN, viewportWidth - tip.width - VIEWPORT_MARGIN);
  return {
    top: Math.min(Math.max(targetTop, VIEWPORT_MARGIN), maxTop),
    left: Math.min(Math.max(targetLeft, VIEWPORT_MARGIN), maxLeft),
  };
}

/** Small branded tooltip with viewport-aware placement and dialog-safe layering. */
export function Tooltip({ label, children, className, placement = "auto" }) {
  const id = useId();
  const anchorRef = useRef(null);
  const tooltipRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState(null);

  useLayoutEffect(() => {
    if (!visible || !anchorRef.current || !tooltipRef.current) return undefined;
    const update = () => {
      if (!anchorRef.current || !tooltipRef.current) return;
      const next = positionTooltip(anchorRef.current, tooltipRef.current, placement);
      setPosition((current) => current?.left === next.left && current?.top === next.top ? current : next);
    };
    update();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    observer?.observe(anchorRef.current);
    observer?.observe(tooltipRef.current);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [label, placement, visible]);

  const describedBy = visible
    ? cx(isValidElement(children) && children.props["aria-describedby"], id)
    : undefined;
  const trigger = isValidElement(children)
    ? cloneElement(children, { "aria-describedby": describedBy })
    : children;
  const portalRoot = visible
    ? anchorRef.current?.closest("dialog[open]") ?? (typeof document === "undefined" ? null : document.body)
    : null;
  const tooltip = visible && portalRoot
    ? createPortal(
        h("span", {
          ref: tooltipRef,
          id,
          role: "tooltip",
          className: "cubyt-tooltip",
          style: {
            left: position?.left ?? VIEWPORT_MARGIN,
            top: position?.top ?? VIEWPORT_MARGIN,
            visibility: position ? "visible" : "hidden",
          },
        }, label),
        portalRoot,
      )
    : null;

  return h(
    "span",
    {
      ref: anchorRef,
      className: cx("cubyt-tooltip-anchor", className),
      onMouseEnter: () => setVisible(true),
      onMouseLeave: () => { setVisible(false); setPosition(null); },
      onFocusCapture: () => setVisible(true),
      onBlurCapture: () => { setVisible(false); setPosition(null); },
    },
    trigger,
    tooltip,
  );
}
