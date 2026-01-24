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

  const [favorites, setFavorites] = useState<Record<string, true>>({});
  const [onlyFavs, setOnlyFavs] = useState(false);

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
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      const ids = Object.keys(favorites);
      localStorage.setItem(FAV_KEY, JSON.stringify(ids));
    } catch {
      // ignore
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
          qty: nextQty,
        },
      };
    });
  }

  function removeOne(a: Article) {
    setCart((prev) => {
      const cur = prev[a.artikelnummer];
      const nextQty = (cur?.qty ?? 0) - 1;

      if (!cur || nextQty <= 0) {
        const copy = { ...prev };
        delete copy[a.artikelnummer];
        return copy;
      }

      return {
        ...prev,
        [a.artikelnummer]: { ...cur, qty: nextQty },
      };
    });
  }

  function setQty(a: Article, qty: number) {
    const safe = Number.isFinite(qty) ? Math.max(0, Math.floor(qty)) : 0;
    setCart((prev) => {
      if (safe <= 0) {
        const copy = { ...prev };
        delete copy[a.artikelnummer];
        return copy;
      }
      return {
        ...prev,
        [a.artikelnummer]: {
          artikelnummer: a.artikelnummer,
          name: a.name,
          einheit: a.einheit,
          qty: safe,
        },
      };
    });
  }

  const favoriteItems = useMemo(() => {
    return items
      .filter((a) => favorites[a.artikelnummer])
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [items, favorites]);

  const displayItems = useMemo(() => {
    const list = items.slice();

    list.sort((a, b) => {
      const af = favorites[a.artikelnummer] ? 1 : 0;
      const bf = favorites[b.artikelnummer] ? 1 : 0;
      if (af !== bf) return bf - af;
      return a.name.localeCompare(b.name);
    });

    if (onlyFavs) return list.filter((a) => favorites[a.artikelnummer]);
    return list;
  }, [items, favorites, onlyFavs]);

  return (
    <div>
      {/* Top-Leiste */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "white",
          borderBottom: "1px solid #eee",
          padding: "10px 0",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ fontSize: 14, opacity: 0.8 }}>
              Im Warenkorb: <b>{cartCount}</b>
            </div>

            <button
              onClick={() => setOnlyFavs((v) => !v)}
              style={{
                padding: "8px 10px",
                borderRadius: 12,
                border: "1px solid #ddd",
                background: onlyFavs ? "#fff7d6" : "white",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 13,
              }}
              aria-label="Nur Favoriten anzeigen"
              title="Nur Favoriten anzeigen"
            >
              ⭐ Favoriten {favCount}
              {onlyFavs ? " (AN)" : ""}
            </button>
          </div>

          <button
            onClick={() => setOpen(true)}
            disabled={cartItems.length === 0}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid #ddd",
              background: cartItems.length === 0 ? "#f5f5f5" : "white",
              cursor: cartItems.length === 0 ? "not-allowed" : "pointer",
              fontWeight: 600,
            }}
          >
            Bestellen
          </button>
        </div>

        {/* Favoriten-Schnellleiste */}
        {favoriteItems.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 12, opacity: 0.65, marginBottom: 6 }}>
              Favoriten – tippen für +1
            </div>

            <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6 }}>
              {favoriteItems.map((a) => {
                const icon = getCategoryIcon(a.kategorie);
                const qty = cart[a.artikelnummer]?.qty ?? 0;

                return (
                  <button
                    key={a.artikelnummer}
                    onClick={() => addOne(a)}
                    style={{
                      minWidth: 140,
                      border: "1px solid #f0c400",
                      background: "#fff7d6",
                      borderRadius: 14,
                      padding: 10,
                      cursor: "pointer",
                      display: "grid",
                      gridTemplateColumns: "44px 1fr",
                      gap: 10,
                      alignItems: "center",
                      textAlign: "left",
                    }}
                    title="Klicken: +1"
                    aria-label={`Favorit: ${a.name}`}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        overflow: "hidden",
                        background: "#f2f2f2",
                        border: "1px solid #e6e6e6",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div style={{ fontSize: 22, lineHeight: 1 }}>{icon}</div>

                      {a.bild_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={a.bild_url}
                          alt={a.name}
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : null}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: 14,
                          lineHeight: 1.2,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {a.name}
                      </div>
                      <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>
                        {qty > 0 ? `Im Korb: ${qty}` : "Tippen: +1"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Artikel-Liste */}
      <div style={{ display: "grid", gap: 10 }}>
        {displayItems.map((a) => {
          const qty = cart[a.artikelnummer]?.qty ?? 0;
          const icon = getCategoryIcon(a.kategorie);
          const fav = isFav(a);

          return (
            <div
              key={a.artikelnummer}
              style={{
                border: fav ? "2px solid #f0c400" : "1px solid #e5e5e5",
                borderRadius: 14,
                padding: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 12,
                    overflow: "hidden",
                    background: "#f2f2f2",
                    border: "1px solid #e6e6e6",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: "0 0 auto",
                  }}
                  aria-label="Artikelbild"
                >
                  <div style={{ fontSize: 28, lineHeight: 1 }}>{icon}</div>

                  {a.bild_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.bild_url}
                      alt={a.name}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : null}
                </div>

                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button
                      onClick={() => toggleFav(a)}
                      style={{
                        border: "1px solid #ddd",
                        background: fav ? "#fff7d6" : "white",
                        borderRadius: 10,
                        padding: "6px 8px",
                        cursor: "pointer",
                        fontWeight: 800,
                        lineHeight: 1,
                      }}
                      aria-label={fav ? "Favorit entfernen" : "Als Favorit markieren"}
                      title={fav ? "Favorit entfernen" : "Als Favorit markieren"}
                    >
                      {fav ? "⭐" : "☆"}
                    </button>

                    <div style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.2 }}>
                      {a.name}
                    </div>
                  </div>

                  <div style={{ fontSize: 13, opacity: 0.7, marginTop: 2 }}>
                    {a.artikelnummer}
                    {a.einheit ? ` • ${a.einheit}` : ""}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  onClick={() => removeOne(a)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    background: "white",
                    cursor: "pointer",
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                  aria-label="minus"
                >
                  −
                </button>

                <input
                  value={qty}
                  onChange={(e) => setQty(a, Number(e.target.value))}
                  inputMode="numeric"
                  style={{
                    width: 56,
                    height: 36,
                    textAlign: "center",
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                />

                <button
                  onClick={() => addOne(a)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    background: "white",
                    cursor: "pointer",
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                  aria-label="plus"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bestell-Dialog */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            zIndex: 50,
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              width: "min(720px, 100%)",
              background: "white",
              borderRadius: 16,
              border: "1px solid #ddd",
              padding: 14,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 10,
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 18 }}>Bestellung</div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  border: "1px solid #ddd",
                  background: "white",
                  borderRadius: 10,
                  padding: "8px 10px",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                X
              </button>
            </div>

            <OrderForm
              items={cartItems}
              onClear={() => setCart({})}
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
