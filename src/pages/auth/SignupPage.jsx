import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { MessageSquare } from "lucide-react";
const SignupPage = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();
  const [companyName, setCompanyName] = useState("Artisan Living Decor");
  const [fullName, setFullName] = useState("Elena Vance");
  const [email, setEmail] = useState("elena@artisanliving.com");
  const handleSubmit = (e) => {
    e.preventDefault();
    switchRole("owner");
    navigate("/onboarding");
  };
  return  <div className={"min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8"}>{<div className={"sm:mx-auto sm:w-full sm:max-w-md text-center"}>{<div className={"inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-700 text-white shadow-xs mb-4"}>{<MessageSquare className={"w-6 h-6"} />}</div>}{<h2 className={"text-2xl font-bold tracking-tight text-slate-900"}>Create your Conversly AI account</h2>}{<p className={"mt-1 text-sm text-slate-500"}>Scale your WhatsApp sales pipeline with dedicated AI assistants</p>}</div>}{<div className={"mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4"}>{<div className={"bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10"}>{<form onSubmit={handleSubmit} className={"space-y-4"}>{<Input label={"Business / Organization Name *"} value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />}{<Input label={"Account Owner Name *"} value={fullName} onChange={(e) => setFullName(e.target.value)} required />}{<Input label={"Work Email *"} type={"email"} value={email} onChange={(e) => setEmail(e.target.value)} required />}{<Input label={"Password *"} type={"password"} defaultValue={"\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"} required />}{<Button type={"submit"} className={"w-full"}>Continue to Quick Onboarding</Button>}</form>}{<div className={"mt-6 text-center text-xs text-slate-500"}>Already have an account?{" "}{<Link to={"/login"} className={"font-semibold text-emerald-700 hover:underline"}>Sign In</Link>}</div>}</div>}</div>}</div>;
};
export {
  SignupPage
};