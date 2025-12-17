import clsx from 'clsx';

export const Card = ({ title, description, actions, className = '', children, highlight = false }) => (
  <div
    className={clsx(
      'glass-panel p-5 md:p-6 space-y-4 relative overflow-hidden',
      highlight && 'border-primary-300/40 shadow-brand',
      className,
    )}
  >
    {(title || description || actions) && (
      <div className="flex items-start gap-3 justify-between">
        <div>
          {title && <h3 className="text-lg font-semibold text-white leading-tight">{title}</h3>}
          {description && <p className="text-[14px] text-slate-300 mt-1 leading-relaxed">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    )}
    {children}
  </div>
);
