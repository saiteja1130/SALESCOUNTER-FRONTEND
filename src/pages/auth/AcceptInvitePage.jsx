import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { apiClient } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import {
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
  Lock,
  User,
  Shield,
  Building2,
} from "lucide-react";

export const AcceptInvitePage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { checkAuthSession } = useAuth();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [verifyError, setVerifyError] = useState(null);
  const [invitationMeta, setInvitationMeta] = useState(null);

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    async function verify() {
      if (!token) {
        setVerifyError("No invitation token provided. Please check the link in your email.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const res = await apiClient.get(`/team/invitations/verify?token=${encodeURIComponent(token)}`);
        if (res.success && res.invitation) {
          setInvitationMeta(res.invitation);
          setFullName(res.invitation.name || "");
        } else {
          setVerifyError(res.message || "Invalid or expired invitation.");
        }
      } catch (err) {
        setVerifyError(err.message || "Failed to verify invitation token.");
      } finally {
        setIsLoading(false);
      }
    }

    verify();
  }, [token]);

  const handleAccept = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!invitationMeta?.hasExistingAccount && (!password || password.length < 6)) {
      setSubmitError("Please provide a password of at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiClient.post("/team/invitations/accept", {
        token,
        password: password || undefined,
        fullName: fullName.trim() || undefined,
      });

      if (res.success) {
        showToast("Invitation accepted! Welcome to your sales workspace.");
        await checkAuthSession();
        navigate("/my-dashboard");
      }
    } catch (err) {
      setSubmitError(err.message || "Failed to accept invitation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-9 h-9 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-500 font-medium">Verifying your team invitation link...</p>
      </div>
    );
  }

  if (verifyError) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-slate-200 text-center sm:px-10">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900 mb-2">Invitation Unavailable</h2>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">{verifyError}</p>
            <div className="space-y-3">
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Go to Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-11 h-11 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xs">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-xl font-bold tracking-tight text-slate-900">
          Join {invitationMeta?.organizationName}
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          You have been invited to manage WhatsApp customer leads on Conversly AI
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-slate-200 sm:px-10">
          {submitError && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed flex-1">{submitError}</div>
            </div>
          )}

          <div className="mb-6 p-4 bg-emerald-50/70 border border-emerald-100 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-950 font-semibold">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Workspace: {invitationMeta?.organizationName}</span>
            </div>
            <div className="text-emerald-800 text-xs">
              Role: <span className="font-semibold capitalize">{invitationMeta?.role || "Sales Representative"}</span>
            </div>
            <div className="text-xs text-emerald-700">
              Account Email: <span className="font-semibold">{invitationMeta?.email}</span>
            </div>
          </div>

          <form onSubmit={handleAccept} className="space-y-4">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              required
            />

            <Input
              label="Email Address"
              value={invitationMeta?.email || ""}
              disabled
              helper="Your team invitation is linked to this email."
            />

            {!invitationMeta?.hasExistingAccount ? (
              <Input
                label="Create Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                helper="Create a secure password to sign into your sales dashboard."
                required
              />
            ) : (
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  You already have a verified Conversly account. Accepting will activate your membership in this workspace immediately.
                </span>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              )}
              Accept Invitation &amp; Open Workspace
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
