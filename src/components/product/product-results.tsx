import { ProductCard } from "@/components/product/product-card";
import type { ProductSummary } from "@/config/products";

export function ProductResults({
  query,
  results,
  onOpen,
}: {
  query: string;
  results: ProductSummary[];
  onOpen: (product: ProductSummary) => void;
}) {
  return (
    <div className="px-8 py-8">
      <div className="animate-fade-in-up">
        <p className="mb-5 text-sm text-muted-foreground">
          Найдено: {results.length} · по запросу «{query}»
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.map((product) => (
            <ProductCard
              key={product.hsCode}
              product={product}
              onOpen={onOpen}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
