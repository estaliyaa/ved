export type DeclField = {
  id: string;
  box: string; // № графы ДТ
  label: string;
  value: string;
  required: boolean;
  hint?: string;
};

export type ValStatus = "ok" | "warn" | "risk";

export type ValItem = {
  status: ValStatus;
  label: string;
  detail: string;
};

export type Validation = {
  completion: number; // % заполнения обязательных граф
  filled: number;
  total: number;
  ready: boolean;
  items: ValItem[];
  suggestions: string[];
};

export const initialFields: DeclField[] = [
  { id: "type", box: "1", label: "Тип декларации", value: "ИМ 40", required: true },
  { id: "consignee", box: "8", label: "Получатель", value: "ТОО «Алтын Логистик», БИН 010203400567", required: true },
  { id: "declarant", box: "14", label: "Декларант", value: "ТОО «Алтын Логистик»", required: true },
  { id: "tradeCountry", box: "11", label: "Торгующая страна", value: "Индия", required: true },
  { id: "terms", box: "20", label: "Условия поставки (Incoterms)", value: "", required: true, hint: "Например, FOB Нава-Шева" },
  { id: "currency", box: "22", label: "Валюта и общая сумма", value: "USD 48 500", required: true },
  { id: "desc", box: "31", label: "Описание товара", value: "Чай чёрный фасованный, 5 000 кг", required: true },
  { id: "code", box: "33", label: "Код ТН ВЭД", value: "0902 30 000 0", required: true, hint: "10 знаков" },
  { id: "origin", box: "34", label: "Страна происхождения", value: "Индия", required: true },
  { id: "price", box: "42", label: "Цена товара", value: "48 500", required: true },
  { id: "docs", box: "44", label: "Разрешительные документы", value: "", required: true, hint: "Сертификаты, лицензии, СТ-1" },
  { id: "payments", box: "47", label: "Исчисление платежей", value: "Пошлина, НДС, сбор", required: false },
];

const CODE_RE = /^\d{4}\s?\d{2}\s?\d{3}\s?\d$/;

export function validate(fields: DeclField[]): Validation {
  const required = fields.filter((f) => f.required);
  const filled = required.filter((f) => f.value.trim().length > 0);
  const completion = Math.round((filled.length / required.length) * 100);

  const items: ValItem[] = [];
  const suggestions: string[] = [];

  // Обязательные поля
  const empty = required.filter((f) => f.value.trim().length === 0);
  if (empty.length === 0) {
    items.push({ status: "ok", label: "Обязательные графы", detail: "Все обязательные графы заполнены." });
  } else {
    items.push({
      status: "risk",
      label: "Обязательные графы",
      detail: `Не заполнено: ${empty.map((f) => `гр. ${f.box} ${f.label}`).join(", ")}.`,
    });
    for (const f of empty) suggestions.push(`Заполните графу ${f.box} «${f.label}».`);
  }

  // Код ТН ВЭД
  const code = fields.find((f) => f.id === "code");
  if (code && code.value.trim()) {
    if (CODE_RE.test(code.value.trim())) {
      items.push({ status: "ok", label: "Код ТН ВЭД", detail: "Формат кода корректен (10 знаков)." });
    } else {
      items.push({ status: "warn", label: "Код ТН ВЭД", detail: "Код должен содержать 10 знаков (ХХХХ ХХ ХХХ Х)." });
      suggestions.push("Проверьте код ТН ВЭД — нужно 10 знаков.");
    }
  } else {
    items.push({ status: "risk", label: "Код ТН ВЭД", detail: "Код не указан." });
  }

  // Разрешительные документы
  const docs = fields.find((f) => f.id === "docs");
  if (docs && docs.value.trim()) {
    items.push({ status: "ok", label: "Разрешительные документы", detail: "Документы указаны в графе 44." });
  } else {
    items.push({ status: "warn", label: "Разрешительные документы", detail: "Графа 44 пуста — проверьте необходимость сертификатов/лицензий." });
    suggestions.push("Добавьте разрешительные документы (СТ-1, сертификаты) в графу 44.");
  }

  // Условия поставки
  const terms = fields.find((f) => f.id === "terms");
  if (terms && !terms.value.trim()) {
    suggestions.push("Укажите условия поставки (Incoterms) — влияет на таможенную стоимость.");
  }

  const ready = empty.length === 0 && items.every((i) => i.status !== "risk");
  if (ready) {
    items.push({ status: "ok", label: "Готовность к подаче", detail: "Декларация прошла предварительную проверку." });
  } else {
    items.push({ status: "warn", label: "Готовность к подаче", detail: "Устраните замечания перед подачей." });
  }

  return { completion, filled: filled.length, total: required.length, ready, items, suggestions };
}
