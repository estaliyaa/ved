"use client";

import { ArrowUpRight } from "lucide-react";

import { VedLogo } from "@/components/brand/ved-logo";
import { type Conversation, useChat } from "@/components/chat/chat-context";
import { followupsFor } from "@/config/scenarios";
import { cn } from "@/lib/utils";

function AssistantAvatar() {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent">
      <VedLogo className="h-5 w-5" />
    </span>
  );
}

export function MessageThread({ conversation }: { conversation: Conversation }) {
  const { typingIn, sendMessage } = useChat();
  const isTyping = typingIn === conversation.id;

  const lastMessage = conversation.messages[conversation.messages.length - 1];
  const showFollowups = !isTyping && lastMessage?.role === "assistant";
  const followups = followupsFor(conversation.scenarioId);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      {conversation.messages.map((message) => {
        const isUser = message.role === "user";
        if (isUser) {
          return (
            <div key={message.id} className="flex justify-end animate-fade-in-up">
              <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-accent px-4 py-3 text-base leading-6 text-foreground">
                {message.content}
              </div>
            </div>
          );
        }
        return (
          <div key={message.id} className="flex gap-4 animate-fade-in-up">
            <AssistantAvatar />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                VED-ассистент
              </span>
              <div className="whitespace-pre-wrap text-base leading-6 text-foreground">
                {message.content}
              </div>
            </div>
          </div>
        );
      })}

      {isTyping && (
        <div className="flex items-center gap-4 animate-fade-in-up">
          <AssistantAvatar />
          <div className="flex items-center gap-1">
            {[0, 0.15, 0.3].map((delay) => (
              <span
                key={delay}
                style={{ animationDelay: `${delay}s` }}
                className="h-2 w-2 rounded-full bg-muted-foreground animate-typing"
              />
            ))}
          </div>
        </div>
      )}

      {showFollowups && (
        <div className="flex flex-col gap-3 pl-14 animate-fade-in-up">
          <span className="text-xs font-semibold text-muted-foreground">
            Что дальше?
          </span>
          <div className="flex flex-wrap gap-2">
            {followups.map((text) => (
              <button
                key={text}
                type="button"
                onClick={() => sendMessage(text)}
                className={cn(
                  "flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors",
                  "hover:border-primary/40 hover:bg-accent"
                )}
              >
                <ArrowUpRight className="h-4 w-4 text-primary" />
                {text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
