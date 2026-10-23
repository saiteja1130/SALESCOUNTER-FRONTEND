function exportLeadsToCSV(leads, filename = "conversly-leads-export.csv") {
  const headers = [
    "Lead ID",
    "Name",
    "Phone",
    "Email",
    "Status",
    "Assigned Salesperson",
    "Source",
    "Interested Product",
    "Budget Range",
    "City",
    "Created At"
  ];
  const rows = leads.map((l) => [
    `"${l.id}"`,
    `"${(l.name || "").replace(/"/g, '""')}"`,
    `"${l.phone || ""}"`,
    `"${l.email || ""}"`,
    `"${l.status}"`,
    `"${(l.assignedToName || "").replace(/"/g, '""')}"`,
    `"${l.source || ""}"`,
    `"${(l.collectedData?.interestedProduct || "").replace(/"/g, '""')}"`,
    `"${(l.collectedData?.budgetRange || "").replace(/"/g, '""')}"`,
    `"${(l.collectedData?.deliveryCity || "").replace(/"/g, '""')}"`,
    `"${l.createdAt}"`
  ]);
  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
export {
  exportLeadsToCSV
};
