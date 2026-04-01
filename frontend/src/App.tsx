import { useEffect, useState } from "react";

interface Item {
  id: number;
  name: string;
  description: string | null;
}

const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchItems = async () => {
    const res = await fetch(`${API_BASE}/items/`);
    setItems(await res.json());
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${API_BASE}/items/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    setName("");
    setDescription("");
    fetchItems();
  };

  const handleDelete = async (id: number) => {
    await fetch(`${API_BASE}/items/${id}`, { method: "DELETE" });
    fetchItems();
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Finturf</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 8 }}>
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ marginRight: 8, padding: 6 }}
          />
          <input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ marginRight: 8, padding: 6 }}
          />
          <button type="submit">Add</button>
        </div>
      </form>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((item) => (
          <li
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <span>
              <strong>{item.name}</strong>
              {item.description && (
                <span style={{ color: "#666", marginLeft: 8 }}>
                  {item.description}
                </span>
              )}
            </span>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
