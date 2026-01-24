"use client";

type Article = {
  artikelnummer: string;
  name: string;
  einheit?: string;
  kategorie: string;
  bild_url?: string;
};

export default function CategoryClient({ items }: { items: Article[] }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {items.map((a) => (
        <div
          key={a.artikelnummer}
          style={{
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: 12,
          }}
        >
          <div style={{ fontWeight: 600 }}>{a.name}</div>
          <div style={{ opacity: 0.7, fontSize: 14 }}>
            {a.artikelnummer}
            {a.einheit ? ` • ${a.einheit}` : ""}
          </div>
        </div>
      ))}
    </div>
  );
}
