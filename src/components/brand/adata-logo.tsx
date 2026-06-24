import { cn } from "@/lib/utils";

/** Логотип Adata: тёмно-синий квадрат с белой «A» + «DATA». */
export function AdataLogo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const square = (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#27364A] text-base font-bold text-white">
      A
    </span>
  );

  if (compact) {
    return (
      <span aria-label="Adata" className={cn("inline-flex", className)}>
        {square}
      </span>
    );
  }

  return (
    <div
      aria-label="Adata"
      className={cn("flex items-center gap-2 text-[#27364A]", className)}
    >
      {square}
      <span className="text-lg font-bold uppercase tracking-wide">DATA</span>
    </div>
  );
}
