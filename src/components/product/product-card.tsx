import { ArrowRight } from "lucide-react";

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
      className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <span className="shrink-0 rounded-lg bg-accent px-3 py-1 font-mono text-sm font-bold tracking-tight text-primary">
            {product.hsCode}
          </span>
          <h3 className="min-w-0 flex-1 truncate text-base font-semibold text-foreground">
            {product.name}
          </h3>
        </div>
        <p className="mt-2 truncate text-xs text-muted-foreground">
          {product.brief}
        </p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
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
      </div>

      <ArrowRight className="h-5 w-5 shrink-0 text-primary opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
    </button>
  );
}
