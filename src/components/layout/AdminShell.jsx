import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { RoleSwitcher } from "./RoleSwitcher";
import { Avatar } from "../ui/Avatar";
import {
  ShieldCheck,
  Building2,
  Users,
  Radio,
  FileText,
  Settings,
  ArrowRight,
  Menu,
  X,
  Activity
} from "lucide-react";
const AdminShell = ({ children }) => {
  const { currentUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = [
    { label: "Platform Overview", path: "/admin", icon:  <Activity className={"w-4 h-4"} /> },
    { label: "Organizations", path: "/admin/organizations", icon:  <Building2 className={"w-4 h-4"} /> },
    { label: "Users & Roles", path: "/admin/users", icon:  <Users className={"w-4 h-4"} /> },
    { label: "Campaigns Overview", path: "/admin/campaigns", icon:  <Radio className={"w-4 h-4"} /> },
    { label: "Audit Activity Log", path: "/admin/activity", icon:  <FileText className={"w-4 h-4"} /> },
    { label: "Platform Settings", path: "/admin/settings", icon:  <Settings className={"w-4 h-4"} /> }
  ];
  const getBreadcrumbTitle = () => {
    const current = navItems.find((i) => i.path === location.pathname);
    return current ? current.label : "Platform Admin";
  };
  return  <div className={"min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row text-slate-900"}>{<div className={"md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 text-white sticky top-0 z-30"}>{<div className={"flex items-center gap-2"}>{<div className={"w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white"}>{<ShieldCheck className={"w-4 h-4"} />}</div>}{<span className={"font-semibold text-sm"}>Conversly Admin</span>}</div>}{<div className={"flex items-center gap-2"}>{<button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={"p-2 rounded-lg text-slate-300 hover:bg-slate-800"}>{mobileMenuOpen ?  <X className={"w-5 h-5"} /> :  <Menu className={"w-5 h-5"} />}</button>}</div>}</div>}{mobileMenuOpen &&  <div className={"md:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs flex"}>{<div className={"w-72 bg-slate-900 text-white h-full shadow-2xl flex flex-col p-4 animate-in slide-in-from-left"}>{<div className={"flex items-center justify-between pb-4 border-b border-slate-800"}>{<div className={"flex items-center gap-2"}>{<ShieldCheck className={"w-5 h-5 text-blue-400"} />}{<span className={"font-semibold text-sm"}>Platform Admin</span>}</div>}{<button onClick={() => setMobileMenuOpen(false)} className={"p-1 rounded-lg text-slate-400"}>{<X className={"w-5 h-5"} />}</button>}</div>}{<nav className={"flex-1 space-y-1 py-4"}>{navItems.map((item) =>  <NavLink to={item.path} onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium ${isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"}`}>{item.icon}{<span>{item.label}</span>}</NavLink>)}</nav>}{<div className={"pt-3 border-t border-slate-800"}>{<RoleSwitcher />}</div>}</div>}{<div className={"flex-1"} onClick={() => setMobileMenuOpen(false)} />}</div>}{<aside className={"hidden md:flex flex-col w-64 bg-slate-900 text-slate-100 shrink-0 sticky top-0 h-screen z-20"}>{<div className={"p-5 border-b border-slate-800"}>{<div className={"flex items-center gap-2.5"}>{<div className={"w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs"}>{<ShieldCheck className={"w-4 h-4"} />}</div>}{<div>{<div className={"font-semibold text-sm tracking-tight text-white"}>Conversly Ops</div>}{<div className={"text-[11px] text-blue-400 font-medium"}>Platform Administration</div>}</div>}</div>}</div>}{<nav className={"flex-1 overflow-y-auto px-3 py-4 space-y-0.5"}>{<div className={"px-3 pb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider"}>Management</div>}{navItems.map((item) =>  <NavLink to={item.path} className={({ isActive }) => `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${isActive ? "bg-blue-600 text-white font-medium shadow-xs" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}>{<span className={"text-slate-400 group-hover:text-white"}>{item.icon}</span>}{<span>{item.label}</span>}</NavLink>)}</nav>}{<div className={"p-3 mx-3 mb-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs"}>{<div className={"text-slate-200 font-medium mb-1"}>Business Tenant View</div>}{<p className={"text-[11px] text-slate-400 mb-2.5 leading-relaxed"}>Switch back to test the customer workspace as Owner.</p>}{<button onClick={() => navigate("/dashboard")} className={"w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"}>{<span>Open Business View</span>}{<ArrowRight className={"w-3.5 h-3.5"} />}</button>}</div>}{<div className={"p-3 border-t border-slate-800 flex items-center justify-between bg-slate-900 gap-2"}>{<div className={"flex items-center gap-2.5 min-w-0 flex-1"}>{<Avatar name={currentUser.name} size={"sm"} />}{<div className={"min-w-0 flex-1"}>{<div className={"text-xs font-semibold text-white truncate"}>{currentUser.name}</div>}{<div className={"text-[11px] text-slate-400 truncate"}>Platform Admin</div>}</div>}</div>}{<div className={"shrink-0"}>{<RoleSwitcher compact />}</div>}</div>}</aside>}{<div className={"flex-1 flex flex-col min-w-0 overflow-hidden"}>{<header className={"hidden md:flex items-center justify-between px-6 lg:px-8 py-3.5 bg-white border-b border-slate-200 sticky top-0 z-10"}>{<div className={"flex items-center gap-2 text-xs text-slate-500"}>{<span>Conversly Ops</span>}{<span>/</span>}{<span className={"font-medium text-slate-900"}>{getBreadcrumbTitle()}</span>}</div>}{<div className={"flex items-center gap-3"}>{<div className={"text-[11px] text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg"}>Cluster: {<span className={"font-medium text-slate-800"}>Production US-East</span>}</div>}</div>}</header>}{<main className={"flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto"}>{children}</main>}</div>}</div>;
};
export {
  AdminShell
};