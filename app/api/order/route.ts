import nodemailer from "nodemailer";

export const runtime = "nodejs";

type CartItem = {
  artikelnummer: string;
  name: string;
  einheit?: string;
  qty: number;
};

type Body = {
  firma: string;
  name: string;
  telefon: string;
  hinweis: string;
  items: CartItem[];
};

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as Body;

    if (!data?.items?.length) {
      return Response.json({ ok: false, error: "Keine Artikel" }, { status: 400 });
    }

    const host = process.env.SMTP_HOST || "smtp.ionos.de";
    const port = Number(process.env.SMTP_PORT || "587");
    const user = process.env.SMTP_USER || "app@webers-oelmuehle.de";
    const pass = process.env.SMTP_PASS;
    const to = process.env.ORDER_TO_EMAIL || "bestellung@webers-oelmuehle.de";

    if (!pass) {
      return Response.json(
        { ok: false, error: "SMTP_PASS fehlt (Vercel Umgebungsvariable)" },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const lines = data.items
      .map((it) => {
        const unit = it.einheit ? ` ${it.einheit}` : "";
        return `- ${it.qty}x${unit} | ${it.name} | Art.-Nr.: ${it.artikelnummer}`;
      })
      .join("\n");

    const text = [
      "BESTELLUNG",
      "",
      `Firma: ${data.firma || "-"}`,
      `Name: ${data.name || "-"}`,
      `Telefon: ${data.telefon || "-"}`,
      `Hinweis: ${data.hinweis || "-"}`,
      "",
      "ARTIKEL:",
      lines,
      "",
      `Zeit: ${new Date().toLocaleString("de-DE")}`,
    ].join("\n");

    const subject = data.firma ? `Bestellung - ${data.firma}` : "Bestellung";

    await transporter.sendMail({
      from: `"Webers Bestellapp" <${user}>`,
      to,
      subject,
      text,
    });

    return Response.json({ ok: true });
  } catch (e: any) {
    return Response.json(
      { ok: false, error: e?.message || "Unbekannter Serverfehler" },
      { status: 500 }
    );
  }
}
