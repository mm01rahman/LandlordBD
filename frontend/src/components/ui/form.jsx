import clsx from 'clsx';

export const Label = ({ children, className = '', ...props }) => (
  <label className={clsx('text-sm font-semibold text-slate-200 leading-relaxed', className)} {...props}>
    {children}
  </label>
);

export const Input = ({ className = '', ...props }) => (
  <input
    className={clsx(
      'input',
      className,
    )}
    {...props}
  />
);

export const Textarea = ({ className = '', ...props }) => (
  <textarea
    className={clsx(
      'input min-h-[120px]',
      className,
    )}
    {...props}
  />
);

export const Select = ({ className = '', ...props }) => (
  <select
    {...props}
    className={`w-full rounded-md border border-white/10 bg-slate-900 text-slate-100
      px-3 py-2 text-sm shadow-sm
      focus:outline-none focus:ring-2 focus:ring-emerald-500/40
      focus:border-emerald-500/40
      disabled:opacity-50
      ${className}`}
  />
);
