# VED — AI-First платформа для участников ВЭД

Modern web platform for foreign economic activity (ВЭД / FEA) participants, built
on an **AI-First** principle: the user never hunts for a module — they describe the
task in natural language to the assistant, and the system surfaces the right data
sources and tools. UX references ChatGPT / Perplexity / Claude / AI workspaces.

## Stack

- **Next.js 15** (App Router) + **TypeScript** + **React 19**
- **Tailwind CSS v3** + **ShadCN-style** components (`src/components/ui`)
- **Lucide** icons
- **Open Sans** via `next/font/google` (latin + cyrillic), exposed as `--font-open-sans`
- UI language: **Russian**

## Commands

- `npm run dev` — dev server (http://localhost:3000)
- `npm run build` — production build (also full type-check)
- `npm run lint`

## Design system rules (do not break)

These are product constraints, enforced in `tailwind.config.ts`:

1. **Minimum text size is 12px.** Never go below.
2. **Everything steps by 4px** — font sizes, line-heights, paddings, gaps.
   Use 12, 16, 20, 24, 28, 32… Never odd / off-grid values (no 14px, no 18px,
   no `gap-0.5`/`p-2.5`, etc.).
   - Tailwind's spacing unit `n` == `4n` px, so 40px = `h-10`, 24px = `px-6`,
     8px = `gap-2`. The type scale is overridden in the config to stay on-grid.
3. Brand color is blue (`--primary` ≈ `#2563EB`). Theme tokens live as HSL CSS
   variables in `src/app/globals.css`; reference them via Tailwind color names
   (`bg-card`, `text-muted-foreground`, `border-border`, `bg-accent`, …).

## Structure

The product is a **single AI-chat screen** — there are no module pages/sub-routes.
Everything happens inside the chat. Only `/` exists.

```
src/
  app/
    layout.tsx            Root: Open Sans, <html lang="ru">
    globals.css           Design tokens (HSL CSS vars) + base styles
    page.tsx              "/" — renders <ChatShell>
  components/
    chat/
      chat-context.tsx    "use client" ChatProvider + useChat(): conversations,
                          activeId, newChat/selectConversation/startScenario/sendMessage.
                          Holds seeded demo history. No real backend yet.
      chat-shell.tsx      ChatProvider + flex(ChatSidebar + ChatMain)
      chat-sidebar.tsx    New chat · search · «Закреплённые диалоги» · «История
                          предыдущих запросов» · profile footer. Items pin/unpin.
      chat-main.tsx       Header, welcome|thread, ChatInput. Welcome: input is the
                          centered hero with cards below; thread: input bottom-pinned.
                          When the active conversation has a `detail` (товар determined),
                          splits into [narrow chat (w-400) | ProductDetailPanel].
      chat-welcome.tsx    Logo + "VED Чат" + centered input slot + the 6 scenario cards
      scenario-card.tsx   One scenario card
      message-thread.tsx  Conversation (user bubble / assistant + avatar), typing dots,
                          and «Что дальше?» follow-up chips after the latest answer
      product-detail-panel.tsx  Right-side товар card: breadcrumb, summary, note banner,
                          stat cards, top-countries/importers bars, yearly chart, shipments
      chat-input.tsx      Rounded input + mic + Отправить (large + placeholder props)
    brand/ved-logo.tsx    Brand mark
    ui/                   ShadCN-style primitives (button, …)
  config/
    scenarios.ts          The 6 chat scenarios (icon, title, description, opening msg)
  lib/utils.ts            cn()
```

## Architecture notes

- **Pure AI-chat, no modules.** The sidebar is search + chat history (ChatGPT/Claude
  style), not module nav. Scenarios (Анализ товара, Проверка импортера, Карта
  импортера, Калькулятор, Околотаможенная сфера, Отслеживание контейнера) are *chat
  scenarios*, not pages: clicking a card calls `startScenario`, which creates a new
  conversation seeded with the scenario's opening assistant message.
- **State** lives in `ChatProvider` (in-memory, client-only). History is seeded demo
  data. `sendMessage` appends the user message + (after a `TYPING_DELAY` «печатает…»
  pause via `replyAfterDelay`) a placeholder assistant reply —
  `chat-context.tsx` (`DEMO_REPLY` / `sendMessage`) is where real intent→data-source→
  tool routing and LLM responses will attach.
- **Товар detail panel.** When a товар is determined — in the `product-analysis`
  scenario, on the user's message — `sendMessage` attaches a `ProductDetail`
  (`buildProductDetail`, mock data) to the conversation. `chat-main` then shows the
  split layout. Trigger/data is mock; extend `buildProductDetail` (or add detail to
  other scenarios) when wiring real sources.
