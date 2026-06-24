"use client";

import { useState } from "react";
import { Calculator, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  type CalcItem,
  type CalcResult,
  calculate,
  countries,
  currencies,
  emptyItem,
  formatKzt,
  procedures,
} from "@/config/calculator";

let idc = 1;

export function CalculatorModule() {
  const [procedure, setProcedure] = useState(procedures[0]);
  const [country, setCountry] = useState(countries[0]);
  const [currency, setCurrency] = useState(currencies[0]);
  const [items, setItems] = useState<CalcItem[]>([emptyItem(idc)]);
  const [result, setResult] = useState<CalcResult | null>(null);

  function addItem() {
    idc += 1;
    setItems((prev) => [...prev, emptyItem(idc)]);
    setResult(null);
  }
  function removeItem(id: number) {
    setItems((prev) =>
      prev.length > 1 ? prev.filter((i) => i.id !== id) : prev
    );
    setResult(null);
  }
  function patch(id: number, p: Partial<CalcItem>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...p } : i)));
    setResult(null);
  }

  const canCalc = items.some((i) => Number(i.price) > 0);

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-8 text-sm">
        <Calculator className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="font-bold text-foreground">Калькулятор платежей</span>
      </header>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="flex flex-col gap-6">
          {/* Параметры */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Таможенная процедура" required>
              <Select value={procedure} onChange={setProcedure} options={procedures} />
            </Field>
            <Field label="Страна отправления" required>
              <Select value={country} onChange={setCountry} options={countries} />
            </Field>
            <Field label="Валюта">
              <Select value={currency} onChange={setCurrency} options={currencies} />
            </Field>
          </div>

          {/* Товары */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold tracking-tight text-foreground">
                Товары в расчёте
              </h3>
              <span className="text-xs text-muted-foreground">
                {items.length} поз.
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {items.map((it, idx) => (
                <div
                  key={it.id}
                  className="rounded-xl border border-border bg-muted/20 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Товар {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(it.id)}
                      aria-label="Удалить товар"
                      disabled={items.length === 1}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-destructive disabled:opacity-40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
                    <div className="col-span-2 lg:col-span-2">
                      <FieldInline label="Наименование">
                        <Input
                          value={it.name}
                          onChange={(v) => patch(it.id, { name: v })}
                          placeholder="Например, чай чёрный"
                        />
                      </FieldInline>
                    </div>
                    <FieldInline label="Код ТН ВЭД">
                      <Input
                        value={it.code}
                        onChange={(v) => patch(it.id, { code: v })}
                        placeholder="0902 30"
                      />
                    </FieldInline>
                    <FieldInline label="Цена за ед.">
                      <Input
                        value={it.price}
                        onChange={(v) => patch(it.id, { price: v })}
                        placeholder="0"
                        type="number"
                      />
                    </FieldInline>
                    <FieldInline label="Кол-во">
                      <Input
                        value={it.qty}
                        onChange={(v) => patch(it.id, { qty: v })}
                        type="number"
                      />
                    </FieldInline>
                    <div className="grid grid-cols-2 gap-2">
                      <FieldInline label="Пошл. %">
                        <Input
                          value={it.dutyRate}
                          onChange={(v) => patch(it.id, { dutyRate: v })}
                          type="number"
                        />
                      </FieldInline>
                      <FieldInline label="Акциз %">
                        <Input
                          value={it.exciseRate}
                          onChange={(v) => patch(it.id, { exciseRate: v })}
                          type="number"
                        />
                      </FieldInline>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="outline" onClick={addItem} className="rounded-xl">
                <Plus />
                Добавить товар
              </Button>
              <Button
                onClick={() => setResult(calculate(items))}
                disabled={!canCalc}
                className="rounded-xl"
              >
                Рассчитать платежи
              </Button>
            </div>
          </div>

          {/* Результат */}
          {result && (
            <div className="rounded-2xl border border-border bg-card p-6 animate-fade-in-up">
              <h3 className="mb-5 text-lg font-bold tracking-tight text-foreground">
                Итого по таможенным платежам и налогам
              </h3>

              <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Metric label="Пошлина" value={formatKzt(result.duty)} />
                <Metric label="Акциз" value={formatKzt(result.excise)} />
                <Metric label="НДС (12%)" value={formatKzt(result.vat)} />
                <Metric label="Таможенный сбор" value={formatKzt(result.fee)} />
              </div>

              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-3">Товар</th>
                      <th className="px-4 py-3 text-right">Тамож. стоим.</th>
                      <th className="px-4 py-3 text-right">Пошлина</th>
                      <th className="px-4 py-3 text-right">Акциз</th>
                      <th className="px-4 py-3 text-right">НДС</th>
                      <th className="px-4 py-3 text-right">Итого</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.lines.map((l) => (
                      <tr key={l.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 font-semibold text-foreground">
                          {l.name}
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground">
                          {formatKzt(l.customsValue)}
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground">
                          {formatKzt(l.duty)}
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground">
                          {formatKzt(l.excise)}
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground">
                          {formatKzt(l.vat)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-foreground">
                          {formatKzt(l.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                  Таможенная стоимость: {formatKzt(result.customsValue)} · Платежи:{" "}
                  {formatKzt(result.payments)}. Расчёт ориентировочный (демо).
                </p>
                <div className="flex items-center gap-3 rounded-xl bg-accent px-5 py-3">
                  <span className="text-sm font-semibold text-accent-foreground">
                    Итого к оплате
                  </span>
                  <span className="text-lg font-bold text-accent-foreground">
                    {formatKzt(result.total)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </span>
      {children}
    </label>
  );
}

function FieldInline({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted-foreground"
    />
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 appearance-none rounded-xl border border-border bg-muted/30 bg-[length:16px] bg-[right_16px_center] bg-no-repeat px-4 pr-10 text-sm text-foreground outline-none transition-colors focus:border-primary focus:bg-card"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E\")",
      }}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <div className="truncate text-lg font-bold tracking-tight text-foreground">
        {value}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
