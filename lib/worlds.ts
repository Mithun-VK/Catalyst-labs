/**
 * DESIGN WORLDS
 *
 * One company, five deliberately different visual environments. Each route
 * declares a world; the world re-themes the design tokens for that subtree
 * (see the WORLDS layer in globals.css) and selects a layout language.
 *
 * The mechanism is cheap on purpose. Tailwind v4 utilities compile down to
 * `var(--color-*)`, so overriding those custom properties re-themes every
 * existing utility inside the world without touching a single component.
 * That keeps the budget where the contrast actually comes from - layout,
 * typography and motion - rather than in five parallel component libraries.
 *
 * TOKEN CONTRACT (important)
 * --------------------------
 * Inside a world, the colour tokens name ROLES, not literal colours:
 *
 *   --color-ink        the page ground
 *   --color-ink-raised a surface sitting above the ground
 *   --color-paper      primary text on that ground
 *   --color-mute       secondary text
 *   --color-ember      the accent
 *
 * In the light world (`atelier`) ground and text are inverted, so `bg-ink`
 * paints ivory and `text-paper` prints near-black. Reading the utilities as
 * roles is what lets Button, Section and every other primitive work unchanged
 * on both a near-black and an ivory page.
 */

export type WorldId = "precision" | "poster" | "atelier" | "studio" | "system";

export type World = {
  id: WorldId;
  /** Shown in the nav's world readout. */
  label: string;
  /** One line on the design intent - used in comments and the nav readout. */
  intent: string;
  /** Nav treatment. Light worlds need the inverse nav. */
  scheme: "dark" | "light";
};

export const worlds: Record<WorldId, World> = {
  precision: {
    id: "precision",
    label: "Precision",
    intent: "Grid, hairlines and editorial restraint. Establishes trust.",
    scheme: "dark",
  },
  poster: {
    id: "poster",
    label: "Poster",
    intent: "Oversized type, colour floods and asymmetry. Creates curiosity.",
    scheme: "dark",
  },
  atelier: {
    id: "atelier",
    label: "Atelier",
    intent: "Ivory, serif and whitespace. Establishes sophistication.",
    scheme: "light",
  },
  studio: {
    id: "studio",
    label: "Studio",
    intent: "Warm ground and interactive type. Creates connection.",
    scheme: "dark",
  },
  system: {
    id: "system",
    label: "System",
    intent: "Cold grid and instrumentation. Creates momentum.",
    scheme: "dark",
  },
};

/**
 * Route to world. Prefix-matched longest-first, so `/services/web` inherits
 * the services world without needing its own entry.
 */
const ROUTE_WORLDS: ReadonlyArray<readonly [string, WorldId]> = [
  ["/work", "poster"],
  ["/services", "atelier"],
  ["/process", "atelier"],
  ["/about", "studio"],
  ["/contact", "system"],
  ["/ai", "system"],
  ["/", "precision"],
] as const;

export function worldForPath(pathname: string): World {
  const match = ROUTE_WORLDS.find(
    ([prefix]) =>
      prefix === "/" ? pathname === "/" : pathname.startsWith(prefix)
  );
  // Legal and 404 routes fall back to the house style.
  return worlds[match?.[1] ?? "precision"];
}
