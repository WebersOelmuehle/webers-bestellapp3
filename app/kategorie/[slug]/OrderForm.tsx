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
  const [name, setName] = useState("");
  const [telefon, setTelefon] = useState("");
  const [hinweis, setHinweis] = useState("");

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

  const mailBody = useMemo(() => {
    const head = [
      "BESTELLUNG",
      "",
      `Firma: ${firma || "-"}`,
      `Name: ${name || "-"}`,
      `Telefon: ${telefon || "-"}`,
      `Hinweis: ${hinweis || "-"}`,
      "",
      "ARTIKEL:",
      lines || "(keine Artikel)",
      "",
    ].join("\n");

    return head;
  }, [firma, name, telefon, hinweis, lines]);

  const subject = useMemo(() => {
    const f = firma?.trim();
    return f ? `Bestellung – ${f}` : "Bestellung";
  }, [firma]);

  function sendMail() {
    if (items.length === 0) return;

    // mailto hat eine Längen-Grenze, aber für den Start reicht es.
    const to = "bestellung@webers-oelmuehle.de";
    const url =
      `mailto:${encodeURIComponent(to)}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(mailBody)}`;

    window.location.href = url;
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {/* Bestellübersicht */}
      <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
        <div style={{ fontWeight: 800, marginBottom: 8 }}>Deine Artikel</div>
        <div style={{ whiteSpace: "pre-wrap", fontSize: 14, opacity: 0.9 }}>
          {lines}
        </div>
      </div>

      {/* Kundendaten */}
      <div style={{ display: "grid", gap: 10 }}>
        <input
          placeholder="Firma"
          value={firma}
          onChange={(e) => setFirma(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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

      {/* Buttons */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={sendMail} style={primaryBtn}>
          Bestellung senden
        </button>

        <button
          onClick={() => {
            onClear();
            onClose();
          }}
          style={btn}
        >
          Warenkorb leeren
        </button>

        <button onClick={onClose} style={btn}>
          Schließen
        </button>
      </div>

      <div style={{ fontSize: 12, opacity: 0.6 }}>
        Hinweis: Aktuell wird die Bestellung über dein E-Mail-Programm versendet
        (mailto). Später können wir das automatisch per Server-Mail machen.
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
