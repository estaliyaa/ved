export type CheckStatus = "ok" | "warn" | "risk";

export type Finding = {
  status: CheckStatus;
  title: string;
  detail: string;
};

export type AuditSection = {
  id: string;
  title: string;
  status: CheckStatus;
  summary: string;
  findings: Finding[];
};

export type Audit = {
  subject: string;
  type: string;
  score: number; // 0–100, индекс риска (больше = выше риск)
  level: CheckStatus;
  passed: number;
  warnings: number;
  risks: number;
  sections: AuditSection[];
  recommendations: string[];
};

export function buildAudit(input: string): Audit {
  const subject = input.trim() || "ТОО «Алтын Логистик»";
  const sections: AuditSection[] = [
    {
      id: "documents",
      title: "Анализ документов",
      status: "warn",
      summary: "Комплект почти полный — не хватает 1 документа.",
      findings: [
        { status: "ok", title: "Инвойс и упаковочный лист", detail: "Соответствуют, расхождений нет." },
        { status: "ok", title: "Контракт и спецификация", detail: "Условия поставки совпадают с ДТ." },
        { status: "warn", title: "Сертификат происхождения (СТ-1)", detail: "Не приложен — нужен для подтверждения преференции." },
      ],
    },
    {
      id: "tnved",
      title: "Корректность ТН ВЭД",
      status: "risk",
      summary: "Код вероятно занижает ставку пошлины.",
      findings: [
        { status: "risk", title: "Код 8704 21 → ожидается 8704 22", detail: "По массе ТС классификация занижает пошлину на ~5%." },
        { status: "ok", title: "Описание товара", detail: "Совпадает с товаросопроводительными документами." },
      ],
    },
    {
      id: "value",
      title: "Таможенная стоимость",
      status: "warn",
      summary: "Стоимость ниже профиля риска по группе.",
      findings: [
        { status: "warn", title: "Отклонение от индекса", detail: "Заявленная стоимость на 18% ниже средней по 8704." },
        { status: "ok", title: "Метод определения", detail: "Метод 1 (по стоимости сделки) применён корректно." },
        { status: "warn", title: "Транспортные расходы", detail: "Фрахт до границы не включён в таможенную стоимость." },
      ],
    },
    {
      id: "payments",
      title: "Таможенные платежи",
      status: "warn",
      summary: "Пересчёт меняет сумму платежей.",
      findings: [
        { status: "warn", title: "Пошлина", detail: "При верном коде пошлина выше на ~1,2 млн ₸." },
        { status: "ok", title: "НДС 12%", detail: "Рассчитан корректно от налоговой базы." },
        { status: "ok", title: "Таможенный сбор", detail: "Соответствует тарифу." },
      ],
    },
    {
      id: "restrictions",
      title: "Соблюдение ограничений",
      status: "ok",
      summary: "Запретов и санкционных рисков не выявлено.",
      findings: [
        { status: "ok", title: "Санкционные списки", detail: "Контрагент и товар не значатся в ограничениях." },
        { status: "ok", title: "Лицензии и квоты", detail: "Для товара не требуются." },
      ],
    },
    {
      id: "violations",
      title: "Потенциальные нарушения",
      status: "risk",
      summary: "Есть признаки занижения платежей.",
      findings: [
        { status: "risk", title: "Недостоверное декларирование", detail: "Сочетание кода и стоимости — типовой профиль риска КоАП." },
        { status: "warn", title: "Неполный комплект документов", detail: "Отсутствие СТ-1 может привести к доначислению." },
      ],
    },
  ];

  let passed = 0;
  let warnings = 0;
  let risks = 0;
  for (const s of sections) {
    for (const f of s.findings) {
      if (f.status === "ok") passed++;
      else if (f.status === "warn") warnings++;
      else risks++;
    }
  }

  return {
    subject,
    type: "Компания · последняя поставка",
    score: 64,
    level: "warn",
    passed,
    warnings,
    risks,
    sections,
    recommendations: [
      "Пересмотреть код ТН ВЭД 8704 21 → 8704 22 и доплатить разницу до проверки.",
      "Приложить сертификат происхождения СТ-1 либо отказаться от преференции.",
      "Включить фрахт до границы в таможенную стоимость.",
      "Подготовить обоснование стоимости (прайс-лист, экспортная декларация).",
      "Провести добровольную корректировку ДТ до выпуска для снижения риска КоАП.",
    ],
  };
}
