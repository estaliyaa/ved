"use client";

import { useEffect, useRef, useState } from "react";
import { Download, SendHorizontal, Sparkles } from "lucide-react";

import type { AgentContext } from "@/config/agents";
import { cn } from "@/lib/utils";

type Msg = { id: string; role: "user" | "assistant"; text: string };

let seq = 0;
const uid = () => `a-${(seq += 1)}`;

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
  const [messages, setMessages] = useState<Msg[]>([]);
  const [value, setValue] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function send(text: string) {
    const t = text.trim();
    if (!t) return;
    setMessages((prev) => [...prev, { id: uid(), role: "user", text: t }]);
    setTyping(true);
    timer.current = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "assistant", text: reply(t, context.subject) },
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

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages.length, typing]);

  const started = messages.length > 0;

  return (
    <aside className="flex w-[420px] shrink-0 flex-col overflow-hidden border-r border-border bg-card">
      {/* Статус соединения */}
      <div className="flex h-12 shrink-0 items-center border-b border-border px-6">
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

      {/* Диалог */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5">
        {/* Приветствие + подсказки */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent text-primary">
              <Sparkles className="h-4 w-4" />
            </span>
            AI
          </div>
          <p className="text-base leading-6 text-foreground">{context.greeting}</p>
          <button
            type="button"
            className="flex h-9 w-fit items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Download className="h-4 w-4" />
            Скачать
          </button>

          {!started && (
            <div className="mt-1 flex flex-wrap gap-2">
              {context.suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-accent"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Сообщения */}
        {started && (
          <div className="mt-6 flex flex-col gap-4">
            {messages.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2 text-sm text-primary-foreground">
                    {m.text}
                  </div>
                </div>
              ) : (
                <div key={m.id} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent text-primary">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    AI
                  </div>
                  <p className="text-sm leading-5 text-foreground">{m.text}</p>
                </div>
              )
            )}
            {typing && (
              <div className="flex gap-1 px-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-typing"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ввод */}
      <div className="shrink-0 border-t border-border px-6 py-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(value);
            setValue("");
          }}
          className="flex h-12 items-center gap-2 rounded-2xl border border-border bg-card pl-4 pr-2 transition-colors focus-within:border-primary/50"
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
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
            )}
          >
            <SendHorizontal className="h-4 w-4" />
          </button>
        </form>
        <p className="mt-2 text-xs text-muted-foreground">
          Ответы основаны на интегрированных источниках. Возможны неточности.
        </p>
      </div>
    </aside>
  );
}
