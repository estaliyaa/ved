"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

import { ModuleSidebar } from "@/components/app/module-sidebar";
import { UnderDevelopment } from "@/components/app/under-development";
import { CalculatorModule } from "@/components/calculator/calculator-module";
import { AiAssistantPopup } from "@/components/chat/ai-assistant-popup";
import { AiChatModule } from "@/components/chat/ai-chat-module";
import { useAssistant } from "@/components/chat/use-assistant";
import { ProductAnalysisModule } from "@/components/product/product-analysis-module";
import { moduleById } from "@/config/modules";

export function AppShell() {
  const [activeId, setActiveId] = useState("product-analysis");
  const [popupOpen, setPopupOpen] = useState(false);
  const active = moduleById(activeId);

  const assistant = useAssistant({
    onOpenChat: () => {
      setActiveId("ai-chat");
      setPopupOpen(false);
    },
  });

  const goTo = (id: string) => {
    setActiveId(id);
    setPopupOpen(false);
  };

  // После входа ассистент сам предлагает помощь (через 6–8 сек).
  const greeted = useRef(false);
  useEffect(() => {
    const t = setTimeout(() => {
      if (!greeted.current) {
        greeted.current = true;
        setActiveId((cur) => {
          if (cur !== "ai-chat") setPopupOpen(true);
          return cur;
        });
      }
    }, 6500);
    return () => clearTimeout(t);
  }, []);

  const productPanelOpen = activeId === "ai-chat" && !!assistant.productDetail;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ModuleSidebar
        activeId={activeId}
        onSelect={setActiveId}
        collapsed={productPanelOpen}
      />

      <div className="flex min-w-0 flex-1 py-4 pr-4">
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {activeId === "ai-chat" && (
            <AiChatModule
              messages={assistant.chatMessages}
              typing={assistant.chatTyping}
              productDetail={assistant.productDetail}
              history={assistant.chatHistory}
              onAsk={assistant.askInChat}
              onOpenModule={goTo}
              onCloseProduct={assistant.closeProduct}
              onReset={assistant.resetChat}
              onLoadChat={assistant.loadChat}
            />
          )}
          {activeId === "product-analysis" && (
            <ProductAnalysisModule onAskAi={() => setPopupOpen(true)} />
          )}
          {activeId === "calculator" && <CalculatorModule />}
          {active?.kind === "dev" && (
            <UnderDevelopment
              icon={active.icon}
              label={active.label}
              onAskAi={() => setPopupOpen(true)}
            />
          )}
        </main>
      </div>

      {/* AI-ассистент: всплывающее окно снизу справа. Не показываем в ИИ Чате. */}
      {activeId !== "ai-chat" &&
        (popupOpen ? (
          <AiAssistantPopup
            messages={assistant.popupMessages}
            typing={assistant.popupTyping}
            onAsk={assistant.askFromPopup}
            onClose={() => setPopupOpen(false)}
            onExpand={() => {
              setActiveId("ai-chat");
              setPopupOpen(false);
            }}
            onEscalate={assistant.escalate}
            onOpenModule={goTo}
          />
        ) : (
          <button
            type="button"
            onClick={() => setPopupOpen(true)}
            aria-label="Спросить ИИ"
            className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#068DFF] to-[#0463b3] text-white shadow-lg shadow-primary/30 transition-transform hover:scale-105"
          >
            <span
              aria-hidden
              className="absolute -inset-1 -z-10 rounded-full bg-[#068DFF]/40 animate-ping"
            />
            <span
              aria-hidden
              className="absolute inset-0 -z-10 rounded-full bg-[#068DFF]/30 blur-md animate-pulse-glow"
            />
            <Sparkles className="h-6 w-6" />
          </button>
        ))}
    </div>
  );
}
