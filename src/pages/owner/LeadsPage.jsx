import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { LeadsTableView } from "../../components/leads/LeadsTableView";
import { LeadDrawer } from "../../components/leads/LeadDrawer";
import { LeadModal } from "../../components/leads/LeadModal";
import { Button } from "../../components/ui/Button";
import { exportLeadsToCSV } from "../../utils/csvExport";
import { useToast } from "../../context/ToastContext";
import { Plus, Download, Search, X, Filter, RotateCcw } from "lucide-react";
const LeadsPage = () => {
  const { filteredLeads, teamMembers } = useApp();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState(null);
  const processedLeads = filteredLeads.filter((l) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      l.name.toLowerCase().includes(q) ||
      l.phone.includes(q) ||
      (l.email && l.email.toLowerCase().includes(q)) ||
      (l.collectedData?.interestedProduct &&
        l.collectedData.interestedProduct.toLowerCase().includes(q));
    if (!matchesSearch) return false;
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    if (assigneeFilter !== "all" && l.assignedToId !== assigneeFilter)
      return false;
    return true;
  });
  const hasActiveFilters = Boolean(
    search.trim() || statusFilter !== "all" || assigneeFilter !== "all",
  );
  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setAssigneeFilter("all");
  };
  const handleOpenLead = (lead) => {
    setSelectedLead(lead);
    setDrawerOpen(true);
  };
  const handleEditLead = (lead) => {
    setLeadToEdit(lead);
    setDrawerOpen(false);
    setModalOpen(true);
  };
  const handleExportAll = () => {
    exportLeadsToCSV(processedLeads);
    showToast(`Exported ${processedLeads.length} leads to CSV`);
  };
  const selectedAssigneeName = teamMembers.find(
    (m) => m.id === assigneeFilter,
  )?.name;
  return (
    <div className={"space-y-5 pb-12"}>
      {
        <div
          className={
            "flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs"
          }
        >
          {
            <div>
              {
                <div className={"flex items-center gap-2.5 flex-wrap"}>
                  {
                    <h1
                      className={
                        "text-xl sm:text-2xl font-bold text-slate-900 tracking-tight"
                      }
                    >
                      WhatsApp Sales Leads
                    </h1>
                  }
                  {
                    <span
                      className={
                        "text-xs bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200/70"
                      }
                    >
                      {filteredLeads.length} Total
                    </span>
                  }
                </div>
              }
              {
                <p className={"text-xs sm:text-sm text-slate-500 mt-1"}>
                  Manage inbound prospective customers, assigned salespeople,
                  and conversation stages
                </p>
              }
            </div>
          }
          {
            <div className={"flex items-center gap-2.5 shrink-0"}>
              {
                <Button
                  variant={"outline"}
                  size={"sm"}
                  icon={<Download className={"w-3.5 h-3.5"} />}
                  onClick={handleExportAll}
                  title={`Export ${processedLeads.length} visible leads as CSV`}
                >
                  Export CSV ({processedLeads.length})
                </Button>
              }
              {
                <Button
                  size={"sm"}
                  icon={<Plus className={"w-3.5 h-3.5"} />}
                  onClick={() => {
                    setLeadToEdit(null);
                    setModalOpen(true);
                  }}
                  className={"bg-emerald-600 hover:bg-emerald-700 text-white"}
                >
                  Add Lead
                </Button>
              }
            </div>
          }
        </div>
      }
      {
        <div
          className={
            "bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3"
          }
        >
          {
            <div
              className={
                "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
              }
            >
              {
                <div
                  className={
                    "flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
                  }
                >
                  {
                    <div className={"relative flex-1 min-w-[260px]"}>
                      {
                        <Search
                          className={
                            "w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none"
                          }
                        />
                      }
                      {
                        <input
                          type={"text"}
                          placeholder={
                            "Search by name, phone, email, or product..."
                          }
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className={
                            "w-full text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-9 py-2.5 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-colors"
                          }
                        />
                      }
                      {search && (
                        <button
                          onClick={() => setSearch("")}
                          aria-label={"Clear search input"}
                          className={
                            "absolute right-3 top-2.5 p-1 rounded-md text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                          }
                        >
                          {<X className={"w-3.5 h-3.5"} />}
                        </button>
                      )}
                    </div>
                  }
                  {
                    <div className={"flex items-center gap-2"}>
                      {
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          aria-label={"Filter by lead stage"}
                          className={
                            "text-xs sm:text-sm rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 cursor-pointer shadow-2xs"
                          }
                        >
                          {<option value={"all"}>All Stages</option>}
                          {<option value={"New"}>New</option>}
                          {<option value={"Interested"}>Interested</option>}
                          {<option value={"In-followup"}>In-followup</option>}
                          {<option value={"Converted"}>Converted</option>}
                          {<option value={"Lost"}>Lost</option>}
                        </select>
                      }
                      {
                        <select
                          value={assigneeFilter}
                          onChange={(e) => setAssigneeFilter(e.target.value)}
                          aria-label={"Filter by assigned representative"}
                          className={
                            "text-xs sm:text-sm rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 cursor-pointer shadow-2xs"
                          }
                        >
                          {<option value={"all"}>All Representatives</option>}
                          {teamMembers.map((m) => (
                            <option value={m.id}>{m.name}</option>
                          ))}
                        </select>
                      }
                    </div>
                  }
                </div>
              }
              {
                <div
                  className={
                    "text-xs text-slate-500 font-medium tabular-nums shrink-0 px-1 self-start sm:self-auto"
                  }
                >
                  {hasActiveFilters ? (
                    <span>
                      Showing{" "}
                      {
                        <strong className={"text-slate-900 font-bold"}>
                          {processedLeads.length}
                        </strong>
                      }{" "}
                      of{" "}
                      {
                        <strong className={"text-slate-900 font-bold"}>
                          {filteredLeads.length}
                        </strong>
                      }{" "}
                      total leads
                      {filteredLeads.length > processedLeads.length && (
                        <span className={"text-slate-400 ml-1"}>
                          ({filteredLeads.length - processedLeads.length}{" "}
                          filtered out)
                        </span>
                      )}
                    </span>
                  ) : (
                    <span>
                      All{" "}
                      {
                        <strong className={"text-slate-900 font-bold"}>
                          {filteredLeads.length}
                        </strong>
                      }{" "}
                      leads
                    </span>
                  )}
                </div>
              }
            </div>
          }
          {hasActiveFilters && (
            <div
              className={
                "flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs"
              }
            >
              {
                <span
                  className={
                    "text-slate-400 flex items-center gap-1 text-[11px] font-medium"
                  }
                >
                  {<Filter className={"w-3 h-3 text-emerald-600"} />}
                  {<span>Active filters:</span>}
                </span>
              }
              {search.trim() && (
                <span
                  className={
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium"
                  }
                >
                  {<span>Search: "{search.trim()}"</span>}
                  {
                    <button
                      onClick={() => setSearch("")}
                      aria-label={"Remove search filter"}
                      className={"hover:text-emerald-950 cursor-pointer"}
                    >
                      {<X className={"w-3 h-3"} />}
                    </button>
                  }
                </span>
              )}
              {statusFilter !== "all" && (
                <span
                  className={
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-medium"
                  }
                >
                  {<span>Stage: {statusFilter}</span>}
                  {
                    <button
                      onClick={() => setStatusFilter("all")}
                      aria-label={"Remove stage filter"}
                      className={"hover:text-slate-900 cursor-pointer"}
                    >
                      {<X className={"w-3 h-3"} />}
                    </button>
                  }
                </span>
              )}
              {assigneeFilter !== "all" && (
                <span
                  className={
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-medium"
                  }
                >
                  {<span>Rep: {selectedAssigneeName || assigneeFilter}</span>}
                  {
                    <button
                      onClick={() => setAssigneeFilter("all")}
                      aria-label={"Remove representative filter"}
                      className={"hover:text-slate-900 cursor-pointer"}
                    >
                      {<X className={"w-3 h-3"} />}
                    </button>
                  }
                </span>
              )}
              {
                <button
                  onClick={handleClearFilters}
                  className={
                    "text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 ml-auto cursor-pointer"
                  }
                >
                  {<RotateCcw className={"w-3 h-3"} />}
                  {<span>Clear all filters</span>}
                </button>
              }
            </div>
          )}
        </div>
      }
      {
        <LeadsTableView
          leads={processedLeads}
          totalUnfilteredCount={filteredLeads.length}
          hasActiveFilter={hasActiveFilters}
          onClearFilters={handleClearFilters}
          onOpenLead={handleOpenLead}
          onEditLead={handleEditLead}
          onAddLead={() => {
            setLeadToEdit(null);
            setModalOpen(true);
          }}
        />
      }
      {
        <LeadDrawer
          lead={selectedLead}
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onEdit={handleEditLead}
        />
      }
      {
        <LeadModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          leadToEdi={leadToEdit}
        />
      }
    </div>
  );
};
export { LeadsPage };
