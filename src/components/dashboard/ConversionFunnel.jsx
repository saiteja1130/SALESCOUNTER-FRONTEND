import { useApp } from "../../context/AppContext";
const ConversionFunnel = () => {
  const { leads } = useApp();
  const stages = [
    { label: "New", count: leads.filter((l) => l.status === "New").length, color: "bg-blue-500" },
    { label: "Interested", count: leads.filter((l) => l.status === "Interested").length, color: "bg-emerald-600" },
    { label: "In-followup", count: leads.filter((l) => l.status === "In-followup").length, color: "bg-amber-500" },
    { label: "Converted", count: leads.filter((l) => l.status === "Converted").length, color: "bg-emerald-700" },
    { label: "Lost", count: leads.filter((l) => l.status === "Lost").length, color: "bg-rose-400" }
  ];
  const total = leads.length || 1;
  const convertedCount = leads.filter((l) => l.status === "Converted").length;
  const conversionRate = Math.round(convertedCount / total * 100);
  const activeCount = leads.filter((l) => l.status !== "Converted" && l.status !== "Lost").length;
  return  <div className={"bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between"}>{<div>{<div className={"flex items-center justify-between mb-4"}>{<div>{<h3 className={"text-sm font-semibold text-slate-900"}>Lead Stage Distribution</h3>}{<p className={"text-xs text-slate-500 mt-0.5"}>Active leads across conversation stages</p>}</div>}{<div className={"text-right"}>{<div className={"text-[11px] text-slate-400"}>Total Tracked</div>}{<div className={"text-sm font-semibold text-slate-900 tabular-nums"}>{leads.length} Leads</div>}</div>}</div>}{<div className={"space-y-3.5"}>{stages.map((stage) => {
        const percent = Math.round(stage.count / total * 100);
        return  <div>{<div className={"flex items-center justify-between text-xs mb-1"}>{<span className={"text-slate-600 font-medium"}>{stage.label}</span>}{<span className={"tabular-nums font-semibold text-slate-800"}>{stage.count}{" "}{<span className={"text-slate-400 font-normal"}>({percent}%)</span>}</span>}</div>}{<div className={"w-full bg-slate-100 rounded-full h-1.5 overflow-hidden"}>{<div className={`h-1.5 rounded-full transition-all duration-500 ${stage.color}`} style={{ width: `${Math.max(4, percent)}%` }} />}</div>}</div>;
      })}</div>}</div>}{<div className={"mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500"}>{<span>Conversion rate: {<strong className={"text-emerald-700 tabular-nums"}>{conversionRate}%</strong>}</span>}{<span>Active pipeline: {<strong className={"text-slate-800 tabular-nums"}>{activeCount} leads</strong>}</span>}</div>}</div>;
};
export {
  ConversionFunnel
};