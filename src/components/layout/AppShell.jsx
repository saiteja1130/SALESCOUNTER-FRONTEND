import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { RoleSwitcher } from "./RoleSwitcher";
import { Avatar } from "../ui/Avatar";
import {
  LayoutDashboard,
  MessageSquare,
  Users2,
  Bot,
  UserCheck,
  Clock,
  Send,
  Settings,
  Menu,
  X,
  ChevronRight,
  Sparkles
} from "lucide-react";
const AppShell = ({ children }) => {
  const { role, currentUser, isOwner } = useAuth();
  const { organization, leads, qrConnected } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const unreadCount = leads.filter((l) => l.needsAttention).length;
  const ownerSections = [
    {
      title: "Workspace",
      items: [
        { label: "Dashboard", path: "/dashboard", icon:  <LayoutDashboard className={"w-4 h-4"} /> },
        {
          label: "Shared Inbox",
          path: "/inbox",
          icon:  <MessageSquare className={"w-4 h-4"} />,
          badge: unreadCount > 0 ? unreadCount : void 0
        },
        { label: "All Leads", path: "/leads", icon:  <Users2 className={"w-4 h-4"} /> }
      ]
    },
    {
      title: "Automation & Growth",
      items: [
        { label: "Teach AI", path: "/teach-ai", icon:  <Bot className={"w-4 h-4"} /> },
        { label: "Follow-ups", path: "/follow-ups", icon:  <Clock className={"w-4 h-4"} /> },
        { label: "Broadcasts", path: "/campaigns", icon:  <Send className={"w-4 h-4"} /> }
      ]
    },
    {
      title: "Management",
      items: [
        { label: "Team & Routing", path: "/team", icon:  <UserCheck className={"w-4 h-4"} /> },
        { label: "Settings", path: "/settings", icon:  <Settings className={"w-4 h-4"} /> }
      ]
    }
  ];
  const salespersonSections = [
    {
      title: "My Workspace",
      items: [
        { label: "My Dashboard", path: "/my-dashboard", icon:  <LayoutDashboard className={"w-4 h-4"} /> },
        {
          label: "My Inbox",
          path: "/inbox",
          icon:  <MessageSquare className={"w-4 h-4"} />,
          badge: unreadCount > 0 ? unreadCount : void 0
        },
        { label: "My Leads", path: "/leads", icon:  <Users2 className={"w-4 h-4"} /> },
        { label: "Follow-ups", path: "/follow-ups", icon:  <Clock className={"w-4 h-4"} /> }
      ]
    },
    {
      title: "Preferences",
      items: [
        { label: "Profile & Settings", path: "/settings", icon:  <Settings className={"w-4 h-4"} /> }
      ]
    }
  ];
  const navSections = isOwner ? ownerSections : salespersonSections;
  const allNavItems = navSections.flatMap((s) => s.items);
  const getBreadcrumbTitle = () => {
    const current = allNavItems.find((i) => i.path === location.pathname);
    if (current) return current.label;
    if (location.pathname.startsWith("/leads")) return "Leads";
    if (location.pathname.startsWith("/inbox")) return "Shared Inbox";
    return "Conversly AI";
  };
  return  <div className={"min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row text-slate-900"}>{<div className={"md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-30"}>{<div className={"flex items-center gap-2"}>{<div className={"w-7 h-7 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs"}>{<MessageSquare className={"w-4 h-4"} />}</div>}{<span className={"font-semibold text-sm tracking-tight text-slate-900"}>Conversly AI</span>}</div>}{<div className={"flex items-center gap-2"}>{<button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={"p-2 rounded-lg text-slate-600 hover:bg-slate-100"}>{mobileMenuOpen ?  <X className={"w-5 h-5"} /> :  <Menu className={"w-5 h-5"} />}</button>}</div>}</div>}{mobileMenuOpen &&  <div className={"md:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs flex"}>{<div className={"w-72 bg-white h-full shadow-2xl flex flex-col p-4 animate-in slide-in-from-left duration-200"}>{<div className={"flex items-center justify-between pb-4 border-b border-slate-100"}>{<div className={"flex items-center gap-2"}>{<div className={"w-7 h-7 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs"}>{<MessageSquare className={"w-4 h-4"} />}</div>}{<span className={"font-semibold text-sm text-slate-900"}>Conversly AI</span>}</div>}{<button onClick={() => setMobileMenuOpen(false)} className={"p-1 rounded-lg text-slate-400"}>{<X className={"w-5 h-5"} />}</button>}</div>}{<div className={"my-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs"}>{<div className={"font-medium text-slate-800"}>{organization.name}</div>}{<div className={"text-[11px] text-slate-500 mt-0.5"}>{role === "owner" ? "Sales Manager Workspace" : "Sales Rep Work Queue"}</div>}</div>}{<nav className={"flex-1 space-y-4 overflow-y-auto py-2"}>{navSections.map((section) =>  <div key={section.title} className={"space-y-1"}>{<div className={"text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2"}>{section.title}</div>}{section.items.map((item) =>  <NavLink key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${isActive ? "bg-emerald-50 text-emerald-800 font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>{<div className={"flex items-center gap-2.5"}>{item.icon}{<span>{item.label}</span>}</div>}{item.badge &&  <span className={"text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full"}>{item.badge}</span>}</NavLink>)}</div>)}</nav>}{<div className={"pt-3 border-t border-slate-100"}>{<RoleSwitcher />}</div>}</div>}{<div className={"flex-1"} onClick={() => setMobileMenuOpen(false)} />}</div>}{<aside className={"hidden md:flex flex-col w-64 bg-white border-r border-slate-200/90 shrink-0 sticky top-0 h-screen z-20"}>{<div className={"px-5 py-4 border-b border-slate-100"}>{<div className={"flex items-center gap-2.5"}>{<div className={"w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs"}>{<MessageSquare className={"w-4 h-4"} />}</div>}{<div>{<div className={"font-semibold text-sm tracking-tight text-slate-900"}>Conversly AI</div>}{<div className={"text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5"}>{<span className={"w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"} />}{<span>WhatsApp Sales</span>}</div>}</div>}</div>}{<div className={"mt-3.5 p-2.5 rounded-lg bg-slate-50/90 border border-slate-200/70 flex items-center justify-between text-xs transition-colors hover:border-slate-300"}>{<div className={"min-w-0 pr-2"}>{<div className={"font-medium text-slate-900 truncate text-xs"}>{organization.name}</div>}{<div className={"text-[11px] text-slate-500 truncate"}>{role === "owner" ? "Sales Manager Workspace" : "Sales Rep Work Queue"}</div>}</div>}{isOwner &&  <button onClick={() => navigate("/settings")} className={"text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-200/50 transition-colors cursor-pointer"} title={"Workspace Settings"}>{<ChevronRight className={"w-3.5 h-3.5"} />}</button>}</div>}</div>}{<div className={"flex-1 overflow-y-auto px-3 py-3 space-y-4"}>{navSections.map((section) =>  <div key={section.title} className={"space-y-0.5"}>{<div className={"px-3 pb-1 text-[10.5px] font-medium text-slate-400 uppercase tracking-wider"}>{section.title}</div>}{section.items.map((item) =>  <NavLink key={item.path} to={item.path} className={({ isActive }) => `group relative flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${isActive ? "bg-slate-100/90 text-slate-900 font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>{<div className={"flex items-center gap-2.5"}>{<span className={"text-slate-400 group-hover:text-slate-700 transition-colors"}>{item.icon}</span>}{<span>{item.label}</span>}</div>}{item.badge &&  <span className={"text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full"}>{item.badge}</span>}</NavLink>)}</div>)}</div>}{<div className={"p-3 border-t border-slate-200/80 flex items-center justify-between bg-white gap-2"}>{<div className={"flex items-center gap-2.5 min-w-0 flex-1"}>{<Avatar name={currentUser.name} size={"sm"} showBadge badgeColor={"green"} />}{<div className={"min-w-0 flex-1"}>{<div className={"text-xs font-semibold text-slate-900 truncate"}>{currentUser.name}</div>}{<div className={"text-[11px] text-slate-500 truncate font-medium"}>{role === "owner" ? "Sales Manager" : "Sales Rep"}</div>}</div>}</div>}{<div className={"shrink-0"}>{<RoleSwitcher compact />}</div>}</div>}</aside>}{<div className={"flex-1 flex flex-col min-w-0 overflow-hidden"}>{<header className={"hidden md:flex items-center justify-between px-6 lg:px-8 py-3 bg-white/90 backdrop-blur-xs border-b border-slate-200/80 sticky top-0 z-10"}>{<div className={"flex items-center gap-2 text-xs text-slate-500"}>{<span className={"hover:text-slate-700 cursor-pointer"} onClick={() => navigate("/dashboard")}>Conversly AI</span>}{<span className={"text-slate-300"}>/</span>}{<span className={"font-semibold text-slate-900"}>{getBreadcrumbTitle()}</span>}</div>}{<div className={"flex items-center gap-3"}>{<div className={"flex items-center gap-2.5 text-[11px] text-slate-500 border border-slate-200/80 rounded-lg px-2.5 py-1 bg-slate-50/70 shadow-2xs"}>{<span className={"flex items-center gap-1.5"}>{<span className={`w-1.5 h-1.5 rounded-full ${qrConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />}{<span className={"font-medium text-slate-700"}>WhatsApp:</span>}{<span className={qrConnected ? "text-emerald-700 font-medium" : "text-amber-700 font-medium"}>{qrConnected ? "Live" : "Standby"}</span>}</span>}{<span className={"text-slate-200"}>|</span>}{<span className={"flex items-center gap-1.5"}>{<Sparkles className={"w-3 h-3 text-emerald-600"} />}{<span className={"font-medium text-slate-700"}>AI:</span>}{<span className={"text-slate-600"}>Gemini 2.5 Active</span>}</span>}</div>}</div>}</header>}{<main className={`flex-1 min-w-0 w-full mx-auto ${location.pathname === "/inbox" ? "" : "p-4 sm:p-6 lg:p-8 max-w-7xl"}`}>{children}</main>}</div>}</div>;
};
export {
  AppShell
};