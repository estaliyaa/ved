import type { Scenario } from "@/config/scenarios";

export function ScenarioCard({
  scenario,
  onSelect,
}: {
  scenario: Scenario;
  onSelect: (id: string) => void;
}) {
  const Icon = scenario.icon;
  return (
    <button
      type="button"
      onClick={() => onSelect(scenario.id)}
      className="group flex h-full items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:border-primary/40 hover:bg-accent/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-foreground">
          {scenario.title}
        </span>
        <span className="text-xs leading-4 text-muted-foreground">
          {scenario.description}
        </span>
      </span>
    </button>
  );
}
