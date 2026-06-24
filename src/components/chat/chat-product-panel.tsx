"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2, X } from "lucide-react";

import { ProductDetail } from "@/components/product/product-detail";
import type { ProductDetail as ProductDetailType } from "@/config/products";

const MIN = 360;
const MAX = 880;
const DEFAULT_W = 480;
const WIDE_W = 760;

export function ChatProductPanel({
  detail,
  onClose,
  onAsk,
}: {
  detail: ProductDetailType;
  onClose: () => void;
  onAsk: (text: string) => void;
}) {
  const [width, setWidth] = useState(DEFAULT_W);
  const draggingRef = useRef(false);

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!draggingRef.current) return;
    // Панель справа: ширина растёт по мере движения курсора влево.
    const w = window.innerWidth - e.clientX;
    setWidth(Math.min(MAX, Math.max(MIN, w)));
  }, []);

  const stop = useCallback(() => {
    draggingRef.current = false;
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  }, []);

  useEffect(() => {
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stop);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stop);
    };
  }, [onPointerMove, stop]);

  const startDrag = () => {
    draggingRef.current = true;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
  };

  const expanded = width >= WIDE_W - 1;
  const toggleSize = () => setWidth(expanded ? DEFAULT_W : WIDE_W);

  return (
    <aside
      style={{ width }}
      className="relative flex shrink-0 flex-col overflow-hidden border-l border-border bg-card"
    >
      {/* Резайз-хэндл — потяните, чтобы настроить ширину окна */}
      <div
        onPointerDown={startDrag}
        role="separator"
        aria-label="Изменить ширину панели"
        className="group absolute left-0 top-0 z-20 flex h-full w-2 cursor-col-resize items-center justify-center hover:bg-primary/10"
      >
        <span className="h-8 w-1 rounded-full bg-border transition-colors group-hover:bg-primary" />
      </div>

      <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border pl-6 pr-4">
        <span className="text-sm font-semibold text-muted-foreground">
          Карточка товара
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleSize}
            aria-label={expanded ? "Свернуть панель" : "Развернуть панель"}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {expanded ? (
              <Minimize2 className="h-5 w-5" />
            ) : (
              <Maximize2 className="h-5 w-5" />
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть карточку"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Тот же контент, что и на странице «Анализ товара» */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <ProductDetail
          detail={detail}
          dense
          onAskAi={(q) =>
            onAsk(q ?? `Расскажи подробнее про «${detail.name}» (${detail.hsCode}).`)
          }
        />
      </div>
    </aside>
  );
}
