import { useLayoutEffect, useState } from "react";

const VIEWPORT_GUTTER = 8;
const MENU_GAP = 6;
const MENU_MAX_HEIGHT = 280;

/** Keep a fixed dropdown inside the visible viewport. */
export function useDropdownPosition({ open, triggerRef, menuRef, placement, align }) {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, maxHeight: MENU_MAX_HEIGHT });

  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !menuRef.current) return undefined;

    const updatePosition = () => {
      const trigger = triggerRef.current;
      const menu = menuRef.current;
      if (!trigger || !menu) return;

      const rect = trigger.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = document.documentElement.clientHeight;
      const below = Math.max(0, viewportHeight - rect.bottom - MENU_GAP - VIEWPORT_GUTTER);
      const above = Math.max(0, rect.top - MENU_GAP - VIEWPORT_GUTTER);
      const measuredHeight = Math.min(menu.scrollHeight, MENU_MAX_HEIGHT);
      const preferAbove = placement === "top"
        || (placement === "auto" && below < measuredHeight && above > below);
      const availableHeight = preferAbove ? above : below;
      const maxHeight = Math.max(96, Math.min(MENU_MAX_HEIGHT, availableHeight));
      const height = Math.min(measuredHeight, maxHeight);
      const width = Math.min(
        Math.max(rect.width, menu.scrollWidth),
        viewportWidth - VIEWPORT_GUTTER * 2,
      );
      const desiredLeft = align === "start" ? rect.left : rect.right - width;
      const left = Math.max(
        VIEWPORT_GUTTER,
        Math.min(desiredLeft, viewportWidth - width - VIEWPORT_GUTTER),
      );
      const top = preferAbove
        ? Math.max(VIEWPORT_GUTTER, rect.top - MENU_GAP - height)
        : Math.min(viewportHeight - height - VIEWPORT_GUTTER, rect.bottom + MENU_GAP);

      setPosition({ top, left, width, maxHeight });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, triggerRef, menuRef, placement, align]);

  return position;
}
