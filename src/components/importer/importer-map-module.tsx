"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleCheck,
  Map,
  Sparkles,
} from "lucide-react";

import { StatCard, SubTitle } from "@/components/product/data-bits";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS = [
  "Код ТН ВЭД",
  "Информация о товаре",
  "Таможенная стоимость",
  "Транспорт и пост",
  "Документы и платежи",
  "Анализ конкурентов",
  "Итоговый отчёт",
];

type Data = {
  code: string;
  name: string;
  manufacturer: string;
  origin: string;
  qty: string;
  weight: string;
  value: string;
  currency: string;
  incoterms: string;
  transport: string;
  route: string;
  post: string;
};

const DEFAULT: Data = {
  code: "0902 30 000 0",
  name: "Чай чёрный фасованный",
  manufacturer: "Tata Global Beverages",
  origin: "Индия",
  qty: "18000",
  weight: "18 000 кг",
  value: "38600000",
  currency: "KZT",
  incoterms: "FOB Калькутта",
  transport: "Морской",
  route: "Нава-Шева → Актау → Алматы",
  post: "Алматы (ЦТО)",
};

export function ImporterMapModule({
  onAskAi,
}: {
  onAskAi: (question?: string) => void;
}) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>(DEFAULT);
  const set = (p: Partial<Data>) => setData((d) => ({ ...d, ...p }));

  const isLast = step === STEPS.length - 1;
  const askAi = () =>
    onAskAi(
      `Проанализируй импортную сделку: товар «${data.name}» (код ТН ВЭД ${data.code}), производитель ${data.manufacturer}, страна происхождения ${data.origin}, условия поставки ${data.incoterms}, маршрут ${data.route}, таможенный пост ${data.post}. Оцени платежи и риски.`
    );

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-8 text-sm">
        <Map className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="font-bold text-foreground">Карта импортёра</span>
        <span className="ml-2 text-muted-foreground">
          · Шаг {step + 1} из {STEPS.length}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={askAi}
          className="ml-auto rounded-full"
        >
          <Sparkles className="text-primary" />
          Спросить ИИ
        </Button>
      </header>

      {/* Stepper — сегментированный прогресс */}
      <div className="shrink-0 border-b border-border px-8 py-5">
        <div className="flex items-end gap-2">
          {STEPS.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setStep(i)}
                className="group flex flex-1 flex-col gap-2 text-left"
                aria-current={active ? "step" : undefined}
              >
                <span
                  className={cn(
                    "h-1 rounded-full transition-colors",
                    done || active ? "bg-primary" : "bg-muted"
                  )}
                />
                <span
                  className={cn(
                    "flex items-center gap-1 text-xs transition-colors",
                    active
                      ? "font-semibold text-primary"
                      : done
                        ? "text-foreground"
                        : "text-muted-foreground"
                  )}
                >
                  {done ? (
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                  ) : (
                    <span className="shrink-0 tabular-nums">{i + 1}.</span>
                  )}
                  <span className="truncate">{s}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          {step === 0 && (
            <StepShell title="Шаг 1 — Код ТН ВЭД" hint="Подберите код товара или выберите в дереве ТН ВЭД.">
              <FieldGrid>
                <Field label="Код ТН ВЭД">
                  <Input value={data.code} onChange={(v) => set({ code: v })} placeholder="0902 30 000 0" />
                </Field>
                <Field label="Наименование товара">
                  <Input value={data.name} onChange={(v) => set({ name: v })} />
                </Field>
              </FieldGrid>
            </StepShell>
          )}

          {step === 1 && (
            <StepShell title="Шаг 2 — Информация о товаре" hint="Характеристики товара для оформления.">
              <FieldGrid>
                <Field label="Производитель">
                  <Input value={data.manufacturer} onChange={(v) => set({ manufacturer: v })} />
                </Field>
                <Field label="Страна происхождения">
                  <Input value={data.origin} onChange={(v) => set({ origin: v })} />
                </Field>
                <Field label="Количество, ед.">
                  <Input value={data.qty} onChange={(v) => set({ qty: v })} type="number" />
                </Field>
                <Field label="Вес, нетто">
                  <Input value={data.weight} onChange={(v) => set({ weight: v })} />
                </Field>
              </FieldGrid>
            </StepShell>
          )}

          {step === 2 && (
            <StepShell title="Шаг 3 — Таможенная стоимость" hint="Стоимость, валюта и условия поставки (Incoterms).">
              <FieldGrid>
                <Field label="Таможенная стоимость">
                  <Input value={data.value} onChange={(v) => set({ value: v })} type="number" />
                </Field>
                <Field label="Валюта">
                  <Input value={data.currency} onChange={(v) => set({ currency: v })} />
                </Field>
                <Field label="Условия поставки (Incoterms)">
                  <Input value={data.incoterms} onChange={(v) => set({ incoterms: v })} />
                </Field>
              </FieldGrid>
            </StepShell>
          )}

          {step === 3 && (
            <StepShell title="Шаг 4 — Транспорт и таможенный пост" hint="Вид транспорта, маршрут и пост оформления.">
              <FieldGrid>
                <Field label="Вид транспорта">
                  <Input value={data.transport} onChange={(v) => set({ transport: v })} />
                </Field>
                <Field label="Маршрут">
                  <Input value={data.route} onChange={(v) => set({ route: v })} />
                </Field>
                <Field label="Таможенный пост">
                  <Input value={data.post} onChange={(v) => set({ post: v })} />
                </Field>
              </FieldGrid>
            </StepShell>
          )}

          {step === 4 && (
            <StepShell title="Шаг 5 — Документы и расчёт платежей" hint="Комплект документов и ориентировочные платежи.">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <SubTitle>Документы</SubTitle>
                  <ul className="flex flex-col gap-2">
                    {["Внешнеторговый контракт", "Инвойс", "Упаковочный лист", "Коносамент", "Сертификат происхождения"].map(
                      (d) => (
                        <li key={d} className="flex items-center gap-2 text-sm text-foreground">
                          <CircleCheck className="h-5 w-5 text-emerald-500" />
                          {d}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div>
                  <SubTitle>Платежи (ориентировочно)</SubTitle>
                  <div className="grid grid-cols-2 gap-3">
                    <StatCard label="Пошлина (5%)" value="1 930 000 ₸" />
                    <StatCard label="НДС (12%)" value="4 863 600 ₸" />
                    <StatCard label="Таможенный сбор" value="25 000 ₸" />
                    <StatCard label="Итого платежей" value="6 818 600 ₸" />
                  </div>
                </div>
              </div>
            </StepShell>
          )}

          {step === 5 && (
            <StepShell title="Шаг 6 — Анализ конкурентов" hint="Другие импортёры этого кода ТН ВЭД.">
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-3">Импортёр</th>
                      <th className="px-4 py-3 text-right">Доля</th>
                      <th className="px-4 py-3 text-right">Ср. цена</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["ТОО «Чайный Дом Алматы»", "28%", "$3,1/кг"],
                      ["ТОО «Караван Импорт»", "19%", "$3,4/кг"],
                      ["ТОО «Шёлковый путь»", "14%", "$2,9/кг"],
                    ].map((r) => (
                      <tr key={r[0]} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 font-semibold text-foreground">{r[0]}</td>
                        <td className="px-4 py-3 text-right text-muted-foreground">{r[1]}</td>
                        <td className="px-4 py-3 text-right text-muted-foreground">{r[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </StepShell>
          )}

          {step === 6 && (
            <StepShell title="Шаг 7 — Итоговый отчёт" hint="Сводка по импортной сделке.">
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <StatCard label="Код ТН ВЭД" value={data.code} />
                  <StatCard label="Таможенная стоимость" value={`${Number(data.value).toLocaleString("ru-RU")} ₸`} />
                  <StatCard label="Платежи" value="6 818 600 ₸" />
                  <StatCard label="Таможенный пост" value={data.post} />
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <SubTitle>Параметры сделки</SubTitle>
                    <dl className="grid grid-cols-1 gap-2 text-sm">
                      <Row k="Товар" v={data.name} />
                      <Row k="Производитель" v={data.manufacturer} />
                      <Row k="Происхождение" v={data.origin} />
                      <Row k="Условия" v={data.incoterms} />
                      <Row k="Маршрут" v={data.route} />
                    </dl>
                  </div>
                  <div>
                    <SubTitle>Рекомендации</SubTitle>
                    <ul className="flex flex-col gap-2 text-sm text-foreground">
                      <li className="flex gap-2"><CircleCheck className="h-5 w-5 shrink-0 text-emerald-500" />Запросить сертификат происхождения формы «А» для преференций</li>
                      <li className="flex gap-2"><CircleCheck className="h-5 w-5 shrink-0 text-emerald-500" />Проверить контрагента перед оплатой</li>
                      <li className="flex gap-2"><CircleCheck className="h-5 w-5 shrink-0 text-emerald-500" />Заложить фитосанитарный контроль в сроки</li>
                    </ul>
                  </div>
                </div>
              </div>
            </StepShell>
          )}
        </div>

        {/* Nav */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="rounded-full"
          >
            <ArrowLeft />
            Назад
          </Button>
          {!isLast ? (
            <Button onClick={() => setStep((s) => s + 1)} className="rounded-full">
              Далее
              <ArrowRight />
            </Button>
          ) : (
            <Button onClick={() => setStep(0)} variant="outline" className="rounded-full">
              Начать заново
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepShell({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-lg font-bold tracking-tight text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
      </div>
      {children}
    </div>
  );
}

function FieldGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-11 rounded-xl border border-border bg-muted/30 px-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:bg-card placeholder:text-muted-foreground"
    />
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-2 last:border-0">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-right font-semibold text-foreground">{v}</dd>
    </div>
  );
}
