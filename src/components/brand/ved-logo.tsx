import { cn } from "@/lib/utils";

/**
 * VED brand mark.
 *
 * An ascending "V" (for ВЭД) read as a rising chart line with two data
 * points — a nod to the platform's analytics core and to growth in trade.
 */
export function VedLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      role="img"
      aria-label="VED"
      className={cn("h-8 w-8", className)}
    >
      <path
        d="M6.5 8.5 L16 23 L25.5 8.5"
        stroke="#2563EB"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6.5" cy="8.5" r="2.4" fill="#93B4FB" />
      <circle cx="25.5" cy="8.5" r="3.4" fill="#2563EB" />
    </svg>
  );
}
