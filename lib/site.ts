/**
 * Single source of truth for company facts.
 *
 * Everything here is verified against the Udyam (MSME) registration on file.
 * Nothing in this file may be invented - no client names, headcount, revenue,
 * awards or statistics. If a value is not known, it does not belong here.
 */

export const site = {
  name: "Catalyst Labs",
  legalName: "Catalyst Labs",
  /** Disambiguates from the unrelated companies that share the name. */
  alternateName: ["Catalyst Labs Chennai", "catalystlabs.co.in"],
  /** Update to the live apex domain before launch; used for canonicals + OG. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://catalystlabs.co.in",
  tagline: "We build the software that moves businesses forward.",
  description:
    "Catalyst Labs is a Chennai-based software and AI engineering studio, established in 2026. We build custom software, web and mobile applications, AI systems and automation around the way a business actually works.",
  shortDescription:
    "Custom software, AI systems and automation, engineered around the way your business actually works.",
  founded: "2026",
  locale: "en_IN",

  /** The person behind the studio. Add `sameAs` profile URLs only when real. */
  founder: {
    name: "Mithun V. K.",
    jobTitle: "Founder",
    sameAs: [
      "https://github.com/Mithun-VK/",
      "https://www.linkedin.com/in/mithunvk06/",
    ] as string[],
  },

  contact: {
    email: "mithun@catalystlabs.co.in",
    /** E.164, no punctuation - used to build the wa.me link. */
    phoneE164: "+919677080327",
    phoneDisplay: "+91 96770 80327",
    whatsappNumber: "919677080327",
  },

  location: {
    /** City-level only. The registered address is a private residence and is
        deliberately not published; the registry number below is the public,
        verifiable credential. */
    city: "Chennai",
    region: "Tamil Nadu",
    regionCode: "TN",
    country: "India",
    countryCode: "IN",
  },

  /** Verifiable Government of India MSME registration. Public by design. */
  registration: {
    scheme: "Udyam",
    number: "UDYAM-TN-02-0462988",
    classification: "Micro Enterprise",
    activity: "Computer programming, consultancy and related activities",
    verifyUrl: "https://udyamregistration.gov.in/",
  },

  /**
   * Booking link (Cal.com / Calendly). Set NEXT_PUBLIC_BOOKING_URL; when it is
   * empty every "Book a call" button is hidden.
   */
  booking: {
    url: process.env.NEXT_PUBLIC_BOOKING_URL ?? "",
    minutes: 30,
  },

  /**
   * TODO(owner): confirm before publishing. Anything left empty/false is NOT
   * shown on the site. `overlapHours` e.g. "14:00-23:00 IST (by appointment)".
   */
  internationalClients: {
    overlapHours: "10:00 AM - 10:00 PM IST, every day",
    milestonePayments: false,
  },

  /** Add real profiles only. An empty string hides the link entirely. */
  social: {
    linkedin: "",
    instagram: "",
    github: "",
    x: "",
  },
} as const;

/** Prefilled WhatsApp deep link. `context` becomes the first message. */
export function whatsappLink(
  context = "Hi Catalyst Labs - I'd like to discuss a project."
) {
  return `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(
    context
  )}`;
}

/** Prefilled mailto fallback, used when the enquiry API is unconfigured. */
export function mailtoLink(
  subject = "Project enquiry",
  body = "Hi Catalyst Labs,\n\nHere is what I'm trying to build:\n\n"
) {
  return `mailto:${site.contact.email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

/**
 * Primary navigation - every real page on the site.
 *
 * Home is the logo and Contact is the CTA, so the bar itself carries the five
 * content routes. AI & Automation and Process are full pages with their own
 * content and search presence, and hiding them behind other pages meant the
 * two routes a prospect most often wants to check - "can they actually do AI"
 * and "how do they work" - were the two hardest to reach.
 *
 * The label is shortened to "AI" in the desktop bar only (see Navbar), where
 * five items plus a logo and a CTA have to share one row at 1024px. The full
 * name is used everywhere it fits: the mobile menu, the footer, breadcrumbs.
 */
export const nav = [
  { label: "Works", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "AI & Automation", href: "/ai" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
] as const;

/** Compact labels for the desktop bar, where horizontal room is the limit. */
export const navShortLabels: Record<string, string> = {
  "/ai": "AI",
};

/** Page titles keyed by route, used for breadcrumbs and the mobile menu. */
export const routeLabels: Record<string, string> = {
  "/": "Home",
  "/services": "Services",
  "/work": "Works",
  "/ai": "AI & Automation",
  "/process": "Process",
  "/about": "About",
  "/contact": "Contact",
  "/privacy": "Privacy",
  "/terms": "Terms",
};
