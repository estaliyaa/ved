"use client";

import { useState } from "react";

import { ModuleSidebar } from "@/components/app/module-sidebar";
import { UnderDevelopment } from "@/components/app/under-development";
import { AgentPanel } from "@/components/agent/agent-panel";
import { CalculatorModule } from "@/components/calculator/calculator-module";
import { ContainerModule } from "@/components/container/container-module";
import { CustomsModule } from "@/components/customs/customs-module";
import { AiChatModule } from "@/components/chat/ai-chat-module";
import { useAssistant } from "@/components/chat/use-assistant";
import { ImporterCheckModule } from "@/components/importer/importer-check-module";
import { ImporterMapModule } from "@/components/importer/importer-map-module";
import { ProductAnalysisModule } from "@/components/product/product-analysis-module";
import { agentContextFor } from "@/config/agents";
import { moduleById } from "@/config/modules";

export function AppShell() {
  const [activeId, setActiveId] = useState("product-analysis");
  const [pendingQ, setPendingQ] = useState<string | null>(null);
  const active = moduleById(activeId);

  const assistant = useAssistant({
    onOpenChat: () => setActiveId("ai-chat"),
  });

  const goTo = (id: string) => setActiveId(id);

  // «Спросить ИИ» из раздела: отправляем готовый вопрос в постоянное окно агента.
  const askAi = (question?: string) => {
    if (question && question.trim()) setPendingQ(question);
  };

  const productPanelOpen = activeId === "ai-chat" && !!assistant.productDetail;
  const isChat = activeId === "ai-chat";
  // Агент показываем во всех готовых разделах, кроме самого ИИ Ассистента
  // и разделов «в разработке».
  const showAgent = !isChat && active?.kind !== "dev";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ModuleSidebar
        activeId={activeId}
        onSelect={setActiveId}
        collapsed={productPanelOpen}
      />

      <div className="flex min-w-0 flex-1 py-4 pr-4">
        <main className="flex min-w-0 flex-1 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {/* Постоянное окно — ИИ-агент раздела (слева, адаптируется под подмодуль). */}
          {showAgent && (
            <AgentPanel
              key={activeId}
              context={agentContextFor(activeId)}
              pending={pendingQ}
              onConsumePending={() => setPendingQ(null)}
            />
          )}

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            {isChat && (
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
              <ProductAnalysisModule onAskAi={askAi} />
            )}
            {activeId === "importer-map" && <ImporterMapModule />}
            {activeId === "importer-check" && (
              <ImporterCheckModule onAskAi={askAi} />
            )}
            {activeId === "calculator" && <CalculatorModule />}
            {activeId === "customs-infrastructure" && <CustomsModule />}
            {activeId === "container-tracking" && <ContainerModule />}
            {active?.kind === "dev" && (
              <UnderDevelopment
                icon={active.icon}
                label={active.label}
                onAskAi={() =>
                  assistant.escalate(
                    `Расскажи про раздел «${active.label}» и помоги решить задачу.`
                  )
                }
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
