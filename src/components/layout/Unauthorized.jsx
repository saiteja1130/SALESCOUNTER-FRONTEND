import { ShieldAlert, ArrowLeft, Crown } from "lucide-react";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Unauthorized = ({ featureName = "Owner-only settings" }) => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mb-4 shadow-2xs">
        <ShieldAlert className="w-7 h-7" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 tracking-tight">
        Access Restricted
      </h2>
      <p className="mt-2 text-sm text-slate-500 max-w-md leading-relaxed">
        This section ({featureName}) is reserved for the business{" "}
        <strong className="text-slate-800 font-semibold">Sales Manager (Owner)</strong> role. In your
        current role as a Sales Representative, your access is focused on your
        assigned leads and follow-ups.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="outline"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate("/my-dashboard")}
        >
          Return to My Dashboard
        </Button>
        <Button
          variant="primary"
          size="sm"
          icon={<Crown className="w-4 h-4" />}
          onClick={() => {
            switchRole("owner");
            navigate("/dashboard");
          }}
        >
          Switch to Sales Manager
        </Button>
      </div>
    </div>
  );
};

export { Unauthorized };