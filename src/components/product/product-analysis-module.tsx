"use client";

import { useState } from "react";
import { ChevronRight, Package } from "lucide-react";

import { ProductDetail } from "@/components/product/product-detail";
import { ProductResults } from "@/components/product/product-results";
import { ProductSearch } from "@/components/product/product-search";
import { TnVedTree } from "@/components/product/tn-ved-tree";
import {
  buildProductDetail,
  productByCode,
  searchProducts,
  type ProductDetail as ProductDetailType,
  type ProductSummary,
} from "@/config/products";
import { cn } from "@/lib/utils";

export function ProductAnalysisModule({ onAskAi }: { onAskAi: () => void }) {
  const [value, setValue] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductSummary[] | null>(null);
  const [detail, setDetail] = useState<ProductDetailType | null>(null);
  const [recent, setRecent] = useState<string[]>([
    "чай",
    "кофе",
    "ноутбуки",
    "смартфоны",
  ]);

  function runSearch(q: string) {
    const term = q.trim();
    if (!term) return;
    setValue(term);
    setQuery(term);
    setResults(searchProducts(term));
    setRecent((prev) =>
      [term, ...prev.filter((x) => x.toLowerCase() !== term.toLowerCase())].slice(
        0,
        8
      )
    );
  }

  function openProduct(p: ProductSummary) {
    setDetail(buildProductDetail(p));
  }

  /** Открыть товар по коду из дерева (синтезируем карточку, если кода нет в каталоге). */
  function openByCode(hsCode: string, title?: string) {
    const p =
      productByCode(hsCode) ??
      ({
        hsCode,
        name: title ?? hsCode,
        brief: "Подбор по дереву ТН ВЭД",
        dutyRate: "5%",
        vatRate: "12%",
        unit: "кг",
      } satisfies ProductSummary);
    openProduct(p);
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-8 text-sm">
        <Package className="h-4 w-4 shrink-0 text-muted-foreground" />
        <button
          type="button"
          onClick={() => setDetail(null)}
          className={cn(
            "shrink-0 transition-colors",
            detail
              ? "font-semibold text-muted-foreground hover:text-foreground"
              : "font-bold text-foreground"
          )}
        >
          Анализ товара
        </button>
        {detail && (
          <>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate font-bold text-foreground">
              {detail.name}
            </span>
          </>
        )}
      </header>

      <div className="flex-1 overflow-hidden">
        {detail ? (
          <div className="h-full overflow-y-auto">
            <ProductDetail
              detail={detail}
              onAskAi={onAskAi}
              onOpenCode={openByCode}
            />
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <ProductSearch
              value={value}
              onChange={setValue}
              onSubmit={() => runSearch(value)}
              recent={recent}
              onRecent={runSearch}
            />
            <div className="flex-1 overflow-y-auto">
              {results ? (
                <ProductResults
                  query={query}
                  results={results}
                  onOpen={openProduct}
                />
              ) : (
                <div className="px-8 pb-8 pt-4">
                  <TnVedTree onOpenProduct={openByCode} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
