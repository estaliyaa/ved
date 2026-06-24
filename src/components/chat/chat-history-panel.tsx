"use client";

import { MessageSquare, X } from "lucide-react";

import type { ChatHistoryItem } from "@/components/chat/use-assistant";

export function ChatHistoryPanel({
  items,
  onSelect,
  onClose,
}: {
  items: ChatHistoryItem[];
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <aside className="flex w-72 shrink-0 flex-col overflow-hidden border-l border-border bg-card">
      <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border px-5">
        <span className="text-sm font-semibold text-foreground">
          История чатов
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть историю"
          className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-3">
        {items.length === 0 ? (
          <p className="px-2 py-4 text-sm text-muted-foreground">
            Пока нет сохранённых чатов
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            {items.map((it) => (
              <li key={it.id}>
                <button
                  type="button"
                  onClick={() => onSelect(it.id)}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left transition-colors hover:bg-muted"
                >
                  <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="truncate text-sm text-foreground">
                    {it.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
