import { useEffect } from "react";
import { X } from "lucide-react";

const Drawer = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = "md",
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClass = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-xl",
    xl: "max-w-2xl",
  }[width] || "max-w-lg";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
          onClick={onClose}
        />
        <div className="fixed inset-y-0 right-0 pl-6 sm:pl-10 max-w-full flex">
          <div
            className={`w-screen ${widthClass} bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200`}
          >
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between bg-white shrink-0">
              <div className="pr-4 min-w-0">
                <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer -mr-1 -mt-1"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 sm:p-6">{children}</div>

            {footer && (
              <div className="p-4 sm:px-6 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { Drawer };
