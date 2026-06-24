"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileSearch,
  Lightbulb,
  Scale,
  Search,
  ShieldAlert,
  ShieldCheck,
  XCircle,
  type LucideIcon,
} from "lucide-react";

import { SectionCard } from "@/components/product/data-bits";
import { buildAudit, type Audit, type CheckStatus } from "@/config/audit";
import { cn } from "@/lib/utils";

const STATUS: Record<
  CheckStatus,
  { label: string; icon: LucideIcon; badge: string; dot: string; text: string }
> = {
  ok: {
    label: "Норма",
    icon: CheckCircle2,
    badge: "bg-emerald-50 text-emerald-700",
    dot: "text-emerald-600",
    text: "text-emerald-700",
  },
  warn: {
    label: "Внимание",
    icon: AlertTriangle,
    badge: "bg-amber-50 text-amber-700",
    dot: "text-amber-600",
    text: "text-amber-700",
  },
  risk: {
    label: "Риск",
    icon: XCircle,
    badge: "bg-rose-50 text-rose-700",
    dot: "text-rose-600",
    text: "text-rose-700",
  },
};

const SECTION_ICON: Record<string, LucideIcon> = {
  documents: FileSearch,
  tnved: Scale,
  value: Scale,
  payments: Scale,
  restrictions: ShieldCheck,
  violations: ShieldAlert,
};

export function AuditModule({ onAskAi }: { onAskAi?: () => void }) {
  const [value, setValue] = useState("");
  const [audit, setAudit] = useState<Audit | null>(null);
  const [open, setOpen] = useState<Set<string>>(new Set(["tnved", "violations"]));

  function run(q: string) {
    const t = q.trim();
    if (!t) return;
    setValue(t);
    setAudit(buildAudit(t));
    setOpen(new Set(["tnved", "violations"]));
  }

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-8 text-sm">
        <ShieldAlert className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="font-bold text-foreground">Таможенный аудит</span>
      </header>

      <div className="shrink-0 px-8 pt-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(value);
          }}
          className="flex h-12 items-center gap-2 rounded-full border border-border bg-card pl-5 pr-2 shadow-sm shadow-foreground/5"
        >
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="БИН компании или номер декларации / поставки"
            aria-label="Компания или поставка"
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={value.trim().length === 0}
            className="flex h-8 shrink-0 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            Проверить
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-8 pt-6">
        {audit ? (
          <div className="flex flex-col gap-4 animate-fade-in-up">
            {/* Сводка по риску */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-lg font-bold tracking-tight text-foreground">
                    {audit.subject}
                  </div>
                  <div className="text-xs text-muted-foreground">{audit.type}</div>
                </div>
                <RiskGauge score={audit.score} level={audit.level} />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <SummaryStat icon={CheckCircle2} value={audit.passed} label="В норме" status="ok" />
                <SummaryStat icon={AlertTriangle} value={audit.warnings} label="Замечаний" status="warn" />
                <SummaryStat icon={XCircle} value={audit.risks} label="Рисков" status="risk" />
              </div>
            </div>

            {/* Проверки */}
            {audit.sections.map((s) => {
              const st = STATUS[s.status];
              return (
                <SectionCard
                  key={s.id}
                  icon={SECTION_ICON[s.id] ?? FileSearch}
                  title={s.title}
                  open={open.has(s.id)}
                  onToggle={() => toggle(s.id)}
                >
                  <span
                    className={cn(
                      "mb-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
                      st.badge
                    )}
                  >
                    <st.icon className="h-4 w-4" />
                    {st.label}
                  </span>
                  <p className="mb-4 text-sm text-muted-foreground">{s.summary}</p>
                  <ul className="flex flex-col gap-3">
                    {s.findings.map((f, i) => {
                      const fs = STATUS[f.status];
                      return (
                        <li key={i} className="flex gap-3">
                          <fs.icon className={cn("mt-1 h-4 w-4 shrink-0", fs.dot)} />
                          <div>
                            <div className="text-sm font-semibold text-foreground">
                              {f.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {f.detail}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </SectionCard>
              );
            })}

            {/* Рекомендации */}
            <section className="overflow-hidden rounded-2xl border border-primary/30 bg-accent/40">
              <div className="flex items-center gap-3 px-5 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Lightbulb className="h-4 w-4" strokeWidth={1.8} />
                </span>
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                  Рекомендации по снижению рисков
                </h3>
              </div>
              <ol className="flex flex-col gap-3 px-5 pb-5 pt-1">
                {audit.recommendations.map((r, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-5 text-foreground">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    {r}
                  </li>
                ))}
              </ol>
              {onAskAi && (
                <div className="border-t border-primary/20 px-5 py-4">
                  <button
                    type="button"
                    onClick={onAskAi}
                    className="flex h-9 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Разобрать с ИИ
                  </button>
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className="flex min-h-full flex-col items-center justify-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-accent text-primary">
              <ShieldAlert className="h-8 w-8" strokeWidth={1.8} />
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
              Таможенный аудит
            </h2>
            <p className="mt-2 max-w-md text-base text-muted-foreground">
              Введите компанию или поставку — проверю документы, ТН ВЭД, стоимость,
              платежи и ограничения, найду риски и дам рекомендации
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function RiskGauge({ score, level }: { score: number; level: CheckStatus }) {
  const st = STATUS[level];
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-20 shrink-0">
        <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            className="stroke-muted"
            strokeWidth="3"
          />
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            className={cn(
              level === "ok" && "stroke-emerald-500",
              level === "warn" && "stroke-amber-500",
              level === "risk" && "stroke-rose-500"
            )}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 97.4} 97.4`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold tracking-tight text-foreground">
            {score}
          </span>
          <span className="text-xs text-muted-foreground">риск</span>
        </div>
      </div>
      <span
        className={cn(
          "rounded-full px-3 py-1 text-xs font-semibold",
          st.badge
        )}
      >
        {level === "risk" ? "Высокий" : level === "warn" ? "Средний" : "Низкий"} риск
      </span>
    </div>
  );
}

function SummaryStat({
  icon: Icon,
  value,
  label,
  status,
}: {
  icon: LucideIcon;
  value: number;
  label: string;
  status: CheckStatus;
}) {
  const st = STATUS[status];
  return (
    <div className="flex flex-col items-center rounded-xl border border-border bg-muted/30 p-4">
      <Icon className={cn("h-5 w-5", st.dot)} />
      <span className="mt-2 text-xl font-bold tracking-tight text-foreground">
        {value}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
