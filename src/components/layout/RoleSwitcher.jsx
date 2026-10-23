import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { UserCheck, Crown, ChevronDown, Check, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
const RoleSwitcher = ({ compact = false }) => {
  const { role, switchRole, currentUser, salespersonCanViewAllLeads, setSalespersonCanViewAllLeads } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const handleSelectRole = (newRole) => {
    switchRole(newRole);
    setIsOpen(false);
    if (newRole === "salesperson") {
      navigate("/my-dashboard");
    } else {
      navigate("/dashboard");
    }
  };
  const getRoleIcon = (r) => {
    switch (r) {
      case "owner":
        return  <Crown className={"w-3.5 h-3.5 text-amber-600"} />;
      case "salesperson":
        return  <UserCheck className={"w-3.5 h-3.5 text-emerald-600"} />;
    }
  };
  const getRoleBadgeStyle = (r) => {
    switch (r) {
      case "owner":
        return "bg-amber-50 text-amber-900 border-amber-200/90";
      case "salesperson":
        return "bg-emerald-50 text-emerald-900 border-emerald-200/90";
    }
  };
  return  <div className={"relative inline-block text-left"}>{<button onClick={() => setIsOpen(!isOpen)} className={`flex items-center gap-1.5 border rounded-lg transition-all duration-150 hover:shadow-2xs cursor-pointer ${compact ? "px-2 py-1 text-xs bg-slate-50/80 hover:bg-slate-100/80 border-slate-200 text-slate-600" : "px-2.5 py-1.5 text-xs bg-white hover:bg-slate-50"} ${compact ? "" : getRoleBadgeStyle(role)}`} title={"Switch demo role (Sales Manager, Sales Rep)"}>{getRoleIcon(role)}{!compact &&  <span className={"text-[11px] font-medium text-slate-600"}>{role === "owner" ? "Sales Manager" : "Sales Rep"}</span>}{<ChevronDown className={"w-3 h-3 text-slate-400"} />}</button>}{isOpen &&  <Fragment>{<div className={"fixed inset-0 z-40"} onClick={() => setIsOpen(false)} />}{<div className={"absolute bottom-full mb-2.5 right-0 w-64 rounded-xl bg-white border border-slate-200/90 shadow-xl z-50 p-2 animate-in fade-in zoom-in-95"}>{<div className={"px-2.5 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider"}>Switch Active Role</div>}{<div className={"space-y-1"}>{<button onClick={() => handleSelectRole("owner")} className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${role === "owner" ? "bg-amber-50 text-slate-900 font-medium" : "hover:bg-slate-50 text-slate-700"}`}>{<div className={"flex items-center gap-2.5"}>{<div className={"w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0"}>{<Crown className={"w-4 h-4"} />}</div>}{<div>{<div className={"font-semibold text-slate-900"}>Elena Vance</div>}{<div className={"text-[11px] text-slate-500"}>Sales Manager \xB7 Full Workspace</div>}</div>}</div>}{role === "owner" &&  <Check className={"w-4 h-4 text-emerald-600 shrink-0"} />}</button>}{<button onClick={() => handleSelectRole("salesperson")} className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${role === "salesperson" ? "bg-emerald-50 text-slate-900 font-medium" : "hover:bg-slate-50 text-slate-700"}`}>{<div className={"flex items-center gap-2.5"}>{<div className={"w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0"}>{<UserCheck className={"w-4 h-4"} />}</div>}{<div>{<div className={"font-semibold text-slate-900"}>Marcus Chen</div>}{<div className={"text-[11px] text-slate-500"}>Sales Rep \xB7 Queue &amp; Follow-ups</div>}</div>}</div>}{role === "salesperson" &&  <Check className={"w-4 h-4 text-emerald-600 shrink-0"} />}</button>}</div>}{<div className={"mt-2 pt-2 border-t border-slate-100 px-2 py-1"}>{<label className={"flex items-center gap-2 text-[11px] text-slate-600 cursor-pointer"}>{<input type={"checkbox"} checked={salespersonCanViewAllLeads} onChange={(e) => setSalespersonCanViewAllLeads(e.target.checked)} className={"rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"} />}{<span className={"flex items-center gap-1"}>{<Eye className={"w-3 h-3 text-slate-400"} />}Allow Salesperson to view all leads</span>}</label>}</div>}</div>}</Fragment>}</div>;
};
export {
  RoleSwitcher
};