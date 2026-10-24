import { useEffect } from "react";
import { X } from "lucide-react";

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "md",
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

  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  }[maxWidth] || "max-w-md";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
          onClick={onClose}
        />
        <div
          className={`relative transform overflow-hidden rounded-2xl bg-white text-left shadow-modal transition-all w-full my-8 border border-slate-200 animate-in fade-in zoom-in-95 duration-150 ${maxWidthClass}`}
        >
          <div className="flex items-start justify-between p-5 sm:p-6 border-b border-slate-100">
            <div>
              <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                {title}
              </h3>
              {description && (
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 hover:bg-slate-100 transition-colors cursor-pointer -mr-1 -mt-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 sm:p-6 max-h-[calc(85vh-130px)] overflow-y-auto">
            {children}
          </div>

          {footer && (
            <div className="flex items-center justify-end gap-2.5 px-5 sm:px-6 py-4 bg-slate-50/80 border-t border-slate-100 rounded-b-2xl">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { Modal };
