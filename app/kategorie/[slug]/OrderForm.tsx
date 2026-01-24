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
  const [sending, setSending] = useState(false);

  const lines = useMemo(() => {
    return items
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
