export default function CategoryPage({ params }: { params: { slug: string } }) {
  return (
    <main style={{ padding: 18, maxWidth: 900, margin: "0 auto" }}>
      <a href="/" style={{ textDecoration: "none" }}>← zurück</a>
      <h1 style={{ marginTop: 12 }}>Kategorie: {params.slug}</h1>
      <p style={{ opacity: 0.8 }}>
        Hier kommt als nächstes die Artikelliste + Mengenfeld + „In den Warenkorb“.
      </p>
    </main>
  );
}
