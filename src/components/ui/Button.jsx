import { Loader2 } from "lucide-react";
const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 whitespace-nowrap shrink-0 disabled:opacity-50 disabled:pointer-events-none cursor-pointer active:scale-[0.98] select-none";
  const sizeStyles = {
    sm: "text-xs px-2.5 py-1.5 gap-1.5 h-8",
    md: "text-xs sm:text-sm px-3.5 py-2 gap-2 h-9",
    lg: "text-sm px-4 py-2.5 gap-2 h-10",
  };
  const variantStyles = {
    primary:
      "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs border border-emerald-700/80 focus-visible:ring-emerald-600/30 active:bg-emerald-800",
    secondary:
      "bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-200/60 focus-visible:ring-slate-400/30",
    outline:
      "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs focus-visible:ring-slate-300 hover:border-slate-300",
    ghost:
      "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 focus-visible:ring-slate-300",
    danger:
      "bg-rose-600 hover:bg-rose-700 text-white shadow-xs border border-rose-700/80 focus-visible:ring-rose-600/30 active:bg-rose-800",
  };
  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className={"w-3.5 h-3.5 animate-spin shrink-0"} />
      ) : (
        icon
      )}
      {children}
    </button>
  );
};
export { Button };
