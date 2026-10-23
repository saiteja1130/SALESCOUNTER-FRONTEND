import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
const ToastContext = createContext(void 0);
const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback((message, type = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4e3);
  }, []);
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
  return  <ToastContext.Provider value={{ showToast }}>{children}{<div className={"fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"}>{toasts.map((toast) =>  <div className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg text-sm transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${toast.type === "success" ? "bg-white border-emerald-200 text-slate-800" : toast.type === "error" ? "bg-white border-red-200 text-slate-800" : "bg-white border-blue-200 text-slate-800"}`}>{toast.type === "success" &&  <CheckCircle2 className={"w-5 h-5 text-emerald-600 shrink-0 mt-0.5"} />}{toast.type === "error" &&  <AlertCircle className={"w-5 h-5 text-red-600 shrink-0 mt-0.5"} />}{toast.type === "info" &&  <Info className={"w-5 h-5 text-blue-600 shrink-0 mt-0.5"} />}{<div className={"flex-1 font-medium"}>{toast.message}</div>}{<button onClick={() => removeToast(toast.id)} className={"text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"}>{<X className={"w-4 h-4"} />}</button>}</div>)}</div>}</ToastContext.Provider>;
};
function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
export {
  ToastProvider,
  useToast
};