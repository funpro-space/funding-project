"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonRegular2Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  theme?: "blue" | "purple" | "emerald" | "amber";
  href?: string;
  target?: string;
  rel?: string;
}

export const ButtonRegular2 = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonRegular2Props>(({
  children,
  className,
  theme = "blue",
  href,
  target,
  rel,
  ...props
}, ref) => {
  const childrenArray = React.Children.toArray(children); 
  const firstChild = childrenArray[0];
  const hasIcon = childrenArray.length > 1 && React.isValidElement(firstChild);

  const innerContent = (
    <span className="button-regular2-inner">
      {hasIcon && (
        <span className="button-regular2-icon">
          {firstChild}
        </span>
      )}
      <span className="button-regular2-text">
        {hasIcon ? childrenArray.slice(1) : children}   
      </span>
    </span>
  );

  const commonClassName = cn(
    "button-regular2",
    `theme-${theme}`,
    className
  );

  if (href) {
    const isExternal = href.startsWith('http') || href.startsWith('//');
    if (isExternal) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel || (target === "_blank" ? "noopener noreferrer" : undefined)}
          className={commonClassName}
          data-animation="bClick"
          {...(props as Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">)}
        >
          {innerContent}
        </a>
      );
    }

    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={commonClassName}
        data-animation="bClick"
        {...(props as Omit<React.ComponentPropsWithoutRef<typeof Link>, "href">)}
      >
        {innerContent}
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={commonClassName}
      data-animation="bClick"
      {...props}
    >
      {innerContent}
    </button>
  );
})

ButtonRegular2.displayName = "ButtonRegular2";
