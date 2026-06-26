"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUp,
  Barcode,
  Calculator,
  Clock,
  RotateCcw,
  Search,
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

const CARDS = [
  {
    icon: Barcode,
    title: "Подбор кода ТН ВЭД",
    desc: "Определю код, пошлины и НДС по описанию товара",
    prompt: "Подобрать код ТН ВЭД для кофе",
  },
  {
    icon: ShieldCheck,
    title: "Проверка контрагентов",
    desc: "Реквизиты, ВЭД-активность и оценка рисков",
    prompt: "Проверь ТОО «Чайный Дом Алматы»",
  },
  {
    icon: Ship,
    title: "Отслеживание контейнеров",
    desc: "Маршрут, порты, статусы и дата прибытия",
    prompt: "Отследить контейнер MSCU7263514",
  },
  {
    icon: Calculator,
    title: "Платежи и документы",
    desc: "Рассчитаю платежи и подскажу комплект документов",
    prompt: "Какие документы нужны для импорта оборудования?",
  },
];

function recentBadge(item: ChatHistoryItem): string {
  const a = item.messages.find((m) => m.role === "assistant" && m.badge);
  return a?.badge ?? "Чат";
}

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
  const homeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages.length, typing]);

  // ⌘K / Ctrl+K — фокус на строку запроса на стартовом экране.
  useEffect(() => {
    if (messages.length > 0) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        homeInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [messages.length]);

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
          ИИ Ассистент
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
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-8">
            {empty ? (
              <div className="mx-auto w-full max-w-5xl pb-4 pt-12 animate-fade-in-up">
                {/* Hero */}
                <div className="flex flex-col items-center text-center">
                  <h2 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
                    Спросите что угодно
                    <br />
                    <span className="text-primary">о внешней торговле</span>
                  </h2>
                  <p className="mt-6 max-w-2xl text-base text-muted-foreground">
                    Опишите задачу простым языком — подберу код ТН ВЭД, проверю
                    контрагента, рассчитаю платежи, отслежу контейнер и соберу
                    аналитику за несколько секунд.
                  </p>
                </div>

                {/* Строка запроса */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submit();
                  }}
                  className="mt-10 flex h-16 items-center gap-3 rounded-2xl border border-border bg-card pl-6 pr-3 shadow-sm shadow-foreground/5 transition-colors focus-within:border-primary/50"
                >
                  <Search className="h-6 w-6 shrink-0 text-muted-foreground" />
                  <input
                    ref={homeInputRef}
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Например: подбери код ТН ВЭД для кофе или проверь контрагента"
                    aria-label="Сообщение ассистенту"
                    className="min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
                  />
                  <kbd className="hidden h-8 items-center rounded-lg border border-border bg-muted px-2 text-xs font-medium text-muted-foreground sm:flex">
                    ⌘K
                  </kbd>
                  <button
                    type="submit"
                    disabled={value.trim().length === 0}
                    className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    Спросить
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>

                {/* Возможности */}
                <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {CARDS.map((c) => {
                    const Icon = c.icon;
                    return (
                      <button
                        key={c.title}
                        type="button"
                        onClick={() => onAsk(c.prompt)}
                        className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {c.title}
                        </span>
                        <span className="text-xs leading-4 text-muted-foreground">
                          {c.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Недавние запросы */}
                {history.length > 0 && (
                  <div className="mt-12">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-bold tracking-tight text-foreground">
                        Недавние запросы
                      </h3>
                      <button
                        type="button"
                        onClick={() => setHistoryOpen(true)}
                        className="flex items-center gap-1 text-sm font-semibold text-primary transition-opacity hover:opacity-80"
                      >
                        Вся история
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-border bg-card">
                      {history.slice(0, 4).map((item, i) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => onLoadChat(item.id)}
                          className={cn(
                            "flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/40",
                            i > 0 && "border-t border-border"
                          )}
                        >
                          <Sparkles className="h-5 w-5 shrink-0 text-muted-foreground" />
                          <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                            {item.title}
                          </span>
                          <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
                            {recentBadge(item)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mx-auto w-full max-w-4xl">
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
            <div className="px-6 pb-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
                className="mx-auto flex w-full max-w-4xl items-center gap-3 rounded-full border border-border bg-card p-2 pl-6 shadow-sm shadow-foreground/5"
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
          <ChatProductPanel
            detail={productDetail}
            onClose={onCloseProduct}
            onAsk={onAsk}
          />
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
