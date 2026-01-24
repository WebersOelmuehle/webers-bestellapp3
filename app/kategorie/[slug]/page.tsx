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
  params: Promise<{ slug: string }>; // Next 15.5.9
};

function normalizeKategorie(k?: string) {
  const v = (k || "").toLowerCase().trim();

  if (
    v === "obst" ||
    v === "gemuese" ||
    v === "obst/gemuese" ||
    v === "obst-gemuese" ||
    v === "obst gemuese"
  ) {
    return "obst-gemuese";
  }
  return v;
}

function titleForSlug(slugNorm: string) {
  if (slugNorm === "obst-gemuese") return "Obst & Gemüse";
  // Standard: jedes Wort groß
  return slugNorm
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const slugNorm = decodeURIComponent(slug || "")
    .toLowerCase()
    .trim();

  const list = (articles as Article[]).filter(
    (a) => normalizeKategorie(a.kategorie) === slugNorm
  );

  const title = titleForSlug(slugNorm);

  return (
    <main
      style={{
        maxWidth: 1100,
        margin: "24px auto",
        padding: "0 16px",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
        lineHeight: 1.4,
      }}
    >
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>
          Kategorie: {title}
        </h1>
        <p style={{ margin: "6px 0 0", opacity: 0.7 }}>
          {list.length} Artikel gefunden
        </p>
      </header>

      <CategoryClient items={list} />
    </main>
  );
}
