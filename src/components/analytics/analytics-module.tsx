"use client";

import { useState } from "react";
import { BarChart3 } from "lucide-react";

import { BarList, YearBars } from "@/components/product/data-bits";
import * as A from "@/config/analytics";
import { cn } from "@/lib/utils";

const TABS = [
  "Импорт",
  "Экспорт",
  "ТН ВЭД",
  "Компании",
  "Регионы",
  "Отрасли",
  "Дашборды",
] as const;

export function AnalyticsModule() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Импорт");

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-8 text-sm">
        <BarChart3 className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="font-bold text-foreground">Аналитика ВЭД</span>
      </header>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="flex flex-col gap-6">
          {/* KPI */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {A.kpis.map((k) => (
              <div key={k.label} className="rounded-2xl border border-border bg-card p-5">
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {k.value}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{k.label}</div>
                <div className="mt-2 text-xs font-semibold text-emerald-600">
                  {k.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto border-b border-border pb-px">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "shrink-0 border-b-2 px-3 pb-3 text-sm font-medium transition-colors",
                  tab === t
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "Импорт" && (
            <Grid3>
              <Card title="По странам">
                <BarList items={A.importByCountry} />
              </Card>
              <Card title="По регионам">
                <BarList items={A.importByRegion} barClassName="bg-emerald-500" />
              </Card>
              <Card title="По товарам">
                <BarList items={A.importByProduct} />
              </Card>
            </Grid3>
          )}

          {tab === "Экспорт" && (
            <Grid3>
              <Card title="По странам">
                <BarList items={A.exportByCountry} />
              </Card>
              <Card title="По регионам">
                <BarList items={A.exportByRegion} barClassName="bg-emerald-500" />
              </Card>
              <Card title="По товарам">
                <BarList items={A.exportByProduct} />
              </Card>
            </Grid3>
          )}

          {tab === "ТН ВЭД" && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Card title="По разделам">
                <BarList items={A.tnvedSections} />
              </Card>
              <Card title="По группам">
                <BarList items={A.tnvedGroups} barClassName="bg-emerald-500" />
              </Card>
            </div>
          )}

          {tab === "Компании" && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Card title="Топ импортёров (импорт, $млн)">
                <BarList items={A.topImporters} />
              </Card>
              <Card title="Топ экспортёров (экспорт, $млн)">
                <BarList items={A.topExporters} barClassName="bg-emerald-500" />
              </Card>
            </div>
          )}

          {tab === "Регионы" && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Card title="Структура торговли">
                <BarList items={A.regionStructure} />
              </Card>
              <Card title="Динамика товарооборота, $млрд">
                <YearBars data={A.yearly} />
              </Card>
              <Card title="География торговли · демо" wide>
                <RegionMap />
              </Card>
            </div>
          )}

          {tab === "Отрасли" && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Card title="Лидеры по отраслям, % товарооборота">
                <BarList items={A.industryLeaders} />
              </Card>
              <Card title="Тренд, $млрд">
                <YearBars data={A.yearly} />
              </Card>
            </div>
          )}

          {tab === "Дашборды" && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Card title="Карта товарооборота · демо" wide>
                <RegionMap />
              </Card>
              <Card title="Динамика, $млрд">
                <YearBars data={A.yearly} />
              </Card>
              <Card title="Рейтинг направлений">
                <BarList items={A.importByCountry} />
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Grid3({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">{children}</div>;
}

function Card({
  title,
  children,
  wide,
}: {
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5",
        wide && "lg:col-span-2"
      )}
    >
      <h3 className="mb-4 text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </div>
  );
}

function RegionMap() {
  return (
    <div className="relative h-64 overflow-hidden rounded-xl bg-muted/30">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {A.regionMap.map((r) => (
        <div
          key={r.label}
          style={{ left: `${r.x}%`, top: `${r.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
        >
          <span
            className="block rounded-full bg-primary/20 ring-2 ring-primary"
            style={{
              width: `${20 + r.share}px`,
              height: `${20 + r.share}px`,
            }}
          />
          <span className="mt-1 block whitespace-nowrap text-xs font-medium text-foreground">
            {r.label} · {r.share}%
          </span>
        </div>
      ))}
    </div>
  );
}
