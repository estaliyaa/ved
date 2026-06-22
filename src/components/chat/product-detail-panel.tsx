"use client";

import { useState } from "react";
import {
  Barcode,
  Building2,
  CalendarRange,
  ChevronRight,
  Globe,
  Info,
  Package,
  Percent,
  Sparkles,
  Truck,
  X,
} from "lucide-react";

import type { Bar, ProductDetail } from "@/components/chat/chat-context";
import { cn } from "@/lib/utils";

export function ProductDetailPanel({
  detail,
  onClose,
}: {
  detail: ProductDetail;
  onClose: () => void;
}) {
  return (
    <section className="flex flex-1 flex-col overflow-hidden bg-background">
      <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-card/70 px-8 backdrop-blur">
        <div className="flex min-w-0 items-center gap-2 text-sm">
          <span className="shrink-0 text-muted-foreground">Анализ товара</span>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate font-semibold text-foreground">
            {detail.name}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Свернуть карточку"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 animate-fade-in-up">
          <div className="flex gap-3">
            <Sparkles className="h-5 w-5 shrink-0 text-primary" />
            <p className="text-sm leading-5 text-foreground">{detail.summary}</p>
          </div>

          {detail.note && (
            <div className="flex gap-3 rounded-xl border border-amber-300/70 bg-amber-50 px-4 py-3">
              <Info className="h-5 w-5 shrink-0 text-amber-500" />
              <p className="text-sm leading-5 text-amber-900">{detail.note}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard icon={Barcode} value={detail.hsCode} label="Код ТН ВЭД" />
            <StatCard
              icon={Percent}
              value={detail.dutyRate}
              label="Импортная пошлина"
            />
            <StatCard
              icon={CalendarRange}
              value={detail.period}
              label="Период данных"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <BarPanel
              icon={Globe}
              title="Топ стран происхождения"
              items={detail.topCountries}
              barClassName="bg-primary"
            />
            <BarPanel
              icon={Building2}
              title="Топ компаний-импортёров"
              items={detail.topImporters}
              barClassName="bg-emerald-500"
            />
          </div>

          <YearChart years={detail.yearly} />

          <ShipmentsPanel shipments={detail.shipments} />
        </div>
      </div>
    </section>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Barcode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
        <Icon className="h-6 w-6" strokeWidth={1.8} />
      </span>
      <div className="min-w-0">
        <div className="truncate text-2xl font-bold tracking-tight text-foreground">
          {value}
        </div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function BarPanel({
  icon: Icon,
  title,
  items,
  barClassName,
}: {
  icon: typeof Globe;
  title: string;
  items: Bar[];
  barClassName: string;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-3">
            <span className="w-36 shrink-0 truncate text-sm text-muted-foreground">
              {item.label}
            </span>
            <span className="relative h-2 flex-1 rounded-full bg-muted">
              <span
                className={cn("absolute inset-y-0 left-0 rounded-full", barClassName)}
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </span>
            <span className="w-8 shrink-0 text-right text-sm font-semibold tabular-nums text-foreground">
              {item.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function YearChart({ years }: { years: { year: string; value: number }[] }) {
  const max = Math.max(...years.map((y) => y.value), 1);
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Package className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">
          Динамика импорта по годам
        </h3>
      </div>

      <div className="mb-2 flex gap-3">
        {years.map((y) => (
          <span
            key={y.year}
            className="flex-1 text-center text-xs tabular-nums text-muted-foreground"
          >
            {y.value}
          </span>
        ))}
      </div>
      <div className="flex h-40 items-end gap-3">
        {years.map((y) => (
          <div
            key={y.year}
            className="flex-1 rounded-t-md bg-primary transition-all"
            style={{ height: `${(y.value / max) * 100}%` }}
          />
        ))}
      </div>
      <div className="mt-2 flex gap-3">
        {years.map((y) => (
          <span
            key={y.year}
            className="flex-1 text-center text-xs text-muted-foreground"
          >
            {y.year}
          </span>
        ))}
      </div>
    </div>
  );
}

const TABS = [
  { id: "all", label: "Все" },
  { id: "import", label: "Импорт" },
  { id: "export", label: "Экспорт" },
] as const;

function ShipmentsPanel({
  shipments,
}: {
  shipments: ProductDetail["shipments"];
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("all");
  const filtered = shipments.filter((s) => tab === "all" || s.kind === tab);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">
            Поставки в выборке
          </h3>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-muted p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-full px-4 py-1 text-xs font-semibold transition-colors",
                tab === t.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="flex flex-col gap-2">
        {filtered.map((s) => (
          <li
            key={s.title}
            className="flex items-center gap-3 rounded-xl border border-border px-4 py-3"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
              {s.kind === "import" ? (
                <Package className="h-5 w-5" />
              ) : (
                <Truck className="h-5 w-5" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-foreground">
                {s.title}
              </div>
              <div className="truncate text-xs text-muted-foreground">
                {s.meta}
              </div>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
                s.kind === "import"
                  ? "bg-accent text-primary"
                  : "bg-emerald-50 text-emerald-600"
              )}
            >
              {s.kind === "import" ? "Импорт" : "Экспорт"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
