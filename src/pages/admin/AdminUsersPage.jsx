import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Avatar } from "../../components/ui/Avatar";
import { Search } from "lucide-react";
const AdminUsersPage = () => {
  const { teamMembers } = useApp();
  const [search, setSearch] = useState("");
  const mockGlobalUsers = [
    ...teamMembers.map((t) => ({ ...t, org: "Artisan Living Decor" })),
    { id: "u-101", name: "Julian Sterling", email: "julian@novahome.com", role: "owner", org: "Nova Home Living", status: "active" },
    { id: "u-102", name: "Carlos Vega", email: "carlos@apexmobility.io", role: "owner", org: "Apex Mobility Motors", status: "active" },
    { id: "u-103", name: "Sofia Alverez", email: "sofia@apexmobility.io", role: "salesperson", org: "Apex Mobility Motors", status: "active" },
    { id: "u-104", name: "Dr. Evelyn Reed", email: "evelyn@claritydermatology.com", role: "owner", org: "Clarity Aesthetic Dermatology", status: "active" }
  ];
  const filtered = mockGlobalUsers.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || u.org.toLowerCase().includes(search.toLowerCase())
  );
  return  <div className={"space-y-6"}>{<div>{<h1 className={"text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight"}>Cross-Tenant Users &amp; Roles</h1>}{<p className={"text-xs sm:text-sm text-slate-500 mt-0.5"}>Directory of all account owners, managers, and sales representatives</p>}</div>}{<div className={"bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs"}>{<div className={"relative max-w-md"}>{<Search className={"w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none"} />}{<input type={"text"} placeholder={"Search by name, email, or tenant organization..."} value={search} onChange={(e) => setSearch(e.target.value)} className={"w-full text-xs rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"} />}</div>}</div>}{<div className={"bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs"}>{<table className={"w-full text-left border-collapse text-xs"}>{<thead>{<tr className={"border-b border-slate-100 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase"}>{<th className={"py-3 px-4"}>User</th>}{<th className={"py-3 px-4"}>Organization</th>}{<th className={"py-3 px-4"}>Assigned Role</th>}{<th className={"py-3 px-4 text-right"}>Status</th>}</tr>}</thead>}{<tbody className={"divide-y divide-slate-100"}>{filtered.map((user) =>  <tr className={"hover:bg-slate-50/70"}>{<td className={"py-3 px-4 flex items-center gap-3"}>{<Avatar name={user.name} size={"sm"} />}{<div>{<div className={"font-semibold text-slate-900"}>{user.name}</div>}{<div className={"text-[11px] text-slate-400 font-mono"}>{user.email}</div>}</div>}</td>}{<td className={"py-3 px-4 font-medium text-slate-700"}>{user.org}</td>}{<td className={"py-3 px-4 capitalize text-slate-600"}>{user.role}</td>}{<td className={"py-3 px-4 text-right"}>{<span className={"text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200"}>Active</span>}</td>}</tr>)}</tbody>}</table>}</div>}</div>;
};
export {
  AdminUsersPage
};