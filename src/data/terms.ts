/**
 * Term registry.
 *
 * Each term `slug` MUST match the folder name under src/content/.
 */

export interface Term {
  /** Must match content folder name (e.g. "cuatrimestre-vii") */
  slug: string;
  /** Full display name */
  name: string;
  /** Short label for compact UI */
  shortName: string;
  /** Roman numeral label */
  numeral: string;
  /** Brief description shown on cards */
  description: string;
  /** Academic period */
  period: string;
  /** Accent color for visual differentiation */
  color: string;
}

export const terms: Term[] = [
  {
    slug: "cuatrimestre-vii",
    name: "Cuatrimestre VII",
    shortName: "Cuat. VII",
    numeral: "VII",
    description:
      "Materias, entregables y evidencias del septimo cuatrimestre de Ingenieria en Desarrollo de Software.",
    period: "Enero - Abril 2026",
    color: "var(--color-accent)",
  },
];

/** Look up a term by its slug */
export function getTermBySlug(slug: string): Term | undefined {
  return terms.find((term) => term.slug === slug);
}
