"use client"

import * as React from "react"
import { createPortal } from "react-dom"

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

interface ModalContextType {
  open: boolean;
  shouldRender: boolean;
  onOpenChange: (open: boolean) => void;
}

const ModalContext = React.createContext<ModalContextType | undefined>(undefined);

export function useModal() {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a Modal component");
  }
  return context;
}

export interface ModalProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Modal({
  children,
  open = false,
  onOpenChange,
}: ModalProps) {
  const [shouldRender, setShouldRender] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      const handle = requestAnimationFrame(() => setShouldRender(true));
      return () => cancelAnimationFrame(handle);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200); // Matches longest close duration in css (overlay fade-out is 200ms)
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      onOpenChange?.(nextOpen);
    },
    [onOpenChange]
  );

  return (
    <ModalContext.Provider value={{ open, shouldRender, onOpenChange: handleOpenChange }}>
      {children}
    </ModalContext.Provider>
  );
}

export function ModalPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  const { shouldRender } = useModal();

  React.useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  if (!mounted || !shouldRender) return null;

  return createPortal(children, document.body);
}

export function ModalOverlay({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { open } = useModal();

  return (
    <div
      data-slot="modal-overlay"
      data-state={open ? "open" : "closed"}
      className={cn("fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-all duration-300", className)}
      {...props}
    />
  );
}

export function ModalContent({
  className,
  children,
  showCloseButton = true,
  size = "default",
  padding = "default",
  isLoading = false,
  overlayClassName,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean;
  size?: "default" | "wide" | "compact" | "full";
  padding?: "default" | "none";
  isLoading?: boolean;
  overlayClassName?: string;
}) {
  const { open, shouldRender, onOpenChange } = useModal();

  // Prevent scroll when open
  React.useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  // Handle ESC key to close modal
  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  if (!shouldRender) return null;

  return (
    <ModalPortal>
      <ModalOverlay className={overlayClassName} />
      <div
        className="fixed inset-0 z-[10000] flex items-center justify-center p-4 overflow-y-auto pointer-events-none"
      >
        <div
          data-slot="modal-content"
          data-modal-size={size === "default" ? undefined : size}
          data-modal-padding={padding === "default" ? undefined : padding}
          data-loading={isLoading ? "true" : undefined}
          data-state={open ? "open" : "closed"}
          className={cn(
            "relative z-[10000] w-full bg-background border rounded-lg shadow-lg flex flex-col transition-all duration-300 pointer-events-auto",
            className
          )}
          onClick={(e) => e.stopPropagation()}
          style={{
            height: isLoading
              ? size === "wide"
                ? "min(85vh, 42rem)"
                : "min(85vh, 20rem)"
              : undefined,
          }}
          {...props}
        >
          <div
            className="modal-content-wrapper flex flex-1 flex-col min-h-0 overflow-hidden w-full"
            data-loading={isLoading ? "true" : undefined}
            data-modal-wide={size === "wide" ? "true" : undefined}
          >
            {isLoading && (
              <div className="modal-loader-overlay absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <div className="modal-spinner w-10 h-10 border-4 border-white/20 border-t-white" />
                </div>
              </div>
            )}
            <div
              className={cn(
                "modal-content--revealed flex flex-1 flex-col min-h-0 overflow-hidden w-full",
                isLoading && "sr-only"
              )}
            >
              {children}
            </div>
          </div>
          {showCloseButton && (
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="modal-close-block-btn"
              aria-label="Close"
            >
              <svg
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5 overflow-visible"
              >
                <rect
                  className="rect-close__block rect-close__block--center"
                  x="42"
                  y="42"
                  width="22"
                  height="22"
                />
                <rect
                  className="rect-close__block rect-close__block--top-left"
                  x="22"
                  y="22"
                  width="22"
                  height="22"
                />
                <rect
                  className="rect-close__block rect-close__block--top-right"
                  x="62"
                  y="22"
                  width="22"
                  height="22"
                />
                <rect
                  className="rect-close__block rect-close__block--bottom-left"
                  x="22"
                  y="62"
                  width="22"
                  height="22"
                />
                <rect
                  className="rect-close__block rect-close__block--bottom-right"
                  x="62"
                  y="62"
                  width="22"
                  height="22"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </ModalPortal>
  );
}

export function ModalHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

export function ModalFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

export function ModalBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="modal-body" className={cn(className)} {...props} />;
}

export function ModalTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="modal-title gradient-text"
      className={cn(className)}
      {...props}
    />
  );
}

export function ModalDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="modal-description"
      className={cn(className)}
      {...props}
    />
  );
}

export function ModalClose({ children, ...props }: { children: React.ReactNode }) {
  const { onOpenChange } = useModal();
  
  if (!React.isValidElement(children)) {
    return <>{children}</>;
  }

  const childProps = children.props as Record<string, unknown>;

  return React.cloneElement(children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>, {
    onClick: (e: React.MouseEvent) => {
      onOpenChange(false);
      if (typeof childProps.onClick === "function") {
        childProps.onClick(e);
      }
    },
    ...props
  });
}

export function ModalCloseButton({ className, ...props }: React.ComponentProps<"button">) {
  const { onOpenChange } = useModal();
  return (
    <button
      type="button"
      onClick={() => onOpenChange(false)}
      data-slot="modal-close"
      className={cn(
        "group relative flex items-center justify-center rounded-full transition-all duration-300 shrink-0 size-11 bg-transparent border-none p-0 text-foreground",
        className
      )}
      aria-label="Close"
      {...props}
    >
      <div className="relative size-6 flex items-center justify-center pointer-events-none">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-[2.8px] bg-current group-hover:bg-foreground rounded-full transition-all duration-300 ease-in-out rotate-45 group-hover:rotate-0 group-hover:w-[5px] group-hover:h-[5px]" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-[2.8px] bg-current group-hover:bg-foreground rounded-full transition-all duration-300 ease-in-out -rotate-45 group-hover:rotate-0 group-hover:w-[5px] group-hover:h-[5px]" />
        </div>
      </div>
    </button>
  );
}
