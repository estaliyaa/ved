"use client";

import { useState } from "react";
import { ChevronRight, Package } from "lucide-react";

import { ProductDetail } from "@/components/product/product-detail";
import { ProductResults } from "@/components/product/product-results";
import { ProductSearch } from "@/components/product/product-search";
import {
  buildProductDetail,
  productByCode,
  searchProducts,
  type ProductDetail as ProductDetailType,
  type ProductSummary,
} from "@/config/products";
import { cn } from "@/lib/utils";

type View = "search" | "results" | "detail";

export function ProductAnalysisModule({ onAskAi }: { onAskAi: () => void }) {
  const [view, setView] = useState<View>("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductSummary[]>([]);
  const [detail, setDetail] = useState<ProductDetailType | null>(null);
  const [recent, setRecent] = useState<string[]>([
    "чай",
    "кофе",
    "ноутбуки",
    "смартфоны",
  ]);

  function runSearch(q: string) {
    setQuery(q);
    setResults(searchProducts(q));
    setView("results");
    setRecent((prev) =>
      [q, ...prev.filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 8)
    );
  }

  function openProduct(p: ProductSummary) {
    setDetail(buildProductDetail(p));
    setView("detail");
  }

  function openByCode(hsCode: string) {
    const p = productByCode(hsCode);
    if (p) openProduct(p);
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-8 text-sm">
        <Package className="h-4 w-4 shrink-0 text-muted-foreground" />
        <button
          type="button"
          onClick={() => setView("search")}
          className={cn(
            "shrink-0 transition-colors",
            view === "search"
              ? "font-bold text-foreground"
              : "font-semibold text-muted-foreground hover:text-foreground"
          )}
        >
          Анализ товара
        </button>

        {view !== "search" && (
          <>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            <button
              type="button"
              onClick={() => setView("results")}
              className={cn(
                "shrink-0 transition-colors",
                view === "results"
                  ? "font-bold text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Результаты
            </button>
          </>
        )}

        {view === "detail" && detail && (
          <>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate font-bold text-foreground">
              {detail.name}
            </span>
          </>
        )}
      </header>

      <div className="flex-1 overflow-hidden">
        {view === "search" && (
          <ProductSearch
            recent={recent}
            onSearch={runSearch}
            onOpenProduct={openByCode}
          />
        )}
        {view === "results" && (
          <div className="h-full overflow-y-auto">
            <ProductResults
              query={query}
              results={results}
              onOpen={openProduct}
            />
          </div>
        )}
        {view === "detail" && detail && (
          <div className="h-full overflow-y-auto">
            <ProductDetail detail={detail} onAskAi={onAskAi} />
          </div>
        )}
      </div>
    </div>
  );
}
