import { CircleCheck, FileText, ShieldAlert } from "lucide-react";

import type { DocumentsData } from "@/components/chat/use-assistant";

export function DocumentsCard({ data }: { data: DocumentsData }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-3">
        <FileText className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-bold tracking-tight text-foreground">
          Комплект документов
        </h3>
      </div>

      <ul className="flex flex-col gap-3">
        {data.base.map((d) => (
          <li key={d} className="flex items-center gap-3 text-sm text-foreground">
            <CircleCheck className="h-5 w-5 shrink-0 text-emerald-500" />
            {d}
          </li>
        ))}
      </ul>

      <p className="mb-3 mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Разрешительные документы для товара
      </p>
      <ul className="flex flex-col gap-3">
        {data.permits.map((p) => (
          <li
            key={p.label}
            className="flex items-center gap-3 text-sm text-foreground"
          >
            {p.warn ? (
              <ShieldAlert className="h-5 w-5 shrink-0 text-amber-500" />
            ) : (
              <CircleCheck className="h-5 w-5 shrink-0 text-emerald-500" />
            )}
            {p.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
