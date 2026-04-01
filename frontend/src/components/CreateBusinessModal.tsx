import { useState } from "react";
import { api, BusinessCreate } from "../api/businesses";
import { randomBusiness } from "../utils/random";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateBusinessModal({ onClose, onCreated }: Props) {
  const [form, setForm] = useState<BusinessCreate>(randomBusiness());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (field: keyof BusinessCreate, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.createBusiness(form);
      onCreated();
    } catch {
      setError("Failed to create business.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>New Business</h2>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.grid}>
            {(
              [
                ["name", "Name"],
                ["ein", "EIN (XX-XXXXXXX)"],
                ["owner_name", "Owner Name"],
                ["website", "Website"],
                ["date_founded", "Date Founded"],
              ] as [keyof BusinessCreate, string][]
            ).map(([field, label]) => (
              <div key={field} style={styles.field}>
                <label style={styles.label}>{label}</label>
                <input
                  style={styles.input}
                  value={(form[field] as string) ?? ""}
                  onChange={(e) => set(field, e.target.value)}
                />
              </div>
            ))}

            <div style={styles.field}>
              <label style={styles.label}>Business Type</label>
              <select
                style={styles.input}
                value={form.business_type ?? ""}
                onChange={(e) => set("business_type", e.target.value)}
              >
                {["llc", "corporation", "sole_proprietor", "partnership", "nonprofit"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>State</label>
              <input
                style={styles.input}
                value={form.state ?? ""}
                onChange={(e) => set("state", e.target.value)}
                maxLength={2}
              />
            </div>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.modalFooter}>
            <button type="button" style={styles.secondaryBtn} onClick={onClose}>Cancel</button>
            <button type="submit" style={styles.primaryBtn} disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
  },
  modal: {
    background: "#fff", borderRadius: 12, padding: 28, width: 520,
    maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
  },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { margin: 0, fontSize: 18, fontWeight: 600, color: "#1e293b" },
  closeBtn: { background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#94a3b8" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px" },
  field: { display: "flex", flexDirection: "column", gap: 4 },
  label: { fontSize: 12, fontWeight: 500, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" },
  input: { padding: "8px 10px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 14, color: "#1e293b", outline: "none" },
  error: { color: "#ef4444", fontSize: 13, marginTop: 12 },
  modalFooter: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 },
  primaryBtn: { padding: "8px 20px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, fontSize: 14, fontWeight: 500, cursor: "pointer" },
  secondaryBtn: { padding: "8px 20px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 6, fontSize: 14, fontWeight: 500, cursor: "pointer" },
};
