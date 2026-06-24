"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  FileText,
  Maximize2,
  ShieldAlert,
  ShieldCheck,
  Ship,
  Sparkles,
  X,
} from "lucide-react";

import { ChatMessages } from "@/components/chat/chat-messages";
import type { AssistantMessage, Cta } from "@/components/chat/use-assistant";

const QUICK = [
  { icon: Ship, label: "Отследить контейнер", prompt: "Отследить контейнер MSCU7263514" },
  { icon: ShieldCheck, label: "Проверить контрагента", prompt: "Проверь ТОО «Чайный Дом Алматы»" },
  { icon: FileText, label: "Подобрать документы", prompt: "Какие документы нужны для импорта?" },
  { icon: ShieldAlert, label: "Проверить ограничения", prompt: "Есть ли ограничения на экспорт электроники?" },
];

export function AiAssistantPopup({
  messages,
  typing,
  onAsk,
  onClose,
  onExpand,
  onEscalate,
  onOpenModule,
}: {
  messages: AssistantMessage[];
  typing: boolean;
  onAsk: (text: string) => void;
  onClose: () => void;
  onExpand: () => void;
  onEscalate: (question: string) => void;
  onOpenModule: (moduleId: string) => void;
}) {
  const [value, setValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages.length, typing]);

  function submit() {
    const t = value.trim();
    if (!t) return;
    onAsk(t);
    setValue("");
  }

  const onCta = (cta: Cta) => {
    if (cta.question) onEscalate(cta.question);
    else if (cta.moduleId) onOpenModule(cta.moduleId);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[660px] max-h-[calc(100vh-5rem)] w-[440px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-foreground/15 animate-fade-in-up">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          <Sparkles className="h-5 w-5" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-sm font-bold text-foreground">ИИ Ассистент</span>
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            На связи
          </span>
        </div>
        <button
          type="button"
          onClick={onExpand}
          aria-label="Открыть в ИИ Чате"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        <ChatMessages
          messages={messages}
          typing={typing}
          onFollowup={onAsk}
          onCta={onCta}
          onOpenModule={onOpenModule}
        />
      </div>

      <div className="border-t border-border px-4 py-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Быстрые действия
        </p>
        <div className="grid grid-cols-2 gap-2">
          {QUICK.map((q) => {
            const Icon = q.icon;
            return (
              <button
                key={q.label}
                type="button"
                onClick={() => onAsk(q.prompt)}
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-left text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-accent"
              >
                <Icon className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate">{q.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex items-center gap-2 border-t border-border p-3"
      >
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Напишите ваш вопрос…"
          aria-label="Сообщение ассистенту"
          className="h-10 min-w-0 flex-1 rounded-full border border-border bg-muted/40 px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/40"
        />
        <button
          type="submit"
          disabled={value.trim().length === 0}
          aria-label="Отправить"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
