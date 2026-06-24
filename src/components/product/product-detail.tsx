"use client";

import { useRef, useState } from "react";
import { Globe, Scale, ShieldAlert, Sparkles, SquareStack } from "lucide-react";

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
import { cn } from "@/lib/utils";

const TABS = [
  { id: "code", title: "Справка по коду" },
  { id: "sanctions", title: "Санкционные ограничения" },
  { id: "trade", title: "ВЭД по товару" },
  { id: "market", title: "Международный рынок и тарифы" },
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
}: {
  detail: ProductDetailType;
  onAskAi: () => void;
}) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(["code"]));
  const [activeTab, setActiveTab] = useState<string>("code");
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

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

  const sectionProps = (id: string) => ({
    open: openIds.has(id),
    onToggle: () => toggle(id),
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
            <Button onClick={onAskAi} className="shrink-0 rounded-full">
              <Sparkles />
              Спросить ИИ
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
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
        <div className="flex flex-col gap-6">
          <div
            ref={(el) => {
              refs.current.code = el;
            }}
            className="scroll-mt-20"
          >
            <SectionCard
              icon={SquareStack}
              title="Справка по коду"
              {...sectionProps("code")}
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
              {...sectionProps("sanctions")}
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
              {...sectionProps("trade")}
            >
              <div className="flex flex-col gap-6">
                <LabeledBlock title="Статистика">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
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
              {...sectionProps("market")}
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
        </div>
      </div>
    </div>
  );
}
