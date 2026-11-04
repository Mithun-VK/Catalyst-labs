import { buildLlmsTxt, llmsHeaders } from "@/lib/llms";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsTxt(), { headers: llmsHeaders });
}
