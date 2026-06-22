import { VedLogo } from "@/components/brand/ved-logo";
import { ScenarioCard } from "@/components/chat/scenario-card";
import { scenarios } from "@/config/scenarios";

export function ChatWelcome({
  input,
  onSelectScenario,
}: {
  /** Поле ввода — главный акцент стартового экрана, в центре. */
  input: React.ReactNode;
  onSelectScenario: (id: string) => void;
}) {
  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-8 animate-fade-in-up">
      <div className="flex max-w-2xl flex-col items-center gap-4 text-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <span
            className="absolute -inset-4 brand-glow animate-pulse-glow"
            aria-hidden
          />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-card shadow-lg shadow-primary/15 ring-1 ring-border/70">
            <VedLogo className="h-9 w-9" />
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            VED Чат
          </h2>
          <p className="text-base text-muted-foreground">
            Опишите задачу — система сама найдёт нужные данные и инструменты
          </p>
        </div>
      </div>

      {/* Главный акцент — поле ввода по центру экрана */}
      <div className="w-full">{input}</div>

      {/* Готовые сценарии — под полем ввода */}
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            onSelect={onSelectScenario}
          />
        ))}
      </div>
    </div>
  );
}
