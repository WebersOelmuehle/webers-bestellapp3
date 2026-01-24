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
  const [hinweis, setHinweis] = useSt
