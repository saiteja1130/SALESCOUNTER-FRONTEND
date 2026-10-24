import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { AuthVisualShowcase } from "../../components/auth/AuthVisualShowcase";
import { MessageSquare, Eye, EyeOff, Loader2, CheckCircle2, ArrowRight } from "lucide-react";

export const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, switchRole } = useAuth();
  const { showToast } = useToast();

  const [companyName, setCompanyName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupResult, setSignupResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      showToast("Please agree to the Terms of Service to continue", "error");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await signup({ companyName, fullName, email, password });
      setSignupResult(res);
      showToast("Workspace initialized! Please verify your email.");
    } catch (err) {
      setErrorMessage(err.message || "Failed to create organization workspace.");
      showToast(err.message || "Registration error", "error");
    } finally {
      setIsSubmitting(false);
    }
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

          {signupResult ? (
            /* Signup Success / Verification State */
            <div className="mt-8 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-4 animate-in zoom-in-95">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Verify Your Email</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  We've sent a verification link to <strong>{signupResult.email}</strong>.
                  Please check your email and click the link to activate your organization workspace and begin your 3-day trial.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wide rounded-xl text-center shadow-xs transition-colors"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <div>
              {/* Form Header Title */}
              <div className="mt-8 sm:mt-10">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Create your organization workspace
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Connect your WhatsApp business line and scale sales with AI
                </p>
              </div>

              {errorMessage && (
                <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 space-y-1">
                  <div className="font-semibold">Unable to register workspace:</div>
                  <div>{errorMessage}</div>
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white font-bold text-sm tracking-wide rounded-xl shadow-md transition-all duration-150 cursor-pointer flex items-center justify-center uppercase mt-2 gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isSubmitting ? "CREATING WORKSPACE..." : "CREATE WORKSPACE"}</span>
                </button>
              </form>
            </div>
          )}
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