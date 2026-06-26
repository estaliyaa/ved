/** Палитра дашборда «Аналитика ВЭД». */
export const PALETTE = {
  blue: "#068DFF",
  violet: "#7c5cfc",
  indigo: "#6366f1",
  emerald: "#10b981",
  amber: "#f59e0b",
  rose: "#f43f5e",
  sky: "#38bdf8",
} as const;

export type Kpi = {
  id: string;
  icon: "turnover" | "import" | "export" | "balance" | "docs";
  label: string;
  prefix: string;
  value: number;
  decimals: number;
  suffix: string;
  delta: string;
  up: boolean;
  color: string;
  spark: number[];
};

export const kpis: Kpi[] = [
  {
    id: "turnover",
    icon: "turnover",
    label: "Товарооборот",
    prefix: "$",
    value: 138.4,
    decimals: 1,
    suffix: " млрд",
    delta: "6,2%",
    up: true,
    color: PALETTE.blue,
    spark: [96, 101, 108, 112, 121, 118, 126, 130, 134, 138],
  },
  {
    id: "import",
    icon: "import",
    label: "Импорт",
    prefix: "$",
    value: 61.2,
    decimals: 1,
    suffix: " млрд",
    delta: "8,1%",
    up: true,
    color: PALETTE.violet,
    spark: [42, 45, 44, 48, 51, 50, 54, 56, 59, 61],
  },
  {
    id: "export",
    icon: "export",
    label: "Экспорт",
    prefix: "$",
    value: 77.2,
    decimals: 1,
    suffix: " млрд",
    delta: "4,7%",
    up: true,
    color: PALETTE.emerald,
    spark: [60, 63, 66, 64, 69, 71, 70, 73, 75, 77],
  },
  {
    id: "balance",
    icon: "balance",
    label: "Сальдо",
    prefix: "+$",
    value: 16.0,
    decimals: 1,
    suffix: " млрд",
    delta: "12,0%",
    up: true,
    color: PALETTE.sky,
    spark: [9, 10, 11, 10, 12, 13, 12, 14, 15, 16],
  },
  {
    id: "docs",
    icon: "docs",
    label: "Оформлено ДТ",
    prefix: "",
    value: 284.5,
    decimals: 1,
    suffix: " тыс.",
    delta: "1,7%",
    up: false,
    color: PALETTE.amber,
    spark: [305, 298, 301, 294, 296, 289, 292, 288, 286, 284],
  },
];

/** Динамика товарооборота по месяцам, $ млрд. */
export const monthly: { m: string; imp: number; exp: number }[] = [
  { m: "Янв", imp: 4.2, exp: 5.4 },
  { m: "Фев", imp: 4.6, exp: 5.1 },
  { m: "Мар", imp: 5.1, exp: 6.0 },
  { m: "Апр", imp: 4.9, exp: 6.4 },
  { m: "Май", imp: 5.6, exp: 6.1 },
  { m: "Июн", imp: 5.2, exp: 6.8 },
  { m: "Июл", imp: 5.9, exp: 6.5 },
  { m: "Авг", imp: 6.1, exp: 7.0 },
  { m: "Сен", imp: 5.7, exp: 6.7 },
  { m: "Окт", imp: 6.4, exp: 7.2 },
  { m: "Ноя", imp: 6.0, exp: 6.9 },
  { m: "Дек", imp: 6.6, exp: 7.5 },
];

/** Донат: структура товарооборота по разделам ТН ВЭД, %. */
export const tnvedShare: { label: string; value: number; color: string }[] = [
  { label: "Минеральные продукты", value: 38, color: PALETTE.blue },
  { label: "Металлы", value: 19, color: PALETTE.violet },
  { label: "Машины и оборудование", value: 17, color: PALETTE.emerald },
  { label: "Продовольствие и АПК", value: 14, color: PALETTE.amber },
  { label: "Химия", value: 12, color: PALETTE.sky },
];

/** Топ стран по товарообороту. */
export const topCountries: {
  name: string;
  flag: string;
  percent: number;
  total: string;
  up: boolean;
}[] = [
  { name: "Россия", flag: "🇷🇺", percent: 23, total: "$31,8 млрд", up: true },
  { name: "Китай", flag: "🇨🇳", percent: 21, total: "$29,1 млрд", up: true },
  { name: "Италия", flag: "🇮🇹", percent: 11, total: "$15,2 млрд", up: true },
  { name: "Германия", flag: "🇩🇪", percent: 8, total: "$11,1 млрд", up: false },
  { name: "Турция", flag: "🇹🇷", percent: 7, total: "$9,7 млрд", up: true },
];

export const topImporters: { name: string; value: string; share: number }[] = [
  { name: "ТОО «КазМунайГаз Импорт»", value: "$1,24 млрд", share: 100 },
  { name: "ТОО «Эфес Казахстан»", value: "$0,87 млрд", share: 70 },
  { name: "ТОО «Тойота Мотор КЗ»", value: "$0,76 млрд", share: 61 },
  { name: "ТОО «Магнум»", value: "$0,54 млрд", share: 44 },
  { name: "ТОО «Алтын Логистик»", value: "$0,41 млрд", share: 33 },
];

export const topExporters: { name: string; value: string; share: number }[] = [
  { name: "ТШО (Тенгизшевройл)", value: "$4,20 млрд", share: 100 },
  { name: "НАК «Казатомпром»", value: "$1,60 млрд", share: 38 },
  { name: "ERG", value: "$1,40 млрд", share: 33 },
  { name: "«Казцинк»", value: "$0,98 млрд", share: 23 },
  { name: "«Продкорпорация»", value: "$0,62 млрд", share: 15 },
];

/** Отрасли — доля в товарообороте, %. */
export const industries: { label: string; value: number; color: string }[] = [
  { label: "Нефтегаз", value: 48, color: PALETTE.blue },
  { label: "Металлургия", value: 19, color: PALETTE.violet },
  { label: "Машиностроение", value: 12, color: PALETTE.emerald },
  { label: "АПК", value: 11, color: PALETTE.amber },
  { label: "Химия", value: 10, color: PALETTE.sky },
];

/** Тепловая карта активности оформления (Пн–Вс × 08:00–19:00), интенсивность 0–4. */
export const heat: number[][] = [
  [0, 1, 2, 3, 3, 4, 4, 3, 2, 2, 1, 0],
  [1, 1, 2, 3, 4, 4, 3, 3, 2, 1, 1, 0],
  [1, 2, 3, 4, 4, 3, 4, 3, 2, 2, 1, 1],
  [0, 1, 2, 3, 4, 4, 4, 3, 3, 2, 1, 0],
  [1, 2, 3, 3, 4, 3, 3, 4, 2, 1, 1, 1],
  [0, 1, 1, 2, 2, 3, 2, 2, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 2, 1, 1, 1, 0, 0, 0],
];
export const heatDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
export const heatHours = ["8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"];

/** Доли товарооборота по регионам РК — для карты (демо). */
export const regionMap: { label: string; share: number; x: number; y: number }[] = [
  { label: "Алматы", share: 38, x: 80, y: 78 },
  { label: "Астана", share: 22, x: 52, y: 40 },
  { label: "Атырау", share: 18, x: 10, y: 52 },
  { label: "Караганда", share: 12, x: 56, y: 52 },
  { label: "Шымкент", share: 8, x: 55, y: 82 },
];
