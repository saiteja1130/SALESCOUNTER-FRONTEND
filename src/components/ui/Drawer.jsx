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
  }[width];
  return (
    <div className={"fixed inset-0 z-50 overflow-hidden"}>
      {
        <div className={"absolute inset-0 overflow-hidden"}>
          {
            <div
              className={
                "absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
              }
              onClick={onClose}
            />
          }
          {
            <div className={"fixed inset-y-0 right-0 pl-10 max-w-full flex"}>
              {
                <div
                  className={`w-screen ${widthClass} bg-white shadow-2xl flex flex-col border-l border-slate-200 transition-transform duration-200`}
                >
                  {
                    <div
                      className={
                        "p-5 border-b border-slate-200 flex items-start justify-between bg-white"
                      }
                    >
                      {
                        <div className={"pr-4"}>
                          {
                            <h2
                              className={
                                "text-base font-semibold text-slate-900"
                              }
                            >
                              {title}
                            </h2>
                          }
                          {subtitle && (
                            <p className={"text-xs text-slate-500 mt-0.5"}>
                              {subtitle}
                            </p>
                          )}
                        </div>
                      }
                      {
                        <button
                          onClick={onClose}
                          className={
                            "text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                          }
                        >
                          {<X className={"w-5 h-5"} />}
                        </button>
                      }
                    </div>
                  }
                  {
                    <div className={"flex-1 overflow-y-auto p-5"}>
                      {children}
                    </div>
                  }
                  {footer && (
                    <div
                      className={
                        "p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5"
                      }
                    >
                      {footer}
                    </div>
                  )}
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  );
};
export { Drawer };
