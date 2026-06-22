"use client";

import { useMemo, useState } from "react";
import { MessageSquare, Pin, Plus, Search, Settings } from "lucide-react";

import { VedLogo } from "@/components/brand/ved-logo";
import { type Conversation, useChat } from "@/components/chat/chat-context";
import { cn } from "@/lib/utils";

export function ChatSidebar() {
  const { conversations, activeId, newChat, selectConversation, togglePin } =
    useChat();
  const [query, setQuery] = useState("");

  const { pinned, history } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? conversations.filter((c) => c.title.toLowerCase().includes(q))
      : conversations;
    return {
      pinned: filtered.filter((c) => c.pinned),
      history: filtered.filter((c) => !c.pinned),
    };
  }, [conversations, query]);

  const nothingFound = pinned.length === 0 && history.length === 0;

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-border bg-card">
      <div className="flex items-center gap-3 px-4 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/60">
          <VedLogo className="h-6 w-6" />
        </span>
        <span className="text-lg font-bold tracking-tight text-foreground">
          VED
        </span>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-4">
        <button
          type="button"
          onClick={newChat}
          className="flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Новый чат
        </button>

        <div className="flex h-10 items-center gap-2 rounded-xl border border-border bg-muted/40 px-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по чатам"
            aria-label="Поиск по чатам"
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        {nothingFound ? (
          <p className="px-2 py-4 text-xs text-muted-foreground">
            Ничего не найдено
          </p>
        ) : (
          <>
            {pinned.length > 0 && (
              <Section title="Закреплённые диалоги">
                {pinned.map((conversation) => (
                  <HistoryItem
                    key={conversation.id}
                    conversation={conversation}
                    isActive={conversation.id === activeId}
                    onSelect={() => selectConversation(conversation.id)}
                    onTogglePin={() => togglePin(conversation.id)}
                  />
                ))}
              </Section>
            )}

            {history.length > 0 && (
              <Section title="История предыдущих запросов">
                {history.map((conversation) => (
                  <HistoryItem
                    key={conversation.id}
                    conversation={conversation}
                    isActive={conversation.id === activeId}
                    onSelect={() => selectConversation(conversation.id)}
                    onTogglePin={() => togglePin(conversation.id)}
                  />
                ))}
              </Section>
            )}
          </>
        )}
      </nav>

      <div className="border-t border-border p-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-muted"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-700 text-xs font-semibold text-primary-foreground">
            АД
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold text-foreground">
              Adata
            </span>
            <span className="truncate text-xs text-muted-foreground">
              22726@adata.kz
            </span>
          </span>
          <Settings className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </div>
    </aside>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <p className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <ul className="flex flex-col gap-1">{children}</ul>
    </div>
  );
}

function HistoryItem({
  conversation,
  isActive,
  onSelect,
  onTogglePin,
}: {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
  onTogglePin: () => void;
}) {
  const isPinned = !!conversation.pinned;
  return (
    <li className="group relative">
      <button
        type="button"
        onClick={onSelect}
        aria-current={isActive ? "true" : undefined}
        className={cn(
          "flex w-full items-center gap-2 rounded-lg py-2 pl-2 pr-9 text-left text-sm transition-colors",
          isActive
            ? "bg-accent font-semibold text-accent-foreground"
            : "text-foreground hover:bg-muted"
        )}
      >
        <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="truncate">{conversation.title}</span>
      </button>

      <button
        type="button"
        onClick={onTogglePin}
        aria-label={isPinned ? "Открепить" : "Закрепить"}
        title={isPinned ? "Открепить" : "Закрепить"}
        className={cn(
          "absolute right-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md transition-opacity hover:bg-background/60",
          isPinned
            ? "text-primary opacity-100"
            : "text-muted-foreground opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
        )}
      >
        {isPinned ? <Pin className="h-4 w-4 fill-current" /> : <Pin className="h-4 w-4" />}
      </button>
    </li>
  );
}
