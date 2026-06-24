export type TrackStatus = "done" | "current" | "pending";

export type TrackStep = {
  port: string;
  code: string;
  note: string;
  date: string;
  status: TrackStatus;
  x: number; // % на карте
  y: number;
};

export type Tracking = {
  number: string;
  carrier: string;
  product: string;
  status: string;
  from: string;
  to: string;
  progress: number;
  vessel: string;
  eta: string;
  steps: TrackStep[];
};

export function buildTracking(input: string): Tracking {
  const m = input.toUpperCase().match(/[A-Z]{4}\d{7}/);
  return {
    number: m ? m[0] : "MSCU7263514",
    carrier: "MSC",
    product: "Чай чёрный фасованный (0902 30)",
    status: "В пути",
    from: "Нава-Шева, Индия",
    to: "Алматы, Казахстан",
    progress: 62,
    vessel: "MSC ISTANBUL",
    eta: "04 июл. 2026 г.",
    steps: [
      { port: "Нава-Шева (INNSA)", code: "INNSA", note: "Погрузка на судно", date: "02 июн. 2026 г.", status: "done", x: 72, y: 78 },
      { port: "Бандар-Аббас (IRBND)", code: "IRBND", note: "Перевалка", date: "14 июн. 2026 г.", status: "done", x: 52, y: 58 },
      { port: "Актау (KZAKT)", code: "KZAKT", note: "Прибытие в порт", date: "26 июн. 2026 г.", status: "current", x: 34, y: 40 },
      { port: "Алматы (ЦТО)", code: "ALA", note: "Таможенное оформление", date: "04 июл. 2026 г.", status: "pending", x: 64, y: 34 },
    ],
  };
}
