import { renderOgCard } from "@/lib/og";
import { ogCards } from "@/lib/og-cards";

type Params = { path: string[] };

/** Every card is rendered once at build time and served as a static PNG. */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return Object.keys(ogCards).map((route) => {
    const segments = route.slice(1).split("/");
    segments[segments.length - 1] += ".png";
    return { path: segments };
  });
}

export async function GET(_req: Request, { params }: { params: Promise<Params> }) {
  const { path } = await params;
  const route = `/${path.join("/")}`.replace(/\.png$/, "");
  const card = ogCards[route];
  if (!card) return new Response("Not found", { status: 404 });
  return renderOgCard(card);
}
