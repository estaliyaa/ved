export const procedures = [
  "Выпуск для внутреннего потребления",
  "Экспорт",
  "Таможенный транзит",
  "Таможенный склад",
  "Реимпорт",
];

export const countries = [
  "Австралия",
  "Китай",
  "Индия",
  "Турция",
  "Германия",
  "ОАЭ",
  "Россия",
  "Узбекистан",
  "США",
];

export const currencies = ["KZT", "USD", "EUR", "CNY", "RUB"];

export const VAT_RATE = 0.12;
export const CUSTOMS_FEE = 25_000; // сбор за оформление, ₸

export type CalcItem = {
  id: number;
  name: string;
  code: string;
  price: string; // таможенная стоимость единицы
  qty: string;
  dutyRate: string; // %
  exciseRate: string; // %
};

export type CalcLine = {
  id: number;
  name: string;
  customsValue: number;
  duty: number;
  excise: number;
  vat: number;
  total: number;
};

export type CalcResult = {
  lines: CalcLine[];
  customsValue: number;
  duty: number;
  excise: number;
  vat: number;
  fee: number;
  payments: number; // пошлина + акциз + НДС + сбор
  total: number; // стоимость + платежи
};

export function emptyItem(id: number): CalcItem {
  return { id, name: "", code: "", price: "", qty: "1", dutyRate: "5", exciseRate: "0" };
}

/** Демо-расчёт таможенных платежей (упрощённая модель, без конвертации валют). */
export function calculate(items: CalcItem[]): CalcResult {
  const lines: CalcLine[] = items.map((i) => {
    const customsValue = (Number(i.price) || 0) * (Number(i.qty) || 0);
    const duty = customsValue * ((Number(i.dutyRate) || 0) / 100);
    const excise = customsValue * ((Number(i.exciseRate) || 0) / 100);
    const vat = (customsValue + duty + excise) * VAT_RATE;
    return {
      id: i.id,
      name: i.name || "Без названия",
      customsValue,
      duty,
      excise,
      vat,
      total: customsValue + duty + excise + vat,
    };
  });

  const customsValue = lines.reduce((s, l) => s + l.customsValue, 0);
  const duty = lines.reduce((s, l) => s + l.duty, 0);
  const excise = lines.reduce((s, l) => s + l.excise, 0);
  const vat = lines.reduce((s, l) => s + l.vat, 0);
  const fee = lines.length ? CUSTOMS_FEE : 0;
  const payments = duty + excise + vat + fee;
  return {
    lines,
    customsValue,
    duty,
    excise,
    vat,
    fee,
    payments,
    total: customsValue + payments,
  };
}

export function formatKzt(n: number): string {
  return `${Math.round(n).toLocaleString("ru-RU")} ₸`;
}
