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

**Module-based app, floating-card layout.** A compact `TopHeader` (just the VED logo)
sits on the gray page bg; a transparent `ModuleSidebar` switches the main area, which is
a **white rounded card**. A fixed bottom-right gradient **«Спросить ИИ»** launcher opens
the AI. State in `AppShell` (in-memory, no routing — only `/`).

```
src/
  app/
    layout.tsx            Root: Open Sans, <html lang="ru">
    globals.css           Design tokens. --background is gray so white cards float
    page.tsx              "/" — renders <AppShell>
  components/
    app/
      app-shell.tsx       TopHeader + [ModuleSidebar | white main card] + bottom-right AI
                          popup/launcher. Holds activeId + popupOpen + useAssistant().
      top-header.tsx      Compact: Adata logo only (no text)
      module-sidebar.tsx  Transparent nav (module icons kept) + Adata account footer
      under-development.tsx  Illustration + «Модуль в разработке» + «Спросить ИИ» CTA
    product/              «Анализ товара» module
      product-analysis-module.tsx  view state (search|results|detail) + breadcrumb
      product-search.tsx  Top search bar + horizontal recent + <TnVedTree>
      tn-ved-tree.tsx     Multi-level ТН ВЭД tree (config/tnved.ts); leaf → opens product
      product-results.tsx · product-card.tsx  Result cards (ТН ВЭД code + name emphasized)
      product-detail.tsx  Hero (+ «Спросить ИИ») + 4 collapsible blocks
      data-bits.tsx       "use client". SectionCard = accordion dropdown; StatCard (no
                          truncation), BarList, YearBars, SimpleTable, …
    calculator/calculator-module.tsx  Multi-item payments calculator (config/calculator.ts)
    chat/                 AI assistant (one shared assistant; popup + ИИ Чат module)
      use-assistant.ts    Hook: messages/typing + askFromPopup (classify→navigate|escalate),
                          askInChat (always rich), reset. Mock classify + replies.
      ai-assistant-popup.tsx  Bottom-right popup widget (entry point)
      ai-chat-module.tsx  Full-page «ИИ Чат» module (shares the conversation)
      chat-messages.tsx   Renderer: bold/bullets, copy/like/dislike, typing dots
    brand/  ved-logo.tsx (VED mark) · adata-logo.tsx (Adata monogram — PLACEHOLDER)
    ui/                   ShadCN-style primitives (button, …)
  config/
    modules.ts            10 sidebar modules (kind: chat | product | calculator | dev)
    products.ts           ProductSummary/ProductDetail, CATALOG, searchProducts,
                          productByCode, buildProductDetail (mock)
    tnved.ts              ТН ВЭД tree + TNVED_STATS (mock)
    calculator.ts         procedures/countries/types/currencies + calculate() (mock)
  lib/utils.ts            cn()
```

## Architecture notes

- **Layout:** transparent sidebar (module icons kept) on the gray page; main content =
  white rounded card. The header shows only the Adata logo.
- **Modules** (`config/modules.ts`): `ИИ Чат` (`chat`), `Анализ товара` (`product`) and
  `Калькулятор` (`calculator`) are built; the other 7 are `dev` → `UnderDevelopment`.
- **AI = one shared assistant** (`chat/use-assistant.ts`). Entry point = bottom-right
  **popup** (`ai-assistant-popup.tsx`) opened by the launcher. Simple Qs → popup answers +
  navigates to the right module; complex Qs → escalate to the **ИИ Чат** module
  (`ai-chat-module.tsx`) with the Q + rich answer. Popup and module share one conversation.
- **Анализ товара**: search bar → `searchProducts` → cards → product page; OR browse the
  `TnVedTree` and click a leaf (`productByCode` → product page). Mock data in
  `config/products.ts` / `config/tnved.ts`. Product page blocks are accordions.
- **Калькулятор**: add multiple товары → `calculate()` → totals. Mock formula
  (duty 5%, fee 20 000 ₸, VAT 12%; no FX conversion).
- **AI panel** (`chat/ai-panel.tsx`): `ChatProvider` + `ChatMain`. Seeded demo;
  `DEMO_REPLY`/`sendMessage` in `chat-context.tsx` is where real LLM/tool routing attaches.
- **Adata logo** (`brand/adata-logo.tsx`) is a PLACEHOLDER monogram — swap for the real
  asset when available (Figma Dev Mode MCP wasn't reachable headless).
