"use client";

import { useCallback, useState } from "react";

import {
  buildProductDetail,
  findProductInText,
  type ProductDetail,
} from "@/config/products";

export type Role = "user" | "assistant";
export type Bar = { label: string; value: number };

export type TrackingData = {
  number: string;
  carrier: string;
  product: string;
  status: string;
  from: string;
  to: string;
  progress: number;
  vessel: string;
  eta: string;
  steps: { port: string; note: string; date: string; done: boolean }[];
};

export type CompanyData = {
  name: string;
  bin: string;
  status: string;
  risk: { label: string; level: "low" | "mid" | "high" };
  stats: { label: string; value: string }[];
  trend: number[];
  countries: string[];
  structure: Bar[];
  factors: string[];
};

export type DocumentsData = {
  product: string;
  base: string[];
  permits: { label: string; warn?: boolean }[];
};

export type Cta = {
  label: string;
  sub: string;
  moduleId?: string;
  question?: string;
};

export type MessageKind =
  | "text"
  | "tracking"
  | "company"
  | "documents"
  | "restrictions";

export type AssistantMessage = {
  id: string;
  role: Role;
  kind: MessageKind;
  badge?: string;
  content?: string;
  followups?: string[];
  cta?: Cta;
  tracking?: TrackingData;
  company?: CompanyData;
  documents?: DocumentsData;
};

const TYPING_DELAY = 700;

let idc = 0;
const uid = () => `m-${(idc += 1)}`;

const user = (content: string): AssistantMessage => ({
  id: uid(),
  role: "user",
  kind: "text",
  content,
});

// ---- mock data builders -----------------------------------------------------

function trackingData(text: string): TrackingData {
  const m = text.toUpperCase().match(/[A-Z]{4}\d{7}/);
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
      { port: "Нава-Шева (INNSA)", note: "Погрузка на судно", date: "02 июн. 2026 г.", done: true },
      { port: "Бандар-Аббас (IRBND)", note: "Перевалка", date: "14 июн. 2026 г.", done: true },
      { port: "Актау (KZAKT)", note: "Прибытие в порт", date: "26 июн. 2026 г.", done: false },
      { port: "Алматы (ЦТО)", note: "Таможенное оформление", date: "04 июл. 2026 г.", done: false },
    ],
  };
}

function companyData(text: string): CompanyData {
  const q = text.match(/«([^»]+)»|"([^"]+)"/);
  return {
    name: q ? `ТОО «${q[1] ?? q[2]}»` : "ТОО «Чайный Дом Алматы»",
    bin: "010540004771",
    status: "Действующая",
    risk: { label: "Низкий риск", level: "low" },
    stats: [
      { label: "Регион", value: "г. Алматы" },
      { label: "Оборот (12 мес.)", value: "$4,8 млн" },
      { label: "Поставок", value: "142" },
      { label: "Регистрация", value: "12 мар. 2009 г." },
    ],
    trend: [30, 42, 36, 54, 46, 70, 58],
    countries: ["Индия", "Шри-Ланка", "Кения"],
    structure: [
      { label: "Чай чёрный фасованный", value: 68 },
      { label: "Чай зелёный", value: 22 },
      { label: "Кофе жареный", value: 10 },
    ],
    factors: [
      "Стабильная история поставок более 10 лет",
      "Нет записей в санкционных перечнях",
    ],
  };
}

function documentsData(text: string): DocumentsData {
  const t = text.toLowerCase();
  const product = t.includes("оборудован")
    ? "Оборудование пищевое промышленное"
    : t.includes("чай")
      ? "Чай чёрный фасованный"
      : "Товар по коду ТН ВЭД";
  return {
    product,
    base: [
      "Внешнеторговый контракт",
      "Инвойс (счёт-фактура)",
      "Упаковочный лист",
      "Транспортные документы (CMR / коносамент / авианакладная)",
      "Документы, подтверждающие таможенную стоимость",
      "Сертификат происхождения (при тарифных преференциях)",
    ],
    permits: [{ label: "Сертификат соответствия ТР ТС 010/2011", warn: true }],
  };
}

// ---- intent + answers -------------------------------------------------------

function detect(text: string): MessageKind | "product" | "generic" {
  const t = text.toLowerCase();
  if (/[a-z]{4}\d{7}|контейнер|отслед|трек/i.test(t)) return "tracking";
  if (/проверь|проверить|контрагент|компани|тоо|участник вэд|надёжн|надежн|бин\b/.test(t))
    return "company";
  if (/документ/.test(t)) return "documents";
  if (/санкц|ограничен|запрет|эмбарго/.test(t)) return "restrictions";
  if (findProductInText(t)) return "product";
  return "generic";
}

const FOLLOWUPS: Record<string, string[]> = {
  tracking: ["Рассчитать платежи по этому грузу", "Какие документы нужны?"],
  company: ["Показать импорт компании", "Проверить другого контрагента"],
  documents: ["Рассчитать платежи", "Проверить ограничения"],
  restrictions: [
    "Есть ли ограничения на экспорт электроники?",
    "Санкции по автомобилям",
  ],
  generic: ["Подобрать код ТН ВЭД", "Проверить контрагента", "Отследить контейнер"],
};

/** Развёрнутый ответ для ИИ Чата (карточки, метрики). */
function buildChatAnswer(text: string): AssistantMessage {
  const kind = detect(text);

  if (kind === "tracking") {
    const data = trackingData(text);
    return {
      id: uid(),
      role: "assistant",
      kind: "tracking",
      badge: "Отслеживание контейнера",
      content: `Контейнер ${data.number} (${data.carrier}). Маршрут ${data.from} → ${data.to}.`,
      tracking: data,
      followups: FOLLOWUPS.tracking,
    };
  }
  if (kind === "company") {
    return {
      id: uid(),
      role: "assistant",
      kind: "company",
      badge: "Проверка участника ВЭД",
      content:
        "Нашёл компанию по запросу. Ниже — регистрационные данные, активность во внешней торговле и оценка рисков.",
      company: companyData(text),
      followups: FOLLOWUPS.company,
    };
  }
  if (kind === "documents") {
    const data = documentsData(text);
    return {
      id: uid(),
      role: "assistant",
      kind: "documents",
      badge: "Документы для оформления",
      content: `Базовый комплект документов для импорта и разрешительные документы для товара «${data.product}».`,
      documents: data,
      followups: FOLLOWUPS.documents,
    };
  }
  if (kind === "restrictions") {
    return {
      id: uid(),
      role: "assistant",
      kind: "restrictions",
      badge: "Проверка ограничений",
      content:
        "Уточните товар — я проверю санкционные ограничения и меры регулирования по коду ТН ВЭД.",
      cta: {
        label: "Открыть «Санкционные ограничения»",
        sub: "Поиск ограничений по коду ТН ВЭД и странам",
        moduleId: "product-analysis",
      },
      followups: FOLLOWUPS.restrictions,
    };
  }
  // generic / product handled by caller
  return {
    id: uid(),
    role: "assistant",
    kind: "text",
    content:
      "Разберу запрос по данным платформы: код ТН ВЭД, пошлины и НДС, ограничения, статистику и документы. Уточните товар или задачу.",
    followups: FOLLOWUPS.generic,
  };
}

/** Короткий ответ для всплывающего ассистента. */
function buildPopupAnswer(text: string): AssistantMessage {
  const kind = detect(text);
  const teaser: Record<string, string> = {
    tracking:
      "Отслежу контейнер: маршрут, порты, статусы и дату прибытия. Подробная карточка — в ИИ Чате.",
    company:
      "Проверю компанию: реквизиты, ВЭД-активность и риски. Полная карточка — в ИИ Чате.",
    documents:
      "Подскажу комплект документов для оформления. Детальный список — в ИИ Чате.",
    restrictions:
      "Проверю санкции и ограничения по коду ТН ВЭД. Подробности — в ИИ Чате.",
    product:
      "Покажу карточку товара: код ТН ВЭД, пошлины, ограничения и статистику. Подробно — в ИИ Чате.",
  };

  if (kind in teaser) {
    return {
      id: uid(),
      role: "assistant",
      kind: "text",
      content: teaser[kind],
      cta: {
        label: "Открыть в ИИ Чате",
        sub: "Подробный ответ с данными",
        question: text,
      },
    };
  }

  // простой ответ прямо в попапе
  return {
    id: uid(),
    role: "assistant",
    kind: "text",
    content:
      "Готов помочь. Спросите, например: «Отследить контейнер», «Проверить контрагента» или «Какие документы нужны для импорта» — отвечу с данными в ИИ Чате.",
  };
}

const POPUP_GREETING: AssistantMessage = {
  id: "pg",
  role: "assistant",
  kind: "text",
  content: "Здравствуйте! Чем могу помочь по ВЭД?",
};

export function useAssistant({
  onOpenChat,
}: {
  onOpenChat: () => void;
}) {
  const [popupMessages, setPopupMessages] = useState<AssistantMessage[]>([
    POPUP_GREETING,
  ]);
  const [chatMessages, setChatMessages] = useState<AssistantMessage[]>([]);
  const [popupTyping, setPopupTyping] = useState(false);
  const [chatTyping, setChatTyping] = useState(false);
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(null);

  const askInChat = useCallback((text: string) => {
    const t = text.trim();
    if (!t) return;
    setChatMessages((prev) => [...prev, user(t)]);

    const product = findProductInText(t);
    setChatTyping(true);
    setTimeout(() => {
      if (product && detect(t) !== "tracking" && detect(t) !== "company") {
        setProductDetail(buildProductDetail(product));
        setChatMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "assistant",
            kind: "text",
            badge: "Анализ товара",
            content: `Открыл карточку товара «${product.name}» (${product.hsCode}) — полная информация в панели справа.`,
            followups: ["Документы для импорта", "Рассчитать платежи", "Проверить ограничения"],
          },
        ]);
      } else {
        setChatMessages((prev) => [...prev, buildChatAnswer(t)]);
      }
      setChatTyping(false);
    }, TYPING_DELAY);
  }, []);

  const askFromPopup = useCallback((text: string) => {
    const t = text.trim();
    if (!t) return;
    setPopupMessages((prev) => [...prev, user(t)]);
    setPopupTyping(true);
    setTimeout(() => {
      setPopupMessages((prev) => [...prev, buildPopupAnswer(t)]);
      setPopupTyping(false);
    }, TYPING_DELAY);
  }, []);

  const escalate = useCallback(
    (question: string) => {
      onOpenChat();
      askInChat(question);
    },
    [onOpenChat, askInChat]
  );

  const closeProduct = useCallback(() => setProductDetail(null), []);

  const resetChat = useCallback(() => {
    setChatMessages([]);
    setChatTyping(false);
    setProductDetail(null);
  }, []);

  return {
    popupMessages,
    chatMessages,
    popupTyping,
    chatTyping,
    productDetail,
    askFromPopup,
    askInChat,
    escalate,
    closeProduct,
    resetChat,
  };
}
