import {
  BarChart3,
  Calculator,
  ClipboardCheck,
  FileText,
  Map,
  Package,
  Ship,
  ShieldCheck,
  Sparkles,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

export type ModuleKind = "chat" | "product" | "calculator" | "tool" | "dev";

export type ModuleDef = {
  id: string;
  label: string;
  icon: LucideIcon;
  kind: ModuleKind;
};

/**
 * Модули платформы (левая навигация).
 * - `chat`    — AI-ассистент (полный чат с историей).
 * - `product` — «Анализ товара» (поиск → карточки → страница товара).
 * - `dev`     — раздел в разработке (заглушка с иллюстрацией).
 */
export const modules: ModuleDef[] = [
  { id: "ai-chat", label: "ИИ Ассистент", icon: Sparkles, kind: "chat" },
  { id: "product-analysis", label: "Анализ товара", icon: Package, kind: "product" },
  { id: "importer-map", label: "Карта импортёра", icon: Map, kind: "tool" },
  { id: "importer-check", label: "Проверка импортёра", icon: ShieldCheck, kind: "tool" },
  { id: "calculator", label: "Калькулятор", icon: Calculator, kind: "calculator" },
  { id: "customs-infrastructure", label: "Околотаможенная сфера", icon: Warehouse, kind: "tool" },
  { id: "container-tracking", label: "Отслеживание контейнера", icon: Ship, kind: "tool" },
  { id: "foreign-trade-analytics", label: "Аналитика ВЭД", icon: BarChart3, kind: "tool" },
  { id: "customs-audit", label: "Таможенный аудит", icon: ClipboardCheck, kind: "dev" },
  { id: "customs-declaration", label: "Таможенное декларирование", icon: FileText, kind: "dev" },
];

export function moduleById(id: string): ModuleDef | undefined {
  return modules.find((m) => m.id === id);
}
