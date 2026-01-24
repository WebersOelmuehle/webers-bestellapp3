 "use client";

import { useMemo, useState } from "react";
import articles from "@/data/articles.json";

type Article = {
  artikelnummer: string;
  name: string;
  einheit?: string;
  kategorie: string;
  bild_url?: string;
};

type Props = {
  params: { slug: string }; // <-- NICHT Promise!
};

function normalizeKategorie(k?: string) {
  const v = (k || "").toLowerCase().trim();

  // Obst + Gemüse zusammenfassen
  if (v === "obst" || v === "gemuese" || v === "obst-gemuese" || v === "obst/gemuese") return "obst-gemuese";

  return v;
}

export default function Page({ params }: Props) {
  // <-- NICHT async, NICHT await!
  const slug = decodeURIComponent(params.slug || "").toLowerCase();

  const list = useMemo(() => {
    return (articles as Article[]).filter((a) => normalizeKategorie(a.kategorie) === slug);
  }, [slug]);

  // Mengen je Artikelnummer
  const [qty, setQty] = useState<Record<string, string>>({});

  return (
    <main style={{ maxWidth: 1100, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ marginBottom: 6 }}>Kategorie: {slug}</h1>
      <p style={{ marginTop: 0, opacity: 0.7 }}>{list.length} Artikel gefunden</p>

      {list.length === 0 ? (
        <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
          Keine Artikel in dieser Kategorie. Prüfe in <code>data/articles.json</code> den Wert <code>kategorie</code>.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 14,
            marginTop: 18,
          }}
        >
          {list.map((a) => (
            <div
              key={`${a.artikelnummer}-${a.name}`}
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: 14,
                padding: 14,
                background: "#fff",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {a.bild_url ? (
                <img
                  src={a.bild_url}
                  alt={a.name}
                  style={{
                    width: "100%",
                    height: 140,
                    objectFit: "cover",
                    borderRadius: 10,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: 140,
                    borderRadius: 10,
                    background: "#f4f4f4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#777",
                    fontSize: 12,
                  }}
                >
                  Kein Bild
                </div>
              )}

              <div>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{a.name}</div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>Art.-Nr.: {a.artikelnummer}</div>
                {a.einheit ? <div style={{ fontSize: 12, opacity: 0.75 }}>Einheit: {a.einheit}</div> : null}
              </div>

              {/* Menge eingeben */}
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input
                  inputMode="numeric"
                  placeholder="Menge"
                  value={qty[a.artikelnummer] ?? ""}
                  onChange={(e) => setQty((prev) => ({ ...prev, [a.artikelnummer]: e.target.value }))}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() => alert(`Hinzugefügt: ${qty[a.artikelnummer] || "?"} x ${a.name}`)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    background: "#fff",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
