import { ChevronDown, Sparkles, type LucideIcon } from "lucide-react";

import type { Bar } from "@/config/products";
import { cn } from "@/lib/utils";

/** Сворачиваемая секция-«дропдаун» (управляется снаружи). */
export function SectionCard({
  icon: Icon,
  title,
  open,
  onToggle,
  children,
  onAskAi,
}: {
  icon: LucideIcon;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  /** Если задан — внизу секции появляется кнопка «Спросить ИИ» по этому блоку. */
  onAskAi?: () => void;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-muted/40"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
          <Icon className="h-4 w-4" strokeWidth={1.8} />
        </span>
        <h3 className="flex-1 text-base font-semibold tracking-tight text-foreground">
          {title}
        </h3>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1">
          {children}
          {onAskAi && (
            <div className="mt-5 flex justify-end border-t border-border pt-4">
              <button
                type="button"
                onClick={onAskAi}
                className="flex h-8 items-center gap-2 rounded-full border border-primary/30 bg-accent/40 px-4 text-xs font-semibold text-primary transition-colors hover:bg-accent"
              >
                <Sparkles className="h-4 w-4" />
                Спросить ИИ по разделу
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

/** Подзаголовок внутри секции. */
export function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </h4>
  );
}

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-muted/30 p-4">
      <div className="text-xl font-bold leading-tight tracking-tight text-foreground">
        {value}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

/** Список «ключ — значение». */
export function KeyValueList({
  rows,
}: {
  rows: { label: string; value: string }[];
}) {
  return (
    <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
      {rows.map((r) => (
        <div key={r.label} className="flex flex-col gap-1">
          <dt className="text-xs text-muted-foreground">{r.label}</dt>
          <dd className="text-sm font-semibold text-foreground">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Маркированный список. */
export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm leading-5 text-foreground">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Теги/чипы. */
export function TagList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-foreground"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

/** Горизонтальные бары (рейтинг). */
export function BarList({
  items,
  barClassName = "bg-primary",
}: {
  items: Bar[];
  barClassName?: string;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-3">
          <span className="w-40 shrink-0 truncate text-sm text-muted-foreground">
            {item.label}
          </span>
          <span className="relative h-2 flex-1 rounded-full bg-muted">
            <span
              className={cn(
                "absolute inset-y-0 left-0 rounded-full",
                barClassName
              )}
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </span>
          <span className="w-8 shrink-0 text-right text-sm font-semibold tabular-nums text-foreground">
            {item.value}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Вертикальная столбчатая диаграмма по годам. */
export function YearBars({
  data,
}: {
  data: { year: string; value: number }[];
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div>
      <div className="mb-2 flex gap-3">
        {data.map((d) => (
          <span
            key={d.year}
            className="flex-1 text-center text-xs tabular-nums text-muted-foreground"
          >
            {d.value}
          </span>
        ))}
      </div>
      <div className="flex h-36 items-end gap-3">
        {data.map((d) => (
          <div
            key={d.year}
            className="flex-1 rounded-t-md bg-primary"
            style={{ height: `${(d.value / max) * 100}%` }}
          />
        ))}
      </div>
      <div className="mt-2 flex gap-3">
        {data.map((d) => (
          <span
            key={d.year}
            className="flex-1 text-center text-xs text-muted-foreground"
          >
            {d.year}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Простая таблица. */
export function SimpleTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            {columns.map((c) => (
              <th
                key={c}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-border last:border-0 hover:bg-muted/30"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={cn(
                    "px-4 py-3",
                    j === 0
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
