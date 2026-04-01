import { useEffect, useState } from "react";
import { api, Business } from "../api/businesses";
import CreateBusinessModal from "./CreateBusinessModal";

interface Props {
  onSelect: (id: number) => void;
}

export default function BusinessList({ onSelect }: Props) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setBusinesses(await api.listBusinesses());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Businesses</h1>
          <p style={styles.subtitle}>{businesses.length} total</p>
        </div>
        <button style={styles.primaryBtn} onClick={() => setShowModal(true)}>
          + New Business
        </button>
      </div>

      {loading ? (
        <p style={styles.empty}>Loading...</p>
      ) : businesses.length === 0 ? (
        <p style={styles.empty}>No businesses yet. Create one to get started.</p>
      ) : (
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <span>Name</span>
            <span>Type</span>
            <span>State</span>
            <span>Owner</span>
            <span>Founded</span>
          </div>
          {businesses.map((b) => (
            <div key={b.id} style={styles.row} onClick={() => onSelect(b.id)}>
              <span style={styles.name}>{b.name}</span>
              <span style={styles.badge}>{b.business_type ?? "—"}</span>
              <span style={styles.cell}>{b.state ?? "—"}</span>
              <span style={styles.cell}>{b.owner_name ?? "—"}</span>
              <span style={styles.cell}>{b.date_founded ?? "—"}</span>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <CreateBusinessModal
          onClose={() => setShowModal(false)}
          onCreated={() => { setShowModal(false); load(); }}
        />
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  title: { margin: 0, fontSize: 24, fontWeight: 700, color: "#1e293b" },
  subtitle: { margin: "4px 0 0", fontSize: 14, color: "#94a3b8" },
  primaryBtn: { padding: "9px 18px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer" },
  empty: { color: "#94a3b8", fontSize: 15, textAlign: "center", marginTop: 60 },
  table: { background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden" },
  tableHeader: {
    display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.5fr 1fr",
    padding: "10px 16px", background: "#f8fafc",
    fontSize: 12, fontWeight: 600, color: "#94a3b8",
    textTransform: "uppercase", letterSpacing: "0.05em",
    borderBottom: "1px solid #e2e8f0",
  },
  row: {
    display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.5fr 1fr",
    padding: "14px 16px", cursor: "pointer", alignItems: "center",
    borderBottom: "1px solid #f1f5f9", transition: "background 0.1s",
  },
  name: { fontWeight: 500, color: "#1e293b", fontSize: 14 },
  badge: {
    display: "inline-block", padding: "2px 8px", background: "#eff6ff",
    color: "#2563eb", borderRadius: 20, fontSize: 12, fontWeight: 500,
    width: "fit-content",
  },
  cell: { fontSize: 14, color: "#64748b" },
};
