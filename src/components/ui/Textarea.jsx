import React from "react";

const Textarea = React.forwardRef(
  (
    {
      label,
      error,
      helper,
      rows = 3,
      maxLength,
      value,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const textareaId =
      id || (label ? label.toLowerCase().replace(/[^a-z0-9]+/g, "-") : undefined);

    const currentLength = typeof value === "string" ? value.length : 0;

    return (
      <div className="w-full">
        {label && (
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor={textareaId}
              className="block text-xs font-medium text-slate-700"
            >
              {label}
            </label>
            {maxLength && (
              <span className="text-xs text-slate-400 tabular-nums font-mono">
                {currentLength}/{maxLength}
              </span>
            )}
          </div>
        )}
        <div className="relative rounded-lg shadow-2xs">
          <textarea
            id={textareaId}
            ref={ref}
            rows={rows}
            maxLength={maxLength}
            value={value}
            className={`w-full text-sm rounded-lg border bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed resize-y ${
              error
                ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20"
                : "border-slate-200"
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
        {helper && !error && (
          <p className="mt-1 text-xs text-slate-500">{helper}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
