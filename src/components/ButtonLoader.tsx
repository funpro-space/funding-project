"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonLoaderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
}

export const ButtonLoader = React.forwardRef<HTMLButtonElement, ButtonLoaderProps>(({
  isLoading = false,
  children,
  className,
  disabled,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      className={cn("btn-loader", isLoading && "is-loading", className)}
      disabled={disabled || isLoading}
      data-animation="bClick"
      {...props}
    >
      <span className="btn-loader-text">
        {children}
      </span>
      <span className="btn-loader-overlay">
        <i className="loader-rectangles">Loading...</i>
      </span>
    </button>
  );
});

ButtonLoader.displayName = "ButtonLoader";
