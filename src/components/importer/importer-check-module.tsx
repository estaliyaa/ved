"use client";

import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Building2,
  ChevronRight,
  Clock,
  Globe,
  Search,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";

import {
  BarList,
  BulletList,
  KeyValueList,
  SectionCard,
  StatCard,
  SubTitle,
  TagList,
  YearBars,
} from "@/components/product/data-bits";
import { Button } from "@/components/ui/button";
import {
  buildImporterProfile,
  riskLabel,
  searchImporters,
  type ImporterProfile,
  type ImporterSummary,
} from "@/config/importers";
import { cn } from "@/lib/utils";

const RISK_CLASS: Record<ImporterSummary["risk"], string> = {
  low: "bg-emerald-50 text-emerald-600",
  mid: "bg-amber-50 text-amber-600",
  high: "bg-red-50 text-red-600",
};
const RISK_DOT: Record<ImporterSummary["risk"], string> = {
  low: "bg-emerald-500",
  mid: "bg-amber-500",
  high: "bg-red-500",
};

function RiskBadge({ risk }: { risk: ImporterSummary["risk"] }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
        RISK_CLASS[risk]
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", RISK_DOT[risk])} />
      {riskLabel(risk)}
    </span>
  );
}

export function ImporterCheckModule({
  onAskAi,
}: {
  onAskAi: (question?: string) => void;
}) {
  const [value, setValue] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ImporterSummary[] | null>(null);
  const [profile, setProfile] = useState<ImporterProfile | null>(null);
  const [recent, setRecent] = useState<string[]>([
    "Чайный Дом",
    "010540004771",
    "Алтын Логистик",
  ]);

  function runSearch(q: string) {
    const term = q.trim();
    if (!term) return;
    const found = searchImporters(term);
    setValue(term);
    setQuery(term);
    setRecent((prev) =>
      [term, ...prev.filter((x) => x.toLowerCase() !== term.toLowerCase())].slice(0, 8)
    );
    if (found.length === 1) {
      setProfile(buildImporterProfile(found[0]));
      setResults(null);
    } else {
      setResults(found);
      setProfile(null);
    }
  }

  function open(s: ImporterSummary) {
    setProfile(buildImporterProfile(s));
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-8 text-sm">
        <ShieldAlert className="h-4 w-4 shrink-0 text-muted-foreground" />
        <button
          type="button"
          onClick={() => setProfile(null)}
          className={cn(
            "shrink-0 transition-colors",
            profile
              ? "font-semibold text-muted-foreground hover:text-foreground"
              : "font-bold text-foreground"
          )}
        >
          Проверка импортёра
        </button>
        {profile && (
          <>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate font-bold text-foreground">
              {profile.name}
            </span>
          </>
        )}
      </header>

      <div className="flex-1 overflow-hidden">
        {profile ? (
          <div className="h-full overflow-y-auto">
            <Profile profile={profile} onAskAi={onAskAi} />
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <div className="shrink-0 px-8 pt-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runSearch(value);
                }}
                className="flex h-12 items-center gap-2 rounded-full border border-border bg-card pl-5 pr-2 shadow-sm shadow-foreground/5"
              >
                <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Поиск по БИН или названию компании — например, 010540004771 или «Чайный Дом»"
                  aria-label="Поиск импортёра"
                  className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="shrink-0 rounded-full px-5"
                  disabled={value.trim().length === 0}
                >
                  Проверить
                </Button>
              </form>
              <div className="mt-4 flex items-center gap-3">
                <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Недавние
                </span>
                <div className="flex flex-1 gap-2 overflow-x-auto pb-1">
                  {recent.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => runSearch(q)}
                      className="flex h-8 shrink-0 items-center gap-2 rounded-full border border-border bg-card px-3 text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-accent"
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-8 pt-4">
              {results ? (
                <div className="animate-fade-in-up">
                  <p className="mb-4 text-sm text-muted-foreground">
                    Найдено: {results.length} · по запросу «{query}»
                  </p>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {results.map((r) => (
                      <button
                        key={r.bin}
                        type="button"
                        onClick={() => open(r)}
                        className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                          <Building2 className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-base font-semibold text-foreground">
                            {r.name}
                          </div>
                          <div className="truncate text-xs text-muted-foreground">
                            БИН {r.bin} · {r.region} · {r.status}
                          </div>
                        </div>
                        <RiskBadge risk={r.risk} />
                        <ArrowRight className="h-5 w-5 shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex min-h-full flex-col items-center justify-center text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-accent text-primary">
                    <ShieldAlert className="h-8 w-8" strokeWidth={1.8} />
                  </span>
                  <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
                    Проверка импортёра
                  </h2>
                  <p className="mt-2 max-w-md text-base text-muted-foreground">
                    Введите БИН или название компании — покажу реквизиты,
                    ВЭД-активность, контрагентов и оценку рисков
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Profile({
  profile,
  onAskAi,
}: {
  profile: ImporterProfile;
  onAskAi: (question?: string) => void;
}) {
  const [open, setOpen] = useState<Set<string>>(() => new Set(["overview"]));
  const props = (id: string, topic: string) => ({
    open: open.has(id),
    onToggle: () =>
      setOpen((p) => {
        const n = new Set(p);
        n.has(id) ? n.delete(id) : n.add(id);
        return n;
      }),
    onAskAi: () =>
      onAskAi(
        `${topic} по импортёру ${profile.name} (БИН ${profile.bin}).`
      ),
  });
  const askProfile = () =>
    onAskAi(
      `Проверь импортёра ${profile.name} (БИН ${profile.bin}). Оцени надёжность, ВЭД-активность и риски.`
    );

  return (
    <div className="px-8 py-6">
      <div className="flex flex-col gap-3 animate-fade-in-up">
        {/* Hero */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
                <Building2 className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  {profile.name}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  БИН {profile.bin} · {profile.status} · {profile.region}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <RiskBadge risk={profile.risk} />
              <Button onClick={askProfile} className="rounded-full">
                <Sparkles />
                Спросить ИИ
              </Button>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Импорт (12 мес.)" value={profile.importVol} />
            <StatCard label="Экспорт (12 мес.)" value={profile.exportVol} />
            <StatCard label="Поставок" value={profile.deals} />
            <StatCard label="Регистрация" value={profile.registered} />
          </div>
        </div>

        <SectionCard icon={Building2} title="Обзор" {...props("overview", "Расскажи про реквизиты и обзор")}>
          <div className="flex flex-col gap-6">
            <KeyValueList
              rows={[
                { label: "БИН", value: profile.bin },
                { label: "Статус", value: profile.status },
                { label: "Дата регистрации", value: profile.registered },
                { label: "Регион", value: profile.region },
                { label: "Руководитель", value: profile.director },
                { label: "Адрес", value: profile.address },
              ]}
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <SubTitle>Контакты</SubTitle>
                <p className="text-sm text-foreground">{profile.phone}</p>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={Globe} title="Внешнеэкономическая деятельность" {...props("fea", "Проанализируй внешнеэкономическую деятельность")}>
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="Импорт" value={profile.importVol} />
              <StatCard label="Экспорт" value={profile.exportVol} />
              <StatCard label="Поставок" value={profile.deals} />
              <StatCard label="Стран" value={String(profile.countries.length)} />
            </div>
            <div>
              <SubTitle>Страны</SubTitle>
              <BarList items={profile.countries} />
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={BarChart3} title="Товары" {...props("products", "Разбери товарную номенклатуру и коды ТН ВЭД")}>
          <div className="flex flex-col gap-6">
            <div>
              <SubTitle>Основные коды ТН ВЭД</SubTitle>
              <ul className="flex flex-col gap-2">
                {profile.topCodes.map((c) => (
                  <li key={c.code} className="flex items-center gap-4">
                    <span className="shrink-0 rounded-md bg-accent px-2 py-1 font-mono text-xs font-bold text-primary">
                      {c.code}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                      {c.title}
                    </span>
                    <span className="shrink-0 text-sm font-bold tabular-nums text-foreground">
                      {c.share}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <SubTitle>Товарная номенклатура</SubTitle>
              <TagList items={profile.nomenclature} />
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={Users} title="Контрагенты" {...props("partners", "Оцени контрагентов")}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <SubTitle>Поставщики</SubTitle>
              <BulletList items={profile.suppliers} />
            </div>
            <div>
              <SubTitle>Покупатели</SubTitle>
              <BulletList items={profile.buyers} />
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={BarChart3} title="Аналитика" {...props("analytics", "Проанализируй динамику и объёмы")}>
          <div className="flex flex-col gap-6">
            <div>
              <SubTitle>Динамика активности</SubTitle>
              <YearBars data={profile.trend} />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <SubTitle>География поставок</SubTitle>
                <BarList items={profile.geography} barClassName="bg-emerald-500" />
              </div>
              <div>
                <SubTitle>Объёмы</SubTitle>
                <div className="grid grid-cols-2 gap-3">
                  {profile.volumes.map((v) => (
                    <StatCard key={v.label} label={v.label} value={v.value} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={ShieldAlert} title="Риски" {...props("risks", "Объясни риски и аномалии")}>
          <div className="flex flex-col gap-6">
            <div>
              <SubTitle>Аномалии</SubTitle>
              <BulletList items={profile.anomalies} />
            </div>
            <div>
              <SubTitle>Подозрительные операции</SubTitle>
              <BulletList items={profile.suspicious} />
            </div>
            <div>
              <SubTitle>Пересечения с санкциями</SubTitle>
              <BulletList items={profile.sanctions} />
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
