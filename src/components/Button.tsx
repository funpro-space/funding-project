import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', href, className = '', children, ...props }, ref) => {
    const classNames = `btn-base btn-${variant} btn-${size} ${className}`.trim();

    if (href) {
      const isExternal = href.startsWith('http') || href.startsWith('//');
      if (isExternal) {
        return (
          <a
            href={href}
            className={classNames}
            target="_blank"
            rel="noopener noreferrer"
            {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            {children}
          </a>
        );
      }

      return (
        <Link
          href={href}
          className={classNames}
          {...(props as unknown as Omit<React.ComponentProps<typeof Link>, 'href'>)}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classNames}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
