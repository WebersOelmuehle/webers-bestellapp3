"use client";

import { useEffect, useMemo, useState } from "react";
import OrderForm from "./OrderForm";

type Article = {
  artikelnummer: string;
  name: string;
  einheit?: string;
  kategorie: string;
  bild_url?: string;
};

type Props = {
  items: Article[];
};

type CartItem = {
  artikelnummer: string;
  name: string;
  einheit?: string;
  qty: number;
};

// Kategorie -> Icon (für Kunden, die nach Bildern/Icons suchen)
function getCategoryIcon(k?: string) {
  const v = (k || "").toLowerCase().trim();

  if (v.includes("obst") || v.includes("gemüse") || v.includes("gemuese")) return "🍎";
  if (v.includes("salat")) return "🥗";

  if (v.includes("fleisch")) return "🥩";
  if (v.includes("fisch")) return "🐟";

  if (v.includes("tiefkühl") || v.includes("tiefkuehl") || v.includes("tk")) return "❄️";
  if (v.includes("pommes")) return "🍟";

  if (v.includes("käse") || v.includes("kaese")) return "🧀";
  if (v.includes("milch") || v.includes("molkerei") || v.includes("joghurt")) return "🥛";

  if (v.includes("konserve") || v.includes("dose") || v.includes("dosen")) return "🥫";

  if (v.includes("pasta") || v.includes("nudel")) return "🍝";
  if (v.includes("mehl") || v.includes("pizza") || v.includes("teig")) return "🍕";

  if (v.includes("getränk") || v.includes("getraenk")) return "🥤";

  if (
    v.includes("non food") ||
    v.includes("non-food") ||
    v.includes("hygiene") ||
    v.includes("reiniger")
  )
    return "🧻";

  return "📦";
}

const FAV_KEY = "webers_bestellapp_favorites_v1";

export default function CategoryClient({ items }: Props) {
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [open, setOpen] = useState(false);

  // Favoriten: wir speichern nur Artikelnummern
  const [favorites, setFavorites] = useState<Record<string, true>>({});
  const [onlyFavs, setOnlyFavs] = useState(false);

  // Favoriten laden (beim Start)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAV_KEY);
      if (!raw) return;
      const arr = JSON.parse(raw) as string[];
      if (Array.isArray(arr)) {
        const map: Record<string, true> = {};
        for (const id of arr) map[id] = true;
        setFavorites(map);
      }
    } catch {
      // ignorieren
    }
  }, []);

  // Favoriten speichern (bei Änderung)
  useEffect(() => {
    try {
      const ids = Object.keys(favorites);
      localStorage.setItem(FAV_KEY, JSON.stringify(ids));
    } catch {
      // ignorieren
    }
  }, [favorites]);

  const cartItems = useMemo(() => Object.values(cart), [cart]);
  const cartCount = useMemo(
    () => cartItems.reduce((sum, it) => sum + (it.qty || 0), 0),
    [cartItems]
  );

  const favCount = useMemo(() => Object.keys(favorites).length, [favorites]);

  function isFav(a: Article) {
    return !!favorites[a.artikelnummer];
  }

  function toggleFav(a: Article) {
    setFavorites((prev) => {
      const copy = { ...prev };
      if (copy[a.artikelnummer]) delete copy[a.artikelnummer];
      else copy[a.artikelnummer] = true;
      return copy;
    });
  }

  function addOne(a: Article) {
    setCart((prev) => {
      const cur = prev[a.artikelnummer];
      const nextQty = (cur?.qty ?? 0) + 1;
      return {
        ...prev,
        [a.artikelnummer]: {
          artikelnummer: a.artikelnummer,
          name: a.name,
          einheit: a.einheit,
          qty: ne
