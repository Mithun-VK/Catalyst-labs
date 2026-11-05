import Link from "next/link";
import { Fragment } from "react";

/**
 * Renders post text, turning [label](/path) into internal links. Only
 * site-relative paths are linked; anything else is printed as plain text, so
 * content can never inject an external or script URL.
 */
export function InlineText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(<Fragment key={i++}>{text.slice(last, m.index)}</Fragment>);
    parts.push(
      <Link key={i++} href={m[2]} className="text-ember underline underline-offset-4 hover:no-underline">
        {m[1]}
      </Link>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(<Fragment key={i++}>{text.slice(last)}</Fragment>);
  return <>{parts}</>;
}
