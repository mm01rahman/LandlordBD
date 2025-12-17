import { forwardRef } from 'react';
import clsx from 'clsx';

const variants = {
  default:
    'bg-primary-600 text-slate-50 shadow-brand hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-500/25',
  ghost: 'bg-transparent text-slate-100 border border-transparent hover:bg-white/5 hover:border-white/10',
  outline: 'border border-white/15 text-slate-100 hover:border-primary-400 hover:text-white hover:bg-primary-500/10',
  subtle: 'bg-white/5 text-slate-100 border border-white/5 hover:bg-white/10',
};

const sizes = {
  sm: 'px-3.5 py-2 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
};

export const Button = forwardRef(
  ({ variant = 'default', size = 'md', className = '', children, asChild = false, href, ...props }, ref) => {
    const Component = asChild && href ? 'a' : 'button';
    return (
      <Component
        ref={ref}
        href={href}
        className={clsx(
          'rounded-xl font-semibold transition transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface inline-flex items-center justify-center gap-2',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Button.displayName = 'Button';
