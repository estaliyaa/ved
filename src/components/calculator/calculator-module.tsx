"use client";

import { useState } from "react";
import { Calculator, Inbox, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  type CalcItem,
  type CalcResult,
  calculate,
  countries,
  currencies,
  formatKzt,
  itemTypes,
  procedures,
} from "@/config/calculator";

let idCounter = 0;

export function CalculatorModule() {
  const [procedure, setProcedure] = useState(procedures[0]);
  const [country, setCountry] = useState(countries[0]);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [origin, setOrigin] = useState(countries[0]);
  const [price, setPrice] = useState("");
  const [type, setType] = useState(itemTypes[0]);
  const [currency, setCurrency] = useState(currencies[0]);

  const [items, setItems] = useState<CalcItem[]>([]);
  const [result, setResult] = useState<CalcResult | null>(null);

  const canAdd = name.trim().length > 0 && Number(price) > 0;

  function addItem() {
    if (!canAdd) return;
    idCounter += 1;
    setItems((prev) => [
      ...prev,
      { id: idCounter, name: name.trim(), code: code.trim(), country: origin, price, type, currency },
    ]);
    setName("");
    setCode("");
    setPrice("");
    setResult(null);
  }

  function removeItem(id: number) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setResult(null);
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-8 text-sm">
        <Calculator className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="font-bold text-foreground">Калькулятор платежей</span>
      </header>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          {/* Параметры декларации */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Таможенная процедура" required>
              <Select
                value={procedure}
                onChange={setProcedure}
                options={procedures}
              />
            </Field>
            <Field label="Страна отправления" required>
              <Select value={country} onChange={setCountry} options={countries} />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Добавление товара */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-5 text-lg font-bold tracking-tight text-foreground">
                Добавление товара
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Наименование товара">
                  <Input value={name} onChange={setName} placeholder="Например, чай чёрный" />
                </Field>
                <Field label="Код товара">
                  <Input value={code} onChange={setCode} placeholder="0902 30 000 0" />
                </Field>
                <Field label="Страна происхождения">
                  <Select value={origin} onChange={setOrigin} options={countries} />
                </Field>
                <Field label="Цена товара">
                  <Input
                    value={price}
                    onChange={setPrice}
                    placeholder="0"
                    type="number"
                  />
                </Field>
                <Field label="Тип">
                  <Select value={type} onChange={setType} options={itemTypes} />
                </Field>
                <Field label="Валюта">
                  <Select
                    value={currency}
                    onChange={setCurrency}
                    options={currencies}
                  />
                </Field>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={addItem}
                  disabled={!canAdd}
                  className="rounded-xl"
                >
                  <Plus />
                  Добавить товар
                </Button>
                <Button
                  onClick={() => setResult(calculate(items))}
                  disabled={items.length === 0}
                  className="rounded-xl"
                >
                  Просчитать
                </Button>
              </div>

              {items.length > 0 && (
                <ul className="mt-5 flex flex-col gap-2 border-t border-border pt-5">
                  {items.map((it) => (
                    <li
                      key={it.id}
                      className="flex items-center gap-3 rounded-xl border border-border px-4 py-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-foreground">
                          {it.name}
                          {it.code ? ` · ${it.code}` : ""}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {it.country} ·{" "}
                          {Number(it.price).toLocaleString("ru-RU")} {it.currency}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(it.id)}
                        aria-label="Удалить"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Итого */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-5 text-lg font-bold tracking-tight text-foreground">
                Итого по таможенным платежам и налогам
              </h3>

              {result ? (
                <div className="flex flex-col gap-3">
                  <Row label="Таможенная стоимость" value={formatKzt(result.customsValue)} />
                  <Row label="Пошлина (5%)" value={formatKzt(result.duty)} />
                  <Row label="Таможенный сбор" value={formatKzt(result.fee)} />
                  <Row label="НДС (12%)" value={formatKzt(result.vat)} />
                  <div className="my-1 border-t border-dashed border-border" />
                  <Row
                    label="Итого платежей"
                    value={formatKzt(result.totalPayments)}
                    strong
                  />
                  <div className="mt-2 flex items-center justify-between rounded-xl bg-accent px-4 py-3">
                    <span className="text-sm font-semibold text-accent-foreground">
                      Итого к оплате
                    </span>
                    <span className="text-lg font-bold text-accent-foreground">
                      {formatKzt(result.totalDue)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Расчёт ориентировочный (демо). Конвертация валют не применяется.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
                  <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted/60 text-muted-foreground">
                    <Inbox className="h-10 w-10" strokeWidth={1.5} />
                  </span>
                  <p className="text-base font-semibold text-foreground">
                    {items.length === 0 ? "Список пуст" : "Готово к расчёту"}
                  </p>
                  <p className="max-w-xs text-sm text-muted-foreground">
                    {items.length === 0
                      ? "Добавьте один или несколько товаров и нажмите «Просчитать»."
                      : `Товаров в списке: ${items.length}. Нажмите «Просчитать».`}
                  </p>
                </div>
              )}
            </div>
          </div>
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
      className="h-11 rounded-xl border border-border bg-muted/30 px-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:bg-card placeholder:text-muted-foreground"
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

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={
          strong ? "font-bold text-foreground" : "font-semibold text-foreground"
        }
      >
        {value}
      </span>
    </div>
  );
}
