"use client";

import * as React from "react";

// Self-contained utility to merge class names without requiring external workspace imports.
function cn(...inputs: (string | undefined | null | boolean | Record<string, boolean>)[]) {
  const classes: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string") {
      classes.push(input);
    } else if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) {
          classes.push(key);
        }
      }
    }
  }
  return classes.join(" ");
}

interface ModernMenuContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registerItem: () => number;
  unregisterItem: () => void;
  layout?: "col" | "row" | "col-flow";
}

const ModernMenuContext = React.createContext<ModernMenuContextType | undefined>(undefined);

export function useModernMenu() {
  const context = React.useContext(ModernMenuContext);
  if (!context) {
    throw new Error("useModernMenu must be used within a ModernMenu component");
  }
  return context;
}

export interface ModernMenuProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  layout?: "col" | "row" | "col-flow";
}

export function ModernMenu({
  children,
  open: controlledOpen,
  onOpenChange,
  className,
  layout = "col",
}: ModernMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange]
  );

  const containerRef = React.useRef<HTMLDivElement>(null);

  // Click outside to close
  React.useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleOpenChange(false);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleOpenChange(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [open, handleOpenChange]);

  // Keep track of registered item indices for dynamic layout/transitions
  const itemCounter = React.useRef(0);

  const registerItem = React.useCallback(() => {
    const current = itemCounter.current;
    itemCounter.current += 1;
    return current;
  }, []);

  const unregisterItem = React.useCallback(() => {
    itemCounter.current = Math.max(0, itemCounter.current - 1);
  }, []);

  return (
    <DropdownContext.Provider value={{ open, onOpenChange: handleOpenChange, registerItem, unregisterItem, layout }}>
      <div
        ref={containerRef}
        data-slot="modern-menu-container"
        data-state={open ? "open" : "closed"}
        className={cn(
          "modern-menu-container relative flex items-center justify-center z-50 overflow-visible",
          open && "is-open",
          className
        )}
      >
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

// Fallback matching DropdownContext or ModernMenuContext for seamless execution
const DropdownContext = ModernMenuContext;

export interface ModernMenuTriggerProps extends React.ComponentPropsWithoutRef<"button"> {
  children?: React.ReactNode;
  showSideLight?: boolean;
  sideLightColor?: string;
  className?: string;
}

export function ModernMenuTrigger({
  children,
  showSideLight = true,
  sideLightColor,
  className,
  ...props
}: ModernMenuTriggerProps) {
  const { open, onOpenChange } = useModernMenu();

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    onOpenChange(!open);
    props.onPointerDown?.(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = e.clientX - centerX;
    const y = centerY - e.clientY;
    e.currentTarget.style.setProperty("--coord-x", x.toString());
    e.currentTarget.style.setProperty("--coord-y", y.toString());
    props.onPointerMove?.(e);
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.style.setProperty("--coord-x", "0");
    e.currentTarget.style.setProperty("--coord-y", "0");
    props.onPointerLeave?.(e);
  };

  return (
    <div className="modern-menu-trigger-wrapper w-full h-full">
      <button
        type="button"
        data-slot="modern-menu-trigger"
        data-state={open ? "open" : "closed"}
        className={cn(
          "modern-menu-button relative flex w-full h-full border-0 text-white overflow-hidden cursor-pointer transition-all duration-300",
          open && "is-open",
          className
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        {...props}
      >
        <span className="modern-menu-btn-inner relative flex w-full h-full bg-[#1a1a1a]">
          {showSideLight && (
            <span
              className="modern-menu-side-light absolute left-0 top-0 bottom-0 w-[2px] opacity-70 transition-all duration-500"
              style={{
                backgroundColor: sideLightColor,
                boxShadow: sideLightColor ? `0 0 8px ${sideLightColor}` : undefined,
              }}
            />
          )}
          <span className="modern-menu-btn-content flex flex-1 items-center pl-4 text-white">
            {children}
          </span>
          <span className="modern-menu-shine-overlay" />
        </span>
      </button>
    </div>
  );
}

export interface ModernMenuContentProps extends React.ComponentPropsWithoutRef<"div"> {
  children?: React.ReactNode;
  className?: string;
}

export function ModernMenuContent({
  children,
  className,
  ...props
}: ModernMenuContentProps) {
  const { open, layout } = useModernMenu();
  const isRow = layout === "row";
  const isColFlow = layout === "col-flow";
  const isFlowLayout = isRow || isColFlow;

  return (
    <div
      data-slot="modern-menu-content"
      data-state={open ? "open" : "closed"}
      className={cn(
        "modern-menu-content absolute z-50 pointer-events-none transition-all duration-300 pb-5",
        isFlowLayout 
          ? `is-row-layout flex ${isColFlow ? 'flex-col' : 'flex-row'} items-center justify-center gap-3 overflow-visible` 
          : "inset-0 overflow-visible",
        open && "is-open",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface ModernMenuItemProps extends React.ComponentPropsWithoutRef<"div"> {
  children?: React.ReactNode;
  index?: number;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function ModernMenuItem({
  children,
  index,
  className,
  onClick,
  ...props
}: ModernMenuItemProps) {
  const { open, onOpenChange, registerItem, unregisterItem, layout } = useModernMenu();
  const [localIndex, setLocalIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    const idx = registerItem();
    Promise.resolve().then(() => {
      setLocalIndex(idx);
    });
    return () => {
      unregisterItem();
    };
  }, [registerItem, unregisterItem]);

  const activeIndex = index !== undefined ? index : (localIndex ?? 0);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(e);
    onOpenChange(false);
  };

  const isFlow = layout === "row" || layout === "col-flow";

  // Stack elements downwards from the trigger with offset and animation delay
  const yOffset = 60 + activeIndex * 50;
  const delay = activeIndex * 100;

  const style: React.CSSProperties = isFlow
    ? {
        position: "relative",
        left: "auto",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transform: open ? "translate3d(0, 0, 0)" : "translate3d(0, -10px, 0)",
        transition: "all 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        transitionDelay: `${delay}ms`,
        zIndex: 9999,
      }
    : {
        position: "absolute",
        left: "50%",
        transform: open
          ? `translate3d(-50%, ${yOffset}px, 0)`
          : `translate3d(-50%, 0, 0)`,
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: "all 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        transitionDelay: `${delay}ms`,
        whiteSpace: "nowrap",
        zIndex: 9999,
      };

  return (
    <div
      data-slot="modern-menu-item"
      data-state={open ? "open" : "closed"}
      className={cn("modern-menu-item", className)}
      style={style}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
}
