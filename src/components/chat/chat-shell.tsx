"use client";

import { ChatProvider } from "@/components/chat/chat-context";
import { ChatMain } from "@/components/chat/chat-main";
import { ChatSidebar } from "@/components/chat/chat-sidebar";

export function ChatShell() {
  return (
    <ChatProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <ChatSidebar />
        <ChatMain />
      </div>
    </ChatProvider>
  );
}
