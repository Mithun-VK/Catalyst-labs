/**
 * Blog posts. Plain structured content rather than MDX, so there is no extra
 * dependency and every post renders through one server component.
 *
 * Writing rules: answer one real buyer question per post, make no claim the
 * site cannot back up (no invented statistics, clients or prices), and link
 * onward to the matching service or location page. Inline links use
 * [label](/path) and are turned into <Link> by the renderer.
 */

import { clinicPosts } from "./clinic";

export type Block =
  | { t: "p"; text: string }
  | { t: "h2"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] }
  | { t: "note"; title: string; text: string };

export type Post = {
  slug: string;
  title: string;
  /** <title>, max 60 chars. */
  seoTitle: string;
  /** Meta description, max 155 chars. */
  description: string;
  date: string; // ISO
  readMinutes: number;
  tags: string[];
  /** Pages this post should send readers on to. */
  related: { label: string; href: string }[];
  body: Block[];
};

const articles: Post[] = [
  {
    slug: "how-much-does-custom-software-cost-in-india",
    title: "How much does custom software cost in India?",
    seoTitle: "How Much Does Custom Software Cost in India? | Catalyst Labs",
    description:
      "What drives the cost of custom software in India, how fixed-price and hourly billing compare, and the questions to ask before you sign.",
    date: "2026-11-05",
    readMinutes: 6,
    tags: ["Pricing", "Custom software"],
    related: [
      { label: "Custom software development", href: "/services/custom-software" },
      { label: "Software development in India", href: "/software-development-india" },
    ],
    body: [
      {
        t: "p",
        text: "Ask five software companies what a project costs and you will get five answers, and none of them will be wrong. Cost depends on what is being built, how well it is understood, and how the work is billed. This guide explains what actually moves the number, so you can compare quotes properly instead of comparing totals.",
      },
      { t: "h2", text: "The five things that set the price" },
      {
        t: "ol",
        items: [
          "Scope. The number of screens, user roles, integrations and edge cases. Two products that look similar can differ enormously underneath.",
          "Integrations. Connecting to payments, a CRM, accounting software or a legacy system is often more work than the visible interface.",
          "Data and security. Handling payments, personal data or regulated records adds design, testing and review time.",
          "Design depth. A working internal tool needs less design effort than a customer-facing product where conversion matters.",
          "Time and certainty. A fixed deadline, or requirements that keep changing, both raise the price.",
        ],
      },
      { t: "h2", text: "Fixed price versus hourly billing" },
      {
        t: "p",
        text: "With fixed-price work you agree deliverables and a total before building starts. The risk of overruns sits with the studio, which is why a good studio insists on a clear written scope first. With hourly or time-and-materials billing you pay for effort as it happens. It is flexible, but the final cost is open, and it rewards slow work.",
      },
      {
        t: "p",
        text: "Neither is always right. Fixed price suits a well-defined product with a clear outcome. Hourly suits exploratory work where the requirements will change as you learn. If a quote does not say which model it uses, ask.",
      },
      { t: "h2", text: "Why quotes from different companies do not match" },
      {
        t: "ul",
        items: [
          "They assumed different scope. One included an admin panel and testing, another did not.",
          "One priced discovery separately, another buried it in the total.",
          "They differ on what happens after launch: bug fixes, hosting, handover and documentation.",
          "Seniority differs. A lower number may mean less experienced people or less testing.",
        ],
      },
      {
        t: "note",
        title: "A practical test",
        text: "Send the same one-page brief to every company and ask each to list what is included, what is not, and how changes are priced. The comparison becomes obvious.",
      },
      { t: "h2", text: "Questions to ask before you sign" },
      {
        t: "ul",
        items: [
          "What exactly is included, and what would cost extra?",
          "Who will actually build this, and can I speak to them directly?",
          "How often will I see working software?",
          "Who owns the code, and when does ownership transfer?",
          "What happens if something breaks after launch?",
          "Can you show me live work I can check myself?",
        ],
      },
      { t: "h2", text: "How we price at Catalyst Labs" },
      {
        t: "p",
        text: "We do not publish a rate card, because scope varies too much for one to mean anything. Every engagement starts with discovery: mapping how the work moves through your business and what a fix is worth. That produces a written scope, success criteria and a fixed proposal, so you know the price before building starts. Code ownership transfers to you once the project is in production and the bug-fix period is complete.",
      },
      {
        t: "p",
        text: "If you are comparing studios, you can [start with a short brief](/contact) and we will tell you what it would take, or [read how a project runs](/process).",
      },
    ],
  },
  {
    slug: "ai-automation-for-small-business-where-to-start",
    title: "AI automation for small business: where to start",
    seoTitle: "AI Automation for Small Business: Where to Start",
    description:
      "How to pick your first AI automation project: what to look for, what to avoid, and how to keep a person in the loop so it actually works.",
    date: "2026-11-05",
    readMinutes: 6,
    tags: ["AI automation", "Small business"],
    related: [
      { label: "AI automation services", href: "/services/ai-automation" },
      { label: "AI automation in Chennai", href: "/ai-automation-chennai" },
    ],
    body: [
      {
        t: "p",
        text: "Most small businesses meet AI as a chat window that answers questions and changes nothing. The useful kind is quieter: a system that reads the enquiry, checks your records, applies your rules, writes the update and flags the cases a person should handle. This is how to choose the first one.",
      },
      { t: "h2", text: "What makes a good first project" },
      {
        t: "ul",
        items: [
          "It is repetitive. Someone does the same steps many times a week.",
          "It follows rules you could write down, even if there are exceptions.",
          "The data it needs already exists somewhere: email, a spreadsheet, a CRM, your documents.",
          "A mistake is recoverable. Start where an error means a quick correction, not a lost customer.",
          "You can measure it: hours saved, response time, or errors avoided.",
        ],
      },
      { t: "h2", text: "Good first candidates" },
      {
        t: "ul",
        items: [
          "Triaging incoming enquiries and routing them to the right person.",
          "Drafting and sending follow-ups on quotes or leads.",
          "Pulling data out of invoices, forms or documents into your system.",
          "Answering common questions from your own documents, with a person taking the rest.",
          "Producing a weekly report that someone currently assembles by hand.",
        ],
      },
      { t: "h2", text: "What to avoid first" },
      {
        t: "ul",
        items: [
          "Anything where a wrong answer is costly and no one reviews it.",
          "A project with no clear owner inside your business.",
          "Automating a process that is itself broken. Fix the process, then automate it.",
          "Buying a tool before you know the problem.",
        ],
      },
      { t: "h2", text: "Keep a person in the loop" },
      {
        t: "p",
        text: "The reliable pattern is automation for the routine cases and a clear handoff to a person for the unclear ones. The system should say when it is unsure, log what it did, and make it easy to correct. Before it goes live, it should be tested against real examples from your business, not invented ones.",
      },
      { t: "h2", text: "A simple way to start" },
      {
        t: "ol",
        items: [
          "List the tasks your team repeats most. Rank them by hours per week.",
          "Pick one that follows rules and uses data you already have.",
          "Write down what a correct result looks like, with ten real examples.",
          "Build it with human review, run it alongside the manual process, and compare.",
          "Only then widen it.",
        ],
      },
      {
        t: "note",
        title: "Not everything needs AI",
        text: "If a form, a database query or a scheduled job solves the problem more cheaply and reliably, use that. See [when not to use AI](/blog/when-not-to-use-ai).",
      },
      {
        t: "p",
        text: "If you want a second opinion on which task to start with, [tell us what your team repeats most](/contact) and we will say honestly whether it is a good fit.",
      },
    ],
  },
  {
    slug: "when-not-to-use-ai",
    title: "When not to use AI (and what to use instead)",
    seoTitle: "When Not to Use AI, and What to Use Instead",
    description:
      "A practical checklist for deciding whether a problem needs AI at all, and the simpler tools that often solve it better and cheaper.",
    date: "2026-11-05",
    readMinutes: 5,
    tags: ["AI automation", "Decision guide"],
    related: [
      { label: "AI and automation", href: "/services/ai-automation" },
      { label: "Custom software", href: "/services/custom-software" },
    ],
    body: [
      {
        t: "p",
        text: "AI is now the default answer to every business problem, which is a good reason to be careful. A language model is the right tool for some jobs and an expensive, unreliable one for others. Choosing well saves money and avoids systems that quietly get things wrong.",
      },
      { t: "h2", text: "A quick test" },
      {
        t: "p",
        text: "Ask three questions. Could you write the rule down exactly? Is the input always in the same shape? Does the answer have to be right every time? If the answer to all three is yes, you probably do not need AI. You need ordinary software.",
      },
      { t: "h2", text: "Use something simpler when" },
      {
        t: "ul",
        items: [
          "The logic is fixed. A formula, a threshold or an if-then rule is cheaper, faster and fully predictable.",
          "The data is structured. A database query or a report does it without guessing.",
          "It runs on a schedule. A scheduled job, not a model, sends the weekly email.",
          "Mistakes are costly and unreviewable, such as tax computation or payments. These need deterministic code and tests.",
          "A form would do. If you only need information in a fixed shape, ask for it in that shape.",
        ],
      },
      { t: "h2", text: "AI earns its place when" },
      {
        t: "ul",
        items: [
          "The input is messy: free-text emails, documents, voice, images.",
          "The task needs judgement across context, such as classifying an enquiry or summarising a thread.",
          "The volume is high enough that doing it by hand does not scale.",
          "A wrong answer is recoverable, or a person reviews the uncertain cases.",
        ],
      },
      { t: "h2", text: "The best systems use both" },
      {
        t: "p",
        text: "In practice the strongest setups combine them: a model reads the messy input and turns it into structured data, then ordinary code applies your rules, updates your systems and decides who should review. The model handles the unclear part. Everything else stays predictable and testable.",
      },
      {
        t: "note",
        title: "Our position",
        text: "If a simpler tool solves your problem, we will tell you and build that instead. We would rather lose an AI project than ship one you did not need.",
      },
      {
        t: "p",
        text: "Not sure which side of the line your problem sits on? [Describe it in a few sentences](/contact), or read [where to start with AI automation](/blog/ai-automation-for-small-business-where-to-start).",
      },
    ],
  },
  {
    slug: "how-to-choose-a-software-development-company-in-chennai",
    title: "How to choose a software development company in Chennai",
    seoTitle: "How to Choose a Software Company in Chennai | Catalyst Labs",
    description:
      "A checklist for choosing a software development company in Chennai: what to verify, what to ask, and the red flags that should make you walk away.",
    date: "2026-11-05",
    readMinutes: 6,
    tags: ["Chennai", "Choosing a vendor"],
    related: [
      { label: "Software development in Chennai", href: "/software-development-chennai" },
      { label: "Our work", href: "/work" },
    ],
    body: [
      {
        t: "p",
        text: "Chennai has hundreds of software companies, from large services firms to small studios. Most look the same on a website. The differences show up in how they scope, who builds your product and what happens after launch. This checklist helps you tell them apart before you commit money.",
      },
      { t: "h2", text: "1. Verify the business is real" },
      {
        t: "ul",
        items: [
          "Ask for the registration details and check them on the official portal. Indian MSMEs have a public Udyam registration number.",
          "Confirm the legal entity that will sign the contract and issue the invoice.",
          "Look for a named person you can speak to, not only a contact form.",
        ],
      },
      { t: "h2", text: "2. Ask to see live work" },
      {
        t: "p",
        text: "A portfolio of screenshots proves little. Ask for links to real, live sites or systems you can open yourself, and for what exactly the company built. Be wary of vague claims about unnamed clients.",
      },
      { t: "h2", text: "3. Understand who will build it" },
      {
        t: "ul",
        items: [
          "Will you speak to the people doing the work, or only to a sales contact?",
          "Is the work done in-house or outsourced?",
          "What happens if the main person is unavailable?",
        ],
      },
      { t: "h2", text: "4. Insist on a written scope" },
      {
        t: "p",
        text: "A proper proposal lists deliverables, what is not included, a timeline, how changes are handled and what you pay when. If a company starts building from a conversation alone, disputes later are likely. See [how we price](/blog/how-much-does-custom-software-cost-in-india) for what a good scope contains.",
      },
      { t: "h2", text: "5. Clarify ownership and handover" },
      {
        t: "ul",
        items: [
          "Who owns the code, and when does ownership transfer?",
          "Will you get documentation and access to your own repository and cloud accounts?",
          "Can another team maintain it if you ever switch?",
        ],
      },
      { t: "h2", text: "6. Ask what happens after launch" },
      {
        t: "p",
        text: "Software needs fixes and updates. Ask about the bug-fix period, hosting, monitoring and how support requests are handled and priced.",
      },
      { t: "h2", text: "Red flags" },
      {
        t: "ul",
        items: [
          "A fixed price with no written scope.",
          "Pressure to pay a large amount upfront.",
          "No live work you can check, or reluctance to share references.",
          "Guaranteed rankings or results nobody can guarantee.",
          "Answers about ownership that change depending on who you ask.",
        ],
      },
      { t: "h2", text: "How we answer these at Catalyst Labs" },
      {
        t: "p",
        text: "Catalyst Labs is a small, founder-led studio in Chennai and a registered Udyam micro enterprise, with the number published on the site. You talk directly to the people building your system, you receive a written scope and fixed proposal before any code, and you can open our [live work](/work) yourself. Code ownership transfers to you after production deployment and the bug-fix period.",
      },
      {
        t: "p",
        text: "If you are comparing companies, send the same brief to each of us. [Start with a short brief](/contact) and see how we answer the checklist above.",
      },
    ],
  },
];

/** Articles plus any published Website Clinic issues (content/clinic.ts). */
export const posts: Post[] = [...articles, ...clinicPosts];

export const getPost =(slug: string) => posts.find((p) => p.slug === slug);
