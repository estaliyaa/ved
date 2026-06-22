"use client";

import { useEffect, useRef, useState } from "react";
import { PanelRightOpen, Sparkles } from "lucide-react";

import { useChat } from "@/components/chat/chat-context";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatWelcome } from "@/components/chat/chat-welcome";
import { MessageThread } from "@/components/chat/message-thread";
import { ProductDetailPanel } from "@/components/chat/product-detail-panel";
import { cn } from "@/lib/utils";

export function ChatMain() {
  const { activeConversation, activeId, typingIn, startScenario, sendMessage } =
    useChat();
  const [message, setMessage] = useState("");
  const [detailOpen, setDetailOpen] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Фокус на поле ввода + раскрытие карточки при смене активного чата.
  useEffect(() => {
    inputRef.current?.focus();
    setDetailOpen(true);
  }, [activeId]);

  // Прокрутка к последнему сообщению (и при появлении индикатора «печатает…»).
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [activeConversation?.messages.length, activeId, typingIn]);

  function handleSelectScenario(id: string) {
    startScenario(id);
    setMessage("");
  }

  function handleSubmit() {
    if (message.trim().length === 0) return;
    sendMessage(message);
    setMessage("");
  }

  const detail = activeConversation?.detail;
  const showDetail = !!detail && detailOpen;
  const title = activeConversation?.title ?? "Новый чат";

  return (
    <div className="flex flex-1 overflow-hidden bg-background">
      {/* Колонка чата — сужается, когда открыта карточка товара */}
      <div
        className={cn(
          "flex min-w-0 flex-col overflow-hidden",
          showDetail ? "w-[400px] shrink-0 border-r border-border" : "flex-1"
        )}
      >
        <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-card/70 px-8 backdrop-blur">
          {showDetail ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">Уточнить через ИИ</span>
            </div>
          ) : (
            <h1 className="truncate text-lg font-bold tracking-tight text-foreground">
              {title}
            </h1>
          )}

          {detail && !detailOpen && (
            <button
              type="button"
              onClick={() => setDetailOpen(true)}
              className="flex h-8 shrink-0 items-center gap-2 rounded-full border border-border bg-card px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <PanelRightOpen className="h-4 w-4 text-primary" />
              Карточка товара
            </button>
          )}
        </header>

        {activeConversation ? (
          <div className="flex flex-1 flex-col overflow-hidden">
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-8">
              <MessageThread conversation={activeConversation} />
            </div>
            <div className="px-8 pb-8">
              <div className="mx-auto w-full max-w-3xl">
                <ChatInput
                  ref={inputRef}
                  value={message}
                  onChange={setMessage}
                  onSubmit={handleSubmit}
                  placeholder={
                    showDetail ? "Изменить выборку…" : undefined
                  }
                />
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  VED-ассистент может ошибаться. Проверяйте важные данные.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-8 py-8">
            <div className="flex min-h-full flex-col items-center justify-center">
              <ChatWelcome
                onSelectScenario={handleSelectScenario}
                input={
                  <ChatInput
                    ref={inputRef}
                    value={message}
                    onChange={setMessage}
                    onSubmit={handleSubmit}
                    large
                  />
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* Карточка товара — расширенный блок справа */}
      {showDetail && detail && (
        <ProductDetailPanel
          detail={detail}
          onClose={() => setDetailOpen(false)}
        />
      )}
    </div>
  );
}
