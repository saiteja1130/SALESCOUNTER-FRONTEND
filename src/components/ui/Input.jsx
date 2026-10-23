import React from "react";
const Input = React.forwardRef(
  ({ label, error, helper, icon, className = "", id, ...props }, ref) => {
    const inputId =
      id || (label ? label.toLowerCase().replace(/\s+/g, "-") : void 0);
    return (
      <div className={"w-full"}>
        {label && (
          <label
            htmlFor={inputId}
            className={"block text-xs font-medium text-slate-700 mb-1.5"}
          >
            {label}
          </label>
        )}
        {
          <div className={"relative rounded-lg shadow-2xs"}>
            {icon && (
              <div
                className={
                  "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"
                }
              >
                {icon}
              </div>
            )}
            {
              <input
                id={inputId}
                re={ref}
                className={`w-full text-sm rounded-lg border bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 disabled:bg-slate-50 disabled:text-slate-500 ${icon ? "pl-9" : ""} ${error ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200"} ${className}`}
                {...props}
              />
            }
          </div>
        }
        {error && <p className={"mt-1 text-xs text-red-600"}>{error}</p>}
        {helper && !error && (
          <p className={"mt-1 text-xs text-slate-500"}>{helper}</p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
export { Input };
