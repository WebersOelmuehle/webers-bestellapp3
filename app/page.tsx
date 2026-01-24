const CATEGORIES = [
  {
    slug: "obst-gemuese",
    label: "Obst & Gemüse",
    image:
      "https://www.webers-oelmuehle.de/img/kunde/images/750x450/I36729I36039IANGE1673523423I.jpg",
  },
  {
    slug: "fleisch-frisch",
    label: "Fleisch frisch",
    image:
      "https://www.webers-oelmuehle.de/img/kunde/images/210x155/I36729I36037IANGE1673523082I.jpg",
  },
  { slug: "fleisch-tiefkuehl", label: "Fleisch TK" },
  { slug: "tiefkuehl-obst-gemuese", label: "TK Obst/Gemüse" },
  { slug: "tiefkuehl-backwaren", label: "TK Backwaren" },
  { slug: "tiefkuehl-pommes", label: "TK Pommes" },

  { slug: "konserven", label: "Konserven" },
  { slug: "fett-und-oele", label: "Fett & Öle" },

  { slug: "pasta-frisch", label: "Pasta frisch" },
  {
    slug: "pasta-getrocknet",
    label: "Pasta getrocknet",
    image:
      "https://www.webers-oelmuehle.de/img/kunde/images/210x155/I36729I36045IANGE1727687521I.jpeg",
  },
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
        {CATEGORIES.map((c) => {
          const hasImage = Boolean((c as any).image);
          const imageUrl = (c as any).image as string | undefined;

          return (
            <a
              key={c.slug}
              href={`/kategorie/${c.slug}`}
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: 12,
                padding: 16,
                textDecoration: "none",
                color: hasImage ? "white" : "inherit",
                background: hasImage
                  ? `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.35)), url("${imageUrl}")`
                  : "white",
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: 120,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
            >
              <div style={{ fontWeight: 700 }}>{c.label}</div>
              <div style={{ opacity: 0.85, marginTop: 6 }}>öffnen →</div>
            </a>
          );
        })}
      </div>
    </main>
  );
}
