"use client";

import { useMemo, useState } from "react";
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

export default function CategoryClient({ items }: Props) {
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [open, setOpen] = useState(false);

  const cartItems = useMemo(() => Object.values(cart), [cart]);
  const cartCount = useMemo(
    () => cartItems.reduce((sum, it) => sum + (it.qty || 0), 0),
    [cartItems]
  );

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
          }}
        >
          <div style={{ fontSize: 14, opacity: 0.8 }}>
            Im Warenkorb: <b>{cartCount}</b>
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
      </div>

      {/* Artikel-Liste */}
      <div style={{ display: "grid", gap: 10 }}>
        {items.map((a) => {
          const inCart = cart[a.artikelnummer];
          const qty = inCart?.qty ?? 0;

          return (
            <div
              key={a.artikelnummer}
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: 14,
                padding: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
              }}
            >
              {/* Linke Seite: Artikelinfo */}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{a.name}</div>
                <div style={{ fontSize: 13, opacity: 0.7, marginTop: 2 }}>
                  {a.artikelnummer}
                  {a.einheit ? ` • ${a.einheit}` : ""}
                </div>
              </div>

              {/* Rechte Seite: Mengenwahl */}
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
