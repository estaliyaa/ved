"use client";

import { Settings } from "lucide-react";

import { AdataLogo } from "@/components/brand/adata-logo";
import { modules } from "@/config/modules";
import { cn } from "@/lib/utils";

export function ModuleSidebar({
  activeId,
  onSelect,
  collapsed = false,
}: {
  activeId: string;
  onSelect: (id: string) => void;
  collapsed?: boolean;
}) {
  return (
    <aside
      className={cn(
        "flex shrink-0 flex-col py-4 transition-[width] duration-200",
        collapsed ? "w-20 items-center px-2" : "w-60 pl-4 pr-4"
      )}
    >
      <div
        className={cn(
          "mb-4 flex items-center border-b border-border pb-4",
          collapsed ? "justify-center" : "px-2"
        )}
      >
        <AdataLogo compact={collapsed} />
      </div>

      <nav className="w-full flex-1 overflow-y-auto">
        <ul className="flex flex-col gap-1">
          {modules.map((m) => {
            const isActive = m.id === activeId;
            const Icon = m.icon;
            return (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => onSelect(m.id)}
                  aria-current={isActive ? "page" : undefined}
                  title={collapsed ? m.label : undefined}
                  className={cn(
                    "flex h-10 items-center rounded-xl text-sm transition-colors",
                    collapsed ? "mx-auto w-12 justify-center" : "w-full gap-3 px-3",
                    isActive
                      ? "bg-card font-semibold text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
                  )}
                >
                  <Icon
                    className="h-5 w-5 shrink-0"
                    strokeWidth={isActive ? 2.1 : 1.8}
                  />
                  {!collapsed && <span className="truncate">{m.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <button
        type="button"
        className={cn(
          "mt-2 flex items-center rounded-xl text-left transition-colors hover:bg-card/60",
          collapsed ? "mx-auto w-12 justify-center px-0 py-2" : "w-full gap-3 px-2 py-2"
        )}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-700 text-xs font-semibold text-primary-foreground">
          АД
        </span>
        {!collapsed && (
          <>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-semibold text-foreground">
                Adata
              </span>
              <span className="truncate text-xs text-muted-foreground">
                22726@adata.kz
              </span>
            </span>
            <Settings className="h-4 w-4 shrink-0 text-muted-foreground" />
          </>
        )}
      </button>
    </aside>
  );
}
