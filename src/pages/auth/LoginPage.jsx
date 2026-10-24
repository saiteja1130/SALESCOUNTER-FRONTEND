import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { AuthVisualShowcase } from "../../components/auth/AuthVisualShowcase";
import {
  MessageSquare,
  Crown,
  UserCheck,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState("elena@artisanliving.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleDemoLogin = (selectedRole) => {
    switchRole(selectedRole);
    showToast(
      selectedRole === "salesperson"
        ? "Signed in as Marcus Chen (Sales Rep)"
        : "Signed in as Elena Vance (Sales Manager)"
    );
    if (selectedRole === "salesperson") {
      navigate("/my-dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleDemoLogin("owner");
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden grid grid-cols-1 lg:grid-cols-12 bg-white">
      {/* Left Column: Authentication Form (Matches Reference Design) */}
      <div className="col-span-1 lg:col-span-5 xl:col-span-5 h-full flex flex-col justify-between p-6 sm:p-8 lg:p-10 xl:p-12 overflow-y-auto">
        {/* Top Brand Logo */}
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 font-sans">
              CONVERSLY AI
            </span>
          </div>

          {/* Form Header Title */}
          <div className="mt-10 sm:mt-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Conversly AI authorized workspace only
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Please login to your account
            </p>
          </div>

          {/* Main Credentials Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full text-sm rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-150"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full text-sm rounded-xl border border-slate-200 bg-white px-4 py-3 pr-11 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>Remember me</span>
              </label>
              <a
                href="#forgot-password"
                onClick={(e) => {
                  e.preventDefault();
                  showToast("Password reset link sent to demo email", "info");
                }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
              >
                Forgot Password?
              </a>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm tracking-wide rounded-xl shadow-md transition-all duration-150 cursor-pointer flex items-center justify-center uppercase"
            >
              LOGIN
            </button>
          </form>

          {/* 1-Click Demo Login Panel */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              1-Click Demo Sign In (Preconfigured Roles)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleDemoLogin("owner")}
                className="flex items-center justify-between p-2.5 rounded-xl border border-amber-200/90 bg-amber-50/50 hover:bg-amber-100/70 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                    <Crown className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-900 truncate">
                      Elena Vance
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      Sales Manager
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-amber-700 shrink-0 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("salesperson")}
                className="flex items-center justify-between p-2.5 rounded-xl border border-emerald-200/90 bg-emerald-50/50 hover:bg-emerald-100/70 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-emerald-200 text-emerald-900 flex items-center justify-center shrink-0">
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-900 truncate">
                      Marcus Chen
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      Sales Rep
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-700 shrink-0 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 pt-4 text-center text-xs text-slate-500">
          Need a new organization?{" "}
          <Link
            to="/signup"
            className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* Right Column: Visual Animation Showcase (WhatsApp Automation & Leads CRM) */}
      <div className="hidden lg:flex lg:col-span-7 xl:col-span-7 h-full overflow-hidden">
        <AuthVisualShowcase />
      </div>
    </div>
  );
};