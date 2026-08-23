import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { WorldId } from "@/lib/worlds";

/**
 * Declares which design world a route belongs to.
 *
 * A SERVER component, and that matters: the `data-world` attribute is present
 * in the HTML on first paint, so the token overrides in globals.css apply
 * before hydration and no page ever flashes the house palette before
 * switching to its own.
 *
 * The token block is selected with `body:has([data-world=...])`, which is why
 * this only needs to render the attribute - the nav and footer sit outside
 * this subtree but still inherit the world's tokens from `body`.
 */
export function World({
  id,
  children,
  className,
}: {
  id: WorldId;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div data-world={id} className={cn("bg-ink text-paper", className)}>
      {children}
    </div>
  );
}
