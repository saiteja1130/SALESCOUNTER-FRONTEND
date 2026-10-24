import React, { useState, useEffect, Fragment } from "react";
import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import { Badge } from "../ui/Badge";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { formatRelativeTime } from "../../utils/formatters";
import { exportLeadsToCSV } from "../../utils/csvExport";
import {
  MessageSquare,
  MoreVertical,
  Download,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Edit2,
  RotateCcw,
  Plus,
  Users,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LeadsTableView = ({
  leads,
  totalUnfilteredCount = 0,
  hasActiveFilters = false,
  hasActiveFilter, // fallback
  onClearFilters,
  onAddLead,
  onOpenLead,
  onEditLead,
}) => {
  const isFiltersActive = hasActiveFilters || hasActiveFilter || false;
  const { teamMembers, assignLead, changeLeadStatus } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkAssignee, setBulkAssignee] = useState("");
  const [bulkStatus, setBulkStatus] = useState("Interested");
  const [activeMenuLeadId, setActiveMenuLeadId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setSelectedIds([]);
  }, [leads]);

  const totalPages = Math.max(1, Math.ceil(leads.length / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [leads.length, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, leads.length);
  const paginatedLeads = leads.slice(startIndex, endIndex);

  const isAllOnPageSelected =
    paginatedLeads.length > 0 &&
    paginatedLeads.every((l) => selectedIds.includes(l.id));

  const toggleSelectAllPage = () => {
    if (isAllOnPageSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !paginatedLeads.some((l) => l.id === id))
      );
    } else {
      const pageIds = paginatedLeads.map((l) => l.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkAssign = () => {
    if (!bulkAssignee) return;
    selectedIds.forEach((id) => assignLead(id, bulkAssignee));
    showToast(`Assigned ${selectedIds.length} leads to representative`);
    setSelectedIds([]);
  };

  const handleBulkStatus = () => {
    selectedIds.forEach((id) => changeLeadStatus(id, bulkStatus));
    showToast(`Updated status for ${selectedIds.length} leads`);
    setSelectedIds([]);
  };

  const handleExportSelected = () => {
    const toExport = leads.filter((l) => selectedIds.includes(l.id));
    exportLeadsToCSV(toExport.length > 0 ? toExport : leads);
    showToast(
      `Exported ${toExport.length > 0 ? toExport.length : leads.length} leads to CSV`
    );
  };

  const statusOptions = [
    "New",
    "Interested",
    "In-followup",
    "Converted",
    "Lost",
  ];

  return (
    <div className="space-y-3">
      {/* Bulk Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="bg-slate-900 text-white rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-md animate-in fade-in">
          <div className="flex items-center gap-2.5 font-medium">
            <span className="bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-emerald-500/30">
              {selectedIds.length} of {leads.length} selected
            </span>
            <span className="text-slate-400 text-xs hidden sm:inline">
              (Bulk changes apply to checked rows)
            </span>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-slate-300 hover:text-white underline cursor-pointer text-xs ml-1"
            >
              Deselect all
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              aria-label="Select bulk status"
              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {statusOptions.map((st) => (
                <option key={st} value={st}>
                  Status: {st}
                </option>
              ))}
            </select>
            <Button size="sm" variant="secondary" onClick={handleBulkStatus}>
              Apply Status
            </Button>

            <select
              value={bulkAssignee}
              onChange={(e) => setBulkAssignee(e.target.value)}
              aria-label="Select bulk assignee"
              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="">Assign sales rep...</option>
              {teamMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleBulkAssign}
              disabled={!bulkAssignee}
            >
              Assign
            </Button>

            <Button
              size="sm"
              variant="outline"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={handleExportSelected}
              className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
            >
              Export ({selectedIds.length})
            </Button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        {paginatedLeads.length === 0 ? (
          <div className="py-16 px-4 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto shadow-2xs">
              <Users className="w-6 h-6" />
            </div>
            {isFiltersActive ? (
              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                  No leads match these filters
                </h3>
                <p className="text-sm text-slate-500">
                  Try adjusting your search terms or clearing your stage and representative filters.
                </p>
                {onClearFilters && (
                  <div className="pt-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={<RotateCcw className="w-3.5 h-3.5" />}
                      onClick={onClearFilters}
                    >
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                  No leads in your workspace yet
                </h3>
                <p className="text-sm text-slate-500">
                  New leads appear automatically when prospective clients message your connected WhatsApp number.
                </p>
                {onAddLead && (
                  <div className="pt-2">
                    <Button
                      size="sm"
                      icon={<Plus className="w-3.5 h-3.5" />}
                      onClick={onAddLead}
                    >
                      Add First Lead
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px] text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/90 bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider sticky top-0 z-10">
                  <th className="py-3.5 px-4 w-10">
                    <button
                      type="button"
                      onClick={toggleSelectAllPage}
                      className="text-slate-400 hover:text-slate-600 flex items-center cursor-pointer"
                      title={
                        isAllOnPageSelected
                          ? "Deselect page"
                          : `Select all ${paginatedLeads.length} on this page`
                      }
                      aria-label={
                        isAllOnPageSelected
                          ? "Deselect all on page"
                          : `Select all ${paginatedLeads.length} on this page`
                      }
                    >
                      {isAllOnPageSelected ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3.5 px-4 font-semibold min-w-[160px]">
                    Lead Contact
                  </th>
                  <th className="py-3.5 px-4 font-semibold min-w-[110px]">
                    Stage
                  </th>
                  <th className="py-3.5 px-4 font-semibold min-w-[140px]">
                    Assigned Rep
                  </th>
                  <th className="py-3.5 px-4 font-semibold text-right min-w-[120px]">
                    Last Contact
                  </th>
                  <th className="py-3.5 px-4 font-semibold text-right min-w-[100px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {paginatedLeads.map((lead) => {
                  const isSelected = selectedIds.includes(lead.id);
                  const isMenuOpen = activeMenuLeadId === lead.id;

                  return (
                    <tr
                      key={lead.id}
                      role="row"
                      tabIndex={0}
                      aria-label={`Lead ${lead.name}, status ${lead.status}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          onOpenLead(lead);
                        }
                      }}
                      className={`h-14 hover:bg-slate-50/80 transition-colors cursor-pointer group focus-visible:outline-none focus-visible:bg-slate-50 ${
                        isSelected ? "bg-emerald-50/40" : ""
                      }`}
                    >
                      <td
                        className="py-3 px-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => toggleSelect(lead.id)}
                          aria-label={`Select lead ${lead.name}`}
                          className="text-slate-400 hover:text-slate-600 flex items-center cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      <td
                        className="py-3 px-4"
                        onClick={() => onOpenLead(lead)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={lead.name}
                            size="md"
                            className="shrink-0 ring-1 ring-slate-200/80"
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                              {lead.name}
                            </div>
                            <div className="text-xs text-slate-500 font-mono mt-0.5 truncate">
                              {lead.phone}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td
                        className="py-3 px-4"
                        onClick={() => onOpenLead(lead)}
                      >
                        <Badge status={lead.status} size="sm" />
                      </td>

                      <td
                        className="py-3 px-4"
                        onClick={() => onOpenLead(lead)}
                      >
                        <div className="flex items-center gap-2.5">
                          <Avatar
                            name={lead.assignedToName || "Unassigned"}
                            size="sm"
                            className="ring-1 ring-slate-200/80"
                          />
                          <div className="font-medium text-xs text-slate-800 truncate max-w-[130px]">
                            {lead.assignedToName || "Unassigned"}
                          </div>
                        </div>
                      </td>

                      <td
                        className="py-3 px-4 text-right text-slate-500 whitespace-nowrap text-xs tabular-nums"
                        onClick={() => onOpenLead(lead)}
                      >
                        <div className="inline-flex items-center gap-1.5 text-slate-600 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{formatRelativeTime(lead.lastContactAt)}</span>
                        </div>
                      </td>

                      <td
                        className="py-3 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="inline-flex items-center gap-1.5 relative">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/inbox?leadId=${lead.id}`)
                            }
                            aria-label={`Open WhatsApp conversation with ${lead.name}`}
                            title="Open chat in Shared Inbox"
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 rounded-md transition-colors shadow-2xs cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="hidden xl:inline">Chat</span>
                          </button>

                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setActiveMenuLeadId(
                                  isMenuOpen ? null : lead.id
                                )
                              }
                              aria-label={`Open actions for ${lead.name}`}
                              title="More options"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {isMenuOpen && (
                              <Fragment>
                                <div
                                  className="fixed inset-0 z-30"
                                  onClick={() => setActiveMenuLeadId(null)}
                                />
                                <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-40 text-left text-xs animate-in fade-in duration-100">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveMenuLeadId(null);
                                      navigate(`/inbox?leadId=${lead.id}`);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-emerald-700 cursor-pointer font-medium"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Open in Inbox</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveMenuLeadId(null);
                                      onOpenLead(lead);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer font-medium"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                                    <span>View Details</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveMenuLeadId(null);
                                      onEditLead(lead);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer font-medium"
                                  >
                                    <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Edit Lead Info</span>
                                  </button>
                                </div>
                              </Fragment>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination & Row Controls */}
        {leads.length > 0 && (
          <div className="px-4 py-3.5 border-t border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <span>
                Showing{" "}
                <strong className="font-semibold text-slate-900">
                  {leads.length > 0 ? startIndex + 1 : 0}
                </strong>{" "}
                to{" "}
                <strong className="font-semibold text-slate-900">
                  {endIndex}
                </strong>{" "}
                of{" "}
                <strong className="font-semibold text-slate-900 tabular-nums">
                  {leads.length}
                </strong>{" "}
                leads
              </span>
              <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
                <span className="text-xs text-slate-400">Rows:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  aria-label="Rows per page"
                  className="bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="First page"
                aria-label="First page"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Previous page"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-1 px-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - currentPage) <= 1
                  )
                  .map((p, idx, arr) => (
                    <React.Fragment key={p}>
                      {idx > 0 && arr[idx - 1] !== p - 1 && (
                        <span className="px-1 text-slate-400 select-none">
                          ...
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => setCurrentPage(p)}
                        aria-label={`Go to page ${p}`}
                        className={`w-7 h-7 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                          currentPage === p
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Next page"
                aria-label="Next page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Last page"
                aria-label="Last page"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { LeadsTableView };