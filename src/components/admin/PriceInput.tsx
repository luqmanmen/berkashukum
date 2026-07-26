"use client";

import { useState } from "react";

interface PriceInputProps {
  defaultValue?: number;
}

export default function PriceInput({ defaultValue }: PriceInputProps) {
  const [display, setDisplay] = useState(
    defaultValue ? defaultValue.toLocaleString("id-ID") : ""
  );
  const [rawValue, setRawValue] = useState(defaultValue ? String(defaultValue) : "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    if (digits === "") {
      setDisplay("");
      setRawValue("");
      return;
    }
    const num = parseInt(digits, 10);
    setRawValue(String(num));
    setDisplay(num.toLocaleString("id-ID"));
  };

  return (
    <div className="relative">
      <span className="absolute left-3 top-2.5 text-sm text-gray-500 font-medium pointer-events-none">
        Rp
      </span>
      <input type="hidden" name="price" value={rawValue} />
      <input
        type="text"
        inputMode="numeric"
        required
        value={display}
        onChange={handleChange}
        placeholder="Contoh: 79.000"
        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-900"
      />
      {rawValue && (
        <p className="text-xs text-gray-400 mt-1.5 font-medium">
          ✓ Rp {parseInt(rawValue).toLocaleString("id-ID")}
        </p>
      )}
    </div>
  );
}
