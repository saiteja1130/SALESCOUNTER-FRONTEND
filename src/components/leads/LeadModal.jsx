import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";

const LeadModal = ({ isOpen, onClose, leadToEdit }) => {
  const { teamMembers, addLead, updateLead } = useApp();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("New");
  const [assignedToId, setAssignedToId] = useState("");
  const [source, setSource] = useState("WhatsApp Inbound");
  const [interestedProduct, setInterestedProduct] = useState("");
  const [budgetRange, setBudgetRange] = useState("Bespoke Package");
  const [deliveryCity, setDeliveryCity] = useState("");

  // Fix bug: reset form fields whenever modal opens or leadToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (leadToEdit) {
        setName(leadToEdit.name || "");
        setPhone(leadToEdit.phone || "");
        setEmail(leadToEdit.email || "");
        setStatus(leadToEdit.status || "New");
        setAssignedToId(leadToEdit.assignedToId || teamMembers[0]?.id || "");
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
        setAssignedToId(teamMembers[0]?.id || "");
        setSource("WhatsApp Inbound");
        setInterestedProduct("");
        setBudgetRange("Bespoke Package");
        setDeliveryCity("");
      }
    }
  }, [isOpen, leadToEdit, teamMembers]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      showToast("Full name and WhatsApp phone number are required", "error");
      return;
    }

    const assignee = teamMembers.find((t) => t.id === assignedToId);

    if (leadToEdit) {
      updateLead(leadToEdit.id, {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        status,
        assignedToId,
        assignedToName: assignee?.name || "Unassigned",
        source,
        collectedData: {
          ...leadToEdit.collectedData,
          interestedProduct: interestedProduct.trim(),
          budgetRange,
          deliveryCity: deliveryCity.trim(),
        },
      });
      showToast("Lead details updated successfully");
    } else {
      addLead({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        status,
        assignedToId,
        assignedToName: assignee?.name || "Unassigned",
        source,
        collectedData: {
          interestedProduct: interestedProduct.trim(),
          budgetRange,
          deliveryCity: deliveryCity.trim(),
        },
      });
      showToast("New WhatsApp lead created successfully");
    }
    onClose();
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
        <div className="flex items-center justify-end gap-2.5 w-full">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit}>
            {leadToEdit ? "Save Changes" : "Create Lead"}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
            {teamMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} ({member.role === "owner" ? "Sales Manager" : "Sales Rep"})
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