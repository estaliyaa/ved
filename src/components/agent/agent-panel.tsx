"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Sparkles } from "lucide-react";

import { ChatMessages } from "@/components/chat/chat-messages";
import type { AssistantMessage } from "@/components/chat/use-assistant";
import type { AgentContext } from "@/config/agents";

let seq = 0;
const uid = () => `ag-${(seq += 1)}`;

function reply(question: string, subject: string): string {
  return (
    `Собрал данные по запросу «${question}» в разделе «${subject}». ` +
    "Свёл информацию из государственных реестров, судебных баз и международных источников — " +
    "ниже основные выводы и рекомендации. Уточните детали, и я разверну любой пункт."
  );
}

export function AgentPanel({
  context,
  pending,
  onConsumePending,
}: {
  context: AgentContext;
  /** Готовый вопрос из раздела — панель отправит его автоматически. */
  pending?: string | null;
  onConsumePending?: () => void;
}) {
  const [messages, setMessages] = useState<AssistantMessage[]>(() => [
    {
      id: uid(),
      role: "assistant",
      kind: "text",
      content: context.greeting,
      followups: context.suggestions,
    },
  ]);
  const [value, setValue] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function send(text: string) {
    const t = text.trim();
    if (!t) return;
    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "user", kind: "text", content: t },
    ]);
    setTyping(true);
    timer.current = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          kind: "text",
          content: reply(t, context.subject),
        },
      ]);
      setTyping(false);
    }, 700);
  }

  // Авто-отправка готового вопроса из раздела.
  useEffect(() => {
    if (pending && pending.trim()) {
      send(pending);
      onConsumePending?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  // Автоскролл вниз только после начала диалога — на старте остаёмся вверху.
  useEffect(() => {
    if (messages.length > 1 || typing) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    }
  }, [messages.length, typing]);

  return (
    <aside className="flex w-[360px] shrink-0 flex-col overflow-hidden border-r border-border bg-card">
      {/* Статус соединения — высота совпадает с шапкой раздела */}
      <div className="flex h-16 shrink-0 items-center border-b border-border px-6">
        <span className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Защищённое соединение
        </span>
      </div>

      {/* Шапка диалога */}
      <header className="flex shrink-0 flex-col gap-1 border-b border-border px-6 py-4">
        <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          Диалог с ИИ-агентом
        </div>
        <div className="truncate text-lg font-bold tracking-tight text-foreground">
          {context.subject}
        </div>
      </header>

      {/* Диалог — единый дизайн с ИИ Ассистентом */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5">
        <ChatMessages
          messages={messages}
          typing={typing}
          onFollowup={send}
          onCta={() => undefined}
          onOpenModule={() => undefined}
        />
      </div>

      {/* Ввод */}
      <div className="shrink-0 border-t border-border px-6 py-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(value);
            setValue("");
          }}
          className="flex items-center gap-2 rounded-full border border-border bg-card p-2 pl-5 shadow-sm shadow-foreground/5"
        >
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Задайте уточняющий вопрос…"
            aria-label="Сообщение ИИ-агенту"
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={value.trim().length === 0}
            aria-label="Отправить"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </form>
        <p className="mt-2 text-xs text-muted-foreground">
          Ответы основаны на интегрированных источниках. Возможны неточности.
        </p>
      </div>
    </aside>
  );
}
