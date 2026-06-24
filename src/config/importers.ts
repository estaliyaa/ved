export type Bar = { label: string; value: number };

export type ImporterSummary = {
  bin: string;
  name: string;
  status: string;
  region: string;
  risk: "low" | "mid" | "high";
};

export type ImporterProfile = ImporterSummary & {
  registered: string;
  director: string;
  phone: string;
  email: string;
  address: string;
  importVol: string;
  exportVol: string;
  deals: string;
  countries: Bar[];
  topCodes: { code: string; title: string; share: number }[];
  nomenclature: string[];
  suppliers: string[];
  buyers: string[];
  trend: { year: string; value: number }[];
  geography: Bar[];
  volumes: { label: string; value: string }[];
  anomalies: string[];
  suspicious: string[];
  sanctions: string[];
};

const RISK_LABEL: Record<ImporterSummary["risk"], string> = {
  low: "Низкий риск",
  mid: "Средний риск",
  high: "Высокий риск",
};

export function riskLabel(r: ImporterSummary["risk"]) {
  return RISK_LABEL[r];
}

const CATALOG: ImporterSummary[] = [
  {
    bin: "010540004771",
    name: "ТОО «Чайный Дом Алматы»",
    status: "Действующая",
    region: "г. Алматы",
    risk: "low",
  },
  {
    bin: "180340021145",
    name: "ТОО «Алтын Логистик»",
    status: "Действующая",
    region: "г. Астана",
    risk: "mid",
  },
  {
    bin: "990240007788",
    name: "ТОО «Караван Импорт»",
    status: "Действующая",
    region: "г. Шымкент",
    risk: "low",
  },
  {
    bin: "150640033019",
    name: "ТОО «Шёлковый путь»",
    status: "Приостановлена",
    region: "г. Алматы",
    risk: "high",
  },
];

export function searchImporters(query: string): ImporterSummary[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits = CATALOG.filter(
    (c) => c.name.toLowerCase().includes(q) || c.bin.includes(q)
  );
  if (hits.length) return hits;
  return [
    {
      bin: q.replace(/\D/g, "").padEnd(12, "0").slice(0, 12),
      name: `Компания по запросу «${query.trim()}»`,
      status: "Действующая",
      region: "г. Алматы",
      risk: "low",
    },
  ];
}

export function buildImporterProfile(s: ImporterSummary): ImporterProfile {
  return {
    ...s,
    registered: "12 мар. 2009 г.",
    director: "Нурланов Асет Бекович",
    phone: "+7 (727) 250-44-71",
    email: "info@company.kz",
    address: `${s.region}, пр. Абая, 150, оф. 24`,
    importVol: "$4,8 млн",
    exportVol: "$0,9 млн",
    deals: "142",
    countries: [
      { label: "Индия", value: 64 },
      { label: "Китай", value: 48 },
      { label: "Шри-Ланка", value: 33 },
      { label: "Кения", value: 21 },
    ],
    topCodes: [
      { code: "0902 30", title: "Чай чёрный фасованный", share: 68 },
      { code: "0902 10", title: "Чай зелёный", share: 22 },
      { code: "0901 21", title: "Кофе жареный", share: 10 },
    ],
    nomenclature: ["Чай чёрный", "Чай зелёный", "Кофе", "Травяные сборы", "Упаковка"],
    suppliers: [
      "Tata Global Beverages (Индия)",
      "James Finlay (Кения)",
      "Dilmah (Шри-Ланка)",
    ],
    buyers: [
      "ТОО «Магнум Кэш энд Керри»",
      "ТОО «Small»",
      "ИП розничная сеть «Аруна»",
    ],
    trend: [
      { year: "2019", value: 31 },
      { year: "2020", value: 38 },
      { year: "2021", value: 42 },
      { year: "2022", value: 49 },
      { year: "2023", value: 58 },
      { year: "2024", value: 41 },
    ],
    geography: [
      { label: "Алматы (ЦТО)", value: 64 },
      { label: "Хоргос", value: 44 },
      { label: "Астана", value: 30 },
    ],
    volumes: [
      { label: "Импорт, 2024", value: "12 480 т" },
      { label: "Средняя цена", value: "$3,1 / кг" },
      { label: "Поставок", value: "142" },
      { label: "Контрагентов", value: "23" },
    ],
    anomalies:
      s.risk === "low"
        ? ["Существенных аномалий не выявлено"]
        : ["Резкий рост объёмов в Q2 2024 (+180%)", "Смена основного поставщика"],
    suspicious:
      s.risk === "high"
        ? ["2 сделки с занижением таможенной стоимости", "Транзит через офшорную юрисдикцию"]
        : ["Подозрительных операций не зафиксировано"],
    sanctions:
      s.risk === "high"
        ? ["Один из учредителей — в списке ЕС (требует проверки)"]
        : ["Пересечений с санкционными перечнями не найдено"],
  };
}
