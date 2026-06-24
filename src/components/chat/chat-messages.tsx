"use client";

import { ArrowRight, MapPin, Sparkles } from "lucide-react";

import { CompanyCard } from "@/components/chat/company-card";
import { DocumentsCard } from "@/components/chat/documents-card";
import { TrackingCard } from "@/components/chat/tracking-card";
import type { AssistantMessage, Cta } from "@/components/chat/use-assistant";

function AssistantAvatar() {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#068DFF] to-[#0463b3] text-white">
      <Sparkles className="h-5 w-5" />
    </span>
  );
}

function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = /^\*\*([^*]+)\*\*$/.exec(part);
        return m ? (
          <strong key={i} className="font-semibold">
            {m[1]}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
}

function RichText({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];
  const flush = (key: string) => {
    if (!bullets.length) return;
    const items = bullets;
    bullets = [];
    blocks.push(
      <ul key={`u${key}`} className="flex flex-col gap-2 pl-1">
        {items.map((b, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-current opacity-60" />
            <span>
              <Inline text={b} />
            </span>
          </li>
        ))}
      </ul>
    );
  };
  lines.forEach((line, idx) => {
    const t = line.trim();
    if (!t) return flush(String(idx));
    const bm = /^[-•]\s+(.*)$/.exec(t);
    if (bm) return void bullets.push(bm[1]);
    flush(String(idx));
    blocks.push(
      <p key={`p${idx}`}>
        <Inline text={t} />
      </p>
    );
  });
  flush("end");
  return <div className="flex flex-col gap-2 text-sm leading-5">{blocks}</div>;
}

function CtaRow({ cta, onClick }: { cta: Cta; onClick: () => void }) {
  const Icon = cta.question ? Sparkles : MapPin;
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left transition-colors hover:border-primary/40 hover:bg-accent/40"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">
          {cta.label}
        </span>
        <span className="block text-xs text-muted-foreground">{cta.sub}</span>
      </span>
      <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
    </button>
  );
}

function Followups({
  items,
  onPick,
}: {
  items: string[];
  onPick: (t: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 pt-1">
      <span className="text-xs font-semibold text-muted-foreground">
        Продолжить:
      </span>
      <div className="flex flex-wrap gap-2">
        {items.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onPick(t)}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-accent"
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ChatMessages({
  messages,
  typing,
  onFollowup,
  onCta,
  onOpenModule,
}: {
  messages: AssistantMessage[];
  typing: boolean;
  onFollowup: (text: string) => void;
  onCta: (cta: Cta) => void;
  onOpenModule: (moduleId: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      {messages.map((m) => {
        if (m.role === "user") {
          return (
            <div key={m.id} className="flex justify-end animate-fade-in-up">
              <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm leading-5 text-primary-foreground">
                {m.content}
              </div>
            </div>
          );
        }
        return (
          <div key={m.id} className="flex gap-3 animate-fade-in-up">
            <AssistantAvatar />
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              {m.badge && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-foreground">
                    ИИ-ассистент
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-xs font-medium text-primary">
                    <Sparkles className="h-4 w-4" />
                    {m.badge}
                  </span>
                </div>
              )}
              {m.content && (
                <div className="rounded-2xl rounded-tl-md bg-muted px-4 py-3 text-foreground">
                  <RichText content={m.content} />
                </div>
              )}
              {m.kind === "tracking" && m.tracking && (
                <TrackingCard data={m.tracking} onOpen={onOpenModule} />
              )}
              {m.kind === "company" && m.company && (
                <CompanyCard data={m.company} onOpen={onOpenModule} />
              )}
              {m.kind === "documents" && m.documents && (
                <DocumentsCard data={m.documents} />
              )}
              {m.cta && <CtaRow cta={m.cta} onClick={() => onCta(m.cta!)} />}
              {m.followups && m.followups.length > 0 && (
                <Followups items={m.followups} onPick={onFollowup} />
              )}
            </div>
          </div>
        );
      })}

      {typing && (
        <div className="flex items-center gap-3 animate-fade-in-up">
          <AssistantAvatar />
          <div className="flex items-center gap-1 rounded-2xl rounded-tl-md bg-muted px-4 py-4">
            {[0, 0.15, 0.3].map((d) => (
              <span
                key={d}
                style={{ animationDelay: `${d}s` }}
                className="h-2 w-2 rounded-full bg-muted-foreground animate-typing"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
