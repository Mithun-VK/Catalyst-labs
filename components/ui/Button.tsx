"use client";

import Link from "next/link";
import { type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { track, type AnalyticsEvent } from "@/lib/analytics";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "group relative inline-flex cursor-pointer items-center justify-center gap-2.5 " +
  "rounded-xs font-medium tracking-[-0.01em] whitespace-nowrap select-none " +
  "transition-[background-color,color,border-color,transform,box-shadow] duration-(--duration-base) " +
  "ease-(--ease-out-soft) active:translate-y-px " +
  "disabled:pointer-events-none disabled:opacity-45";

const variants: Record<Variant, string> = {
  // The one place the accent is used as a fill.
  /* `text-on-ember`, not `text-ink`: see the token's note in globals.css.
     The shadow reads from --shadow-ember, which each world re-tunes, because
     a hardcoded orange glow smears grey on an ivory page. */
  primary:
    "bg-ember text-on-ember hover:bg-ember-soft shadow-[var(--shadow-ember)]",
  secondary:
    "border border-line-strong bg-transparent text-paper hover:border-paper/40 hover:bg-paper/[0.04]",
  ghost: "text-paper/80 hover:text-paper",
};

const sizes: Record<Size, string> = {
  // 44px min height everywhere - thumb-friendly on mobile.
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-[3.25rem] px-7 text-base",
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Fires on activation, before navigation. */
  event?: AnalyticsEvent;
  eventProps?: Record<string, string>;
  /** Renders the animated arrow affordance. */
  arrow?: boolean;
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  event,
  eventProps,
  arrow = false,
  ...props
}: CommonProps & ComponentProps<"button">) {
  return (
    <button
      {...props}
      onClick={(e) => {
        if (event) track(event, eventProps);
        props.onClick?.(e);
      }}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {children}
      {arrow ? <Arrow /> : null}
    </button>
  );
}

export function ButtonLink({
  children,
  variant = "primary",
  size = "md",
  className,
  event,
  eventProps,
  arrow = false,
  href,
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  const external = typeof href === "string" && /^(https?:|mailto:|tel:)/.test(href);

  const content = (
    <>
      {children}
      {arrow ? <Arrow /> : null}
    </>
  );

  const classes = cn(base, variants[variant], sizes[size], className);
  const onClick = () => {
    if (event) track(event, eventProps);
  };

  if (external) {
    return (
      <a
        href={href as string}
        onClick={onClick}
        className={classes}
        {...(href.toString().startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={classes} {...props}>
      {content}
    </Link>
  );
}

/** Shared arrow: slides on hover, and is decorative to assistive tech. */
function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 transition-transform duration-(--duration-base) ease-(--ease-out-quart) group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="square"
    >
      <path d="M1 8h13M9 3l5 5-5 5" />
    </svg>
  );
}
