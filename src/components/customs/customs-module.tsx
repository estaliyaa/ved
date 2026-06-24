"use client";

import { useMemo, useState } from "react";
import { MapPin, Search, Warehouse } from "lucide-react";

import {
  facilities,
  facilityTypes,
  type FacilityTypeId,
  typeIcon,
  typeLabel,
} from "@/config/customs";
import { cn } from "@/lib/utils";

export function CustomsModule() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Set<FacilityTypeId>>(new Set());
  const [selected, setSelected] = useState<string | null>(null);

  function toggleType(id: FacilityTypeId) {
    setActive((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return facilities.filter(
      (f) =>
        (active.size === 0 || active.has(f.type)) &&
        (!q ||
          f.name.toLowerCase().includes(q) ||
          f.city.toLowerCase().includes(q) ||
          f.address.toLowerCase().includes(q))
    );
  }, [query, active]);

  const visibleIds = new Set(filtered.map((f) => f.id));

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-8 text-sm">
        <Warehouse className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="font-bold text-foreground">Околотаможенная сфера</span>
      </header>

      {/* Поиск + фильтры */}
      <div className="shrink-0 border-b border-border px-8 py-4">
        <div className="flex h-11 items-center gap-2 rounded-full border border-border bg-card pl-5 pr-2">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск объекта — например, «СВХ в Алматы» или «Хоргос»"
            aria-label="Поиск объекта"
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {facilityTypes.map((t) => {
            const on = active.has(t.id);
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => toggleType(t.id)}
                className={cn(
                  "flex h-8 items-center gap-2 rounded-full border px-3 text-xs font-medium transition-colors",
                  on
                    ? "border-primary bg-accent text-primary"
                    : "border-border bg-card text-muted-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Список + карта */}
      <div className="flex min-h-0 flex-1">
        <div className="w-[380px] shrink-0 overflow-y-auto border-r border-border p-4">
          <p className="mb-3 px-1 text-xs text-muted-foreground">
            Найдено объектов: {filtered.length}
          </p>
          <ul className="flex flex-col gap-2">
            {filtered.map((f) => {
              const Icon = typeIcon(f.type);
              const isSel = selected === f.id;
              return (
                <li key={f.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(f.id)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors",
                      isSel
                        ? "border-primary bg-accent/40"
                        : "border-border bg-card hover:border-primary/40 hover:bg-accent/20"
                    )}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-foreground">
                        {f.name}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {f.city} · {f.address}
                      </div>
                      <div className="mt-1 text-xs text-primary">
                        {typeLabel(f.type)}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="px-1 py-4 text-sm text-muted-foreground">
                Ничего не найдено
              </li>
            )}
          </ul>
        </div>

        {/* Карта (демо) */}
        <div className="relative min-w-0 flex-1 overflow-hidden bg-muted/30">
          <div
            className="absolute inset-0 opacity-[0.5]"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <span className="absolute left-4 top-4 rounded-full bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            Карта · демо
          </span>

          {facilities.map((f) => {
            const visible = visibleIds.has(f.id);
            const isSel = selected === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelected(f.id)}
                aria-label={f.name}
                style={{ left: `${f.x}%`, top: `${f.y}%` }}
                className={cn(
                  "group absolute -translate-x-1/2 -translate-y-full transition-all",
                  visible ? "opacity-100" : "pointer-events-none opacity-20"
                )}
              >
                <span
                  className={cn(
                    "flex items-center justify-center rounded-full text-white shadow-md transition-all",
                    isSel
                      ? "h-9 w-9 bg-gradient-to-br from-[#068DFF] to-[#0463b3] ring-4 ring-primary/30"
                      : "h-7 w-7 bg-primary group-hover:scale-110"
                  )}
                >
                  <MapPin className={isSel ? "h-5 w-5" : "h-4 w-4"} />
                </span>
                {isSel && (
                  <span className="absolute left-1/2 top-full mt-2 w-44 -translate-x-1/2 rounded-xl border border-border bg-card p-3 text-left shadow-lg">
                    <span className="block truncate text-sm font-semibold text-foreground">
                      {f.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {f.city} · {typeLabel(f.type)}
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
