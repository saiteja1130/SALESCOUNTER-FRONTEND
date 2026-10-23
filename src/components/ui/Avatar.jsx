const Avatar = ({
  name,
  size = "md",
  className = "",
  showBadge = false,
  badgeColor = "green",
}) => {
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  const sizeStyles = {
    sm: "w-7 h-7 text-[11px]",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm font-semibold",
  }[size];
  const palettes = [
    "bg-slate-100 text-slate-700 border-slate-200",
    "bg-emerald-100 text-emerald-800 border-emerald-200",
    "bg-stone-100 text-stone-700 border-stone-200",
    "bg-blue-100 text-blue-800 border-blue-200",
  ];
  const charCode = name.charCodeAt(0) || 0;
  const palette = palettes[charCode % palettes.length];
  return (
    <div className={"relative inline-block shrink-0"}>
      {
        <div
          className={`flex items-center justify-center font-medium rounded-full border ${sizeStyles} ${palette} ${className}`}
        >
          {initials}
        </div>
      }
      {showBadge && (
        <span
          className={`absolute bottom-0 right-0 block w-2 h-2 rounded-full ring-2 ring-white ${badgeColor === "green" ? "bg-emerald-600" : badgeColor === "amber" ? "bg-amber-500" : "bg-slate-400"}`}
        />
      )}
    </div>
  );
};
export { Avatar };
