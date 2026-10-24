import { useState, Fragment } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { UserCheck, Crown, ChevronDown, Check, Eye, ShieldCheck, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const RoleSwitcher = ({ compact = false }) => {
  const {
    role,
    switchRole,
    currentUser,
    salespersonCanViewAllLeads,
    setSalespersonCanViewAllLeads,
    logout,
  } = useAuth();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    showToast("You have been signed out", "info");
    navigate("/login");
  };

  const isAdminRoute = location.pathname.startsWith("/admin");

  const handleSelectRole = (newRole) => {
    switchRole(newRole);
    setIsOpen(false);
    if (newRole === "salesperson") {
      navigate("/my-dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  const handleGoAdmin = () => {
    setIsOpen(false);
    navigate("/admin");
  };

  const getRoleIcon = () => {
    if (isAdminRoute) return <ShieldCheck className="w-4 h-4 text-blue-600" />;
    switch (role) {
      case "owner":
        return <Crown className="w-4 h-4 text-amber-600" />;
      case "salesperson":
        return <UserCheck className="w-4 h-4 text-emerald-600" />;
      default:
        return <Crown className="w-4 h-4 text-amber-600" />;
    }
  };

  const getRoleLabel = () => {
    if (isAdminRoute) return "Platform Admin";
    return role === "owner" ? "Sales Manager" : "Sales Rep";
  };

  const getRoleBadgeStyle = () => {
    if (isAdminRoute) return "bg-blue-50 text-blue-900 border-blue-200/90";
    return role === "owner"
      ? "bg-amber-50 text-amber-900 border-amber-200/90"
      : "bg-emerald-50 text-emerald-900 border-emerald-200/90";
  };

  return (
    <div className="relative inline-block text-left w-full sm:w-auto">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 border rounded-lg transition-all duration-150 hover:shadow-2xs cursor-pointer select-none ${
          compact
            ? "px-2.5 py-1.5 text-xs bg-slate-50/90 hover:bg-slate-100 border-slate-200 text-slate-700"
            : `px-3 py-2 text-xs bg-white hover:bg-slate-50 ${getRoleBadgeStyle()}`
        }`}
        title="Switch active user role (Sales Manager, Sales Rep, Platform Admin)"
      >
        <div className="flex items-center gap-2">
          {getRoleIcon()}
          {!compact && (
            <span className="font-semibold text-slate-800">
              {getRoleLabel()}
            </span>
          )}
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <Fragment>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full mb-2 right-0 w-72 rounded-xl bg-white border border-slate-200 shadow-xl z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Switch Active Role
            </div>

            <div className="space-y-1">
              <button
                type="button"
                onClick={() => handleSelectRole("owner")}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                  role === "owner" && !isAdminRoute
                    ? "bg-amber-50 text-slate-900 font-medium"
                    : "hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 truncate">
                      Elena Vance
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      Sales Manager · Full Workspace
                    </div>
                  </div>
                </div>
                {role === "owner" && !isAdminRoute && (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole("salesperson")}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                  role === "salesperson" && !isAdminRoute
                    ? "bg-emerald-50 text-slate-900 font-medium"
                    : "hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 truncate">
                      Marcus Chen
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      Sales Rep · Assigned Queue
                    </div>
                  </div>
                </div>
                {role === "salesperson" && !isAdminRoute && (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                )}
              </button>

              <button
                type="button"
                onClick={handleGoAdmin}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                  isAdminRoute
                    ? "bg-blue-50 text-slate-900 font-medium"
                    : "hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 truncate">
                      Platform Ops
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      Platform Admin · Multi-Tenant
                    </div>
                  </div>
                </div>
                {isAdminRoute && (
                  <Check className="w-4 h-4 text-blue-600 shrink-0 ml-2" />
                )}
              </button>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 px-2 py-1">
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={salespersonCanViewAllLeads}
                  onChange={(e) =>
                    setSalespersonCanViewAllLeads(e.target.checked)
                  }
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                />
                <span className="flex items-center gap-1.5 select-none">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  Allow Sales Reps to view all leads
                </span>
              </label>
            </div>

            <div className="mt-1 pt-1.5 border-t border-slate-100">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-2 rounded-lg text-left text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-100 transition-colors">
                    <LogOut className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold">Sign Out</div>
                    <div className="text-xs text-slate-400 group-hover:text-rose-500/80">
                      End current session
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export { RoleSwitcher };