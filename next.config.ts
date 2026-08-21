import type { NextConfig } from "next";

/**
 * Security headers. No third-party scripts are bundled with the site, so the
 * CSP stays tight by default. If an analytics vendor is added later, extend
 * `script-src` there rather than loosening it globally.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

/** Apex, no www, no trailing slash - enforced by the rules below. */
const CANONICAL_HOST = "catalystlabs.co.in";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // One URL per page. `/about/` must not be a second address for `/about`.
  trailingSlash: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },

  async redirects() {
    return [
      {
        // www → apex, 301, preserving the path.
        source: "/:path*",
        has: [{ type: "host", value: `www.${CANONICAL_HOST}` }],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        /**
         * Keep preview and deployment URLs out of the index.
         *
         * Every `*.vercel.app` host serves the same content as the production
         * domain. Canonical tags alone are a hint, not a directive, so without
         * this the previews compete with the real site for the same queries.
         * The rule matches any host that is not the canonical apex.
         */
        source: "/:path*",
        has: [{ type: "host", value: "(?<host>.*\\.vercel\\.app)" }],
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
