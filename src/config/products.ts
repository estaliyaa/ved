export type Bar = { label: string; value: number };

/** Ячейка таблицы «Справка по товару» — текст или ссылка (НПА, разрешительный документ). */
export type CustomsCell = string | { link: string };
export type CustomsTable = { columns: string[]; rows: CustomsCell[][] };
/** Сворачиваемый подраздел справки (таблицы + примечание). */
export type CustomsSection = {
  id: string;
  title: string;
  tables: CustomsTable[];
  note?: string[];
};

/** Карточка товара в результатах поиска (акцент — код и название). */
export type ProductSummary = {
  hsCode: string;
  name: string;
  brief: string;
  dutyRate: string;
  vatRate: string;
  unit: string;
};

/** Полная страница товара. */
export type ProductDetail = ProductSummary & {
  // 1. Справка по коду
  description: string;
  excise: string;
  restrictions: string[];
  permits: string[];
  labeling: string;
  // 2. Санкционные ограничения
  sanctions: string[];
  sanctionsStats: string;
  sanctionsDocs: string[];
  // 3. ВЭД по товару
  importers: Bar[];
  exporters: Bar[];
  suppliers: Bar[];
  countries: Bar[];
  customsPosts: Bar[];
  yearly: { year: string; value: number }[];
  tradeStats: { label: string; value: string }[];
  // 4. Международный рынок и тарифы
  intlTariffs: { country: string; tariff: string }[];
  importDuties: string;
  protectionMeasures: string[];
  preferences: string[];
  deliveryTerms: { country: string; term: string; days: string; cost: string }[];
  // Заголовок товара
  addUnit: string;
  validFrom: string;
  validTo: string;
  groupNote: string;
  positionNote: string;
  // Справка по товару (импорт / экспорт)
  refImport: CustomsSection[];
  refExport: CustomsSection[];
};

const CATALOG: ProductSummary[] = [
  {
    hsCode: "0902 30 000 0",
    name: "Чай чёрный (ферментированный), в упаковках ≤ 3 кг",
    brief: "Пищевая продукция · фитосанитарный контроль",
    dutyRate: "5%",
    vatRate: "12%",
    unit: "кг",
  },
  {
    hsCode: "0902 10 000 0",
    name: "Чай зелёный (неферментированный), в упаковках ≤ 3 кг",
    brief: "Пищевая продукция · фитосанитарный контроль",
    dutyRate: "5%",
    vatRate: "12%",
    unit: "кг",
  },
  {
    hsCode: "0902 40 000 0",
    name: "Чай чёрный (ферментированный), в упаковках > 3 кг",
    brief: "Оптовая фасовка · пищевая продукция",
    dutyRate: "5%",
    vatRate: "12%",
    unit: "кг",
  },
  {
    hsCode: "2101 20 980 0",
    name: "Экстракты, эссенции и концентраты чая",
    brief: "Готовая продукция на основе чая",
    dutyRate: "6%",
    vatRate: "12%",
    unit: "кг",
  },
  {
    hsCode: "0901 21 000 0",
    name: "Кофе жареный с кофеином",
    brief: "Пищевая продукция · фитосанитарный контроль",
    dutyRate: "8%",
    vatRate: "12%",
    unit: "кг",
  },
  {
    hsCode: "0901 11 000 0",
    name: "Кофе нежареный с кофеином (зелёный)",
    brief: "Сырьё · пищевая продукция",
    dutyRate: "5%",
    vatRate: "12%",
    unit: "кг",
  },
  {
    hsCode: "8471 30 000 0",
    name: "Портативные компьютеры (ноутбуки) массой ≤ 10 кг",
    brief: "Электроника · сертификация ТР ТС",
    dutyRate: "0%",
    vatRate: "12%",
    unit: "шт",
  },
  {
    hsCode: "8517 13 000 0",
    name: "Смартфоны",
    brief: "Электроника · нотификация ФСБ, ТР ТС",
    dutyRate: "0%",
    vatRate: "12%",
    unit: "шт",
  },
];

export function searchProducts(query: string): ProductSummary[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits = CATALOG.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brief.toLowerCase().includes(q) ||
      p.hsCode.toLowerCase().includes(q)
  );
  if (hits.length) return hits;

  // Если в каталоге нет совпадений — показываем подбор по описанию (демо).
  const label = query.trim();
  return [
    {
      hsCode: "0000 00 000 0",
      name: `${label} — наиболее вероятная позиция`,
      brief: "Подбор кода ТН ВЭД по описанию",
      dutyRate: "5%",
      vatRate: "12%",
      unit: "кг",
    },
    {
      hsCode: "0000 00 000 1",
      name: `${label} — альтернативная классификация`,
      brief: "Уточните характеристики для точного кода",
      dutyRate: "7%",
      vatRate: "12%",
      unit: "кг",
    },
  ];
}

export function productByCode(hsCode: string): ProductSummary | undefined {
  return CATALOG.find((p) => p.hsCode === hsCode);
}

const PRODUCT_KEYWORDS: { kw: string[]; code: string }[] = [
  { kw: ["чай зел", "зелёный чай", "зеленый чай"], code: "0902 10 000 0" },
  { kw: ["чай"], code: "0902 30 000 0" },
  { kw: ["кофе"], code: "0901 11 000 0" },
  { kw: ["ноутбук", "компьютер"], code: "8471 30 000 0" },
  { kw: ["смартфон", "телефон"], code: "8517 13 000 0" },
];

/** Найти товар в тексте запроса (по ключевому слову или коду). */
export function findProductInText(text: string): ProductSummary | undefined {
  const t = text.toLowerCase();
  const codeMatch = t.match(/\d{4}\s?\d{2}/);
  if (codeMatch) {
    const digits = codeMatch[0].replace(/\s/g, "");
    const byCode = CATALOG.find((p) =>
      p.hsCode.replace(/\s/g, "").startsWith(digits)
    );
    if (byCode) return byCode;
  }
  for (const e of PRODUCT_KEYWORDS) {
    if (e.kw.some((k) => t.includes(k))) return productByCode(e.code);
  }
  return undefined;
}

const L = (s: string): CustomsCell => ({ link: s });

/** Справка по товару при ввозе (выпуск для внутреннего потребления). */
function buildImportRef(p: ProductSummary): CustomsSection[] {
  const duty = p.dutyRate;
  const vat = p.vatRate;
  return [
    {
      id: "tariffs",
      title: "Импортные тарифные меры",
      tables: [
        {
          columns: ["№", "Ставка ЕТТ", "Нормативно-правовой акт", "Действует с", "Действует до"],
          rows: [["1", duty, L("Решение Совета ЕЭК от 14 сентября 2021 года № 80"), "26.11.2024", "—"]],
        },
        {
          columns: ["№", "Ставка ВТО", "Нормативно-правовой акт", "Действует с", "Действует до"],
          rows: [["1", duty, L("Протокол о присоединении РК к ВТО"), "30.11.2015", "—"]],
        },
      ],
      note: [
        `Ставка ЕТТ: ${duty} · 01.01.2017 — 31.12.2021`,
        `Ставка ВТО: ${duty} · 06.01.2019 — 31.12.2021`,
        "Ставка ВТО: 0% · 24.03.2017 — 31.08.2017",
        "Ставка ВТО: 0% · 01.09.2017 — 30.11.2017",
      ],
    },
    {
      id: "protective",
      title: "Защитные меры",
      tables: [
        {
          columns: ["Ставка", "Нормативно-правовой акт", "Действует с", "Дата изменения", "Действует до"],
          rows: [["28,60%", L("Решение Коллегии ЕЭК от 29 мая 2018 года № 90"), "20.07.2019", "01.01.2022", "19.07.2024"]],
        },
      ],
      note: ["Антидемпинговая пошлина применяется к отдельным странам-производителям."],
    },
    {
      id: "preferences",
      title: "Тарифные преференции",
      tables: [
        {
          columns: ["№", "Страна", "Ставка", "Нормативно-правовой акт", "Действует с", "Действует до"],
          rows: [
            ["1", "Вьетнам", "2,7%", L("Решение Коллегии ЕЭК от 19 апреля 2016 года № 36"), "05.10.2016", "—"],
            ["2", "Развивающиеся страны", "75% от ЕТТ", L("Решение Совета ЕЭК № 8"), "01.01.2021", "—"],
          ],
        },
      ],
      note: ["Для применения преференции требуется сертификат о происхождении формы «А»."],
    },
    {
      id: "vat",
      title: "НДС",
      tables: [
        {
          columns: ["№", "Ставка", "Нормативно-правовой акт", "Действует с", "Действует до"],
          rows: [["1", vat, L("Кодекс Республики Казахстан от 25 декабря 2017 года № 120-VI ЗРК"), "25.12.2017", "—"]],
        },
      ],
      note: ["НДС при ввозе исчисляется на дату регистрации декларации на товары."],
    },
    {
      id: "excise",
      title: "Акциз",
      tables: [
        {
          columns: ["№", "Ставка", "Нормативно-правовой акт", "Описание", "Действует с", "Действует до"],
          rows: [["1", "Не облагается", L("Кодекс Республики Казахстан № 120-VI ЗРК"), "Товар не является подакцизным", "25.12.2017", "—"]],
        },
      ],
      note: ["Перечень подакцизных товаров установлен ст. 462 Налогового кодекса РК."],
    },
    {
      id: "restrictions",
      title: "Запреты и ограничения",
      tables: [
        {
          columns: ["№", "Вид меры", "Разрешительный документ", "Нормативно-правовой акт", "Действует с", "Действует до"],
          rows: [
            ["1", "Техническое регулирование", L("Декларация о соответствии ТР ТС"), L("Решение Коллегии ЕЭК № 28"), "05.12.2023", "—"],
            ["2", "Санитарные меры", L("Свидетельство о государственной регистрации"), L("Решение Комиссии ТС № 299"), "16.10.2018", "—"],
          ],
        },
      ],
      note: ["Перечень подконтрольных товаров утверждён решениями Коллегии ЕЭК."],
    },
    {
      id: "benefits",
      title: "Льготы",
      tables: [
        {
          columns: ["№", "Наименование", "Нормативно-правовой акт", "Действует с", "Действует до"],
          rows: [["1", "Освобождение от НДС для отдельных категорий", L("Кодекс Республики Казахстан № 120-VI ЗРК"), "01.01.2018", "—"]],
        },
      ],
      note: ["Льгота применяется при соблюдении условий целевого использования товара."],
    },
    {
      id: "marking",
      title: "Маркировка",
      tables: [
        {
          columns: ["№", "Вид", "Нормативно-правовой акт", "Действует с", "Действует до"],
          rows: [
            ["1", "Знак обращения на рынке ЕАЭС (EAC)", L("ТР ТС 022/2011"), "15.02.2014", "—"],
            ["2", "Маркировка средствами идентификации", L("Постановление Правительства РК"), "01.09.2021", "—"],
          ],
        },
      ],
      note: ["Маркировка обязательна для выпуска товара в обращение на территории ЕАЭС."],
    },
  ];
}

/** Справка по товару при вывозе (экспорт). */
function buildExportRef(p: ProductSummary): CustomsSection[] {
  void p;
  return [
    {
      id: "tariffs",
      title: "Экспортные тарифные меры",
      tables: [
        {
          columns: ["№", "Ставка вывозной пошлины", "Нормативно-правовой акт", "Действует с", "Действует до"],
          rows: [["1", "Не установлена", L("Перечень вывозных таможенных пошлин"), "01.01.2020", "—"]],
        },
      ],
      note: ["Вывозная таможенная пошлина для данной позиции не установлена."],
    },
    {
      id: "preferences",
      title: "Тарифные преференции",
      tables: [],
      note: ["Тарифные преференции при экспорте не применяются."],
    },
    {
      id: "vat",
      title: "НДС",
      tables: [
        {
          columns: ["№", "Ставка", "Нормативно-правовой акт", "Действует с", "Действует до"],
          rows: [["1", "0% (при подтверждении экспорта)", L("Кодекс Республики Казахстан № 120-VI ЗРК"), "25.12.2017", "—"]],
        },
      ],
      note: ["Нулевая ставка НДС применяется при документальном подтверждении экспорта."],
    },
    {
      id: "restrictions",
      title: "Запреты и ограничения",
      tables: [
        {
          columns: ["№", "Вид меры", "Разрешительный документ", "Нормативно-правовой акт", "Действует с", "Действует до"],
          rows: [["1", "Экспортный контроль", L("Не требуется для данной позиции"), L("Закон РК «Об экспортном контроле»"), "21.07.2007", "—"]],
        },
      ],
      note: ["Проверьте принадлежность товара к спискам контролируемой продукции."],
    },
  ];
}

export function buildProductDetail(p: ProductSummary): ProductDetail {
  return {
    ...p,
    description: `${p.name}. Классификация по единой ТН ВЭД ЕАЭС — код ${p.hsCode}. Раздел содержит сведения для таможенного оформления: применимые ставки, требования и ограничения.`,
    excise: "Не облагается",
    restrictions: [
      "Подлежит таможенному контролю и декларированию",
      "Соответствие техническим регламентам ЕАЭС",
    ],
    permits: [
      "Декларация о соответствии ТР ТС",
      "Сертификат происхождения (при тарифных преференциях)",
    ],
    labeling:
      "Маркировка знаком обращения ЕАЭС (EAC); обязательные сведения на государственном и русском языках.",
    sanctions: [
      "Позиция не входит в санкционные перечни РК и ЕАЭС",
      "Рекомендована проверка контрагентов по спискам OFAC / ЕС",
    ],
    sanctionsStats: "За 2024 год — 0 заблокированных поставок по данной позиции.",
    sanctionsDocs: [
      "Перечни Совета Безопасности ООН",
      "Меры экспортного контроля РК",
      "Регламент (ЕС) 833/2014 — справочно",
    ],
    importers: [
      { label: "ТОО «Глобал Трейд»", value: 41 },
      { label: "ТОО «Алтын Логистик»", value: 33 },
      { label: "ИП Сагынбаев", value: 27 },
      { label: "ТОО «Караван»", value: 19 },
      { label: "ТОО «Шёлковый путь»", value: 14 },
    ],
    exporters: [
      { label: "Global Trade Co.", value: 58 },
      { label: "Orient Export Ltd.", value: 47 },
      { label: "Asia Supply Group", value: 31 },
      { label: "United Traders", value: 24 },
      { label: "Prime Exporters", value: 18 },
    ],
    suppliers: [
      { label: "Eastern Sourcing", value: 36 },
      { label: "Silk Road Supply", value: 29 },
      { label: "Continental Goods", value: 22 },
      { label: "Pacific Vendors", value: 17 },
    ],
    countries: [
      { label: "Индия", value: 64 },
      { label: "Китай", value: 51 },
      { label: "Турция", value: 38 },
      { label: "Вьетнам", value: 29 },
      { label: "Иран", value: 22 },
    ],
    customsPosts: [
      { label: "Алматы (ЦТО)", value: 64 },
      { label: "Астана", value: 51 },
      { label: "Хоргос", value: 44 },
      { label: "Шымкент", value: 30 },
      { label: "Достык", value: 21 },
    ],
    yearly: [
      { year: "2019", value: 31 },
      { year: "2020", value: 38 },
      { year: "2021", value: 42 },
      { year: "2022", value: 49 },
      { year: "2023", value: 58 },
      { year: "2024", value: 41 },
    ],
    tradeStats: [
      { label: "Объём импорта, 2024", value: "12 480 т" },
      { label: "Сумма импорта", value: "$38.6 млн" },
      { label: "Средняя цена", value: "$3.1 / кг" },
      { label: "Оформлено поставок", value: "1 284" },
    ],
    intlTariffs: [
      { country: "ЕАЭС", tariff: "5%" },
      { country: "Евросоюз", tariff: "0–3.2%" },
      { country: "США", tariff: "0%" },
      { country: "Китай", tariff: "15%" },
    ],
    importDuties:
      "Ставка ввозной таможенной пошлины по ЕТТ ЕАЭС — 5%. НДС при ввозе — 12%. Для отдельных стран действуют тарифные преференции.",
    protectionMeasures: [
      "Антидемпинговые меры не применяются",
      "Специальные защитные меры отсутствуют",
      "Тарифная квота не установлена",
    ],
    preferences: [
      "Развивающиеся страны (РС) — 75% базовой ставки",
      "Наименее развитые страны (НРС) — 0%",
      "Требуется сертификат происхождения формы «А»",
    ],
    deliveryTerms: [
      { country: "Индия", term: "FOB Калькутта", days: "28–35", cost: "$0.18/кг" },
      { country: "Китай", term: "FCA Иу", days: "12–18", cost: "$0.14/кг" },
      { country: "Турция", term: "FOB Стамбул", days: "14–20", cost: "$0.16/кг" },
      { country: "Вьетнам", term: "FOB Хайфон", days: "30–38", cost: "$0.20/кг" },
    ],
    addUnit: p.unit === "шт" ? "—" : "л",
    validFrom: "05.10.2016",
    validTo: "—",
    groupNote: "Пояснение к группе",
    positionNote: "Пояснение к позиции",
    refImport: buildImportRef(p),
    refExport: buildExportRef(p),
  };
}
