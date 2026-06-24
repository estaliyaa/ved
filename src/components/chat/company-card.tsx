import { ArrowRight, Building2 } from "lucide-react";

import type { CompanyData } from "@/components/chat/use-assistant";

function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const w = 100;
  const h = 36;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className="h-16 w-full"
    >
      <polygon
        points={`0,${h} ${pts.join(" ")} ${w},${h}`}
        fill="rgb(16 185 129 / 0.12)"
      />
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke="#10b981"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </p>
  );
}

export function CompanyCard({
  data,
  onOpen,
}: {
  data: CompanyData;
  onOpen: (moduleId: string) => void;
}) {
  const maxStruct = Math.max(...data.structure.map((s) => s.value), 1);
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
            <Building2 className="h-5 w-5" />
          </span>
          <div>
            <div className="text-lg font-bold tracking-tight text-foreground">
              {data.name}
            </div>
            <div className="text-xs text-muted-foreground">
              БИН {data.bin} · {data.status}
            </div>
          </div>
        </div>
        <span className="flex shrink-0 items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {data.risk.label}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {data.stats.map((s) => (
          <div key={s.label}>
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="text-sm font-bold text-foreground">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <SubLabel>Динамика поставок</SubLabel>
        <Sparkline values={data.trend} />
      </div>

      <div className="mt-5">
        <SubLabel>Страны-партнёры</SubLabel>
        <div className="flex flex-wrap gap-2">
          {data.countries.map((c) => (
            <span
              key={c}
              className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-foreground"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <SubLabel>Товарная структура</SubLabel>
        <ul className="flex flex-col gap-2">
          {data.structure.map((s) => (
            <li key={s.label} className="flex items-center gap-4">
              <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-primary"
                  style={{ width: `${(s.value / maxStruct) * 100}%` }}
                />
              </span>
              <span className="w-44 shrink-0 truncate text-sm text-foreground">
                {s.label}
              </span>
              <span className="w-10 shrink-0 text-right text-sm font-bold tabular-nums text-foreground">
                {s.value}%
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 rounded-xl border border-border bg-muted/30 p-4">
        <SubLabel>Факторы оценки</SubLabel>
        <ul className="flex flex-col gap-2">
          {data.factors.map((f) => (
            <li key={f} className="flex gap-2 text-sm text-foreground">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={() => onOpen("importer-check")}
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
      >
        Полная проверка участника ВЭД
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
