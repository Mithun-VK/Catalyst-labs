import Link from "next/link";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { nav } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * 404. Designed rather than defaulted: it says what happened in one line and
 * then does the only useful thing - offer every route the visitor might have
 * been looking for.
 */
export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="grid-field pointer-events-none absolute inset-0 -z-10 opacity-60"
      />

      <div className="container-page py-40 sm:py-52">
        <div className="grid gap-x-(--space-gutter) gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="label flex items-center gap-3 text-mute">
              <span className="text-ember">404</span>
              <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
              Not found
            </p>

            <h1 className="mt-6 text-h1 text-paper">
              That page doesn&rsquo;t{" "}
              <span className="accent-word text-ember">exist</span>.
            </h1>

            <p className="mt-6 max-w-lg text-lead text-mute">
              The link may be out of date, or the address may have a typo in it.
              Everything on the site is one click away below.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/" arrow className="w-full sm:w-auto">
                Back to home
              </ButtonLink>
              <ButtonLink
                href="/contact"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Start a Project
              </ButtonLink>
            </div>
          </div>

          <nav aria-label="All pages" className="lg:col-span-4 lg:col-start-9">
            <p className="label text-mute-deep">All pages</p>
            <ul className="mt-5 border-t border-line">
              {[...nav, { label: "Contact", href: "/contact" }].map(
                (item, i) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex min-h-11 items-center gap-4 border-b border-line py-3 text-body text-mute transition-colors duration-(--duration-base) hover:text-paper"
                    >
                      <span className="label text-mute-deep transition-colors group-hover:text-ember">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {item.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}
