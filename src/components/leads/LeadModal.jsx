import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
const LeadModal = ({
  isOpen,
  onClose,
  leadToEdit
}) => {
  const { teamMembers, addLead, updateLead } = useApp();
  const { showToast } = useToast();
  const [name, setName] = useState(leadToEdit?.name || "");
  const [phone, setPhone] = useState(leadToEdit?.phone || "");
  const [email, setEmail] = useState(leadToEdit?.email || "");
  const [status, setStatus] = useState(leadToEdit?.status || "New");
  const [assignedToId, setAssignedToId] = useState(
    leadToEdit?.assignedToId || teamMembers[0]?.id || ""
  );
  const [source, setSource] = useState(leadToEdit?.source || "WhatsApp Inbound");
  const [interestedProduct, setInterestedProduct] = useState(
    leadToEdit?.collectedData?.interestedProduct || ""
  );
  const [budgetRange, setBudgetRange] = useState(
    leadToEdit?.collectedData?.budgetRange || "Bespoke Package"
  );
  const [deliveryCity, setDeliveryCity] = useState(
    leadToEdit?.collectedData?.deliveryCity || ""
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      showToast("Name and WhatsApp phone number are required", "error");
      return;
    }
    const assignee = teamMembers.find((t) => t.id === assignedToId);
    if (leadToEdit) {
      updateLead(leadToEdit.id, {
        name,
        phone,
        email,
        status,
        assignedToId,
        assignedToName: assignee?.name || "Unassigned",
        source,
        collectedData: {
          ...leadToEdit.collectedData,
          interestedProduct,
          budgetRange,
          deliveryCity
        }
      });
      showToast("Lead details updated successfully");
    } else {
      addLead({
        name,
        phone,
        email,
        status,
        assignedToId,
        assignedToName: assignee?.name || "Unassigned",
        source,
        tags: ["New Lead", "Inbound"],
        aiHandled: true,
        needsAttention: false,
        collectedData: {
          interestedProduct,
          budgetRange,
          deliveryCity
        }
      });
      showToast("New WhatsApp lead registered and AI assigned");
    }
    onClose();
  };
  const statusOptions = ["New", "Interested", "In-followup", "Converted", "Lost"];
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={leadToEdit ? "Edit Lead Profile" : "Add New WhatsApp Lead"}
      description="Enter customer contact details, sales stage, and qualification criteria."
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit}>
            {leadToEdit ? "Save Changes" : "Create Lead"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Full Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Marcus Aurelius"
            required
          />
          <Input
            label="WhatsApp Phone *"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
            required
          />
        </div>
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@company.com"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Lead Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statusOptions.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </Select>
          <Select
            label="Assigned Salesperson"
            value={assignedToId}
            onChange={(e) => setAssignedToId(e.target.value)}
          >
            {teamMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.role})
              </option>
            ))}
          </Select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Acquisition Channel"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          >
            <option value="WhatsApp Inbound">WhatsApp Inbound</option>
            <option value="Website Click-to-Chat">Website Click-to-Chat</option>
            <option value="Instagram Ad">Instagram Ad</option>
            <option value="Manual">Manual Entry</option>
          </Select>
          <Input
            label="Delivery City / Region"
            value={deliveryCity}
            onChange={(e) => setDeliveryCity(e.target.value)}
            placeholder="e.g. Chicago, IL"
          />
        </div>
        <Input
          label="Interested Product / Catalog Item"
          value={interestedProduct}
          onChange={(e) => setInterestedProduct(e.target.value)}
          placeholder="e.g. Verona Conference Table"
        />
      </form>
    </Modal>
  );
};
export {
  LeadModal
};