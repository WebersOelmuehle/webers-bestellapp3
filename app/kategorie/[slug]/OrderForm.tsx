"use client";

import { useMemo, useState } from "react";

type CartItem = {
  artikelnummer: string;
  name: string;
  einheit?: string;
  qty: number;
};

export default function OrderForm({
  items,
  onClear,
  onClose,
}: {
  items: CartItem[];
  onClear: () => void;
  onClose: () => void;
}) {
  const [firma, setFirma] = useState("");
  const [kontaktName, setKontaktName] = useState("");
  const [telefon, setTelefon] = useState("");
  const [hinweis, setHinweis] = useState("");
  const [sending, setSending] = useState(false);

  const lines = useMemo(() => {
    return items
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((it) => {
        const unit = it.einheit ? ` ${it.einheit}` : "";
        return `- ${it.qty}x${unit} | ${it.name} | Art.-Nr.: ${it.artikelnummer}`;
      })
      .join("\n");
  }, [items]);

  async function sendMail() {
    if (items.length === 0) return;

    setSending(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firma,
          name: kontaktName,
          telefon,
          hinweis,
          items,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        alert("Fehler beim Senden: " + (json.error || "Unbekannt"));
        return;
      }

      alert("Bestellung wurde gesendet ✅");
      onClear();
      onClose();
    } catch (e: any) {
      alert("Netzwerkfehler: " + (e?.message || "Unbekannt"));
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
        <div style={{ fontWeight: 800, marginBottom: 8 }}>Deine Artikel</div>
        <div style={{ whiteSpace: "pre-wrap", fontSize: 14, opacity: 0.9 }}>
          {lines}
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <input
          placeholder="Firma"
          value={firma}
          onChange={(e) => setFirma(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Name"
          value={kontaktName}
          onChange={(e) => setKontaktName(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Telefon"
          value={telefon}
          onChange={(e) => setTelefon(e.target.value)}
          style={inputStyle}
        />

        <textarea
          placeholder="Hinweis (optional) – z.B. Lieferung bis 10 Uhr"
          value={hinweis}
          onChange={(e) => setHinweis(e.target.value)}
          style={{ ...inputStyle, height: 90, resize: "vertical" }}
        />
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={sendMail} style={primaryBtn} disabled={sending}>
          {sending ? "Sende..." : "Bestellung senden"}
        </button>

        <button
          onClick={() => {
            onClear();
            onClose();
          }}
          style={btn}
          disabled={sending}
        >
          Warenkorb leeren
        </button>

        <button onClick={onClose} style={btn} disabled={sending}>
          Schließen
        </button>
      </div>

      <div style={{ fontSize: 12, opacity: 0.6 }}>
        Hinweis: Die Bestellung wird automatisch im Hintergrund per E-Mail versendet.
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #ddd",
  fontSize: 16,
  fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
};

const btn: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer",
  fontWeight: 700,
};

const primaryBtn: React.CSSProperties = {
  ...btn,
  border: "1px solid #111",
};
