import { Button } from "./Button";
const EmptyState = ({ icon, title, description, actionLabel, onAction }) => {
  return (
    <div
      className={
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-xl border border-slate-200"
      }
    >
      {
        <div
          className={
            "w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-4"
          }
        >
          {icon}
        </div>
      }
      {<h3 className={"text-sm font-semibold text-slate-900"}>{title}</h3>}
      {<p className={"mt-1 text-xs text-slate-500 max-w-sm"}>{description}</p>}
      {actionLabel && onAction && (
        <div className={"mt-5"}>
          {
            <Button size={"sm"} onClick={onAction}>
              {actionLabel}
            </Button>
          }
        </div>
      )}
    </div>
  );
};
export { EmptyState };
