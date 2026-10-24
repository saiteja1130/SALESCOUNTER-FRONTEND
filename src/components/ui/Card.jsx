const Card = ({
  children,
  className = "",
  onClick,
  hoverable = false,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`bg-white rounded-xl border border-slate-200/90 shadow-xs transition-all duration-150 ${
        hoverable || onClick
          ? "hover:border-slate-300 hover:shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = "", action }) => {
  return (
    <div
      className={`p-5 sm:p-6 pb-3 sm:pb-4 border-b border-slate-100 flex items-start justify-between gap-3 ${className}`}
    >
      <div className="min-w-0 flex-1">{children}</div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

const CardTitle = ({ children, className = "" }) => {
  return (
    <h3
      className={`text-base font-semibold text-slate-900 tracking-tight ${className}`}
    >
      {children}
    </h3>
  );
};

const CardDescription = ({ children, className = "" }) => {
  return (
    <p className={`text-xs text-slate-500 mt-1 leading-relaxed ${className}`}>
      {children}
    </p>
  );
};

const CardContent = ({ children, className = "", noPadding = false }) => {
  return (
    <div className={`${noPadding ? "" : "p-5 sm:p-6"} ${className}`}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = "" }) => {
  return (
    <div
      className={`p-4 sm:px-6 bg-slate-50/60 border-t border-slate-100 rounded-b-xl flex items-center justify-between gap-3 text-xs ${className}`}
    >
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
