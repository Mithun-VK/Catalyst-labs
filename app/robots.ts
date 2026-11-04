import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * AI crawlers are named explicitly so the policy is deliberate rather than
 * inherited from "*". Search and user-triggered agents are what put the site
 * in AI answers; training crawlers are allowed too. To opt out of training
 * only, move GPTBot, ClaudeBot, Google-Extended and Applebot-Extended into a
 * `disallow: "/"` rule - the search/answer bots are unaffected by that.
 */
const AI_CRAWLERS = [
  // OpenAI: training, search index, user-triggered fetch
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic: training, search index, user-triggered fetch
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google Gemini / Apple Intelligence training opt-in tokens
  "Google-Extended",
  "Applebot-Extended",
  // Others
  "CCBot",
  "Meta-ExternalAgent",
  "DuckAssistBot",
  "MistralAI-User",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: ["/api/"] },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
