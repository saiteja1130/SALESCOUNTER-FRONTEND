import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { LeadsTableView } from "../../components/leads/LeadsTableView";
import { LeadDrawer } from "../../components/leads/LeadDrawer";
import { LeadModal } from "../../components/leads/LeadModal";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
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
    search.trim() || statusFilter !== "all" || assigneeFilter !== "all"
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
    (m) => m.id === assigneeFilter
  )?.name;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="All WhatsApp Leads"
        description="Comprehensive list of prospective customers, assigned representatives, and AI-extracted qualification data."
        badge={
          <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-0.5 rounded-full border border-slate-200">
            {processedLeads.length}{" "}
            {processedLeads.length === 1 ? "Lead" : "Leads"}
          </span>
        }
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={handleExportAll}
            >
              Export CSV
            </Button>
            <Button
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => {
                setLeadToEdit(null);
                setModalOpen(true);
              }}
            >
              Add Lead
            </Button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Field */}
          <div className="md:col-span-5 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by lead name, phone, product, or email..."
              className="w-full text-sm rounded-lg border border-slate-200 bg-white pl-9 pr-9 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by stage"
              className="w-full text-sm rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-colors cursor-pointer"
            >
              <option value="all">All Stages</option>
              <option value="New">New (Untriaged)</option>
              <option value="Interested">Interested (In Dialogue)</option>
              <option value="In-followup">In-followup (Cadence)</option>
              <option value="Converted">Converted (Closed Won)</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          {/* Assignee Filter */}
          <div className="md:col-span-4">
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              aria-label="Filter by assigned representative"
              className="w-full text-sm rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-colors cursor-pointer"
            >
              <option value="all">All Assigned Reps</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.role === "owner" ? "Sales Manager" : "Sales Rep"})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs flex-wrap gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-500 font-medium">Active filters:</span>
              {search && (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                  Search: &quot;{search}&quot;
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="hover:text-slate-900 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              )}
              {statusFilter !== "all" && (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                  Stage: {statusFilter}
                  <button
                    type="button"
                    onClick={() => setStatusFilter("all")}
                    className="hover:text-slate-900 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              )}
              {assigneeFilter !== "all" && (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                  Rep: {selectedAssigneeName || "Selected"}
                  <button
                    type="button"
                    onClick={() => setAssigneeFilter("all")}
                    className="hover:text-slate-900 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset all</span>
            </button>
          </div>
        )}
      </div>

      {/* Leads Table */}
      <LeadsTableView
        leads={processedLeads}
        totalUnfilteredCount={filteredLeads.length}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
        onOpenLead={handleOpenLead}
        onEditLead={handleEditLead}
        onAddLead={() => {
          setLeadToEdit(null);
          setModalOpen(true);
        }}
      />

      {/* Drawer and Modal (Bugs fixed: leadToEdit={leadToEdit}) */}
      <LeadDrawer
        lead={selectedLead}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onEdit={handleEditLead}
      />
      <LeadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        leadToEdit={leadToEdit}
      />
    </div>
  );
};

export { LeadsPage };
