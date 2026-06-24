import { ArrowRight, Ship } from "lucide-react";

import type { TrackingData } from "@/components/chat/use-assistant";
import { cn } from "@/lib/utils";

export function TrackingCard({
  data,
  onOpen,
}: {
  data: TrackingData;
  onOpen: (moduleId: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
            <Ship className="h-5 w-5" />
          </span>
          <div>
            <div className="text-lg font-bold tracking-tight text-foreground">
              {data.number}
            </div>
            <div className="text-xs text-muted-foreground">
              {data.carrier} · {data.product}
            </div>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">
          {data.status}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>{data.from}</span>
        <span>{data.to}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${data.progress}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          Судно:{" "}
          <span className="font-semibold text-foreground">{data.vessel}</span>
        </span>
        <span className="font-semibold text-foreground">ETA {data.eta}</span>
      </div>

      <ol className="mt-5 flex flex-col">
        {data.steps.map((s, i) => (
          <li key={i} className="relative flex gap-3 pb-4 last:pb-0">
            {i < data.steps.length - 1 && (
              <span className="absolute left-[5px] top-3 h-full w-px bg-border" />
            )}
            <span
              className={cn(
                "relative mt-1 h-3 w-3 shrink-0 rounded-full border-2",
                s.done ? "border-primary bg-primary" : "border-border bg-card"
              )}
            />
            <div className="flex flex-1 items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-foreground">
                  {s.port}
                </div>
                <div className="text-xs text-muted-foreground">{s.note}</div>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {s.date}
              </span>
            </div>
          </li>
        ))}
      </ol>

      <button
        type="button"
        onClick={() => onOpen("container-tracking")}
        className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
      >
        Открыть «Отслеживание контейнеров»
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
