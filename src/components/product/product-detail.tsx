"use client";

import { useRef, useState } from "react";
import {
  ChevronDown,
  ExternalLink,
  FileText,
  Globe,
  Scale,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

import {
  BarList,
  BulletList,
  SectionCard,
  SimpleTable,
  StatCard,
  SubTitle,
  TagList,
  YearBars,
} from "@/components/product/data-bits";
import { Button } from "@/components/ui/button";
import type {
  CustomsCell,
  CustomsSection,
  CustomsTable,
  ProductDetail as ProductDetailType,
} from "@/config/products";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "info", title: "Информация о товаре" },
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

function HeaderField({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children ?? (
        <span className="text-sm font-semibold text-foreground">{value}</span>
      )}
    </div>
  );
}

function Cell({ cell }: { cell: CustomsCell }) {
  if (typeof cell === "object" && cell && "link" in cell) {
    return (
      <button
        type="button"
        className="text-left font-medium text-primary transition-colors hover:underline"
      >
        {cell.link}
      </button>
    );
  }
  return <span className="text-foreground">{cell}</span>;
}

function CustomsTableView({ table }: { table: CustomsTable }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-muted/40 text-left text-xs font-medium text-muted-foreground">
            {table.columns.map((c, i) => (
              <th key={i} className="px-4 py-2 font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri} className="border-t border-border align-top">
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-3">
                  <Cell cell={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SubAccordion({ section }: { section: CustomsSection }) {
  const [open, setOpen] = useState(true);
  const [noteOpen, setNoteOpen] = useState(false);
  return (
    <section className="overflow-hidden rounded-xl border border-border">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 bg-muted/40 px-4 py-3 text-left transition-colors hover:bg-muted/60"
      >
        <h4 className="text-sm font-semibold text-foreground">{section.title}</h4>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="flex flex-col gap-4 p-4">
          {section.tables.length > 0 ? (
            section.tables.map((t, i) => <CustomsTableView key={i} table={t} />)
          ) : (
            <p className="text-sm text-muted-foreground">
              Нет данных по выбранному режиму.
            </p>
          )}

          {section.note && section.note.length > 0 && (
            <div className="overflow-hidden rounded-lg bg-accent/40">
              <button
                type="button"
                onClick={() => setNoteOpen((o) => !o)}
                className="flex w-full items-center justify-between px-4 py-2 text-sm"
              >
                <span className="text-muted-foreground">Примечание</span>
                <span className="font-medium text-primary">
                  {noteOpen ? "Скрыть" : "Показать"}
                </span>
              </button>
              {noteOpen && (
                <ul className="flex flex-col gap-1 px-4 pb-3 text-sm text-foreground">
                  {section.note.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export function ProductDetail({
  detail,
  onAskAi,
  dense = false,
}: {
  detail: ProductDetailType;
  /** Передаётся готовый вопрос для ассистента (привязан к товару/разделу). */
  onAskAi: (question?: string) => void;
  onOpenCode?: (hsCode: string, title?: string) => void;
  /** Компактный режим для узкой панели (ИИ Чат): метрики в 2 колонки. */
  dense?: boolean;
}) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(["info"]));
  const [activeTab, setActiveTab] = useState<string>("info");
  const [mode, setMode] = useState<"import" | "export">("import");
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  const tag = `«${detail.name}» (${detail.hsCode})`;
  const customs = mode === "import" ? detail.refImport : detail.refExport;

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
              <p className="mt-1 text-sm text-muted-foreground">{detail.brief}</p>
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

          {/* Заголовок товара */}
          <div className="mt-6 rounded-xl border border-border bg-muted/40 p-5">
            <div
              className={cn(
                "grid gap-x-6 gap-y-4",
                dense
                  ? "grid-cols-2"
                  : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
              )}
            >
              <HeaderField label="Единица измерения" value={detail.unit} />
              <HeaderField
                label="Дополнительная единица измерения"
                value={detail.addUnit}
              />
              <HeaderField label="Действует с" value={detail.validFrom} />
              <HeaderField label="Действует до" value={detail.validTo} />
              <HeaderField label="Группа">
                <button
                  type="button"
                  className="text-left text-sm font-medium text-primary hover:underline"
                >
                  {detail.groupNote}
                </button>
              </HeaderField>
              <HeaderField label="Позиция">
                <button
                  type="button"
                  className="text-left text-sm font-medium text-primary hover:underline"
                >
                  {detail.positionNote}
                </button>
              </HeaderField>
            </div>
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
          {/* 1. Информация о товаре */}
          <div
            ref={(el) => {
              refs.current.info = el;
            }}
            className="scroll-mt-20"
          >
            <SectionCard
              icon={FileText}
              title="Информация о товаре"
              {...sectionProps(
                "info",
                `Дай справку по товару ${tag}: тарифные меры, преференции, НДС, запреты и ограничения.`
              )}
            >
              <div className="flex flex-col gap-5">
                {/* Переключатель режима + переход к международному рынку */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex max-w-full flex-wrap items-center gap-1 rounded-2xl bg-muted p-1">
                    {(
                      [
                        ["import", "Выпуск для внутреннего потребления"],
                        ["export", "Экспорт"],
                      ] as const
                    ).map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setMode(id)}
                        className={cn(
                          "h-8 rounded-xl px-4 text-sm font-semibold transition-colors",
                          mode === id
                            ? "bg-card text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {mode === "export" && (
                    <button
                      type="button"
                      onClick={() => goTo("market")}
                      className="flex h-9 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-primary transition-colors hover:bg-accent/70"
                    >
                      Международный рынок и тарифы
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Подразделы справки */}
                <div className="flex flex-col gap-3">
                  {customs.map((s) => (
                    <SubAccordion key={s.id} section={s} />
                  ))}
                </div>
              </div>
            </SectionCard>
          </div>

          {/* 2. Санкционные ограничения */}
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

          {/* 3. ВЭД по товару */}
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

          {/* 4. Международный рынок и тарифы */}
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
        </div>
      </div>
    </div>
  );
}
