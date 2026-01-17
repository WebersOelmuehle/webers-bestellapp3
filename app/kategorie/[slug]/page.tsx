import path from "path";
import { promises as fs } from "fs";
import OrderForm from "./OrderForm";

type Article = {
  id: string;
  name: string;
  unit?: string;
  category: string;
};

function labelFromSlug(slug: string) {
  // optional: schöner anzeigen
  const map: Record<string, string> = {
    obst: "Obst",
    gemuese: "Gemüse",
    "fleisch-frisch": "Fleisch frisch",
    "fleisch-tk": "Fleisch TK",
    "tk-obst-gemuese": "TK Obst/Gemüse",
    "tk-backwaren": "TK Backwaren",
    "tk-pommes": "TK Pommes",
    konserven: "Konserven",
    "pasta-frisch": "Pasta frisch",
    "pasta-getrocknet": "Pasta getrocknet",
    kaese: "Käse",
    molkereiprodukte: "Molkereiprodukte",
    salate: "Salate",
    "non-food": "Non-Food"
  };
  return map[slug] ?? slug;
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const filePath = path.join(process.cwd(), "data", "articles.json");
  const json = await fs.readFile(filePath, "utf8");
  const all: Article[] = JSON.parse(json);

  const articles = all.filter((a) => a.category === slug);

  return <OrderForm categoryLabel={labelFromSlug(slug)} articles={articles} />;
}
