/** Tailwind gradient class sets — must be static strings for the compiler. */
export const adGradientClasses = {
  violetSunset: "from-violet-600 via-primary to-orange-500",
  slateHero: "from-slate-900 via-slate-800 to-primary/80",
  ocean: "from-blue-600 to-cyan-500",
  brand: "from-primary to-rose-600",
  indigo: "from-indigo-600 to-purple-600",
  editorial: "from-foreground via-slate-800 to-primary",
  zinc: "from-zinc-800 to-zinc-900",
} as const;

export type AdGradientKey = keyof typeof adGradientClasses;
