"use client";

import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  Download,
  FileText,
  Globe2,
  Scale,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import {
  AreaChart,
  Donut,
  Sparkline,
  StackedBars,
  useCountUp,
  useMounted,
} from "@/components/analytics/charts";
import * as A from "@/config/analytics";
import { cn } from "@/lib/utils";

const ICONS: Record<A.Kpi["icon"], LucideIcon> = {
  turnover: Globe2,
  import: ArrowDownLeft,
  export: ArrowUpRight,
  balance: Scale,
  docs: FileText,
};

const HEAT_BG = [
  "bg-muted",
  "bg-primary/25",
  "bg-primary/45",
  "bg-primary/70",
  "bg-primary",
];

const PERIODS = ["Неделя", "Месяц", "Квартал", "Год"] as const;

export function AnalyticsModule() {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("Год");

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-8 text-sm">
        <BarChart3 className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="font-bold text-foreground">Аналитика ВЭД</span>
      </header>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="flex flex-col gap-5">
          {/* Заголовок раздела */}
          <div className="flex flex-wrap items-center justify-between gap-3 animate-fade-in-up">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Обзор внешней торговли
              </h2>
              <p className="text-sm text-muted-foreground">
                Казахстан · данные за 2024 год
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 rounded-full bg-muted p-1">
                {PERIODS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPeriod(p)}
                    className={cn(
                      "h-8 rounded-full px-3 text-sm font-medium transition-colors",
                      period === p
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <span className="flex h-9 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                01 янв — 31 дек 2024
              </span>
              <button
                type="button"
                className="flex h-9 items-center gap-2 rounded-full bg-gradient-to-br from-[#068DFF] to-[#0463b3] px-4 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-transform hover:scale-[1.03]"
              >
                <Download className="h-4 w-4" />
                Экспорт
              </button>
            </div>
          </div>

          {/* KPI */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 2xl:grid-cols-5">
            {A.kpis.map((k, i) => (
              <KpiCard key={k.id} kpi={k} delay={i * 60} />
            ))}
          </div>

          {/* График динамики + донат */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card
              className="lg:col-span-2"
              title="Динамика товарооборота"
              subtitle="Импорт и экспорт по месяцам, $ млрд"
              action={<Legend />}
              delay={120}
            >
              <AreaChart data={A.monthly} />
            </Card>
            <Card
              title="Структура по ТН ВЭД"
              subtitle="Доли разделов в товарообороте"
              delay={180}
            >
              <Donut
                segments={A.tnvedShare}
                centerTop="$138,4"
                centerSub="млрд оборот"
              />
              <ul className="mt-5 flex flex-col gap-2">
                {A.tnvedShare.map((s) => (
                  <li key={s.label} className="flex items-center gap-2 text-sm">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: s.color }}
                    />
                    <span className="min-w-0 flex-1 truncate text-muted-foreground">
                      {s.label}
                    </span>
                    <span className="font-semibold text-foreground">
                      {s.value}%
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Столбцы + топ стран */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card
              className="lg:col-span-2"
              title="Импорт / экспорт по месяцам"
              subtitle="$ млрд"
              action={<Legend />}
              delay={120}
            >
              <StackedBars data={A.monthly} />
            </Card>
            <Card title="Топ стран" subtitle="Доля в товарообороте" delay={180}>
              <RankRows
                rows={A.topCountries.map((c) => ({
                  lead: <span className="text-lg leading-none">{c.flag}</span>,
                  name: c.name,
                  pct: c.percent,
                  right: (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      {c.total}
                      {c.up ? (
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-rose-500" />
                      )}
                    </span>
                  ),
                }))}
                max={Math.max(...A.topCountries.map((c) => c.percent))}
              />
            </Card>
          </div>

          {/* Heatmap + отрасли */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card
              className="lg:col-span-2"
              title="Периоды активности оформления"
              subtitle="Пиковая нагрузка — будни, 11:00–14:00"
              delay={120}
            >
              <Heatmap />
            </Card>
            <Card title="Отрасли" subtitle="Доля в товарообороте" delay={180}>
              <div className="flex flex-col gap-4">
                {A.industries.map((s) => (
                  <Bar key={s.label} label={s.label} value={s.value} color={s.color} max={50} />
                ))}
              </div>
            </Card>
          </div>

          {/* Импортёры / экспортёры / карта */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card title="Топ импортёров" subtitle="по объёму ввоза" delay={120}>
              <RankRows
                rows={A.topImporters.map((c) => ({
                  name: c.name,
                  pct: c.share,
                  right: (
                    <span className="text-xs font-semibold text-foreground">
                      {c.value}
                    </span>
                  ),
                }))}
                max={100}
                color={A.PALETTE.violet}
              />
            </Card>
            <Card title="Топ экспортёров" subtitle="по объёму вывоза" delay={180}>
              <RankRows
                rows={A.topExporters.map((c) => ({
                  name: c.name,
                  pct: c.share,
                  right: (
                    <span className="text-xs font-semibold text-foreground">
                      {c.value}
                    </span>
                  ),
                }))}
                max={100}
                color={A.PALETTE.emerald}
              />
            </Card>
            <Card title="География торговли" subtitle="Доли регионов · демо" delay={240}>
              <RegionMap />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ kpi, delay }: { kpi: A.Kpi; delay: number }) {
  const n = useCountUp(kpi.value);
  const Icon = ICONS[kpi.icon];
  const display =
    kpi.prefix + n.toFixed(kpi.decimals).replace(".", ",") + kpi.suffix;
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 animate-fade-in-up transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-foreground/5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ background: `${kpi.color}1a`, color: kpi.color }}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span
          className={cn(
            "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold",
            kpi.up ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          )}
        >
          {kpi.up ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          {kpi.delta}
        </span>
      </div>
      <div className="mt-4 whitespace-nowrap text-xl font-bold tracking-tight text-foreground">
        {display}
      </div>
      <div className="text-xs text-muted-foreground">{kpi.label}</div>
      <div className="mt-3 h-8">
        <Sparkline data={kpi.spark} color={kpi.color} className="h-8 w-full" />
      </div>
    </div>
  );
}

function Card({
  title,
  subtitle,
  action,
  children,
  className,
  delay = 0,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card p-5 animate-fade-in-up",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Legend() {
  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <span className="flex items-center gap-1">
        <span className="h-2 w-2 rounded-full" style={{ background: "#7c5cfc" }} />
        Импорт
      </span>
      <span className="flex items-center gap-1">
        <span className="h-2 w-2 rounded-full" style={{ background: "#10b981" }} />
        Экспорт
      </span>
    </div>
  );
}

function RankRows({
  rows,
  max,
  color = "hsl(var(--primary))",
}: {
  rows: {
    lead?: React.ReactNode;
    name: string;
    pct: number;
    right: React.ReactNode;
  }[];
  max: number;
  color?: string;
}) {
  const mounted = useMounted();
  return (
    <ul className="flex flex-col gap-4">
      {rows.map((r, i) => (
        <li key={i} className="flex items-center gap-3">
          {r.lead}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                {r.name}
              </span>
              {r.right}
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-[width] duration-700 ease-out"
                style={{
                  width: mounted ? `${(r.pct / max) * 100}%` : "0%",
                  background: color,
                }}
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Bar({
  label,
  value,
  color,
  max,
}: {
  label: string;
  value: number;
  color: string;
  max: number;
}) {
  const mounted = useMounted();
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-foreground">{value}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{ width: mounted ? `${(value / max) * 100}%` : "0%", background: color }}
        />
      </div>
    </div>
  );
}

function Heatmap() {
  return (
    <div>
      <div className="flex gap-2">
        <div className="flex shrink-0 flex-col justify-between py-1 pr-1">
          {A.heatDays.map((d) => (
            <span key={d} className="text-xs leading-5 text-muted-foreground">
              {d}
            </span>
          ))}
        </div>
        <div className="flex-1">
          <div className="flex flex-col gap-1">
            {A.heat.map((row, ri) => (
              <div key={ri} className="grid grid-cols-12 gap-1">
                {row.map((v, ci) => (
                  <span
                    key={ci}
                    title={`${A.heatDays[ri]} · ${A.heatHours[ci]}:00`}
                    className={cn(
                      "aspect-square rounded-sm transition-transform hover:scale-110",
                      HEAT_BG[v]
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-12 gap-1">
            {A.heatHours.map((h) => (
              <span key={h} className="text-center text-xs text-muted-foreground">
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end gap-2 text-xs text-muted-foreground">
        Меньше
        {HEAT_BG.map((c, i) => (
          <span key={i} className={cn("h-3 w-3 rounded-sm", c)} />
        ))}
        Больше
      </div>
    </div>
  );
}

function RegionMap() {
  return (
    <div className="relative h-56 overflow-hidden rounded-xl bg-muted/30">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
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
            style={{ width: `${16 + r.share}px`, height: `${16 + r.share}px` }}
          />
          <span className="mt-1 block whitespace-nowrap text-xs font-medium text-foreground">
            {r.label} · {r.share}%
          </span>
        </div>
      ))}
    </div>
  );
}
