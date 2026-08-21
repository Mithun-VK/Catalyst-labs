import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * The mark: a signal entering a node and leaving it changed. Drawn on a 24px
 * grid with 1.5px strokes so it stays crisp at nav size. The ember dot is the
 * catalyst.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("h-6 w-6 shrink-0", className)}
      fill="none"
    >
      <rect
        x="6.75"
        y="6.75"
        width="10.5"
        height="10.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M0.5 12h6.25M17.25 12H23.5"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.45"
      />
      <path d="M12 0.5v6.25" stroke="currentColor" strokeWidth="1.5" opacity="0.45" />
      <circle cx="12" cy="12" r="2.6" fill="var(--color-ember)" />
    </svg>
  );
}

export function Logo({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="Catalyst Labs - home"
      className={cn(
        "group inline-flex items-center gap-2.5 text-paper",
        "transition-opacity duration-(--duration-base) hover:opacity-80",
        className
      )}
    >
      <LogoMark className="transition-transform duration-(--duration-slow) ease-(--ease-out-quart) group-hover:rotate-90" />
      <span className="flex flex-col leading-none">
        <span className="text-[0.9375rem] font-semibold tracking-[-0.02em]">
          Catalyst Labs
        </span>
        <span className="label mt-1 text-[0.5625rem] text-mute-deep">
          Software · AI · Automation
        </span>
      </span>
    </Link>
  );
}
