import { useEffect, useState } from "react";
import { api, BusinessDetailData, Risk } from "../api/businesses";

interface Props {
  id: number;
  onBack: () => void;
}

const TIER_COLORS: Record<string, { bg: string; color: string }> = {
  low: { bg: "#f0fdf4", color: "#16a34a" },
  medium: { bg: "#fffbeb", color: "#d97706" },
  high: { bg: "#fef2f2", color: "#dc2626" },
};

function RiskCard({ risk }: { risk: Risk }) {
  const tier = risk.risk_tier ?? "unknown";
  const tierStyle = TIER_COLORS[tier] ?? { bg: "#f8fafc", color: "#64748b" };

  return (
    <div style={styles.riskCard}>
      <div style={styles.riskCardTop}>
        <span style={{ ...styles.tierBadge, background: tierStyle.bg, color: tierStyle.color }}>
          {tier.toUpperCase()}
        </span>
        <span style={styles.riskScore}>{risk.risk_score?.toFixed(1) ?? "—"} / 100</span>
        <span style={styles.riskDate}>{new Date(risk.evaluated_at).toLocaleString()}</span>
      </div>
      <div style={styles.riskGrid}>
        <Stat label="Real Business" value={risk.is_real === null ? "—" : risk.is_real ? "Yes" : "No"} />
        <Stat label="Monthly Revenue" value={risk.monthly_revenue != null ? `$${risk.monthly_revenue.toLocaleString()}` : "—"} />
        <Stat label="Outstanding Debt" value={risk.outstanding_debt != null ? `$${risk.outstanding_debt.toLocaleString()}` : "—"} />
        <Stat label="Employees" value={risk.num_employees?.toString() ?? "—"} />
        <Stat label="Owner Credit Score" value={risk.owner_credit_score?.toString() ?? "—"} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.stat}>
      <span style={styles.statLabel}>{label}</span>
      <span style={styles.statValue}>{value}</span>
    </div>
  );
}

export default function BusinessDetail({ id, onBack }: Props) {
  const [business, setBusiness] = useState<BusinessDetailData | null>(null);
  const [history, setHistory] = useState<Risk[] | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const load = async () => setBusiness(await api.getBusiness(id));

  useEffect(() => { load(); }, [id]);

  const handleEvaluate = async () => {
    setEvaluating(true);
    await api.evaluate(id);
    await load();
    if (history) await loadHistory();
    setEvaluating(false);
  };

  const loadHistory = async () => {
    setLoadingHistory(true);
    setHistory(await api.getRiskHistory(id));
    setLoadingHistory(false);
  };

  const toggleHistory = () => {
    if (history) { setHistory(null); return; }
    loadHistory();
  };

  if (!business) return <p style={styles.loading}>Loading...</p>;

  return (
    <div>
      <button style={styles.backBtn} onClick={onBack}>← Back</button>

      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>{business.name}</h1>
          <span style={styles.typeBadge}>{business.business_type ?? "—"}</span>
        </div>
        <div style={styles.actions}>
          <button style={styles.secondaryBtn} onClick={toggleHistory}>
            {history ? "Hide History" : "View History"}
          </button>
          <button style={styles.primaryBtn} onClick={handleEvaluate} disabled={evaluating}>
            {evaluating ? "Evaluating..." : "Run Evaluation"}
          </button>
        </div>
      </div>

      <div style={styles.infoGrid}>
        <InfoCard title="Identity">
          <Stat label="EIN" value={business.ein ?? "—"} />
          <Stat label="State" value={business.state ?? "—"} />
          <Stat label="Founded" value={business.date_founded ?? "—"} />
          <Stat label="Website" value={business.website ?? "—"} />
        </InfoCard>
        <InfoCard title="Owner">
          <Stat label="Name" value={business.owner_name ?? "—"} />
        </InfoCard>
      </div>

      <h2 style={styles.sectionTitle}>Latest Evaluation</h2>
      {business.latest_risk ? (
        <RiskCard risk={business.latest_risk} />
      ) : (
        <p style={styles.empty}>No evaluations yet. Run one to see results.</p>
      )}

      {history !== null && (
        <>
          <h2 style={styles.sectionTitle}>Evaluation History ({history.length})</h2>
          {loadingHistory ? (
            <p style={styles.empty}>Loading...</p>
          ) : history.length === 0 ? (
            <p style={styles.empty}>No history yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {history.map((r) => <RiskCard key={r.id} risk={r} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={styles.infoCard}>
      <h3 style={styles.infoCardTitle}>{title}</h3>
      {children}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  loading: { color: "#94a3b8", textAlign: "center", marginTop: 60 },
  backBtn: { background: "none", border: "none", color: "#2563eb", fontSize: 14, cursor: "pointer", padding: 0, marginBottom: 20, fontWeight: 500 },
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  title: { margin: "0 0 6px", fontSize: 24, fontWeight: 700, color: "#1e293b" },
  typeBadge: { padding: "2px 10px", background: "#eff6ff", color: "#2563eb", borderRadius: 20, fontSize: 12, fontWeight: 500 },
  actions: { display: "flex", gap: 8 },
  primaryBtn: { padding: "9px 18px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer" },
  secondaryBtn: { padding: "9px 18px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer" },
  infoGrid: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 28 },
  infoCard: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: 16 },
  infoCardTitle: { margin: "0 0 12px", fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" },
  sectionTitle: { fontSize: 16, fontWeight: 600, color: "#1e293b", margin: "0 0 12px" },
  empty: { color: "#94a3b8", fontSize: 14 },
  riskCard: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: 16, marginBottom: 10 },
  riskCardTop: { display: "flex", alignItems: "center", gap: 12, marginBottom: 14 },
  tierBadge: { padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 },
  riskScore: { fontSize: 20, fontWeight: 700, color: "#1e293b" },
  riskDate: { marginLeft: "auto", fontSize: 12, color: "#94a3b8" },
  riskGrid: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 },
  stat: { display: "flex", flexDirection: "column", gap: 2 },
  statLabel: { fontSize: 11, fontWeight: 500, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" },
  statValue: { fontSize: 14, fontWeight: 500, color: "#1e293b" },
};
