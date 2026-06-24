"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Barcode,
  Clock,
  FileText,
  Package,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Ship,
  Sparkles,
} from "lucide-react";

import { ChatHistoryPanel } from "@/components/chat/chat-history-panel";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatProductPanel } from "@/components/chat/chat-product-panel";
import type {
  AssistantMessage,
  ChatHistoryItem,
  Cta,
} from "@/components/chat/use-assistant";
import type { ProductDetail } from "@/config/products";
import { cn } from "@/lib/utils";

const QUICK = [
  { icon: Ship, label: "Отследить контейнер", prompt: "Отследить контейнер MSCU7263514" },
  { icon: ShieldCheck, label: "Проверить контрагента", prompt: "Проверь ТОО «Чайный Дом Алматы»" },
  { icon: FileText, label: "Документы для импорта", prompt: "Какие документы нужны для импорта оборудования?" },
  { icon: ShieldAlert, label: "Проверить ограничения", prompt: "Есть ли ограничения на экспорт электроники?" },
  { icon: Package, label: "Анализ товара", prompt: "Покажи карточку товара: чай чёрный" },
  { icon: Barcode, label: "Подобрать код ТН ВЭД", prompt: "Подобрать код ТН ВЭД для кофе" },
];

export function AiChatModule({
  messages,
  typing,
  productDetail,
  history,
  onAsk,
  onOpenModule,
  onCloseProduct,
  onReset,
  onLoadChat,
}: {
  messages: AssistantMessage[];
  typing: boolean;
  productDetail: ProductDetail | null;
  history: ChatHistoryItem[];
  onAsk: (text: string) => void;
  onOpenModule: (moduleId: string) => void;
  onCloseProduct: () => void;
  onReset: () => void;
  onLoadChat: (id: string) => void;
}) {
  const [value, setValue] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
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

  const onCta = (cta: Cta) =>
    cta.moduleId ? onOpenModule(cta.moduleId) : onAsk(cta.question ?? "");

  const empty = messages.length === 0;

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-8">
        <Sparkles className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-bold tracking-tight text-foreground">
          ИИ Чат
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setHistoryOpen((o) => !o)}
            className={cn(
              "flex h-9 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium transition-colors",
              historyOpen
                ? "bg-accent text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Clock className="h-4 w-4" />
            История
          </button>
          {!empty && (
            <button
              type="button"
              onClick={onReset}
              className="flex h-9 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
              Новый чат
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-8">
            {empty ? (
              <div className="flex min-h-full flex-col items-center justify-center">
                <div className="flex w-full max-w-2xl flex-col items-center gap-6 text-center animate-fade-in-up">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#068DFF] to-[#0463b3] text-white">
                    <Sparkles className="h-8 w-8" />
                  </span>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                      Чем помочь по ВЭД?
                    </h2>
                    <p className="text-base text-muted-foreground">
                      Задайте вопрос или выберите тему ниже
                    </p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      submit();
                    }}
                    className="flex w-full items-center gap-3 rounded-full border border-border bg-card p-2 pl-6 shadow-sm shadow-foreground/5"
                  >
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Спросите что-нибудь о ВЭД…"
                      aria-label="Сообщение ассистенту"
                      className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    />
                    <button
                      type="submit"
                      disabled={value.trim().length === 0}
                      aria-label="Отправить"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                    >
                      <ArrowUp className="h-5 w-5" />
                    </button>
                  </form>

                  <div className="flex flex-wrap justify-center gap-2">
                    {QUICK.map((q) => {
                      const Icon = q.icon;
                      return (
                        <button
                          key={q.label}
                          type="button"
                          onClick={() => onAsk(q.prompt)}
                          className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-accent"
                        >
                          <Icon className="h-4 w-4 text-primary" />
                          {q.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mx-auto w-full max-w-3xl">
                <ChatMessages
                  messages={messages}
                  typing={typing}
                  onFollowup={onAsk}
                  onCta={onCta}
                  onOpenModule={onOpenModule}
                />
              </div>
            )}
          </div>

          {!empty && (
            <div className="px-8 pb-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
                className="mx-auto flex w-full max-w-3xl items-center gap-3 rounded-full border border-border bg-card p-2 pl-6 shadow-sm shadow-foreground/5"
              >
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Спросите что-нибудь о ВЭД…"
                  aria-label="Сообщение ассистенту"
                  className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  disabled={value.trim().length === 0}
                  aria-label="Отправить"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  <ArrowUp className="h-5 w-5" />
                </button>
              </form>
            </div>
          )}
        </div>

        {productDetail ? (
          <ChatProductPanel detail={productDetail} onClose={onCloseProduct} />
        ) : historyOpen ? (
          <ChatHistoryPanel
            items={history}
            onSelect={(id) => {
              onLoadChat(id);
              setHistoryOpen(false);
            }}
            onClose={() => setHistoryOpen(false)}
          />
        ) : null}
      </div>
    </div>
  );
}
