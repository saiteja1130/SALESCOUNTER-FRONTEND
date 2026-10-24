import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
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
  Sparkles,
  LogOut,
} from "lucide-react";

const AppShell = ({ children }) => {
  const { role, currentUser, isOwner, logout } = useAuth();
  const { organization, leads, qrConnected } = useApp();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast("You have been signed out", "info");
    navigate("/login");
  };

  const unreadCount = leads.filter((l) => l.needsAttention).length;

  const ownerSections = [
    {
      title: "Workspace",
      items: [
        {
          label: "Dashboard",
          path: "/dashboard",
          icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
        },
        {
          label: "Shared Inbox",
          path: "/inbox",
          icon: <MessageSquare className="w-4 h-4 shrink-0" />,
          badge: unreadCount > 0 ? unreadCount : undefined,
        },
        {
          label: "All Leads",
          path: "/leads",
          icon: <Users2 className="w-4 h-4 shrink-0" />,
        },
      ],
    },
    {
      title: "Automation & Growth",
      items: [
        {
          label: "Teach AI",
          path: "/teach-ai",
          icon: <Bot className="w-4 h-4 shrink-0" />,
        },
        {
          label: "Follow-ups",
          path: "/follow-ups",
          icon: <Clock className="w-4 h-4 shrink-0" />,
        },
        {
          label: "Broadcasts",
          path: "/campaigns",
          icon: <Send className="w-4 h-4 shrink-0" />,
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          label: "Team & Routing",
          path: "/team",
          icon: <UserCheck className="w-4 h-4 shrink-0" />,
        },
        {
          label: "Settings",
          path: "/settings",
          icon: <Settings className="w-4 h-4 shrink-0" />,
        },
      ],
    },
  ];

  const salespersonSections = [
    {
      title: "My Workspace",
      items: [
        {
          label: "My Dashboard",
          path: "/my-dashboard",
          icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
        },
        {
          label: "My Inbox",
          path: "/inbox",
          icon: <MessageSquare className="w-4 h-4 shrink-0" />,
          badge: unreadCount > 0 ? unreadCount : undefined,
        },
        {
          label: "My Leads",
          path: "/leads",
          icon: <Users2 className="w-4 h-4 shrink-0" />,
        },
        {
          label: "Follow-ups",
          path: "/follow-ups",
          icon: <Clock className="w-4 h-4 shrink-0" />,
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          label: "Profile & Settings",
          path: "/settings",
          icon: <Settings className="w-4 h-4 shrink-0" />,
        },
      ],
    },
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

  const isInbox = location.pathname === "/inbox";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row text-slate-900">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <MessageSquare className="w-4 h-4" />
          </div>
          <span className="font-bold text-base tracking-tight text-slate-900">
            Conversly AI
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs flex">
          <div className="w-72 bg-white h-full shadow-2xl flex flex-col p-4 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-slate-900">
                  Conversly AI
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-3 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
              <div className="font-semibold text-slate-800">
                {organization.name}
              </div>
              <div className="text-slate-500 mt-0.5">
                {role === "owner"
                  ? "Sales Manager Workspace"
                  : "Sales Rep Work Queue"}
              </div>
            </div>

            <nav className="flex-1 space-y-4 overflow-y-auto py-2">
              {navSections.map((section) => (
                <div key={section.title} className="space-y-1">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
                    {section.title}
                  </div>
                  {section.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[40px] ${
                          isActive
                            ? "bg-emerald-50 text-emerald-800 font-semibold"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              ))}
            </nav>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <RoleSwitcher />
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/70 transition-colors cursor-pointer min-h-[40px]"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
          <div
            className="flex-1"
            onClick={() => setMobileMenuOpen(false)}
          />
        </div>
      )}

      {/* Desktop Sidebar (44px nav items, clear hierarchy) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/90 shrink-0 sticky top-0 h-screen z-20">
        {/* Brand & Workspace */}
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight text-slate-900">
                Conversly AI
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                <span>WhatsApp AI Sales</span>
              </div>
            </div>
          </div>

          <div className="mt-3.5 p-2.5 rounded-lg bg-slate-50/90 border border-slate-200/70 flex items-center justify-between text-xs transition-colors hover:border-slate-300">
            <div className="min-w-0 pr-2">
              <div className="font-semibold text-slate-900 truncate text-xs">
                {organization.name}
              </div>
              <div className="text-xs text-slate-500 truncate">
                {role === "owner"
                  ? "Sales Manager Workspace"
                  : "Sales Rep Work Queue"}
              </div>
            </div>
            {isOwner && (
              <button
                type="button"
                onClick={() => navigate("/settings")}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-200/50 transition-colors cursor-pointer"
                title="Workspace Settings"
                aria-label="Workspace Settings"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-0.5">
              <div className="px-3 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {section.title}
              </div>
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group relative flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 min-h-[40px] ${
                      isActive
                        ? "bg-slate-100/90 text-slate-900 font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-slate-400 group-hover:text-slate-700 transition-colors">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </div>

        {/* User Footer */}
        <div className="p-3 border-t border-slate-200/80 flex items-center justify-between bg-white gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <Avatar name={currentUser.name} size="sm" showBadge badgeColor="green" />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-900 truncate">
                {currentUser.name}
              </div>
              <div className="text-xs text-slate-500 truncate font-medium">
                {role === "owner" ? "Sales Manager" : "Sales Rep"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <RoleSwitcher compact />
            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Sign out of account"
              aria-label="Sign out of account"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Desktop Top Header Bar */}
        <header className="hidden md:flex items-center justify-between px-6 lg:px-8 py-3 bg-white/90 backdrop-blur-xs border-b border-slate-200/80 sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span
              className="hover:text-slate-800 cursor-pointer font-medium"
              onClick={() => navigate("/dashboard")}
            >
              Conversly AI
            </span>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-900">
              {getBreadcrumbTitle()}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 text-xs text-slate-500 border border-slate-200/80 rounded-lg px-3 py-1.5 bg-slate-50/70 shadow-2xs">
              <span className="flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    qrConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                  }`}
                />
                <span className="font-medium text-slate-700">WhatsApp:</span>
                <span
                  className={
                    qrConnected
                      ? "text-emerald-700 font-semibold"
                      : "text-amber-700 font-semibold"
                  }
                >
                  {qrConnected ? "Live" : "Standby"}
                </span>
              </span>
              <span className="text-slate-200">|</span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-medium text-slate-700">AI:</span>
                <span className="text-slate-600 font-medium">
                  Gemini 2.5 Active
                </span>
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 border border-slate-200/80 hover:border-rose-200 rounded-lg px-2.5 py-1.5 bg-slate-50/70 hover:bg-rose-50/50 transition-colors cursor-pointer shadow-2xs"
              title="Sign out of account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Routed Page Container */}
        <main
          className={`flex-1 min-w-0 w-full ${
            isInbox ? "h-[calc(100vh-57px)]" : "p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export { AppShell };