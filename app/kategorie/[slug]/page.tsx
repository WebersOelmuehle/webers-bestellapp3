import articles from "@/data/articles.json";
import CategoryClient from "./CategoryClient";

type Article = {
  artikelnummer: string;
  name: string;
  einheit?: string;
  kategorie: string;
  bild_url?: string;
};

type Props = {
  params: Promise<{ slug: string }>; // <-- so will Next 15.5.9 das hier
};

function normalizeKategorie(k?: string) {
  const v = (k || "").toLowerCase().trim();

  if (v === "obst" || v === "gemuese" || v === "obst/gemuese" || v === "obst-gemuese") {
    return "obst-gemuese";
  }
  return v;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const slugNorm = decodeURIComponent(slug || "").toLowerCase();

  const list = (articles as Article[]).filter(
    (a) => normalizeKategorie(a.kategorie) === slugNorm
  );

  return (
    <main style={{ maxWidth: 1100, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ marginBottom: 6 }}>Kategorie: {slugNorm}</h1>
      <p style={{ marginTop: 0, opacity: 0.7 }}>{list.length} Artikel gefunden</p>

      <CategoryClient items={list} />
    </main>
  );
}
