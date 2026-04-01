import { useState } from "react";
import BusinessList from "./components/BusinessList";
import BusinessDetail from "./components/BusinessDetail";

type View = { page: "list" } | { page: "detail"; id: number };

export default function App() {
  const [view, setView] = useState<View>({ page: "list" });

  return (
    <div style={styles.root}>
      <nav style={styles.nav}>
        <span style={styles.navBrand} onClick={() => setView({ page: "list" })}>
          Finturf
        </span>
      </nav>
      <main style={styles.main}>
        {view.page === "list" && (
          <BusinessList onSelect={(id) => setView({ page: "detail", id })} />
        )}
        {view.page === "detail" && (
          <BusinessDetail
            id={view.id}
            onBack={() => setView({ page: "list" })}
          />
        )}
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: { minHeight: "100vh", background: "#f8fafc", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
  nav: { background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 32px", height: 56, display: "flex", alignItems: "center" },
  navBrand: { fontSize: 18, fontWeight: 700, color: "#2563eb", cursor: "pointer", letterSpacing: "-0.02em" },
  main: { maxWidth: 960, margin: "0 auto", padding: "32px 24px" },
};
