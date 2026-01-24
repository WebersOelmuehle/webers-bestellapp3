"use client";

import { useMemo, useState } from "react";
import articles from "@/data/articles.json";

type Article = {
  artikelnummer: string;
  name: string;
  einheit?: string;
  kategorie: string;
  bild_url?: string;
};

type Props = {
  params: { slug: string };
};

const ORDER_EMAIL = "bestellung@webers-oelmuehle.de";

export default function Page({ params }: Props) {
  const slug = params.slug;

  const normalize = (k?: string) => {
    const v = (k || "").toLowerCase();
    if (v === "obst" || v === "gemuese") return "obst-gemuese";
    return v;
  };

  const list = useMemo(() => {
    const s = (slug || "").toLowerCase();
    return (articles as Article[]).filter((a) => normalize(a.kategorie) === s);
  }, [slug]);

  // Kunde/Absender
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // Mengen pro Artikelnummer
  const [qtyBySku, setQtyBySku] = useState<Record<string, string>>({});

  const selectedItems = useMemo(() => {
    const items = list
      .map((a) => {
        const qtyRaw = (qtyBySku[a.artikelnummer] || "").trim();
        const qtyNum = Number(qtyRaw.replace(",", "."));
        const isValid = qtyRaw !== "" && !Number.isNaN(qtyNum) && qtyNum > 0;

        return {
          ...a,
          qtyRaw,
          qtyNum,
          isValid,
        };
      })
      .filter((x) => x.isValid);

    return items;
  }, [list, qtyBySku]);

  const positionsCount = selectedItems.length;

  const buildEmailBody = () => {
    const lines: string[] = [];
    lines.push("Neue Bestellung (Webers Bestell-App)");
    lines.push("");
    lines.push("Kunde / Absender:");
    lines.push(`- Name/Firma: ${customerName || "-"}`);
    lines.push(`- Telefon: ${customerPhone || "-"}`);
    lines.push(`- Kategorie: ${slug}`);
    lines.push("");
    lines.push("Positionen:");
    if (selectedItems.length === 0) {
      lines.push("- (keine Positionen ausgewählt)");
    } else {
      selectedItems.forEach((i) => {
        lines.push(
          `- ${i.artikelnummer} | ${i.name} | Menge: ${i.qtyRaw} ${i.einheit ? i.einheit : ""}`.trim()
        );
      });
    }
    lines.push("");
    lines.push("Hinweis: Bitte prüfen und in die Warenwirtschaft übernehmen.");
    return lines.join("\n");
  };

  const sendOrder = () => {
    const subject = `Bestellung ${customerName ? `- ${customerName}` : ""} (${slug})`.trim();
    const body = buildEmailBody();

    // mailto öffnen
    const mailto =
      `mailto:${encodeURIComponent(ORDER_EMAIL)}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
  };

  const setQty = (artikelnummer: string, value: string) => {
    setQtyBySku((prev) => ({ ...prev, [artikelnummer]: value }));
  };

  return (
    <main style={{ maxWidth: 1100, margin: "32px auto", padding: "0 16px" }}>
      <h1 style={{ marginBottom: 6 }}>Kategorie: {slug}</h1>
      <p style={{ marginTop: 0, opacity: 0.7 }}>
        {list.length} Artikel gefunden
      </p>

      {/* Kunde / Absender */}
      <section
        style={{
          marginTop: 14,
          padding: 14,
          border: "1px solid #e5e5e5",
          borderRadius: 14,
          background: "#fff",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Kunde / Absender</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <label style={{ display: "block" }}>
            <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>Name / Firma</div>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="z.B. Restaurant Muster"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ddd",
              }}
            />
          </label>

          <label style={{ display: "block" }}>
            <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>Telefon (optional)</div>
            <input
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="z.B. 07822 …"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ddd",
              }}
            />
          </label>
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={sendOrder}
            disabled={selectedItems.length === 0}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid #111",
              background: selectedItems.length === 0 ? "#f2f2f2" : "#111",
              color: selectedItems.length === 0 ? "#777" : "white",
              cursor: selectedItems.length === 0 ? "not-allowed" : "pointer",
              fontWeight: 700,
            }}
            title={selectedItems.length === 0 ? "Bitte mindestens eine Menge eingeben" : "Bestellung per E-Mail senden"}
          >
            Bestellung senden ({positionsCount})
          </button>

          <div style={{ fontSize: 12, opacity: 0.75 }}>
            Tipp: Menge als Zahl eingeben (z.B. <b>2</b> oder <b>2,5</b>).
          </div>
        </div>
      </section>

      {/* Artikel */}
      {list.length === 0 ? (
        <div style={{ marginTop: 18, padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
          Keine Artikel in dieser Kategorie. Prüfe in <code>data/articles.json</code> den Wert{" "}
          <code>kategorie</code>.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
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
                display: "flex",
                flexDirection: "column",
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

              <div style={{ fontSize: 12, opacity: 0.75 }}>Art.-Nr.: {a.artikelnummer}</div>
              {a.einheit ? (
                <div style={{ fontSize: 12, opacity: 0.75 }}>Einheit: {a.einheit}</div>
              ) : null}

              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>Menge</div>
                <input
                  inputMode="decimal"
                  value={qtyBySku[a.artikelnummer] || ""}
                  onChange={(e) => setQty(a.artikelnummer, e.target.value)}
                  placeholder={a.einheit ? `z.B. 2 (${a.einheit})` : "z.B. 2"}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid #ddd",
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => setQty(a.artikelnummer, "")}
                style={{
                  marginTop: 10,
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  background: "white",
                  cursor: "pointer",
                  fontSize: 12,
                  opacity: 0.9,
                }}
              >
                Menge löschen
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
