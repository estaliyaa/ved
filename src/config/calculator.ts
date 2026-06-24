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

export const itemTypes = ["Товар", "Сырьё", "Оборудование", "Комплектующие"];

export const currencies = ["KZT", "USD", "EUR", "CNY", "RUB"];

export type CalcItem = {
  id: number;
  name: string;
  code: string;
  country: string;
  price: string;
  type: string;
  currency: string;
};

export type CalcResult = {
  customsValue: number;
  duty: number;
  fee: number;
  vat: number;
  totalPayments: number;
  totalDue: number;
};

/** Демо-расчёт платежей по списку товаров (упрощённая модель). */
export function calculate(items: CalcItem[]): CalcResult {
  const customsValue = items.reduce(
    (sum, i) => sum + (Number(i.price) || 0),
    0
  );
  const duty = customsValue * 0.05; // пошлина 5%
  const fee = items.length ? 20000 : 0; // таможенный сбор
  const vat = (customsValue + duty) * 0.12; // НДС 12%
  const totalPayments = duty + fee + vat;
  const totalDue = customsValue + totalPayments;
  return { customsValue, duty, fee, vat, totalPayments, totalDue };
}

export function formatKzt(n: number): string {
  return `${Math.round(n).toLocaleString("ru-RU")} ₸`;
}
