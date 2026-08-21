# Catalyst Labs - website

Production website for Catalyst Labs, a software and AI engineering studio in
Chennai, India.

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4. No UI kit, no
animation library, no third-party scripts.

---

## Running it

```bash
npm install
cp .env.example .env.local   # fill in at least one enquiry channel
npm run dev                  # http://localhost:3000
```

```bash
npm run build && npm start   # production
npm run typecheck            # tsc --noEmit
npm run lint
```

> **Windows + OneDrive note.** This project lives in a OneDrive-synced folder.
> Never run `next dev` and `next build` at the same time - both write to
> `.next/` and the result is a corrupted build that throws
> `Cannot find module './xxx.js'` at runtime. If that happens, stop all node
> processes, delete `.next`, and rebuild.

---

## Where things live

```
app/                     routes (one folder per page)
  api/enquiry/route.ts   enquiry endpoint - validation, rate limit, delivery
  services/[slug]/       generated from content/services.ts
  icon.tsx               favicon, generated (no binary asset)
  opengraph-image.tsx    share card, generated at the edge
components/
  nav/                   Navbar, MobileMenu
  sections/              page sections (each usable standalone)
  visuals/               ReactionField (hero canvas), ChainStrip
  ui/                    Button, Section, PageHeader, Reveal, Logo …
  forms/EnquiryForm.tsx
content/                 all copy and data - typed, no CMS
lib/
  site.ts                company facts. Single source of truth.
  enquiry.ts             validation shared by client and server
  observer.ts            one IntersectionObserver for every scroll reveal
  analytics.ts           vendor-agnostic event shim
app/globals.css          the entire design system
```

**To change copy, edit `content/` - not components.** Services, blueprints,
process stages, AI scenarios and impact statements are all typed data.

---

## The design system

Everything resolves to tokens in `app/globals.css`. No component contains a raw
hex value or a one-off duration.

- **Colour** - near-black ground (`--color-ink`), warm off-white
  (`--color-paper`), one accent (`--color-ember`, `#ff5b28`) used only for CTAs,
  live state and a single focal point per section.
- **Type** - Instrument Sans (structure), JetBrains Mono (technical labels),
  Instrument Serif italic (accent words only). Fluid `clamp()` scale, so no
  component sets a breakpoint-specific font size.
- **Space** - 4px base; `--space-section` and `--space-gutter` carry the rhythm.
- **Radius** - 2–14px. Deliberately tight; large pill radii read as template.

> **Tailwind v4 gotcha:** the CSS-variable shorthand is `duration-(--duration-base)`,
> **not** `duration-[--duration-base]`. The bracket form compiles to invalid CSS
> (`transition-duration: --duration-base`) and is silently dropped. If spacing,
> z-index or timing looks wrong, check this first.

### Alignment contract

Every route renders `<PageHeader>` and nothing else above the fold. Breadcrumb,
eyebrow, H1, lead and actions therefore land on identical baselines and columns
site-wide: content in grid columns 1–7, meta aside in 9–12. Sections below use
the same 12-column grid and the same gutter token.

---

## Motion

No animation library ships to the client.

- Scroll reveals: one client component (`components/ui/RevealController.tsx`)
  toggling `[data-visible]`, with CSS transitions. `Reveal` itself is a server
  component, so the client bundle does not grow with the number of revealed
  blocks.

> **Do not put `content-visibility: auto` on an ancestor of a `[data-reveal]`
> element.** This was tried (a `defer-render` utility, applied per-section) to
> skip offscreen layout and paint. A skipped subtree has no rendered boxes, so
> an IntersectionObserver watching elements inside it can fail to report them
> — measured at **40 of 41 blocks stuck at `opacity: 0` on the home page in
> Chrome**. Redirecting the observer to watch the container instead papered
> over Chrome but produced **72 stuck instances in Safari**, confirmed by
> control-arm A/B testing to be the same underlying failure mode, not a
> separate bug. The property has been removed entirely rather than patched
> again. If you reintroduce it anywhere near reveal content, re-run the
> reveal verification in both Chromium and WebKit before shipping — see
> `RevealController`'s history comment.
- Hero lattice (`ReactionField`): a single canvas, points batched into a few
  fill passes, rAF suspended when off-screen or when the tab is hidden.
- `prefers-reduced-motion` is honoured in CSS **and** in JS - the canvas draws
  one static frame and the timed sequences resolve instantly.

---

## Lead capture

`POST /api/enquiry` validates with the same module the form uses
(`lib/enquiry.ts`), rate-limits per IP, and delivers via Resend and/or a
webhook. See `.env.example`.

Spam handling: a hidden honeypot field plus a submission-timing check. Suspected
bots receive `200 OK` and are discarded - a bot that gets an error retries with
new tactics.

**In-memory rate limiting is per-instance.** It stops casual flooding, not a
distributed attack. Move it to Redis/Upstash or the platform WAF before you
expect real traffic.

Analytics events (`cta_click`, `form_submitted`, `whatsapp_click`, …) are emitted
through `lib/analytics.ts`, which forwards to GTM, Plausible or gtag if one is
present and no-ops otherwise. No vendor script is bundled and no key is in
client code.

---

## Content policy

The site publishes **no invented clients, logos, testimonials, metrics, awards
or headcount.** This is a deliberate constraint, not an oversight:

- `content/work.ts` exports an **empty** `caseStudies` array. Add real entries
  as engagements complete and clients approve publication - the Work page
  switches presentation automatically once the array is non-empty.
- Until then it shows `blueprints`: reference architectures, labelled on the
  page as "not a client case study".
- The only external credential shown is the Udyam MSME registration number,
  which is publicly verifiable.

Keep it that way. A prospect who checks a claim and finds it hollow is lost
permanently.

---

## Before launch

1. Set `NEXT_PUBLIC_SITE_URL` to the real apex domain.
2. Configure an enquiry channel and **send a real test enquiry**.
3. Add real profile URLs to `site.social` - empty strings hide the links.
4. Have `app/privacy` and `app/terms` reviewed by someone qualified. They
   describe this site's actual behaviour accurately, but they are not legal
   advice.
5. Re-check the registered address decision: `lib/site.ts` publishes city-level
   location only, because the registered address is a private residence.
