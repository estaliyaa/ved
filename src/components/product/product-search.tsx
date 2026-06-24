"use client";

import { Clock, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ProductSearch({
  value,
  onChange,
  onSubmit,
  recent,
  onRecent,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  recent: string[];
  onRecent: (q: string) => void;
}) {
  return (
    <div className="shrink-0 px-8 pt-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex h-12 items-center gap-2 rounded-full border border-border bg-card pl-5 pr-2 shadow-sm shadow-foreground/5"
      >
        <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Поиск товара по названию или коду ТН ВЭД — например, чай или 0902"
          aria-label="Поиск товара"
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <Button
          type="submit"
          size="sm"
          className="shrink-0 rounded-full px-5"
          disabled={value.trim().length === 0}
        >
          Найти
        </Button>
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
              onClick={() => onRecent(q)}
              className="flex h-8 shrink-0 items-center gap-2 rounded-full border border-border bg-card px-3 text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-accent"
            >
              <Clock className="h-4 w-4 text-muted-foreground" />
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
