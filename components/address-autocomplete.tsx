"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  addressValueFromSuggestion,
  emptyAddressValue,
  type AddressSuggestion,
  type AddressValue,
} from "@/lib/address-search";

const inputClass =
  "w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";

const labelClass = "mb-1.5 block text-sm font-semibold text-slate-700";

type Props = {
  value: AddressValue;
  onChange: (next: AddressValue) => void;
  disabled?: boolean;
  hint?: string;
};

export function AddressAutocomplete({
  value,
  onChange,
  disabled,
  hint,
}: Props) {
  const listId = useId();
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reqSeq = useRef(0);

  useEffect(() => {
    const q = value.query.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const seq = ++reqSeq.current;
    setLoading(true);
    const timer = setTimeout(() => {
      void (async () => {
        try {
          const res = await fetch(
            `/api/address/search?q=${encodeURIComponent(q)}`
          );
          if (!res.ok) throw new Error("search failed");
          const data = (await res.json()) as {
            suggestions?: AddressSuggestion[];
          };
          if (seq !== reqSeq.current) return;
          setSuggestions(data.suggestions ?? []);
          setOpen(true);
        } catch {
          if (seq !== reqSeq.current) return;
          setSuggestions([]);
        } finally {
          if (seq === reqSeq.current) setLoading(false);
        }
      })();
    }, 280);

    return () => clearTimeout(timer);
  }, [value.query]);

  function pick(suggestion: AddressSuggestion) {
    onChange(addressValueFromSuggestion(suggestion));
    setSuggestions([]);
    setOpen(false);
  }

  function clearAll() {
    onChange(emptyAddressValue());
    setSuggestions([]);
    setOpen(false);
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <label className={labelClass} htmlFor={`${listId}-query`}>
          Dirección (opcional)
        </label>
        <input
          id={`${listId}-query`}
          type="text"
          role="combobox"
          aria-expanded={open && suggestions.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="street-address"
          disabled={disabled}
          value={value.query}
          onChange={(e) =>
            onChange({
              ...value,
              query: e.target.value,
            })
          }
          onFocus={() => {
            if (blurTimer.current) clearTimeout(blurTimer.current);
            if (suggestions.length > 0) setOpen(true);
          }}
          onBlur={() => {
            blurTimer.current = setTimeout(() => setOpen(false), 160);
          }}
          placeholder="Busca como en Maps: calle, ciudad, CP, país…"
          className={inputClass}
        />
        {loading ? (
          <p className="mt-1.5 text-xs text-slate-400">Buscando direcciones…</p>
        ) : null}
        {open && suggestions.length > 0 ? (
          <ul
            id={listId}
            role="listbox"
            className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
          >
            {suggestions.map((s) => (
              <li key={s.id} role="option">
                <button
                  type="button"
                  className="w-full px-3 py-2.5 text-left text-sm text-slate-800 hover:bg-blue-50"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(s)}
                >
                  <span className="block font-medium text-slate-900">
                    {s.address || s.city || s.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {[s.postalCode, s.city, s.country]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {(value.address || value.city || value.postalCode || value.country) && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Calle y número</label>
            <input
              type="text"
              value={value.address}
              disabled={disabled}
              onChange={(e) =>
                onChange({ ...value, address: e.target.value })
              }
              className={inputClass}
              autoComplete="address-line1"
            />
          </div>
          <div>
            <label className={labelClass}>Ciudad</label>
            <input
              type="text"
              value={value.city}
              disabled={disabled}
              onChange={(e) => onChange({ ...value, city: e.target.value })}
              className={inputClass}
              autoComplete="address-level2"
            />
          </div>
          <div>
            <label className={labelClass}>Código postal</label>
            <input
              type="text"
              value={value.postalCode}
              disabled={disabled}
              onChange={(e) =>
                onChange({ ...value, postalCode: e.target.value })
              }
              className={inputClass}
              autoComplete="postal-code"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>País</label>
            <input
              type="text"
              value={value.country}
              disabled={disabled}
              onChange={(e) => onChange({ ...value, country: e.target.value })}
              className={inputClass}
              autoComplete="country-name"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={clearAll}
              disabled={disabled}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Borrar dirección
            </button>
          </div>
        </div>
      )}

      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}
