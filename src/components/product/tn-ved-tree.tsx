"use client";

import { useState } from "react";
import { ArrowUpRight, ChevronRight } from "lucide-react";

import { TNVED_STATS, tnvedTree, type TnVedNode } from "@/config/tnved";
import { cn } from "@/lib/utils";

export function TnVedTree({
  onOpenProduct,
}: {
  onOpenProduct: (hsCode: string, title?: string) => void;
}) {
  const pct = (TNVED_STATS.active / TNVED_STATS.total) * 100;
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Дерево ТН ВЭД
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Выберите раздел, чтобы раскрыть коды и перейти к товару
          </p>
        </div>
        <div className="w-56">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Действующих кодов</span>
            <span className="font-semibold text-foreground">
              {TNVED_STATS.active.toLocaleString("ru-RU")} из{" "}
              {TNVED_STATS.total.toLocaleString("ru-RU")}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-1 text-right text-xs font-semibold text-primary">
            {pct.toFixed(2)}%
          </div>
        </div>
      </div>

      <ul className="flex flex-col gap-2">
        {tnvedTree.map((node, i) => (
          <TreeNode key={i} node={node} depth={0} onOpenProduct={onOpenProduct} />
        ))}
      </ul>
    </div>
  );
}

function TreeNode({
  node,
  depth,
  onOpenProduct,
}: {
  node: TnVedNode;
  depth: number;
  onOpenProduct: (hsCode: string, title?: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const hasChildren = !!node.children?.length;
  const isLeaf = !hasChildren; // последний уровень всегда открывает товар
  const badge = node.label ?? node.code;

  function handleClick() {
    if (isLeaf) onOpenProduct(node.productHsCode ?? node.code ?? "", node.title);
    else setOpen((o) => !o);
  }

  return (
    <li>
      <button
        type="button"
        onClick={handleClick}
        aria-expanded={hasChildren ? open : undefined}
        className={cn(
          "group flex w-full items-center gap-3 rounded-xl border bg-card px-4 py-3 text-left transition-colors hover:border-primary/40 hover:bg-accent/30",
          depth === 0 ? "border-border" : "border-border/70"
        )}
      >
        {hasChildren ? (
          <ChevronRight
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
              open && "rotate-90"
            )}
          />
        ) : (
          <span className="h-4 w-4 shrink-0" aria-hidden />
        )}

        {badge && (
          <span
            className={cn(
              "shrink-0 rounded-md px-2 py-1 font-mono text-xs font-bold",
              isLeaf ? "bg-accent text-primary" : "bg-muted text-foreground"
            )}
          >
            {badge}
          </span>
        )}

        <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
          {node.title}
          {node.range ? ` (${node.range})` : ""}
        </span>

        {isLeaf && (
          <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
            Открыть
            <ArrowUpRight className="h-4 w-4" />
          </span>
        )}
      </button>

      {hasChildren && open && (
        <ul className="ml-4 mt-2 flex flex-col gap-2 border-l border-border pl-4">
          {node.children!.map((child, i) => (
            <TreeNode
              key={i}
              node={child}
              depth={depth + 1}
              onOpenProduct={onOpenProduct}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
