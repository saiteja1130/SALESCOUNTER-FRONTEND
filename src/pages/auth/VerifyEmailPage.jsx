import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { apiClient } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { CheckCircle2, AlertCircle, RefreshCw, MessageSquare, ArrowRight } from "lucide-react";

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(Boolean(token));
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(token ? null : "Missing email verification token in link.");
  const [resendEmail, setResendEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    const executeVerification = async () => {
      try {
        setLoading(true);
        const res = await apiClient.post("/auth/verify-email", { token });
        if (isMounted) {
          setVerified(true);
          setLoading(false);
          showToast("Email verified successfully! You can now log in.");
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to verify email token.");
          setLoading(false);
        }
      }
    };

    executeVerification();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail) return;

    try {
      setResending(true);
      await apiClient.post("/auth/resend-verification", { email: resendEmail });
      setResendSuccess(true);
      showToast("Fresh verification link sent! Please check your email or server log.");
    } catch (err) {
      showToast(err.message || "Failed to resend verification.", "error");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <MessageSquare className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900 font-sans">
            CONVERSLY AI
          </span>
        </div>

        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10 text-center">
          {loading && (
            <div className="py-8 space-y-4">
              <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">Verifying your email...</h3>
              <p className="text-xs text-slate-500">Please wait while we confirm your workspace registration.</p>
            </div>
          )}

          {!loading && verified && (
            <div className="py-6 space-y-5 animate-in zoom-in-95">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Email Verified!</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Your organization workspace and 3-day trial are ready. You can now sign in with your credentials.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wide rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {!loading && error && (
            <div className="py-6 space-y-5">
              <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Verification Link Invalid</h3>
                <p className="text-xs text-rose-600 mt-1">{error}</p>
              </div>

              {/* Resend form */}
              <div className="mt-4 pt-4 border-t border-slate-100 text-left">
                <p className="text-xs font-semibold text-slate-700 mb-2">Request a fresh verification link:</p>
                <form onSubmit={handleResend} className="space-y-3">
                  <input
                    type="email"
                    required
                    placeholder="Enter your registered email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="submit"
                    disabled={resending}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {resending ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span>Resend Verification Link</span>
                    )}
                  </button>
                </form>
                {resendSuccess && (
                  <p className="text-xs text-emerald-600 mt-2 font-medium">
                    ✓ New link generated! Check your email or backend console.
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Link to="/login" className="text-xs font-semibold text-blue-600 hover:underline">
                  Return to Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
