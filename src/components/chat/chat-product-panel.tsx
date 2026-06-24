"use client";

import { X } from "lucide-react";

import {
  BarList,
  BulletList,
  KeyValueList,
  StatCard,
  SubTitle,
  YearBars,
} from "@/components/product/data-bits";
import type { ProductDetail } from "@/config/products";

export function ChatProductPanel({
  detail,
  onClose,
}: {
  detail: ProductDetail;
  onClose: () => void;
}) {
  return (
    <aside className="flex w-[420px] shrink-0 flex-col overflow-hidden border-l border-border bg-card">
      <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border px-6">
        <span className="text-sm font-semibold text-muted-foreground">
          Карточка товара
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть карточку"
          className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
        <div>
          <span className="inline-block rounded-lg bg-accent px-3 py-1 font-mono text-sm font-bold tracking-tight text-primary">
            {detail.hsCode}
          </span>
          <h2 className="mt-3 text-xl font-bold tracking-tight text-foreground">
            {detail.name}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{detail.brief}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Импортная пошлина" value={detail.dutyRate} />
          <StatCard label="НДС" value={detail.vatRate} />
          <StatCard label="Акциз" value={detail.excise} />
          <StatCard label="Единица" value={detail.unit} />
        </div>

        <div>
          <SubTitle>Справка по коду</SubTitle>
          <KeyValueList
            rows={[
              { label: "Пошлины", value: detail.dutyRate },
              { label: "НДС", value: detail.vatRate },
            ]}
          />
          <div className="mt-3">
            <SubTitle>Ограничения</SubTitle>
            <BulletList items={detail.restrictions} />
          </div>
        </div>

        <div>
          <SubTitle>Страны-поставщики</SubTitle>
          <BarList items={detail.countries} />
        </div>

        <div>
          <SubTitle>Динамика импорта по годам</SubTitle>
          <YearBars data={detail.yearly} />
        </div>
      </div>
    </aside>
  );
}
