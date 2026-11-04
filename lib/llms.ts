import { site } from "@/lib/site";
import { services } from "@/content/services";
import { projects, alsoBuilt, STATUS_LABEL } from "@/content/projects";
import { processStages } from "@/content/process";
import { caseStudies } from "@/content/case-studies";
import { siteFaqs } from "@/lib/faq";

const u = (path = "") => `${site.url}${path}`;

const header = () =>
  `# ${site.name}

> ${site.description}

${site.name} (also written ${site.alternateName.join(", ")}) is not affiliated with other companies of the same name. Founder: ${site.founder.name}. Contact: ${site.contact.email}, ${site.contact.phoneDisplay}. Registered ${site.registration.classification} under India's ${site.registration.scheme} scheme, ${site.registration.number} (verify at ${site.registration.verifyUrl}).`;

/** Short index for /llms.txt: what the company is, then links. */
export function buildLlmsTxt(): string {
  const lines = [
    header(),
    "",
    "## Pages",
    `- [Home](${u("/")}): overview of what the studio builds`,
    `- [Services](${u("/services")}): the practices offered`,
    `- [Work](${u("/work")}): projects, with status and verifiable detail`,
    `- [AI & Automation](${u("/ai")}): how AI is applied in client systems`,
    `- [Process](${u("/process")}): how an engagement runs, stage by stage`,
    `- [About](${u("/about")}): the studio and its company record`,
    `- [Contact](${u("/contact")}): start an enquiry`,
    "",
    "## Services",
    ...services.map(
      (s) => `- [${s.title}](${u(`/services/${s.id}`)}): ${s.summary}`
    ),
    "",
    "## Optional",
    `- [Full content in one file](${u("/llms-full.txt")})`,
  ];
  return lines.join("\n") + "\n";
}

/** Full plain-markdown content for /llms-full.txt. */
export function buildLlmsFullTxt(): string {
  const out: string[] = [header(), ""];

  out.push("## Services", "");
  for (const s of services) {
    out.push(`### ${s.title}`, `URL: ${u(`/services/${s.id}`)}`, "", s.tagline, "");
    out.push(...s.detail.flatMap((p) => [p, ""]));
    out.push("Deliverables:", ...s.deliverables.map((d) => `- ${d}`), "");
    out.push("Technologies: " + s.stack.join(", "), "");
    out.push(...s.faqs.flatMap((f) => [`**${f.q}**`, f.a, ""]));
  }

  out.push("## Projects", "");
  for (const p of [...projects, ...alsoBuilt]) {
    out.push(
      `### ${p.name}`,
      `Domain: ${p.domain}. Status: ${STATUS_LABEL[p.status]}. Year: ${p.year}.${p.href ? ` URL: ${p.href}` : ""}`,
      "",
      p.summary,
      "",
      p.detail,
      ""
    );
    if (p.proof.length) out.push(...p.proof.map((x) => `- ${x}`), "");
    out.push("Technologies: " + p.technology.join(", "), "");
  }

  out.push("## Case studies", "");
  for (const c of caseStudies) {
    out.push(
      `### ${c.title}`,
      `URL: ${u(`/work/${c.slug}`)}`,
      "",
      c.summary,
      "",
      ...c.results.map((r) => `- ${r.value} ${r.label} (${r.source})`),
      "",
      ...c.notes.map((n) => `Note: ${n}`),
      ""
    );
  }

  out.push("## Process", "");
  for (const st of processStages) {
    out.push(
      `### ${st.index}. ${st.title} (${st.duration})`,
      "",
      st.body,
      "",
      "Output:",
      ...st.output.map((o) => `- ${o}`),
      ""
    );
  }

  out.push("## FAQ", "", ...siteFaqs.flatMap((f) => [`**${f.q}**`, f.a, ""]));
  return out.join("\n");
}

export const llmsHeaders = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "public, max-age=3600, s-maxage=86400",
};
