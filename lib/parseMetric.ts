/**
 * Splits a recorded proof line into an animatable number, if it has one.
 *
 * Proof entries are real sentences ("ROC AUC 0.908 on held-out evaluation",
 * "102 automated tests passing"), not bare figures, so this never invents a
 * value - it only locates the number already present in the fact and hands
 * back enough to animate just that token while the rest of the sentence
 * renders as plain text around it. Entries with no number (e.g. "Full test
 * suite passing") return null and are left as ordinary text.
 */
export type ParsedMetric = {
  prefix: string;
  value: number;
  /** Decimal places in the source, so 0.908 counts up as 0.908, not 0.9080000001. */
  decimals: number;
  suffix: string;
};

export function parseMetric(text: string): ParsedMetric | null {
  // A decimal is unambiguous ("ROC AUC 0.908") - product codes and region
  // names ("EC2", "ap-south-1", "B2B") are never written with a decimal
  // point, so it is safe to match one anywhere in the sentence.
  //
  // A plain integer is only trusted at the very start of the sentence
  // ("102 automated tests passing"). Without that anchor, `/\d+/` also
  // matches the digits inside "AWS EC2", "ap-south-1" and "B2B buyer" -
  // real facts, but not the metric the sentence is stating, and animating
  // them as a counter mid-word reads as a rendering bug, not a feature.
  const decimal = text.match(/\d+\.\d+/);
  const match = decimal ?? text.match(/^\d+/);
  if (!match || match.index === undefined) return null;

  const raw = match[0];
  const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;

  return {
    prefix: text.slice(0, match.index),
    value: Number(raw),
    decimals,
    suffix: text.slice(match.index + raw.length),
  };
}
