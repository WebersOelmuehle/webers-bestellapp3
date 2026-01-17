import articles from "@/data/articles.json";

type Article = {
  artikelnummer: string;
  name: string;
  einheit?: string;
  kategorie: string;
  bild_url?: string;
};

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const list = (articles as Article[]).filter(
    (a) => (a.kategorie || "").toLowerCase() === slug.toLowerCase()
  );

  return (
    <main style={{ maxWidth: 1100, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ marginBottom: 6 }}>Kategorie: {slug}</h1>
      <p style={{ marginTop: 0, opacity: 0.7 }}>
        {list.length} Artikel gefunden
      </p>

      {list.length === 0 ? (
        <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
          Keine Artikel in dieser Kategorie. Prüfe in <code>data/articles.json</code> den Wert{" "}
          <code>kategorie</code>.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 14,
            marginTop: 18,
          }}
        >
          {list.map((a) => (
            <div
              key={a.artikelnummer}
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: 14,
                padding: 14,
                background: "#fff",
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
                    marginBottom: 10,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: 140,
                    borderRadius: 10,
                    background: "#f4f4f4",
                    marginBottom: 10,
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

              <div style={{ fontWeight: 700, marginBottom: 6 }}>{a.name}</div>

              <div style={{ fontSize: 12, opacity: 0.75 }}>
                Art.-Nr.: {a.artikelnummer}
              </div>
              {a.einheit ? (
                <div style={{ fontSize: 12, opacity: 0.75 }}>
                  Einheit: {a.einheit}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

