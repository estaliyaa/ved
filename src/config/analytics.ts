export type Bar = { label: string; value: number };

export const kpis: { label: string; value: string; sub: string }[] = [
  { label: "Товарооборот, 2024", value: "$138,4 млрд", sub: "+6,2% г/г" },
  { label: "Импорт", value: "$61,2 млрд", sub: "+8,1% г/г" },
  { label: "Экспорт", value: "$77,2 млрд", sub: "+4,7% г/г" },
  { label: "Сальдо", value: "+$16,0 млрд", sub: "профицит" },
];

export const importByCountry: Bar[] = [
  { label: "Россия", value: 34 },
  { label: "Китай", value: 31 },
  { label: "Германия", value: 9 },
  { label: "Турция", value: 7 },
  { label: "Республика Корея", value: 5 },
];
export const importByRegion: Bar[] = [
  { label: "Алматы", value: 38 },
  { label: "Астана", value: 22 },
  { label: "Карагандинская", value: 12 },
  { label: "Атырауская", value: 10 },
  { label: "Шымкент", value: 8 },
];
export const importByProduct: Bar[] = [
  { label: "Машины и оборудование", value: 41 },
  { label: "Химия", value: 16 },
  { label: "Металлы", value: 12 },
  { label: "Продовольствие", value: 11 },
  { label: "Электроника", value: 9 },
];

export const exportByCountry: Bar[] = [
  { label: "Китай", value: 22 },
  { label: "Италия", value: 14 },
  { label: "Россия", value: 12 },
  { label: "Нидерланды", value: 9 },
  { label: "Франция", value: 7 },
];
export const exportByRegion: Bar[] = [
  { label: "Атырауская", value: 41 },
  { label: "Карагандинская", value: 16 },
  { label: "Мангистауская", value: 12 },
  { label: "ВКО", value: 9 },
  { label: "Костанайская", value: 7 },
];
export const exportByProduct: Bar[] = [
  { label: "Нефть и газ", value: 58 },
  { label: "Металлы", value: 16 },
  { label: "Зерно", value: 9 },
  { label: "Уран", value: 6 },
  { label: "Химия", value: 4 },
];

export const tnvedSections: Bar[] = [
  { label: "V — Минеральные продукты", value: 52 },
  { label: "XV — Недрагоценные металлы", value: 15 },
  { label: "XVI — Машины и оборудование", value: 12 },
  { label: "II — Растительные продукты", value: 8 },
  { label: "VI — Химия", value: 7 },
];
export const tnvedGroups: Bar[] = [
  { label: "27 — Топливо минеральное", value: 49 },
  { label: "26 — Руды", value: 11 },
  { label: "72 — Чёрные металлы", value: 9 },
  { label: "84 — Оборудование", value: 8 },
  { label: "10 — Злаки", value: 6 },
];

export const topImporters: Bar[] = [
  { label: "ТОО «КазМунайГаз Импорт»", value: 1240 },
  { label: "ТОО «Эфес Казахстан»", value: 870 },
  { label: "ТОО «Тойота Мотор КЗ»", value: 760 },
  { label: "ТОО «Магнум»", value: 540 },
  { label: "ТОО «Алтын Логистик»", value: 410 },
];
export const topExporters: Bar[] = [
  { label: "ТШО (Тенгизшевройл)", value: 4200 },
  { label: "НАК «Казатомпром»", value: 1600 },
  { label: "ERG", value: 1400 },
  { label: "«Казцинк»", value: 980 },
  { label: "«Продкорпорация»", value: 620 },
];

export const regionStructure: Bar[] = [
  { label: "Сырьё и топливо", value: 54 },
  { label: "Металлы", value: 18 },
  { label: "Машины", value: 14 },
  { label: "АПК", value: 9 },
  { label: "Прочее", value: 5 },
];

export const industryLeaders: Bar[] = [
  { label: "Нефтегаз", value: 48 },
  { label: "Металлургия", value: 19 },
  { label: "Машиностроение", value: 12 },
  { label: "АПК", value: 11 },
  { label: "Химия", value: 10 },
];

export const yearly: { year: string; value: number }[] = [
  { year: "2019", value: 96 },
  { year: "2020", value: 85 },
  { year: "2021", value: 101 },
  { year: "2022", value: 134 },
  { year: "2023", value: 130 },
  { year: "2024", value: 138 },
];

/** Доли товарооборота по регионам — для «карты» (демо). */
export const regionMap: { label: string; share: number; x: number; y: number }[] = [
  { label: "Алматы", share: 38, x: 80, y: 78 },
  { label: "Астана", share: 22, x: 52, y: 40 },
  { label: "Атырау", share: 18, x: 10, y: 52 },
  { label: "Караганда", share: 12, x: 56, y: 52 },
  { label: "Шымкент", share: 8, x: 55, y: 82 },
];
