/**
 * Renders a JSON-LD block. Content is always built from local constants, so
 * there is no untrusted input to escape - but `<` is still escaped to close
 * off any future path where content becomes dynamic and could break out of
 * the script element.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
