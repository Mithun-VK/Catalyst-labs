import Link from "next/link";
import { nav, site, whatsappLink } from "@/lib/site";
import { services } from "@/content/services";
import { LogoMark } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";

const socials = [
  { label: "LinkedIn", href: site.social.linkedin },
  { label: "Instagram", href: site.social.instagram },
  { label: "GitHub", href: site.social.github },
  { label: "X", href: site.social.x },
].filter((s) => s.href);

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line">
      <div className="container-page py-16 sm:py-20">
        <div className="grid gap-x-(--space-gutter) gap-y-12 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="flex items-center gap-2.5 text-paper">
                <LogoMark />
                <span className="text-[0.9375rem] font-semibold tracking-[-0.02em]">
                  {site.name}
                </span>
              </div>

              <p className="mt-6 max-w-sm text-body text-mute">
                A software and AI engineering studio in {site.location.city}. We
                build the systems businesses run on - and the automation that
                keeps people out of the parts a machine should handle.
              </p>

              <p className="mt-8 max-w-sm text-h3 text-paper">
                Build what matters.{" "}
                <span className="accent-word text-ember">Automate</span> what
                doesn&rsquo;t.
              </p>
            </Reveal>
          </div>

          {/* Columns */}
          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
            <FooterColumn title="Navigate">
              {nav.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
              <FooterLink href="/contact">Contact</FooterLink>
            </FooterColumn>

            <FooterColumn title="Services">
              {services.map((service) => (
                <FooterLink key={service.id} href={`/services/${service.id}`}>
                  {service.title}
                </FooterLink>
              ))}
            </FooterColumn>

            <FooterColumn title="Contact">
              <FooterLink href={whatsappLink()} external>
                WhatsApp
              </FooterLink>
              <FooterLink href={`mailto:${site.contact.email}`}>
                {site.contact.email}
              </FooterLink>
              <FooterLink href={`tel:${site.contact.phoneE164}`}>
                {site.contact.phoneDisplay}
              </FooterLink>

              {socials.length > 0 ? (
                <>
                  <span className="label mt-6 block text-mute-deep">Social</span>
                  {socials.map((social) => (
                    <FooterLink key={social.label} href={social.href} external>
                      {social.label}
                    </FooterLink>
                  ))}
                </>
              ) : null}
            </FooterColumn>
          </div>
        </div>

        {/* Baseline */}
        <div className="mt-16 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p className="text-[0.8125rem] text-mute-deep">
              © {year} {site.legalName}. All rights reserved.
            </p>
            <p className="label text-mute-deep">
              {site.registration.number}
            </p>
          </div>

          <nav aria-label="Legal" className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-[0.8125rem] text-mute-deep transition-colors duration-(--duration-base) hover:text-paper"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-[0.8125rem] text-mute-deep transition-colors duration-(--duration-base) hover:text-paper"
            >
              Terms
            </Link>
            <a
              href="#top"
              className="group inline-flex items-center gap-2 text-[0.8125rem] text-mute-deep transition-colors duration-(--duration-base) hover:text-paper"
            >
              Back to top
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-3 w-3 transition-transform duration-(--duration-base) group-hover:-translate-y-0.5"
              >
                <path d="M8 14V2M3 7l5-5 5 5" />
              </svg>
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="label text-mute-deep">{title}</h2>
      <ul className="mt-4 flex flex-col gap-0.5">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  // min-h-9 keeps every footer link past the WCAG 2.5.8 target minimum on
  // touch without turning the footer into a ladder.
  const className =
    "group inline-flex min-h-9 items-center gap-2 py-1 text-small text-mute transition-colors duration-(--duration-base) hover:text-paper";

  return (
    <li>
      {external || href.startsWith("mailto:") || href.startsWith("tel:") ? (
        <a
          href={href}
          className={className}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          <span
            aria-hidden="true"
            className="h-px w-0 bg-ember transition-all duration-(--duration-base) ease-(--ease-out-quart) group-hover:w-3"
          />
          {children}
        </a>
      ) : (
        <Link href={href} className={className}>
          <span
            aria-hidden="true"
            className="h-px w-0 bg-ember transition-all duration-(--duration-base) ease-(--ease-out-quart) group-hover:w-3"
          />
          {children}
        </Link>
      )}
    </li>
  );
}
