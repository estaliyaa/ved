import { Cog, Wrench, type LucideIcon } from "lucide-react";

export function UnderDevelopment({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <div className="relative mb-8 flex h-40 w-40 items-center justify-center animate-fade-in-up">
        <span className="absolute inset-0 brand-glow" aria-hidden />
        <span className="absolute inset-2 rounded-full border-2 border-dashed border-primary/30" />
        <span className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-accent text-primary shadow-lg shadow-primary/10">
          <Icon className="h-12 w-12" strokeWidth={1.6} />
        </span>
        <span className="absolute -right-1 top-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-card shadow-md ring-1 ring-border">
          <Cog className="h-5 w-5 text-muted-foreground" />
        </span>
        <span className="absolute -left-1 bottom-2 flex h-9 w-9 items-center justify-center rounded-2xl bg-card shadow-md ring-1 ring-border">
          <Wrench className="h-4 w-4 text-muted-foreground" />
        </span>
      </div>

      <span className="mb-4 inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
        Скоро
      </span>
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        Модуль в разработке
      </h2>
      <p className="mt-2 max-w-md text-base text-muted-foreground">
        Раздел «{label}» пока недоступен. Мы уже работаем над ним — а пока задачу
        можно решить через ассистента.
      </p>
    </div>
  );
}
