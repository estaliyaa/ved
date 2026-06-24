"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  Lightbulb,
  Sparkles,
  XCircle,
  type LucideIcon,
} from "lucide-react";

import {
  initialFields,
  validate,
  type DeclField,
  type ValStatus,
} from "@/config/declaration";
import { cn } from "@/lib/utils";

const VAL: Record<ValStatus, { icon: LucideIcon; dot: string }> = {
  ok: { icon: CheckCircle2, dot: "text-emerald-600" },
  warn: { icon: AlertTriangle, dot: "text-amber-600" },
  risk: { icon: XCircle, dot: "text-rose-600" },
};

export function DeclarationModule({ onAskAi }: { onAskAi?: () => void }) {
  const [fields, setFields] = useState<DeclField[]>(initialFields);
  const result = useMemo(() => validate(fields), [fields]);

  function update(id: string, value: string) {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, value } : f)));
  }

  function generate() {
    setFields(initialFields);
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border px-8 text-sm">
        <div className="flex items-center gap-2">
          <FileCheck2 className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="font-bold text-foreground">Таможенное декларирование</span>
        </div>
        <button
          type="button"
          onClick={generate}
          className="flex h-8 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          Сгенерировать черновик
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          {/* Форма ДТ */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-1 text-base font-semibold tracking-tight text-foreground">
              Декларация на товары (ДТ)
            </h3>
            <p className="mb-5 text-xs text-muted-foreground">
              Заполните графы — проверка идёт автоматически справа
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {fields.map((f) => {
                const empty = f.required && f.value.trim().length === 0;
                return (
                  <label key={f.id} className="flex flex-col gap-1">
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex h-5 min-w-5 items-center justify-center rounded bg-muted px-1 text-xs font-bold text-foreground">
                        {f.box}
                      </span>
                      {f.label}
                      {f.required && <span className="text-rose-500">*</span>}
                    </span>
                    <input
                      type="text"
                      value={f.value}
                      onChange={(e) => update(f.id, e.target.value)}
                      placeholder={f.hint ?? ""}
                      className={cn(
                        "h-10 rounded-lg border bg-card px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary",
                        empty ? "border-rose-300" : "border-border"
                      )}
                    />
                  </label>
                );
              })}
            </div>
          </div>

          {/* Панель проверки */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-0 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  Заполнение
                </span>
                <span className="text-sm font-bold text-foreground">
                  {result.completion}%
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    result.ready ? "bg-emerald-500" : "bg-primary"
                  )}
                  style={{ width: `${result.completion}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Заполнено {result.filled} из {result.total} обязательных граф
              </div>

              <div
                className={cn(
                  "mt-4 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold",
                  result.ready
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                )}
              >
                {result.ready ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                {result.ready ? "Готово к подаче" : "Есть замечания"}
              </div>
            </div>

            {/* Чек-лист */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                Проверка перед подачей
              </h3>
              <ul className="flex flex-col gap-3">
                {result.items.map((it, i) => {
                  const v = VAL[it.status];
                  return (
                    <li key={i} className="flex gap-3">
                      <v.icon className={cn("mt-1 h-4 w-4 shrink-0", v.dot)} />
                      <div>
                        <div className="text-sm font-semibold text-foreground">
                          {it.label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {it.detail}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Автоподсказки */}
            {result.suggestions.length > 0 && (
              <div className="rounded-2xl border border-primary/30 bg-accent/40 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">
                    Автоподсказки
                  </h3>
                </div>
                <ul className="flex flex-col gap-2">
                  {result.suggestions.map((s, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-xs leading-5 text-foreground"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                      {s}
                    </li>
                  ))}
                </ul>
                {onAskAi && (
                  <button
                    type="button"
                    onClick={onAskAi}
                    className="mt-4 flex h-9 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Помощь ИИ с заполнением
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
