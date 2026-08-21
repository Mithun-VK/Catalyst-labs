import Link from "next/link";
import { type ReactNode } from "react";
import { ButtonLink } from "./Button";

/** Shared shell for the legal pages: narrow measure, generous rhythm. */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <article className="container-page py-36 sm:py-44">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="label group inline-flex items-center gap-2.5 text-mute transition-colors duration-(--duration-base) hover:text-paper"
        >
          <span
            aria-hidden="true"
            className="transition-transform duration-(--duration-base) group-hover:-translate-x-1"
          >
            ←
          </span>
          Back to site
        </Link>

        <h1 className="mt-8 text-h1 text-paper">{title}</h1>
        <p className="label mt-5 text-mute-deep">Last updated · {updated}</p>

        <div className="mt-14 flex flex-col gap-12">{children}</div>

        <div className="mt-16 border-t border-line pt-10">
          <p className="text-body text-mute">
            Have a project instead of a question about policy?
          </p>
          <ButtonLink
            href="/contact"
            variant="secondary"
            arrow
            className="mt-5"
            event="cta_click"
            eventProps={{ location: "legal", label: "start_a_project" }}
          >
            Start a Project
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-h3 text-paper">{title}</h2>
      <div className="mt-4 flex flex-col gap-4 text-body text-mute">{children}</div>
    </section>
  );
}
