import { forwardRef } from "react";
import { Mic, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  /** Крупный «геройский» вариант для стартового экрана. */
  large?: boolean;
  placeholder?: string;
};

export const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
  function ChatInput(
    { value, onChange, onSubmit, large = false, placeholder },
    ref
  ) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className={cn(
          "flex items-center gap-3 rounded-full border border-border bg-card",
          large
            ? "p-2 pl-8 shadow-md shadow-foreground/5 ring-1 ring-primary/10"
            : "p-2 pl-6 shadow-sm shadow-foreground/5"
        )}
      >
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "Опишите вашу задачу простыми словами…"}
          aria-label="Сообщение ассистенту"
          className={cn(
            "min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground",
            large ? "text-base" : "text-sm"
          )}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 rounded-full"
          aria-label="Голосовой ввод"
        >
          <Mic />
        </Button>
        <Button
          type="submit"
          size={large ? "lg" : "default"}
          className="shrink-0 rounded-full px-6"
          disabled={value.trim().length === 0}
        >
          <Send />
          Отправить
        </Button>
      </form>
    );
  }
);
