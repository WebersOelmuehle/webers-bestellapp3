async function sendMail() {
  if (items.length === 0) return;

  try {
    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firma,
        name,
        telefon,
        hinweis,
        items,
