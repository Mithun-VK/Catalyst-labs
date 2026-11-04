/**
 * Enquiry contract shared by the form component and the API route, so client
 * and server validation can never drift apart. Hand-rolled rather than
 * pulling in a schema library for eleven fields.
 */

export const PROJECT_TYPES = [
  "AI & automation",
  "Custom software",
  "Web application",
  "Mobile application",
  "SaaS / MVP",
  "Data & integrations",
  "Not sure yet",
] as const;

export const CURRENCIES = ["USD", "GBP", "EUR", "INR"] as const;
export type Currency = (typeof CURRENCIES)[number];

/** Budget bands per currency. Ranges are enquiry guidance, not price quotes. */
export const BUDGETS_BY_CURRENCY: Record<Currency, readonly string[]> = {
  USD: ["Under $3k", "$3k – $10k", "$10k – $30k", "$30k+", "Needs discussion"],
  GBP: ["Under £2.5k", "£2.5k – £8k", "£8k – £25k", "£25k+", "Needs discussion"],
  EUR: ["Under €3k", "€3k – €9k", "€9k – €28k", "€28k+", "Needs discussion"],
  INR: ["Under ₹2L", "₹2L – ₹5L", "₹5L – ₹15L", "₹15L+", "Needs discussion"],
};

export const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "Netherlands",
  "France",
  "Ireland",
  "United Arab Emirates",
  "Saudi Arabia",
  "Singapore",
  "India",
  "Other",
] as const;

export const CONTACT_METHODS = ["Email", "WhatsApp", "Video call"] as const;

/** Best-effort defaults from the browser time zone. The visitor can change both. */
export function guessLocale(timeZone: string): {
  currency: Currency;
  country: string;
} {
  if (timeZone === "Asia/Kolkata" || timeZone === "Asia/Calcutta") {
    return { currency: "INR", country: "India" };
  }
  if (timeZone === "Europe/London") {
    return { currency: "GBP", country: "United Kingdom" };
  }
  if (timeZone.startsWith("Europe/")) return { currency: "EUR", country: "" };
  if (timeZone === "Asia/Dubai") {
    return { currency: "USD", country: "United Arab Emirates" };
  }
  return { currency: "USD", country: "" };
}

export const TIMELINES = [
  "As soon as possible",
  "1–3 months",
  "3–6 months",
  "Planning ahead",
] as const;

export type EnquiryInput = {
  name: string;
  company: string;
  email: string;
  phone: string;
  projectType: string;
  /** Selected budget currency; `budget` holds a band from BUDGETS_BY_CURRENCY. */
  currency: string;
  budget: string;
  timeline: string;
  country: string;
  /** IANA zone, auto-detected and editable, e.g. "Europe/London". */
  timezone: string;
  contactMethod: string;
  /* Attribution, captured client-side on first visit. */
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  referrer: string;
  landingPage: string;
  /** Free-form origin tag from ?source=, e.g. "work-safemerchant". */
  source: string;
  brief: string;
  currentProduct: string;
  notes: string;
  /** Honeypot - must stay empty. Hidden from humans and screen readers. */
  website: string;
  /** ms since the form mounted; sub-second submits are bots. */
  elapsedMs: number;
};

export type FieldErrors = Partial<Record<keyof EnquiryInput, string>>;

export const REQUIRED_FIELDS = [
  "name",
  "email",
  "projectType",
  "brief",
] as const satisfies readonly (keyof EnquiryInput)[];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d][\d\s\-()]{6,20}$/;

export const LIMITS = {
  country: 60,
  timezone: 60,
  attribution: 200,
  name: 80,
  company: 100,
  email: 160,
  phone: 24,
  brief: 2000,
  currentProduct: 200,
  notes: 1000,
} as const;

export function emptyEnquiry(): EnquiryInput {
  return {
    name: "",
    company: "",
    email: "",
    phone: "",
    projectType: "",
    currency: "USD",
    budget: "",
    timeline: "",
    country: "",
    timezone: "",
    contactMethod: "",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    referrer: "",
    landingPage: "",
    source: "",
    brief: "",
    currentProduct: "",
    notes: "",
    website: "",
    elapsedMs: 0,
  };
}

/** Validates one field. Returns undefined when the value is acceptable. */
export function validateField(
  field: keyof EnquiryInput,
  value: string
): string | undefined {
  const v = value.trim();

  switch (field) {
    case "name":
      if (!v) return "Please tell us your name.";
      if (v.length < 2) return "That looks too short.";
      if (v.length > LIMITS.name) return `Keep this under ${LIMITS.name} characters.`;
      return undefined;
    case "email":
      if (!v) return "We need an email to reply to.";
      if (!EMAIL_RE.test(v)) return "That doesn't look like a valid email.";
      if (v.length > LIMITS.email) return "That email is too long.";
      return undefined;
    case "phone":
      if (!v) return undefined; // optional
      if (!PHONE_RE.test(v)) return "Use digits, spaces and + only.";
      return undefined;
    case "projectType":
      if (!v) return "Pick the closest match.";
      return undefined;
    case "brief":
      if (!v) return "A sentence or two is enough to start.";
      if (v.length < 20) return "Tell us a little more - 20 characters minimum.";
      if (v.length > LIMITS.brief) return `Keep this under ${LIMITS.brief} characters.`;
      return undefined;
    case "company":
      if (v.length > LIMITS.company) return "That's too long.";
      return undefined;
    case "currentProduct":
      if (v.length > LIMITS.currentProduct) return "That's too long.";
      return undefined;
    case "currency":
      if (v && !(CURRENCIES as readonly string[]).includes(v)) return "Pick a listed currency.";
      return undefined;
    case "country":
      if (v.length > LIMITS.country) return "That's too long.";
      return undefined;
    case "timezone":
      if (v.length > LIMITS.timezone) return "That's too long.";
      return undefined;
    case "contactMethod":
      if (v && !(CONTACT_METHODS as readonly string[]).includes(v)) return "Pick a listed method.";
      return undefined;
    case "notes":
      if (v.length > LIMITS.notes) return `Keep this under ${LIMITS.notes} characters.`;
      return undefined;
    default:
      return undefined;
  }
}

/** Full-payload validation. Used by the API route as the authority. */
export function validateEnquiry(input: Partial<EnquiryInput>): {
  ok: boolean;
  errors: FieldErrors;
  /** True when the submission looks automated rather than invalid. */
  suspectedBot: boolean;
} {
  const errors: FieldErrors = {};

  (Object.keys(emptyEnquiry()) as (keyof EnquiryInput)[]).forEach((field) => {
    if (field === "elapsedMs" || field === "website") return;
    const error = validateField(field, String(input[field] ?? ""));
    if (error) errors[field] = error;
  });

  const suspectedBot =
    Boolean(String(input.website ?? "").trim()) ||
    (typeof input.elapsedMs === "number" && input.elapsedMs > 0 && input.elapsedMs < 2500);

  return { ok: Object.keys(errors).length === 0, errors, suspectedBot };
}
