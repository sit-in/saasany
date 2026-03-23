"use client";

import { useEffect, useState } from "react";
import { themes, DEFAULT_THEME, type ThemeId } from "@/config/themes";
import { cn } from "@/lib/utils";
import { Palette } from "lucide-react";

function getStoredTheme(): ThemeId {
  if (typeof window === "undefined") return DEFAULT_THEME;
  return (localStorage.getItem("color-theme") as ThemeId) || DEFAULT_THEME;
}

function applyTheme(themeId: ThemeId) {
  const root = document.documentElement;
  if (themeId === DEFAULT_THEME) {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", themeId);
  }
  localStorage.setItem("color-theme", themeId);
}

export function ThemeSwitcher() {
  const [current, setCurrent] = useState<ThemeId>(DEFAULT_THEME);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = getStoredTheme();
    setCurrent(stored);
    applyTheme(stored);
  }, []);

  function handleSelect(themeId: ThemeId) {
    setCurrent(themeId);
    applyTheme(themeId);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-accent"
        aria-label="Switch color theme"
      >
        <Palette className="h-4 w-4" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 rounded-lg border border-border bg-popover p-3 shadow-md">
            <div className="grid grid-cols-3 gap-2">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleSelect(theme.id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-md p-2 transition-colors hover:bg-accent",
                    current === theme.id && "bg-accent"
                  )}
                  title={theme.name}
                >
                  <span
                    className={cn(
                      "h-6 w-6 rounded-full border-2 transition-transform",
                      current === theme.id
                        ? "border-foreground scale-110"
                        : "border-transparent"
                    )}
                    style={{ backgroundColor: theme.color }}
                  />
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {theme.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
