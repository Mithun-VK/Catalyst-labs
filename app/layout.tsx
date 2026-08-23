import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/nav/Navbar";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";
import { StructuredData } from "@/components/seo/StructuredData";
import { SpotlightRoot } from "@/components/ui/SpotlightRoot";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { RouteTransition } from "@/components/transitions/RouteTransition";

/**
 * Three families, latin subset, SELF-HOSTED.
 *
 * These were previously pulled via `next/font/google`, which downloads the
 * files at BUILD time — making every build (including Vercel deploys) depend
 * on Google's CDN being healthy. It repeatedly served URLs that 404'd, failing
 * three builds in a row for fonts that never change. The files now live in
 * `app/fonts/` and are fingerprinted and served from our own origin, which
 * also drops the `fonts.gstatic.com` connection at runtime.
 *
 * To update a family: re-download the latin subset woff2 and replace the file.
 */
const instrumentSans = localFont({
  src: "./fonts/InstrumentSans-Variable.woff2",
  variable: "--font-instrument-sans",
  display: "swap",
  // Variable font: declare the range actually used. Nothing sets font-bold.
  weight: "400 600",
});

const jetbrainsMono = localFont({
  src: "./fonts/JetBrainsMono-Variable.woff2",
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: "400 500",
});

const instrumentSerif = localFont({
  src: "./fonts/InstrumentSerif-Italic.woff2",
  variable: "--font-instrument-serif",
  display: "swap",
  weight: "400",
  style: "italic",
  // Used for a handful of accent words only, so it stays off the critical path.
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  // Pages set an absolute title via buildMetadata(); this is the fallback for
  // any route that does not (currently only the 404).
  title: {
    default: `Website & Software Development in Chennai | ${site.name}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  /**
   * Google Search Console. Set GOOGLE_SITE_VERIFICATION in the Vercel project
   * to the token from the "HTML tag" verification method - the bare token
   * only, not the whole meta tag. Omitted entirely when unset, because an
   * empty verification tag is worse than no tag.
   */
  ...(process.env.GOOGLE_SITE_VERIFICATION || process.env.BING_SITE_VERIFICATION
    ? {
        verification: {
          ...(process.env.GOOGLE_SITE_VERIFICATION
            ? { google: process.env.GOOGLE_SITE_VERIFICATION }
            : {}),
          /* Bing Webmaster Tools (msvalidate.01). Bing also feeds Yahoo,
             DuckDuckGo, Ecosia and Copilot, so this one token covers most
             non-Google search surfaces. Easiest path is to import the
             existing Search Console property, which verifies automatically
             and makes this token unnecessary. */
          ...(process.env.BING_SITE_VERIFICATION
            ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } }
            : {}),
        },
      }
    : {}),
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  keywords: [
    "software development company",
    "custom software development",
    "AI automation",
    "AI development company",
    "web application development",
    "mobile app development",
    "SaaS development",
    "business process automation",
    "software development Chennai",
    "software development India",
  ],
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} - Software, AI & Automation Engineering`,
    description: site.shortDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} - Software, AI & Automation Engineering`,
    description: site.shortDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#08090a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      className={`${instrumentSans.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only left-4 top-4 z-(--z-overlay) rounded-xs bg-ember px-4 py-3 text-small font-medium text-on-ember focus:not-sr-only focus:fixed"
        >
          Skip to content
        </a>

        {/* Film grain over the whole surface. Decorative, non-interactive. */}
        <div aria-hidden="true" className="grain" />

        <div id="top" />
        <Navbar />
        <main id="main">
          <RouteTransition>{children}</RouteTransition>
        </main>
        <Footer />
        <StructuredData />
        <SpotlightRoot />
        <CustomCursor />
      </body>
    </html>
  );
}
