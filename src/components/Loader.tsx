"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface LoaderProps {
  className?: string;
  text?: string;
  showText?: boolean;
  fullscreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
  className,
  text = "Loading workspace...",
  showText = true,
  fullscreen = false,
}) => {
  return (
    <div
      className={cn(
        "funpro-loader-container",
        fullscreen && "full-screen",
        className
      )}
    >
      <div className="loader-rectangles" role="status" aria-label="Loading">
        Loading...
      </div>
      {showText && text && <p className="funpro-loader-text">{text}</p>}
    </div>
  );
};

export default Loader;
