import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { MessageSquare, Crown, UserCheck, ArrowRight } from "lucide-react";
const LoginPage = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();
  const [email, setEmail] = useState("elena@artisanliving.com");
  const [password, setPassword] = useState("\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022");
  const handleDemoLogin = (selectedRole) => {
    switchRole(selectedRole);
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
  return  <div className={"min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8"}>{<div className={"sm:mx-auto sm:w-full sm:max-w-md text-center"}>{<div className={"inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-700 text-white shadow-xs mb-4"}>{<MessageSquare className={"w-6 h-6"} />}</div>}{<h2 className={"text-2xl font-bold tracking-tight text-slate-900"}>Sign in to Conversly AI</h2>}{<p className={"mt-1 text-sm text-slate-500"}>WhatsApp AI Sales Assistant SaaS Platform</p>}</div>}{<div className={"mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4"}>{<div className={"bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10"}>{<div className={"mb-6 pb-6 border-b border-slate-100"}>{<div className={"text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5"}>1-Click Demo Sign In (2 Roles)</div>}{<div className={"space-y-2"}>{<button type={"button"} onClick={() => handleDemoLogin("owner")} className={"w-full flex items-center justify-between p-2.5 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/60 text-left transition-colors"}>{<div className={"flex items-center gap-2.5"}>{<div className={"w-8 h-8 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center"}>{<Crown className={"w-4 h-4"} />}</div>}{<div>{<div className={"text-xs font-semibold text-slate-900"}>Elena Vance</div>}{<div className={"text-[11px] text-slate-500"}>Sales Manager \xB7 Artisan Living Decor</div>}</div>}</div>}{<ArrowRight className={"w-4 h-4 text-amber-700"} />}</button>}{<button type={"button"} onClick={() => handleDemoLogin("salesperson")} className={"w-full flex items-center justify-between p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/60 text-left transition-colors"}>{<div className={"flex items-center gap-2.5"}>{<div className={"w-8 h-8 rounded-lg bg-emerald-200 text-emerald-900 flex items-center justify-center"}>{<UserCheck className={"w-4 h-4"} />}</div>}{<div>{<div className={"text-xs font-semibold text-slate-900"}>Marcus Chen</div>}{<div className={"text-[11px] text-slate-500"}>Sales Rep \xB7 Assigned Queue &amp; Leads</div>}</div>}</div>}{<ArrowRight className={"w-4 h-4 text-emerald-700"} />}</button>}</div>}</div>}{<form onSubmit={handleSubmit} className={"space-y-4"}>{<Input label={"Email address"} type={"email"} value={email} onChange={(e) => setEmail(e.target.value)} required />}{<Input label={"Password"} type={"password"} value={password} onChange={(e) => setPassword(e.target.value)} required />}{<div className={"flex items-center justify-between text-xs"}>{<label className={"flex items-center gap-2 text-slate-600"}>{<input type={"checkbox"} defaultChecked className={"rounded border-slate-300 text-emerald-700 focus:ring-emerald-700"} />}{<span>Remember this session</span>}</label>}{<a href={"#forgot"} className={"text-emerald-700 hover:underline"}>Forgot password?</a>}</div>}{<Button type={"submit"} className={"w-full"}>Sign In to Workspace</Button>}</form>}{<div className={"mt-6 text-center text-xs text-slate-500"}>Need a new organization?{" "}{<Link to={"/onboarding"} className={"font-semibold text-emerald-700 hover:underline"}>Start Onboarding Wizard</Link>}</div>}</div>}</div>}</div>;
};
export {
  LoginPage
};