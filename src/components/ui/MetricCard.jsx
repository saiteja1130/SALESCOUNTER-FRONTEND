const MetricCard = ({
  label,
  value,
  subValue,
  trend,
  progress,
  icon,
  onClick,
  ariaLabel,
  className = "",
}) => {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel || (onClick ? `View ${label}` : undefined)}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={`bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between transition-all duration-150 ${
        onClick
          ? "cursor-pointer hover:border-slate-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          : ""
      } ${className}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {label}
          </span>
          {icon && (
            <div className="text-slate-400 p-1.5 bg-slate-50 rounded-lg border border-slate-100 shrink-0">
              {icon}
            </div>
          )}
        </div>

        <div className="mt-3 flex items-baseline gap-2.5 flex-wrap">
          <span className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight tabular-nums leading-none">
            {value}
          </span>
          {trend && (
            <span
              className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded tabular-nums ${
                trend.isPositive
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                  : "bg-slate-50 text-slate-600 border border-slate-200/60"
              }`}
            >
              {trend.value}
            </span>
          )}
        </div>

        {subValue && (
          <p className="mt-1.5 text-xs text-slate-500 font-normal leading-relaxed">
            {subValue}
          </p>
        )}
      </div>

      {progress && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span>{progress.label || "Daily Limit"}</span>
            <span className="tabular-nums font-semibold text-slate-700">
              {progress.current} / {progress.total}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(
                  100,
                  Math.round((progress.current / progress.total) * 100)
                )}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export { MetricCard };
