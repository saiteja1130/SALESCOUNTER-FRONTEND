import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { AuthVisualShowcase } from "../../components/auth/AuthVisualShowcase";
import { MessageSquare, Eye, EyeOff } from "lucide-react";

export const SignupPage = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();
  const { showToast } = useToast();
  const [companyName, setCompanyName] = useState("Artisan Living Decor");
  const [fullName, setFullName] = useState("Elena Vance");
  const [email, setEmail] = useState("elena@artisanliving.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      showToast("Please agree to the Terms of Service to continue", "error");
      return;
    }
    switchRole("owner");
    showToast("Workspace initialized! Welcome to Conversly AI");
    navigate("/onboarding");
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden grid grid-cols-1 lg:grid-cols-12 bg-white">
      {/* Left Column: Organization Registration Form */}
      <div className="col-span-1 lg:col-span-5 xl:col-span-5 h-full flex flex-col justify-between p-6 sm:p-8 lg:p-10 xl:p-12 overflow-y-auto">
        <div>
          {/* Top Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 font-sans">
              CONVERSLY AI
            </span>
          </div>

          {/* Form Header Title */}
          <div className="mt-8 sm:mt-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Create your organization workspace
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Connect your WhatsApp business line and scale sales with AI
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label
                htmlFor="companyName"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Business / Organization Name
              </label>
              <input
                id="companyName"
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Artisan Living Decor"
                className="w-full text-sm rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-150"
              />
            </div>

            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Account Owner Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Elena Vance"
                className="w-full text-sm rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-150"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Work Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elena@company.com"
                className="w-full text-sm rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-150"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
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
                  placeholder="Create a secure password"
                  className="w-full text-sm rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-11 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-150"
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

            <div className="pt-1">
              <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer mt-0.5"
                />
                <span>
                  I agree to the Conversly AI Terms of Service and Privacy Policy for automated WhatsApp interactions.
                </span>
              </label>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm tracking-wide rounded-xl shadow-md transition-all duration-150 cursor-pointer flex items-center justify-center uppercase mt-2"
            >
              CREATE WORKSPACE
            </button>
          </form>
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 pt-4 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Right Column: Visual Animation Showcase */}
      <div className="hidden lg:flex lg:col-span-7 xl:col-span-7 h-full overflow-hidden">
        <AuthVisualShowcase />
      </div>
    </div>
  );
};