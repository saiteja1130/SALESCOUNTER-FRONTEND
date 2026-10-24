import React from "react";
import { ChevronDown } from "lucide-react";

const Select = React.forwardRef(
  (
    { label, error, helper, options, children, className = "", id, ...props },
    ref
  ) => {
    const selectId =
      id || (label ? label.toLowerCase().replace(/[^a-z0-9]+/g, "-") : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-medium text-slate-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={`w-full text-sm rounded-lg border bg-white px-3 py-2 pr-9 text-slate-900 transition-colors appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
              error
                ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20"
                : "border-slate-200"
            } ${className}`}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
        {helper && !error && (
          <p className="mt-1 text-xs text-slate-500">{helper}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };