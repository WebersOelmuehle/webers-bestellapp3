"use client";

import { useMemo, useState } from "react";

type Article = {
  id: string;
  name: string;
  unit?: string;
  category: string;
};

export default function OrderForm({
  categoryLabel,
  articles,
}: {
  categoryLabel: string;
  articles: Article[];
}) {
  const [qty, setQty] = useState<Record<string, string>>({});

  const selected = useMemo(() => {
    return articles
      .map((a) => ({ ...a, quantity: (qty[a.id] || "").trim() }))
      .filter((a) => a.quantity !== "" && a.quantity !== "0");
  }, [articles, qty]);

  function setQuantity(id: string, value: string) {
    setQty((prev) => ({ ...prev, [id]: value }));
  }

  function handleSubmit() {
    // Später ersetzen wir das durch "Mail senden"
    // Für jetzt: einfache Vorschau/Debug
    alert(
      "Bestellung (Demo):\n\n" +
        selected
          .map((a) => `${a.quantity} ${a.unit ?? ""} ${a.name} (${a.id})`)
          .join("\n")
    );
  }

  return (
    <main style={{ maxWidth: 900, margin: "24px auto", padding: 16 }}>
      <h1 style={{ fontSize: 34, marginBottom: 8 }}>Kategorie: {categoryLabel}</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Mengen eintragen und später per E-Mail senden.
      </p>

      <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
        {articles.map((a) => (
          <div
            key={a.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>{a.name}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                {a.id}{a.unit ? ` • Einheit: ${a.unit}` : ""}
              </div>
            </div>

            <input
              value={qty[a.id] || ""}
              onChange={(e) => setQuantity(a.id, e.target.value)}
              placeholder="Menge"
              inputMode="decimal"
              style={{
                width: 140,
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ccc",
                textAlign: "right",
              }}
            />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 18, alignItems: "center" }}>
        <button
          onClick={handleSubmit}
          disabled={selected.length === 0}
          style={{
            padding: "12px 16px",
            borderRadius: 12,
            border: "none",
            cursor: selected.length === 0 ? "not-allowed" : "pointer",
            fontWeight: 700,
          }}
        >
          Bestellung senden (Demo)
        </button>

        <div style={{ fontSize: 13, opacity: 0.8 }}>
          Ausgewählt: <b>{selected.length}</b> Position(en)
        </div>
      </div>
    </main>
  );
}
