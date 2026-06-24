"use client";

import { useState } from "react";
import { Clock, Map as MapIcon, Search, Ship } from "lucide-react";

import { buildTracking, type Tracking, type TrackStatus } from "@/config/tracking";
import { cn } from "@/lib/utils";

const DOT: Record<TrackStatus, string> = {
  done: "border-primary bg-primary",
  current: "border-primary bg-card ring-4 ring-primary/20",
  pending: "border-border bg-card",
};

export function ContainerModule() {
  const [value, setValue] = useState("");
  const [tracking, setTracking] = useState<Tracking | null>(null);
  const [view, setView] = useState<"timeline" | "map">("timeline");
  const [recent, setRecent] = useState<string[]>([
    "MSCU7263514",
    "TCLU1234567",
  ]);

  function track(q: string) {
    const t = q.trim();
    if (!t) return;
    setValue(t);
    setTracking(buildTracking(t));
    setRecent((prev) => [t, ...prev.filter((x) => x !== t)].slice(0, 6));
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-8 text-sm">
        <Ship className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="font-bold text-foreground">Отслеживание контейнера</span>
      </header>

      <div className="shrink-0 px-8 pt-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            track(value);
          }}
          className="flex h-12 items-center gap-2 rounded-full border border-border bg-card pl-5 pr-2 shadow-sm shadow-foreground/5"
        >
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Номер контейнера — например, MSCU7263514"
            aria-label="Номер контейнера"
            className="min-w-0 flex-1 bg-transparent text-sm uppercase text-foreground outline-none placeholder:normal-case placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={value.trim().length === 0}
            className="flex h-8 shrink-0 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            Отследить
          </button>
        </form>
        <div className="mt-4 flex items-center gap-3">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Недавние
          </span>
          <div className="flex flex-1 gap-2 overflow-x-auto pb-1">
            {recent.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => track(q)}
                className="flex h-8 shrink-0 items-center gap-2 rounded-full border border-border bg-card px-3 font-mono text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-accent"
              >
                <Clock className="h-4 w-4 text-muted-foreground" />
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-8 pt-4">
        {tracking ? (
          <div className="flex flex-col gap-4 animate-fade-in-up">
            {/* Hero */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                    <Ship className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="font-mono text-lg font-bold tracking-tight text-foreground">
                      {tracking.number}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {tracking.carrier} · {tracking.product}
                    </div>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
                  {tracking.status}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>{tracking.from}</span>
                <span>{tracking.to}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${tracking.progress}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Судно:{" "}
                  <span className="font-semibold text-foreground">
                    {tracking.vessel}
                  </span>
                </span>
                <span className="font-semibold text-foreground">
                  ETA {tracking.eta}
                </span>
              </div>
            </div>

            {/* View toggle */}
            <div className="flex w-fit items-center gap-1 rounded-full bg-muted p-1">
              {(
                [
                  ["timeline", "Статусы"],
                  ["map", "Карта"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setView(id)}
                  className={cn(
                    "flex h-8 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors",
                    view === id
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {id === "map" && <MapIcon className="h-4 w-4" />}
                  {label}
                </button>
              ))}
            </div>

            {view === "timeline" ? (
              <div className="rounded-2xl border border-border bg-card p-6">
                <ol className="flex flex-col">
                  {tracking.steps.map((s, i) => (
                    <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
                      {i < tracking.steps.length - 1 && (
                        <span className="absolute left-[7px] top-4 h-full w-px bg-border" />
                      )}
                      <span
                        className={cn(
                          "relative mt-1 h-4 w-4 shrink-0 rounded-full border-2",
                          DOT[s.status]
                        )}
                      />
                      <div className="flex flex-1 items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-foreground">
                            {s.port}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {s.note}
                          </div>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 text-xs",
                            s.status === "current"
                              ? "font-semibold text-primary"
                              : "text-muted-foreground"
                          )}
                        >
                          {s.date}
                        </span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <div className="relative h-[420px] overflow-hidden rounded-2xl border border-border bg-muted/30">
                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    backgroundImage:
                      "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />
                <span className="absolute left-4 top-4 rounded-full bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                  Маршрут · демо
                </span>
                <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                  <polyline
                    points={tracking.steps.map((s) => `${s.x}%,${s.y}%`).join(" ")}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    strokeDasharray="6 6"
                  />
                </svg>
                {tracking.steps.map((s, i) => (
                  <div
                    key={i}
                    style={{ left: `${s.x}%`, top: `${s.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full text-white shadow-md",
                        s.status === "pending" ? "bg-muted-foreground" : "bg-primary",
                        s.status === "current" && "ring-4 ring-primary/30"
                      )}
                    >
                      <Ship className="h-4 w-4" />
                    </span>
                    <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-card px-2 py-1 text-xs font-medium text-foreground shadow-sm">
                      {s.code}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex min-h-full flex-col items-center justify-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-accent text-primary">
              <Ship className="h-8 w-8" strokeWidth={1.8} />
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
              Отслеживание контейнера
            </h2>
            <p className="mt-2 max-w-md text-base text-muted-foreground">
              Введите номер контейнера — покажу текущую локацию, маршрут, порты,
              статусы и дату прибытия
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
