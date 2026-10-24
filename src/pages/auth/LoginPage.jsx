import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { AuthVisualShowcase } from "../../components/auth/AuthVisualShowcase";
import {
  MessageSquare,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
} from "lucide-react";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setUnverifiedEmail(null);
    setIsLoading(true);

    try {
      const res = await login(email, password);
      showToast(`Welcome back, ${res.user.name}!`);
      if (res.user.role === "salesperson") {
        navigate("/my-dashboard");
      } else if (res.user.role === "admin") {
        navigate("/admin");
      } else {
        const onboardingStatus = res.organization?.onboarding?.status;
        if (onboardingStatus === "completed" || onboardingStatus === "skipped") {
          navigate("/dashboard");
        } else {
          navigate("/onboarding");
        }
      }
    } catch (err) {
      if (err.code === "UNVERIFIED_EMAIL") {
        setUnverifiedEmail(email);
        setLoginError(err.message);
      } else {
        setLoginError(err.message || "Failed to sign in. Please verify your credentials.");
      }
      showToast(err.message || "Sign in failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden grid grid-cols-1 lg:grid-cols-12 bg-white">
      {/* Left Column: Authentication Form */}
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
          <div className="mt-8 sm:mt-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Conversly AI authorized workspace
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Please sign in to access your organization
            </p>
          </div>

          {loginError && (
            <div className="mt-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <div className="font-medium">{loginError}</div>
              </div>
              {unverifiedEmail && (
                <div className="pt-1">
                  <Link
                    to="/verify-email"
                    className="font-bold text-rose-800 underline hover:text-rose-900 inline-block"
                  >
                    Resend email verification link →
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Main Credentials Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                placeholder="Enter your email"
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
                  placeholder="Enter your password"
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
                  showToast("Password reset feature: Please contact platform administrator", "info");
                }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
              >
                Forgot Password?
              </a>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white font-bold text-sm tracking-wide rounded-xl shadow-md transition-all duration-150 cursor-pointer flex items-center justify-center uppercase gap-2 mt-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isLoading ? "AUTHENTICATING..." : "LOGIN"}</span>
            </button>
          </form>
        </div>

        {/* Footer Navigation */}
        <div className="mt-6 pt-3 text-center text-xs text-slate-500">
          Need a new organization?{" "}
          <Link
            to="/signup"
            className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Sign Up
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