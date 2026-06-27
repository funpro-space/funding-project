"use client";

import * as React from "react";
import { useRef, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

// Global helper to close other open menus
export function closeAllMenus() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("close-all-menus"));
  }
}

// Simple self-contained Slot component to avoid Radix UI dependency
interface SlotProps {
  children: React.ReactElement;
  [key: string]: unknown;
}

const Slot = React.forwardRef<HTMLElement, SlotProps>(({ children, ...props }, ref) => {
  if (!React.isValidElement(children)) {
    return null;
  }

  // Merge ref and other properties
  const childWithRef = children as React.ReactElement & { ref?: React.Ref<HTMLElement> };
  const childRef = childWithRef.ref;
  const mergedRef = (node: HTMLElement | null) => {
    if (typeof childRef === "function") {
      childRef(node);
    } else if (childRef && typeof childRef === "object" && "current" in childRef) {
      (childRef as React.MutableRefObject<HTMLElement | null>).current = node;
    }
    if (typeof ref === "function") {
      ref(node);
    } else if (ref && typeof ref === "object" && "current" in ref) {
      (ref as React.MutableRefObject<HTMLElement | null>).current = node;
    }
  };

  const childProps = children.props as Record<string, unknown>;
  const mergedProps = { ...props, ...childProps } as Record<string, unknown>;

  // Combine classNames
  if (props.className && childProps.className) {
    mergedProps.className = cn(props.className as string, childProps.className as string);
  }

  // Combine event handlers
  for (const key of Object.keys(mergedProps)) {
    if (key.startsWith("on") && typeof props[key] === "function" && typeof childProps[key] === "function") {
      const propHandler = props[key] as (e: unknown) => void;
      const childHandler = childProps[key] as (e: unknown) => void;
      mergedProps[key] = (e: unknown) => {
        propHandler(e);
        childHandler(e);
      };
    }
  }

  return React.cloneElement(children, {
    ...mergedProps,
    ref: mergedRef,
  } as React.Attributes);
});
Slot.displayName = "Slot";

// Dropdown Context
interface DropdownContextType {
  isOpen: boolean;
  close: () => void;
}
const DropdownContext = React.createContext<DropdownContextType | undefined>(undefined);

export function useDropdownContext() {
  const context = React.useContext(DropdownContext);
  if (!context) {
    throw new Error("Dropdown sub-components must be used within a DotDropdown component");
  }
  return context;
}

export interface DotDropdownProps {
  children: React.ReactNode;
  align?: "left" | "right";
  side?: "top" | "bottom";
  className?: string;
  triggerLabel?: React.ReactNode;
  triggerClassName?: string;
  asChild?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * 📦 Custom Block Dropdown
 * High-fidelity, completely self-contained, pure React animated dropdown
 * featuring a beautiful rectangular pixel-block down arrow icon that merges
 * into a single unified square block on click/open state, aligning perfectly
 * with our pixel-grid brand logo!
 */
export function DotDropdown({
  children,
  align = "right",
  side = "bottom",
  className,
  triggerLabel,
  triggerClassName,
  asChild = false,
  onOpenChange,
}: DotDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [adjustedLeft, setAdjustedLeft] = useState<number | null>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  const toggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const nextOpen = !isOpen;
      
      if (nextOpen) {
        closeAllMenus();
        if (triggerRef.current) {
          const rect = triggerRef.current.getBoundingClientRect();
          setCoords({
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height,
          });
        }
      }
      
      setIsOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [isOpen, onOpenChange]
  );

  // Prevent Radix/Dialog Modal click-outside dismissal from capturing internal portal clicks
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: Event) => {
      const target = e.target as Node;
      if (contentRef.current?.contains(target)) {
        e.stopPropagation();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("mousedown", handlePointerDown, true);
    document.addEventListener("touchstart", handlePointerDown, true);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("mousedown", handlePointerDown, true);
      document.removeEventListener("touchstart", handlePointerDown, true);
    };
  }, [isOpen]);

  // Handle auto edge-position overflow correction
  useEffect(() => {
    if (isOpen && contentRef.current) {
      const rect = contentRef.current.getBoundingClientRect();
      const padding = 16;

      if (rect.left < padding) {
        setAdjustedLeft(padding);
      } else if (rect.right > window.innerWidth - padding) {
        const overflow = rect.right - (window.innerWidth - padding);
        setAdjustedLeft(Math.max(padding, rect.left - overflow));
      }
    } else {
      setAdjustedLeft(null);
    }
  }, [isOpen, coords]);

  // Handle global menu close broadcast
  useEffect(() => {
    const handleGlobalClose = () => {
      if (isOpen) {
        close();
      }
    };
    window.addEventListener("close-all-menus", handleGlobalClose);
    return () => window.removeEventListener("close-all-menus", handleGlobalClose);
  }, [isOpen, close]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Click outside detection supporting portal architecture
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent | TouchEvent) => {
      if (!isOpen) return;

      const target = e.target as Node;
      const isInsideTrigger = containerRef.current?.contains(target);
      const isInsideContent = contentRef.current?.contains(target);

      if (!isInsideTrigger && !isInsideContent) {
        close();
      }
    };

    document.addEventListener("mousedown", handleGlobalClick, true);
    document.addEventListener("touchstart", handleGlobalClick, true);
    return () => {
      document.removeEventListener("mousedown", handleGlobalClick, true);
      document.removeEventListener("touchstart", handleGlobalClick, true);
    };
  }, [isOpen, close]);

  // Reposition portal on scroll/resize
  useEffect(() => {
    if (!isOpen) return;

    const handleUpdate = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setCoords({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    window.addEventListener("scroll", handleUpdate, true);
    window.addEventListener("resize", handleUpdate);

    return () => {
      window.removeEventListener("scroll", handleUpdate, true);
      window.removeEventListener("resize", handleUpdate);
    };
  }, [isOpen]);

  const TriggerComponent = asChild ? Slot : "button";

  let triggerChild: React.ReactNode = null;
  let contentChildren: React.ReactNode = children;

  if (asChild) {
    const childrenArray = React.Children.toArray(children);
    triggerChild = childrenArray[0];
    contentChildren = childrenArray.slice(1);
  }

  const dropdownContent = mounted ? (
    <div
      ref={contentRef}
      className={cn(
        "dot-dropdown__content",
        isOpen && "dot-dropdown--open",
        `dot-dropdown--align-${align}`,
        `dot-dropdown--side-${side}`
      )}
      data-state={isOpen ? "open" : "closed"}
      style={{
        position: "fixed",
        top: side === "bottom" ? `${coords.top - window.scrollY + coords.height + 8}px` : `${coords.top - window.scrollY - 8}px`,
        left: adjustedLeft !== null ? `${adjustedLeft - window.scrollX}px` : (align === "left" ? `${coords.left - window.scrollX}px` : "auto"),
        right: (adjustedLeft === null && align === "right" && typeof window !== "undefined") ? `${window.innerWidth - (coords.left - window.scrollX + coords.width)}px` : "auto",
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {React.Children.map(contentChildren, function mapChild(child): React.ReactNode {
        if (React.isValidElement(child)) {
          if (child.type === React.Fragment) {
            return React.Children.map((child as React.ReactElement<{ children?: React.ReactNode }>).props.children, mapChild);
          }
          // Automatically pass close helper to nested child items
          return React.cloneElement(child as React.ReactElement<{ closeMenu?: () => void }>, { closeMenu: close });
        }
        return child;
      })}
    </div>
  ) : null;

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = e.clientX - centerX;
    const y = centerY - e.clientY;
    e.currentTarget.style.setProperty("--coord-x", x.toString());
    e.currentTarget.style.setProperty("--coord-y", y.toString());
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.style.setProperty("--coord-x", "0");
    e.currentTarget.style.setProperty("--coord-y", "0");
  };

  return (
    <DropdownContext.Provider value={{ isOpen, close }}>
      <div
        ref={containerRef}
        className={cn(
          "dot-dropdown",
          isOpen && "dot-dropdown--open",
          className
        )}
      >
        <TriggerComponent
          ref={triggerRef as unknown as React.Ref<HTMLButtonElement>}
          className={cn(
            !asChild && "dot-dropdown__trigger",
            triggerClassName
          )}
          onClick={toggle}
          onPointerMove={asChild ? undefined : handlePointerMove}
          onPointerLeave={asChild ? undefined : handlePointerLeave}
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          {asChild ? triggerChild : (
            <>
              {triggerLabel && <span className="dot-dropdown__trigger-label mr-0.5">{triggerLabel}</span>}
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                <rect
                  className="rect-dropdown__block rect-dropdown__block--1"
                  x="30"
                  y="32"
                  width="16"
                  height="16"
                />
                <rect
                  className="rect-dropdown__block rect-dropdown__block--2"
                  x="54"
                  y="32"
                  width="16"
                  height="16"
                />
                <rect
                  className="rect-dropdown__block rect-dropdown__block--3"
                  x="42"
                  y="52"
                  width="16"
                  height="16"
                />
              </svg>
            </>
          )}
        </TriggerComponent>

        {mounted && createPortal(dropdownContent, document.body)}
      </div>
    </DropdownContext.Provider>
  );
}

export interface DotDropdownItemProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  closeOnClick?: boolean;
  className?: string;
  closeMenu?: () => void;
  selected?: boolean;
  disabled?: boolean;
  soon?: boolean;
}

export function DotDropdownItem({
  children,
  onClick,
  closeOnClick = true,
  className,
  closeMenu,
  selected,
  disabled,
  soon,
}: DotDropdownItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled) return;

    onClick?.(e);

    if (closeOnClick) {
      closeMenu?.();
    }
  };

  const itemElement = (
    <button
      type="button"
      className={cn("dot-dropdown__item", className)}
      onClick={handleClick}
      data-selected={selected}
      disabled={disabled}
    >
      {children}
    </button>
  );

  if (soon) {
    return (
      <div className="dot-dropdown__item-wrapper w-full flex items-center pr-2">
        {itemElement}
        <span className="dropdown-soon-badge text-[9px] font-bold tracking-wider px-1 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
          SOON
        </span>
      </div>
    );
  }

  return itemElement;
}

export function DotDropdownSeparator() {
  return <div className="dot-dropdown__separator" />;
}

export function DotDropdownTitle({ children }: { children: React.ReactNode }) {
  return <div className="dot-dropdown__title">{children}</div>;
}
