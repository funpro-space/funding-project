"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonRegularProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "accent";
  href?: string;
  target?: string;
  rel?: string;
}

export const ButtonRegular = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonRegularProps>(({
  children,
  className,
  variant = "default",
  href,
  target,
  rel,
  ...props
}, ref) => {
  const childrenArray = React.Children.toArray(children); 
  const firstChild = childrenArray[0];
  const hasIcon = childrenArray.length > 1 && React.isValidElement(firstChild);

  const innerContent = (
    <>
      <div className="button-regular-overlay" />
      <span className="button-regular-inner">
        {hasIcon && (
          <div className="button-regular-icon">
            {firstChild}
          </div>
        )}
        <span className="button-regular-text">
          {hasIcon ? childrenArray.slice(1) : children}   
        </span>
      </span>
    </>
  );

  const commonClassName = cn("button-regular shimmer-effect", variant, className);

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
ButtonRegular.displayName = "ButtonRegular";
