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

export const Select = ({ className = '', children, ...props }) => (
  <select
    className={clsx(
      'input',
      className,
    )}
    {...props}
  >
    {children}
  </select>
);
