export type ImpactItem = {
  id: string;
  title: string;
  body: string;
  /** Before / after states, rendered as a small visual comparison. */
  before: string;
  after: string;
};

export const impacts: ImpactItem[] = [
  {
    id: "manual-work",
    title: "Less manual work",
    body:
      "Anything that follows a rule stops needing a person to start it, check it or copy it into the next system.",
    before: "Someone re-keys it",
    after: "It runs on its own",
  },
  {
    id: "response",
    title: "Faster response",
    body:
      "Customers and leads get an answer in seconds, at 2am, on the channel they messaged from.",
    before: "Answered when noticed",
    after: "Answered on arrival",
  },
  {
    id: "conversion",
    title: "Better conversion",
    body:
      "Fewer steps, faster pages and clearer journeys between someone being interested and someone buying.",
    before: "Friction at every step",
    after: "A path with no gaps",
  },
  {
    id: "visibility",
    title: "More visibility",
    body:
      "The numbers that matter come out of the system that holds the work, not out of a monthly export.",
    before: "Ask three people",
    after: "Open the dashboard",
  },
  {
    id: "friction",
    title: "Lower operational friction",
    body:
      "Tools that ignore each other get connected, so information stops being retyped at every handoff.",
    before: "Six disconnected tools",
    after: "One connected system",
  },
];

export type Differentiator = {
  id: string;
  index: string;
  title: string;
  body: string;
};

export const differentiators: Differentiator[] = [
  {
    id: "business-first",
    index: "01",
    title: "Business-first engineering",
    body:
      "We start from what the business is losing - time, leads, accuracy - and work backwards to the smallest system that fixes it. Technology choices come last, not first.",
  },
  {
    id: "ai-native",
    index: "02",
    title: "AI where it earns its place",
    body:
      "We're direct about where a model adds leverage and where a database query, a form or a cron job would do the job better and cheaper. AI is a component, not the pitch.",
  },
  {
    id: "execution",
    index: "03",
    title: "Short feedback loops",
    body:
      "Working software on a staging URL every week from the first build cycle. You redirect the project while redirecting is still cheap, instead of at a reveal.",
  },
  {
    id: "scale",
    index: "04",
    title: "Built to be extended",
    body:
      "Typed code, real data models, tests on the paths that matter and written-down decisions. The second version should be built on the first, not instead of it.",
  },
  {
    id: "partner",
    index: "05",
    title: "One technical partner",
    body:
      "Architecture, design, engineering, automation and deployment handled by the same people. No handoff between an agency and a development shop for you to manage.",
  },
];
