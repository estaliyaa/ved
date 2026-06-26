"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

import { ModuleSidebar } from "@/components/app/module-sidebar";
import { UnderDevelopment } from "@/components/app/under-development";
import { AgentPanel } from "@/components/agent/agent-panel";
import { AnalyticsModule } from "@/components/analytics/analytics-module";
import { AuditModule } from "@/components/audit/audit-module";
import { CalculatorModule } from "@/components/calculator/calculator-module";
import { ContainerModule } from "@/components/container/container-module";
import { CustomsModule } from "@/components/customs/customs-module";
import { AiChatModule } from "@/components/chat/ai-chat-module";
import { useAssistant } from "@/components/chat/use-assistant";
import { DeclarationModule } from "@/components/declaration/declaration-module";
import { ImporterCheckModule } from "@/components/importer/importer-check-module";
import { ImporterMapModule } from "@/components/importer/importer-map-module";
import { ProductAnalysisModule } from "@/components/product/product-analysis-module";
import { agentContextFor } from "@/config/agents";
import { moduleById } from "@/config/modules";

export function AppShell() {
  const [activeId, setActiveId] = useState("product-analysis");
  const [agentOpen, setAgentOpen] = useState(false);
  const [pendingQ, setPendingQ] = useState<string | null>(null);
  const active = moduleById(activeId);

  const assistant = useAssistant({
    onOpenChat: () => setActiveId("ai-chat"),
  });

  const goTo = (id: string) => setActiveId(id);

  // «Спросить ИИ» из раздела: открываем второе окно — ИИ-агента этого раздела.
  const askAi = (question?: string) => {
    setAgentOpen(true);
    if (question && question.trim()) setPendingQ(question);
  };

  const productPanelOpen = activeId === "ai-chat" && !!assistant.productDetail;
  const isChat = activeId === "ai-chat";
  const showAgent = !isChat;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ModuleSidebar
        activeId={activeId}
        onSelect={setActiveId}
        collapsed={productPanelOpen}
      />

      <div className="flex min-w-0 flex-1 py-4 pr-4">
        <main className="flex min-w-0 flex-1 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
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
            {activeId === "foreign-trade-analytics" && <AnalyticsModule />}
            {activeId === "customs-audit" && <AuditModule onAskAi={askAi} />}
            {activeId === "customs-declaration" && (
              <DeclarationModule onAskAi={askAi} />
            )}
            {active?.kind === "dev" && (
              <UnderDevelopment
                icon={active.icon}
                label={active.label}
                onAskAi={() => setAgentOpen(true)}
              />
            )}
          </div>

          {/* Второе окно — ИИ-агент раздела (адаптируется под подмодуль). */}
          {showAgent && agentOpen && (
            <AgentPanel
              key={activeId}
              context={agentContextFor(activeId)}
              pending={pendingQ}
              onConsumePending={() => setPendingQ(null)}
              onClose={() => setAgentOpen(false)}
            />
          )}
        </main>
      </div>

      {/* Открыть второе окно с ИИ-агентом раздела (вкладка у правого края). */}
      {showAgent && !agentOpen && (
        <button
          type="button"
          onClick={() => setAgentOpen(true)}
          className="group fixed right-0 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-2 rounded-l-2xl bg-gradient-to-br from-[#068DFF] to-[#0463b3] px-2 py-4 text-white shadow-lg shadow-primary/30 transition-all hover:px-3"
        >
          <Sparkles className="h-5 w-5" />
          <span
            className="text-xs font-semibold tracking-wide"
            style={{ writingMode: "vertical-rl" }}
          >
            ИИ-агент
          </span>
        </button>
      )}
    </div>
  );
}
