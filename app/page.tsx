const CATEGORIES = [
  { slug: "obst", label: "Obst" },
  { slug: "gemuese", label: "Gemüse" },
  { slug: "fleisch-frisch", label: "Fleisch frisch" },
  { slug: "fleisch-tiefkuehl", label: "Fleisch TK" },
  { slug: "tiefkuehl-obst-gemuese", label: "TK Obst/Gemüse" },
  { slug: "tiefkuehl-backwaren", label: "TK Backwaren" },
  { slug: "tiefkuehl-pommes", label: "TK Pommes" },
  { slug: "konserven", label: "Konserven" },
  { slug: "pasta-frisch", label: "Pasta frisch" },
  { slug: "pasta-getrocknet", label: "Pasta getrocknet" },
  { slug: "kaese", label: "Käse" },
  { slug: "molkereiprodukte", label: "Molkereiprodukte" },
  { slug: "salate", label: "Salate" },
  { slug: "non-food", label: "Non-Food" },
];

export default function Page() {
  return (
    <main style={{ padding: 18, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ margin: "8px 0 12px" }}>Webers Bestell-App</h1>
      <p style={{ margin: "0 0 16px", opacity: 0.8 }}>
        Bitte Kategorie wählen:
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
        }}
      >
        {CATEGORIES.map((c) => (
          <a
            key={c.slug}
            href={`/kategorie/${c.slug}`}
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 12,
              padding: 16,
              textDecoration: "none",
              color: "inherit",
              background: "white",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700 }}>{c.label}</div>
            <div style={{ marginTop: 6, opacity: 0.7, fontSize: 13 }}>
              öffnen →
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}

