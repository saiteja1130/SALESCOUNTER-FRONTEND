const Badge = ({ status, variant, children, size = "sm", showDot = true }) => {
  let displayLabel = children || status;
  let determinedVariant = variant || "neutral";
  if (status) {
    switch (status) {
      case "New":
      case "new":
        determinedVariant = "info";
        displayLabel = children || "New";
        break;
      case "Interested":
      case "intrested":
      case "Intrested":
      case "Contacted":
        determinedVariant = "emerald";
        displayLabel = children || "Interested";
        break;
      case "In-followup":
      case "in-followup":
      case "Follow-up":
        determinedVariant = "warning";
        displayLabel = children || "In-followup";
        break;
      case "Converted":
      case "converted":
        determinedVariant = "success";
        displayLabel = children || "Converted";
        break;
      case "Lost":
      case "lost":
        determinedVariant = "error";
        displayLabel = children || "Lost";
        break;
      default:
        determinedVariant = variant || "neutral";
    }
  }
  const styles = {
    neutral: {
      container: "bg-slate-50 text-slate-700 border-slate-200/80",
      dot: "bg-slate-400",
    },
    emerald: {
      container: "bg-emerald-50/80 text-emerald-800 border-emerald-200/80",
      dot: "bg-emerald-600",
    },
    success: {
      container:
        "bg-emerald-50 text-emerald-900 border-emerald-300/80 font-medium",
      dot: "bg-emerald-700",
    },
    warning: {
      container: "bg-amber-50/80 text-amber-800 border-amber-200/80",
      dot: "bg-amber-500",
    },
    error: {
      container: "bg-rose-50/80 text-rose-700 border-rose-200/80",
      dot: "bg-rose-500",
    },
    info: {
      container: "bg-blue-50/80 text-blue-800 border-blue-200/80",
      dot: "bg-blue-500",
    },
  }[determinedVariant];
  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 rounded-md font-medium border",
    md: "text-xs px-2.5 py-1 rounded-md font-medium border",
  }[size];
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 ${sizeStyles} ${styles.container}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${styles.dot}`} />
      )}
      {displayLabel}
    </span>
  );
};
export { Badge };
