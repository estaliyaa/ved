"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { scenarioById, scenarios } from "@/config/scenarios";

export type ChatRole = "user" | "assistant";

export type Message = {
  id: string;
  role: ChatRole;
  content: string;
};

export type Bar = { label: string; value: number };

/** Полная карточка товара — раскрывается справа, когда товар определён. */
export type ProductDetail = {
  name: string;
  hsCode: string;
  dutyRate: string;
  vatRate: string;
  period: string;
  summary: string;
  note?: string;
  topCountries: Bar[];
  topImporters: Bar[];
  yearly: { year: string; value: number }[];
  shipments: { title: string; meta: string; kind: "import" | "export" }[];
};

export type Conversation = {
  id: string;
  title: string;
  scenarioId?: string;
  pinned?: boolean;
  detail?: ProductDetail;
  messages: Message[];
};

/** Построить карточку товара (демо-данные) по описанию из запроса. */
export function buildProductDetail(name: string): ProductDetail {
  const clean = name.trim().length > 48 ? `${name.trim().slice(0, 48)}…` : name.trim();
  return {
    name: clean || "Товар",
    hsCode: "0902",
    dutyRate: "5%",
    vatRate: "12%",
    period: "2019–2024",
    summary: `Определил товар: «${clean || "Товар"}». Подобрал код ТН ВЭД, ставки пошлины и НДС, статистику импорта и топ стран-поставщиков. Полная карточка — справа. Уточните параметры запросом слева или выберите действие ниже.`,
    note: "Данные приблизительные и приведены для демонстрации. Точные ставки и статистика появятся после подключения источников.",
    topCountries: [
      { label: "Индия", value: 64 },
      { label: "Кения", value: 51 },
      { label: "Шри-Ланка", value: 38 },
      { label: "Китай", value: 29 },
      { label: "Вьетнам", value: 22 },
    ],
    topImporters: [
      { label: "ТОО «Чай-Импорт»", value: 41 },
      { label: "ТОО «Алтын Логистик»", value: 33 },
      { label: "ИП Сагынбаев", value: 27 },
      { label: "ТОО «Караван»", value: 19 },
      { label: "ТОО «Шёлковый путь»", value: 14 },
    ],
    yearly: [
      { year: "2019", value: 31 },
      { year: "2020", value: 38 },
      { year: "2021", value: 42 },
      { year: "2022", value: 49 },
      { year: "2023", value: 58 },
      { year: "2024", value: 41 },
    ],
    shipments: [
      {
        title: "Чай чёрный байховый, 18 т",
        meta: "Индия → Алматы · 12.03.2024 · ИМ-40",
        kind: "import",
      },
      {
        title: "Чай зелёный, 9 т",
        meta: "Китай → Астана · 28.01.2024 · ИМ-40",
        kind: "import",
      },
      {
        title: "Чай в пакетиках, 4 т",
        meta: "Шри-Ланка → Шымкент · 14.11.2023 · ИМ-40",
        kind: "import",
      },
      {
        title: "Реэкспорт чая, 6 т",
        meta: "Алматы → Бишкек · 03.10.2023 · ЭК-10",
        kind: "export",
      },
      {
        title: "Чай травяной, 2 т",
        meta: "Кения → Караганда · 21.08.2023 · ИМ-40",
        kind: "import",
      },
    ],
  };
}

const DEMO_REPLY =
  "Это демонстрационный интерфейс. Маршрутизация запроса к источникам данных и инструментам ВЭД будет подключена позже — здесь появится ответ ассистента.";

/** Задержка, имитирующая «печатает…» ассистента, мс. */
const TYPING_DELAY = 700;

let idCounter = 0;
function uid(prefix: string) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

/** Стартовая история чатов (демо-данные). */
function seedConversations(): Conversation[] {
  const opening = (scenarioId: string) =>
    scenarioById(scenarioId)?.opening ?? "";
  return [
    {
      id: "seed-tea",
      title: "Импорт чая из Индии",
      scenarioId: "product-analysis",
      detail: buildProductDetail("Чай чёрный, Индия"),
      messages: [
        { id: "m1", role: "user", content: "Хочу импортировать чай из Индии" },
        { id: "m2", role: "assistant", content: opening("product-analysis") },
      ],
    },
    {
      id: "seed-importer",
      title: "Проверка ТОО «Алтын Логистик»",
      scenarioId: "importer-check",
      pinned: true,
      messages: [
        { id: "m3", role: "assistant", content: opening("importer-check") },
      ],
    },
    {
      id: "seed-calc",
      title: "Пошлина на кофемашины из Китая",
      scenarioId: "calculator",
      messages: [
        { id: "m4", role: "assistant", content: opening("calculator") },
      ],
    },
    {
      id: "seed-svh",
      title: "СВХ в Алматы",
      scenarioId: "customs-infrastructure",
      messages: [
        {
          id: "m5",
          role: "assistant",
          content: opening("customs-infrastructure"),
        },
      ],
    },
    {
      id: "seed-container",
      title: "Контейнер GVDU2017934",
      scenarioId: "container-tracking",
      pinned: true,
      messages: [
        { id: "m6", role: "assistant", content: opening("container-tracking") },
      ],
    },
    {
      id: "seed-map",
      title: "Мастер импорта: текстиль",
      scenarioId: "import-map",
      messages: [
        { id: "m7", role: "assistant", content: opening("import-map") },
      ],
    },
  ];
}

type ChatContextValue = {
  conversations: Conversation[];
  activeId: string | null;
  activeConversation: Conversation | null;
  /** id чата, в котором ассистент сейчас «печатает». */
  typingIn: string | null;
  newChat: () => void;
  selectConversation: (id: string) => void;
  startScenario: (scenarioId: string) => void;
  sendMessage: (text: string) => void;
  togglePin: (id: string) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(
    seedConversations
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [typingIn, setTypingIn] = useState<string | null>(null);

  /** Добавить ответ ассистента с задержкой «печатает…». */
  const replyAfterDelay = useCallback((conversationId: string, content: string) => {
    setTypingIn(conversationId);
    setTimeout(() => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  { id: uid("msg"), role: "assistant", content },
                ],
              }
            : c
        )
      );
      setTypingIn((current) =>
        current === conversationId ? null : current
      );
    }, TYPING_DELAY);
  }, []);

  const newChat = useCallback(() => setActiveId(null), []);

  const selectConversation = useCallback((id: string) => setActiveId(id), []);

  const togglePin = useCallback((id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c))
    );
  }, []);

  const startScenario = useCallback(
    (scenarioId: string) => {
      const scenario = scenarios.find((s) => s.id === scenarioId);
      if (!scenario) return;
      const conversation: Conversation = {
        id: uid("chat"),
        title: scenario.title,
        scenarioId,
        messages: [],
      };
      setConversations((prev) => [conversation, ...prev]);
      setActiveId(conversation.id);
      replyAfterDelay(conversation.id, scenario.opening);
    },
    [replyAfterDelay]
  );

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMsg: Message = {
        id: uid("msg"),
        role: "user",
        content: trimmed,
      };

      if (activeId) {
        const conv = conversations.find((c) => c.id === activeId);
        // Товар определяется по описанию из запроса в сценарии «Анализ товара».
        const attach =
          conv?.scenarioId === "product-analysis" && !conv.detail;
        const detail = attach ? buildProductDetail(trimmed) : undefined;

        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeId
              ? {
                  ...c,
                  messages: [...c.messages, userMsg],
                  ...(detail ? { detail } : {}),
                }
              : c
          )
        );
        replyAfterDelay(activeId, detail ? detail.summary : DEMO_REPLY);
        return;
      }

      const newId = uid("chat");
      const conversation: Conversation = {
        id: newId,
        title: trimmed.length > 40 ? `${trimmed.slice(0, 40)}…` : trimmed,
        messages: [userMsg],
      };
      setConversations((prev) => [conversation, ...prev]);
      setActiveId(newId);
      replyAfterDelay(newId, DEMO_REPLY);
    },
    [activeId, conversations, replyAfterDelay]
  );

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId]
  );

  const value = useMemo(
    () => ({
      conversations,
      activeId,
      activeConversation,
      typingIn,
      newChat,
      selectConversation,
      startScenario,
      sendMessage,
      togglePin,
    }),
    [
      conversations,
      activeId,
      activeConversation,
      typingIn,
      newChat,
      selectConversation,
      startScenario,
      sendMessage,
      togglePin,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
