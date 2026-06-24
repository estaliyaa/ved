import { ArrowRight, ArrowUpRight } from "lucide-react";

import type { ProductSummary } from "@/config/products";

export function ProductCard({
  product,
  onOpen,
}: {
  product: ProductSummary;
  onOpen: (product: ProductSummary) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(product)}
      className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-lg bg-accent px-3 py-1 font-mono text-sm font-bold tracking-tight text-primary">
          {product.hsCode}
        </span>
        <ArrowUpRight className="h-5 w-5 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <h3 className="text-base font-semibold leading-6 text-foreground">
        {product.name}
      </h3>
      <p className="text-xs text-muted-foreground">{product.brief}</p>

      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-2 text-xs text-muted-foreground">
        <span>
          Пошлина:{" "}
          <span className="font-semibold text-foreground">
            {product.dutyRate}
          </span>
        </span>
        <span>
          НДС:{" "}
          <span className="font-semibold text-foreground">
            {product.vatRate}
          </span>
        </span>
        <span>
          Ед.:{" "}
          <span className="font-semibold text-foreground">{product.unit}</span>
        </span>
      </div>

      <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
        Открыть
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </button>
  );
}
