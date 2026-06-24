"use client";

import { useRef, useState } from "react";
import {
  Globe,
  ListTree,
  Scale,
  ShieldAlert,
  Sparkles,
  SquareStack,
} from "lucide-react";

import {
  BarList,
  BulletList,
  KeyValueList,
  SectionCard,
  SimpleTable,
  StatCard,
  SubTitle,
  TagList,
  YearBars,
} from "@/components/product/data-bits";
import { Button } from "@/components/ui/button";
import type { ProductDetail as ProductDetailType } from "@/config/products";
import { findTnVedPath } from "@/config/tnved";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "code", title: "Справка по коду" },
  { id: "sanctions", title: "Санкционные ограничения" },
  { id: "trade", title: "ВЭД по товару" },
  { id: "market", title: "Международный рынок и тарифы" },
  { id: "tree", title: "Дерево ТН ВЭД" },
] as const;

function LabeledBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <SubTitle>{title}</SubTitle>
      {children}
    </div>
  );
}

export function ProductDetail({
  detail,
  onAskAi,
  onOpenCode,
  dense = false,
}: {
  detail: ProductDetailType;
  /** Передаётся готовый вопрос для ассистента (привязан к товару/разделу). */
  onAskAi: (question?: string) => void;
  onOpenCode?: (hsCode: string, title?: string) => void;
  /** Компактный режим для узкой панели (ИИ Чат): метрики в 2 колонки. */
  dense?: boolean;
}) {
  const path = findTnVedPath(detail.hsCode);
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(["code"]));
  const [activeTab, setActiveTab] = useState<string>("code");
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  const tag = `«${detail.name}» (${detail.hsCode})`;

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function goTo(id: string) {
    setActiveTab(id);
    setOpenIds((prev) => new Set(prev).add(id));
    requestAnimationFrame(() => {
      refs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const sectionProps = (id: string, question: string) => ({
    open: openIds.has(id),
    onToggle: () => toggle(id),
    onAskAi: () => onAskAi(question),
  });

  return (
    <div className="animate-fade-in-up">
      {/* Hero */}
      <div className="px-8 pb-6 pt-8">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <span className="inline-block rounded-lg bg-accent px-3 py-1 font-mono text-sm font-bold tracking-tight text-primary">
                {detail.hsCode}
              </span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
                {detail.name}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {detail.brief}
              </p>
            </div>
            <Button
              onClick={() =>
                onAskAi(
                  `Проанализируй товар ${tag}: код, пошлины, ограничения и поставки.`
                )
              }
              className="shrink-0 rounded-full"
            >
              <Sparkles />
              Спросить ИИ
            </Button>
          </div>

          <div
            className={cn(
              "mt-6 grid gap-4",
              dense ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"
            )}
          >
            <StatCard label="Импортная пошлина" value={detail.dutyRate} />
            <StatCard label="НДС" value={detail.vatRate} />
            <StatCard label="Акциз" value={detail.excise} />
            <StatCard label="Единица измерения" value={detail.unit} />
          </div>
        </div>
      </div>

      {/* Sticky tabs / anchor nav */}
      <div className="sticky top-0 z-10 border-b border-border bg-card">
        <div className="flex gap-2 overflow-x-auto px-8 py-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => goTo(t.id)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                activeTab === t.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {t.title}
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="px-8 py-6">
        <div className="flex flex-col gap-3">
          <div
            ref={(el) => {
              refs.current.code = el;
            }}
            className="scroll-mt-20"
          >
            <SectionCard
              icon={SquareStack}
              title="Справка по коду"
              {...sectionProps(
                "code",
                `Дай справку по коду ТН ВЭД ${detail.hsCode} для ${tag}: пошлины, НДС, ограничения, маркировка.`
              )}
            >
              <div className="flex flex-col gap-6">
                <LabeledBlock title="Описание товара">
                  <p className="text-sm leading-5 text-foreground">
                    {detail.description}
                  </p>
                </LabeledBlock>
                <KeyValueList
                  rows={[
                    { label: "Единицы измерения", value: detail.unit },
                    { label: "Пошлины", value: detail.dutyRate },
                    { label: "НДС", value: detail.vatRate },
                    { label: "Акцизы", value: detail.excise },
                  ]}
                />
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <LabeledBlock title="Ограничения">
                    <BulletList items={detail.restrictions} />
                  </LabeledBlock>
                  <LabeledBlock title="Разрешения">
                    <BulletList items={detail.permits} />
                  </LabeledBlock>
                </div>
                <LabeledBlock title="Маркировка">
                  <p className="text-sm leading-5 text-foreground">
                    {detail.labeling}
                  </p>
                </LabeledBlock>
              </div>
            </SectionCard>
          </div>

          <div
            ref={(el) => {
              refs.current.sanctions = el;
            }}
            className="scroll-mt-20"
          >
            <SectionCard
              icon={ShieldAlert}
              title="Санкционные ограничения"
              {...sectionProps(
                "sanctions",
                `Какие санкционные ограничения и меры регулирования по ${tag}?`
              )}
            >
              <div className="flex flex-col gap-6">
                <LabeledBlock title="Список санкций">
                  <BulletList items={detail.sanctions} />
                </LabeledBlock>
                <LabeledBlock title="Статистика">
                  <p className="text-sm leading-5 text-foreground">
                    {detail.sanctionsStats}
                  </p>
                </LabeledBlock>
                <LabeledBlock title="Нормативные документы">
                  <TagList items={detail.sanctionsDocs} />
                </LabeledBlock>
              </div>
            </SectionCard>
          </div>

          <div
            ref={(el) => {
              refs.current.trade = el;
            }}
            className="scroll-mt-20"
          >
            <SectionCard
              icon={Globe}
              title="ВЭД по товару"
              {...sectionProps(
                "trade",
                `Покажи ВЭД-статистику по ${tag}: импортёры, экспортёры, страны и динамику.`
              )}
            >
              <div className="flex flex-col gap-6">
                <LabeledBlock title="Статистика">
                  <div
                    className={cn(
                      "grid gap-4",
                      dense ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"
                    )}
                  >
                    {detail.tradeStats.map((s) => (
                      <StatCard key={s.label} label={s.label} value={s.value} />
                    ))}
                  </div>
                </LabeledBlock>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <LabeledBlock title="Импортёры">
                    <BarList items={detail.importers} />
                  </LabeledBlock>
                  <LabeledBlock title="Экспортёры">
                    <BarList
                      items={detail.exporters}
                      barClassName="bg-emerald-500"
                    />
                  </LabeledBlock>
                  <LabeledBlock title="Поставщики">
                    <BarList items={detail.suppliers} />
                  </LabeledBlock>
                  <LabeledBlock title="Страны">
                    <BarList
                      items={detail.countries}
                      barClassName="bg-emerald-500"
                    />
                  </LabeledBlock>
                </div>
                <LabeledBlock title="Таможенные посты">
                  <BarList items={detail.customsPosts} />
                </LabeledBlock>
                <LabeledBlock title="Динамика по годам">
                  <YearBars data={detail.yearly} />
                </LabeledBlock>
              </div>
            </SectionCard>
          </div>

          <div
            ref={(el) => {
              refs.current.market = el;
            }}
            className="scroll-mt-20"
          >
            <SectionCard
              icon={Scale}
              title="Международный рынок и тарифы"
              {...sectionProps(
                "market",
                `Какие международные тарифы, пошлины и преференции на ${tag}?`
              )}
            >
              <div className="flex flex-col gap-6">
                <LabeledBlock title="Международные тарифы">
                  <SimpleTable
                    columns={["Рынок", "Тариф"]}
                    rows={detail.intlTariffs.map((t) => [t.country, t.tariff])}
                  />
                </LabeledBlock>
                <LabeledBlock title="Импортные пошлины">
                  <p className="text-sm leading-5 text-foreground">
                    {detail.importDuties}
                  </p>
                </LabeledBlock>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <LabeledBlock title="Меры защиты рынка">
                    <BulletList items={detail.protectionMeasures} />
                  </LabeledBlock>
                  <LabeledBlock title="Преференции">
                    <BulletList items={detail.preferences} />
                  </LabeledBlock>
                </div>
                <LabeledBlock title="Сравнение условий поставки по странам">
                  <SimpleTable
                    columns={["Страна", "Условие", "Срок, дн.", "Стоимость"]}
                    rows={detail.deliveryTerms.map((d) => [
                      d.country,
                      d.term,
                      d.days,
                      d.cost,
                    ])}
                  />
                </LabeledBlock>
              </div>
            </SectionCard>
          </div>

          {/* 5. Дерево ТН ВЭД — ветка товара */}
          <div
            ref={(el) => {
              refs.current.tree = el;
            }}
            className="scroll-mt-20"
          >
            <SectionCard
              icon={ListTree}
              title="Дерево ТН ВЭД"
              {...sectionProps(
                "tree",
                `Покажи положение кода ${detail.hsCode} в дереве ТН ВЭД и соседние позиции.`
              )}
            >
              {path.length > 0 ? (
                <ol className="flex flex-col">
                  {path.map((n, i) => {
                    const isLast = i === path.length - 1;
                    const label = n.label ?? n.code;
                    return (
                      <li
                        key={i}
                        className="relative flex gap-3 pb-3 last:pb-0"
                        style={{ marginLeft: `${i * 16}px` }}
                      >
                        {!isLast && (
                          <span className="absolute left-3 top-7 h-full w-px bg-border" />
                        )}
                        <span
                          className={cn(
                            "relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                            isLast
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {i + 1}
                        </span>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex flex-wrap items-center gap-2">
                            {label && (
                              <span className="rounded-md bg-muted px-2 py-1 font-mono text-xs font-bold text-foreground">
                                {label}
                              </span>
                            )}
                            {isLast && (
                              <span className="rounded-md bg-accent px-2 py-1 font-mono text-xs font-bold text-primary">
                                {detail.hsCode}
                              </span>
                            )}
                          </div>
                          <span
                            className={cn(
                              "mt-1 text-sm",
                              isLast
                                ? "font-semibold text-foreground"
                                : "text-muted-foreground"
                            )}
                          >
                            {n.title}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Положение в дереве ТН ВЭД недоступно для этого кода.
                </p>
              )}
            </SectionCard>
          </div>
        </div>

      </div>
    </div>
  );
}
