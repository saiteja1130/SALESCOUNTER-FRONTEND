import { useState } from "react";
const DATA_BY_RANGE = {
  today: {
    label: "Today (Hourly Activity)",
    totalLeads: 18,
    totalChats: 84,
    data: [
      { day: "09:00", leads: 2, aiChats: 8 },
      { day: "11:00", leads: 4, aiChats: 16 },
      { day: "13:00", leads: 3, aiChats: 22 },
      { day: "15:00", leads: 5, aiChats: 18 },
      { day: "17:00", leads: 3, aiChats: 14 },
      { day: "Now", leads: 1, aiChats: 6 }
    ]
  },
  "7d": {
    label: "Past 7 Days (Daily Inbound)",
    totalLeads: 184,
    totalChats: 650,
    data: [
      { day: "Sat", leads: 14, aiChats: 48 },
      { day: "Sun", leads: 11, aiChats: 36 },
      { day: "Mon", leads: 26, aiChats: 92 },
      { day: "Tue", leads: 31, aiChats: 110 },
      { day: "Wed", leads: 28, aiChats: 98 },
      { day: "Thu", leads: 35, aiChats: 124 },
      { day: "Fri (Today)", leads: 39, aiChats: 142 }
    ]
  },
  "30d": {
    label: "Past 30 Days (Weekly Performance)",
    totalLeads: 742,
    totalChats: 2810,
    data: [
      { day: "Week 1", leads: 154, aiChats: 610 },
      { day: "Week 2", leads: 182, aiChats: 690 },
      { day: "Week 3", leads: 195, aiChats: 730 },
      { day: "Week 4", leads: 211, aiChats: 780 }
    ]
  },
  all: {
    label: "All Time (Monthly Growth)",
    totalLeads: 2180,
    totalChats: 8940,
    data: [
      { day: "Nov", leads: 240, aiChats: 980 },
      { day: "Dec", leads: 310, aiChats: 1220 },
      { day: "Jan", leads: 390, aiChats: 1540 },
      { day: "Feb", leads: 460, aiChats: 1890 },
      { day: "Mar", leads: 520, aiChats: 2150 },
      { day: "Apr", leads: 620, aiChats: 2560 }
    ]
  }
};
const LeadsChart = ({ timeRange = "7d" }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [activeMetric, setActiveMetric] = useState("both");
  const activeSet = DATA_BY_RANGE[timeRange] || DATA_BY_RANGE["7d"];
  const data = activeSet.data;
  const maxLeads = Math.max(...data.map((d) => d.leads), 10);
  const maxChats = Math.max(...data.map((d) => d.aiChats), 20);
  const maxVal = Math.ceil(Math.max(maxLeads, maxChats) * 1.15);
  const height = 180;
  const width = 500;
  const paddingX = 35;
  const paddingY = 25;
  const getX = (idx) => paddingX + idx / Math.max(1, data.length - 1) * (width - 2 * paddingX);
  const getY = (val) => height - paddingY - val / maxVal * (height - 2 * paddingY);
  const leadsPoints = data.map((d, i) => `${getX(i)},${getY(d.leads)}`).join(" ");
  const chatsPoints = data.map((d, i) => `${getX(i)},${getY(d.aiChats)}`).join(" ");
  const leadsArea = `${getX(0)},${height - paddingY} ${leadsPoints} ${getX(data.length - 1)},${height - paddingY}`;
  const chatsArea = `${getX(0)},${height - paddingY} ${chatsPoints} ${getX(data.length - 1)},${height - paddingY}`;
  const gridSteps = [0, Math.round(maxVal * 0.25), Math.round(maxVal * 0.5), Math.round(maxVal * 0.75), maxVal];
  return  <div className={"bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs"}>{<div className={"flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4"}>{<div>{<div className={"flex items-center gap-2"}>{<h3 className={"text-sm font-semibold text-slate-900"}>WhatsApp Inbound &amp; AI Volume</h3>}{<span className={"text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60"}>{activeSet.label}</span>}</div>}{<p className={"text-xs text-slate-500 mt-0.5"}>Automated AI qualification vs manual human handoffs</p>}</div>}{<div className={"flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs self-start sm:self-auto border border-slate-200/60"}>{<button onClick={() => setActiveMetric("both")} className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${activeMetric === "both" ? "bg-white text-slate-900 shadow-2xs font-semibold" : "text-slate-600 hover:text-slate-900"}`}>All Activity</button>}{<button onClick={() => setActiveMetric("leads")} className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${activeMetric === "leads" ? "bg-white text-emerald-800 shadow-2xs font-semibold" : "text-slate-600 hover:text-slate-900"}`}>Leads</button>}{<button onClick={() => setActiveMetric("chats")} className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${activeMetric === "chats" ? "bg-white text-blue-800 shadow-2xs font-semibold" : "text-slate-600 hover:text-slate-900"}`}>AI Messages</button>}</div>}</div>}{<div className={"relative w-full overflow-hidden select-none"}>{<svg viewBox={`0 0 ${width} ${height}`} className={"w-full h-48 sm:h-56 select-none overflow-visible"}>{<defs>{<linearGradient id={"chatsGradient"} x1={"0"} y1={"0"} x2={"0"} y2={"1"}>{<stop offset={"0%"} stopColor={"#2563EB"} stopOpacity={"0.12"} />}{<stop offset={"100%"} stopColor={"#2563EB"} stopOpacity={"0.0"} />}</linearGradient>}{<linearGradient id={"leadsGradient"} x1={"0"} y1={"0"} x2={"0"} y2={"1"}>{<stop offset={"0%"} stopColor={"#059669"} stopOpacity={"0.15"} />}{<stop offset={"100%"} stopColor={"#059669"} stopOpacity={"0.0"} />}</linearGradient>}</defs>}{gridSteps.map((val) =>  <g>{<line x1={paddingX} y1={getY(val)} x2={width - paddingX} y2={getY(val)} stroke={"#F1F5F9"} strokeWidth={"1"} />}{<text x={paddingX - 8} y={getY(val) + 3} textAnchor={"end"} className={"text-[10px] fill-slate-400 tabular-nums font-mono"}>{val}</text>}</g>)}{(activeMetric === "both" || activeMetric === "chats") &&  <Fragment>{<polygon points={chatsArea} fill={"url(#chatsGradient)"} />}{<polyline fill={"none"} stroke={"#2563EB"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} points={chatsPoints} />}</Fragment>}{(activeMetric === "both" || activeMetric === "leads") &&  <Fragment>{<polygon points={leadsArea} fill={"url(#leadsGradient)"} />}{<polyline fill={"none"} stroke={"#059669"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} points={leadsPoints} />}</Fragment>}{data.map((d, i) => {
              const x = getX(i);
              const yChat = getY(d.aiChats);
              const yLead = getY(d.leads);
              const isHovered = hoveredIdx === i;
              return  <g>{isHovered &&  <line x1={x} y1={paddingY} x2={x} y2={height - paddingY} stroke={"#94A3B8"} strokeWidth={"1"} strokeDasharray={"3 3"} />}{(activeMetric === "both" || activeMetric === "chats") &&  <circle cx={x} cy={yChat} r={isHovered ? 4.5 : 3} fill={"#FFFFFF"} stroke={"#2563EB"} strokeWidth={"2"} className={"transition-all duration-150"} />}{(activeMetric === "both" || activeMetric === "leads") &&  <circle cx={x} cy={yLead} r={isHovered ? 4.5 : 3} fill={"#FFFFFF"} stroke={"#059669"} strokeWidth={"2"} className={"transition-all duration-150"} />}{<text x={x} y={height - 6} textAnchor={"middle"} className={`text-[11px] ${isHovered ? "fill-slate-900 font-semibold" : "fill-slate-500"}`}>{d.day}</text>}{<rect x={x - 25} y={0} width={50} heigh={height} fill={"transparent"} className={"cursor-pointer"} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)} />}</g>;
            })}</svg>}{hoveredIdx !== null && data[hoveredIdx] &&  <div className={"absolute top-2 bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl pointer-events-none transition-all duration-75 z-20 border border-slate-800"} style={{
            left: `${Math.min(72, Math.max(8, hoveredIdx / Math.max(1, data.length - 1) * 75 + 8))}%`
          }}>{<div className={"font-medium text-slate-300 border-b border-slate-800 pb-1 mb-1.5 text-xs"}>{data[hoveredIdx].day}</div>}{<div className={"flex items-center justify-between gap-4 text-emerald-400 text-xs"}>{<span>New Leads:</span>}{<span className={"font-semibold tabular-nums"}>{data[hoveredIdx].leads}</span>}</div>}{<div className={"flex items-center justify-between gap-4 text-blue-400 text-xs mt-0.5"}>{<span>AI Messages:</span>}{<span className={"font-semibold tabular-nums"}>{data[hoveredIdx].aiChats}</span>}</div>}</div>}</div>}{<div className={"flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500"}>{<div className={"flex items-center gap-4"}>{<div className={"flex items-center gap-1.5"}>{<span className={"w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"} />}{<span className={"font-medium text-slate-700"}>Leads ({activeSet.totalLeads})</span>}</div>}{<div className={"flex items-center gap-1.5"}>{<span className={"w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"} />}{<span className={"font-medium text-slate-700"}>AI Messages ({activeSet.totalChats})</span>}</div>}</div>}{<div className={"text-xs text-slate-400"}>Response latency: ~1.2s avg</div>}</div>}</div>;
};
export {
  LeadsChart
};