export const themes = [
  { id: "emerald", name: "Emerald", color: "#0D9276" },
  { id: "ocean", name: "Ocean", color: "#2563EB" },
  { id: "violet", name: "Violet", color: "#7C3AED" },
  { id: "amber", name: "Amber", color: "#D97706" },
  { id: "rose", name: "Rose", color: "#E11D48" },
  { id: "zinc", name: "Zinc", color: "#71717A" },
] as const;

export type ThemeId = (typeof themes)[number]["id"];

export const DEFAULT_THEME: ThemeId = "emerald";
