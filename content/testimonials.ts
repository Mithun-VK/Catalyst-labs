/**
 * Client testimonials. Leave this array empty until a client has approved the
 * exact wording: the Works page renders the section only when entries exist,
 * and no review markup is ever generated from invented text.
 *
 * Add an entry only with the person's written approval, for example:
 *   {
 *     quote: "Their exact words, unedited.",
 *     name: "Full name",
 *     role: "Title",
 *     company: "TAIG Fashion Profiles",
 *     projectSlug: "fashion-profiles",
 *   }
 */

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  projectSlug: string;
};

export const testimonials: Testimonial[] = [];
