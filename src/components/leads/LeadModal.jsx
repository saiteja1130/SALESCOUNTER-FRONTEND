import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { AlertCircle, Clock, Zap } from "lucide-react";

const LeadModal = ({ isOpen, onClose, leadToEdit }) => {
  const { teamMembers, addLead, updateLead, entitlementUsage } = useApp();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("New");
  const [assignedToId, setAssignedToId] = useState("round-robin");
  const [source, setSource] = useState("WhatsApp Inbound");
  const [interestedProduct, setInterestedProduct] = useState("");
  const [budgetRange, setBudgetRange] = useState("Bespoke Package");
  const [deliveryCity, setDeliveryCity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Filter to active sales representatives only (Owners cannot be assigned leads)
  const salesReps = teamMembers.filter(
    (m) => m.role !== "owner" && m.status !== "disabled"
  );

  // Entitlement quota tracking
  const todayCount = entitlementUsage?.dailyLeads?.todayCount ?? 0;
  const maxLimit = entitlementUsage?.dailyLeads?.maxLimit ?? 30;
  const isLimitReached = !leadToEdit && todayCount >= maxLimit;

  useEffect(() => {
    if (isOpen) {
      setFormError(null);
      setIsSubmitting(false);
      if (leadToEdit) {
        setName(leadToEdit.name || "");
        setPhone(leadToEdit.phone || "");
        setEmail(leadToEdit.email || "");
        setStatus(leadToEdit.status || "New");
        setAssignedToId(
          leadToEdit.assignedToId?._id ||
          leadToEdit.assignedToId ||
          "unassigned"
        );
        setSource(leadToEdit.source || "WhatsApp Inbound");
        setInterestedProduct(leadToEdit.collectedData?.interestedProduct || "");
        setBudgetRange(
          leadToEdit.collectedData?.budgetRange || "Bespoke Package"
        );
        setDeliveryCity(leadToEdit.collectedData?.deliveryCity || "");
      } else {
        setName("");
        setPhone("");
        setEmail("");
        setStatus("New");
        setAssignedToId("round-robin");
        setSource("WhatsApp Inbound");
        setInterestedProduct("");
        setBudgetRange("Bespoke Package");
        setDeliveryCity("");
      }
    }
  }, [isOpen, leadToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || !phone.trim()) {
      setFormError("Full name and WhatsApp phone number are required.");
      showToast("Full name and WhatsApp phone number are required", "error");
      return;
    }

    if (isLimitReached) {
      setFormError(`Daily lead creation quota reached (${todayCount}/${maxLimit}). Limit resets at 12:00 AM IST.`);
      showToast("Daily lead creation quota reached", "error");
      return;
    }

    const assignee = salesReps.find((t) => t.id === assignedToId);
    let resolvedName = "Unassigned";
    if (assignedToId === "round-robin") {
      resolvedName = "Round-Robin Auto Assign";
    } else if (assignee) {
      resolvedName = assignee.name;
    }

    setIsSubmitting(true);
    try {
      if (leadToEdit) {
        await updateLead(leadToEdit.id, {
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          status,
          assignedToId: assignedToId === "unassigned" ? "unassigned" : assignedToId,
          assignedToName: resolvedName,
          source,
          collectedData: {
            ...leadToEdit.collectedData,
            interestedProduct: interestedProduct.trim(),
            budgetRange,
            deliveryCity: deliveryCity.trim(),
          },
        });
        showToast("Lead details updated successfully");
        onClose();
      } else {
        await addLead({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          status,
          assignedToId,
          assignedToName: resolvedName,
          source,
          collectedData: {
            interestedProduct: interestedProduct.trim(),
            budgetRange,
            deliveryCity: deliveryCity.trim(),
          },
        });
        showToast("New WhatsApp lead created successfully within quota");
        onClose();
      }
    } catch (err) {
      const msg = err.message || "Failed to process lead request";
      setFormError(msg);
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={leadToEdit ? "Edit Lead Details" : "Add New Lead"}
      description={
        leadToEdit
          ? "Update contact profile, sales stage, and AI-extracted qualification data."
          : "Manually add a prospect into your WhatsApp CRM pipeline."
      }
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>IST Midnight Reset</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={isSubmitting || isLimitReached}
            >
              {isSubmitting
                ? "Saving..."
                : leadToEdit
                ? "Save Changes"
                : "Create Lead"}
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Daily Quota Limit Banner */}
        {!leadToEdit && (
          <div
            className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
              isLimitReached
                ? "bg-rose-50 border-rose-200 text-rose-800"
                : "bg-blue-50/70 border-blue-200 text-blue-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap className={`w-4 h-4 ${isLimitReached ? "text-rose-600" : "text-blue-600"}`} />
              <span>
                <strong>Daily Quota:</strong> {todayCount} of {maxLimit} leads used today
              </span>
            </div>
            <span className="font-semibold text-slate-600">Resets at 12:00 AM IST</span>
          </div>
        )}

        {/* Error Alert Box */}
        {formError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div className="leading-relaxed flex-1 font-medium">{formError}</div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Liam Foster"
            required
          />
          <Input
            label="WhatsApp Mobile Phone *"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +1 (555) 234-5678"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. liam@example.com"
          />
          <Select
            label="Pipeline Stage"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="New">New</option>
            <option value="Interested">Interested</option>
            <option value="In-followup">In-followup</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Assigned Sales Representative"
            value={assignedToId}
            onChange={(e) => setAssignedToId(e.target.value)}
          >
            <option value="round-robin">⚡ Round-Robin Auto Assign (Active Reps)</option>
            <option value="unassigned">Unassigned (Queue)</option>
            {salesReps.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} (Sales Rep)
              </option>
            ))}
          </Select>

          <Select
            label="Inbound Channel / Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          >
            <option value="WhatsApp Inbound">WhatsApp Inbound (Organic)</option>
            <option value="Instagram Ad -> WhatsApp">Instagram Ad - WhatsApp</option>
            <option value="Website QR Scan">Website QR Scan</option>
            <option value="VIP Referral">VIP Referral</option>
            <option value="Trade Show / Event">Trade Show / Event</option>
          </Select>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Qualification Data (AI Extracted)
          </div>

          <div className="space-y-3">
            <Input
              label="Interested Product or Service"
              value={interestedProduct}
              onChange={(e) => setInterestedProduct(e.target.value)}
              placeholder="e.g. Artisan Dining Table, Velvet Sectional"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Budget Category"
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
              >
                <option value="Under $1,000">Under $1,000</option>
                <option value="$1,000 - $3,000">$1,000 - $3,000</option>
                <option value="$3,000 - $7,500">$3,000 - $7,500</option>
                <option value="$7,500 - $15,000">$7,500 - $15,000</option>
                <option value="$15,000+ Premium">$15,000+ Premium</option>
                <option value="Bespoke Package">Bespoke Package</option>
              </Select>

              <Input
                label="Delivery City / Area"
                value={deliveryCity}
                onChange={(e) => setDeliveryCity(e.target.value)}
                placeholder="e.g. Seattle, WA"
              />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export { LeadModal };