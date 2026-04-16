/**
 * Shared utility functions.
 * Keep this file lean — only pure helpers that are reused across 2+ files.
 */

/**
 * Convert a slug like "unidad-1" into a human-readable label: "Unidad 1".
 * Works for any kebab-case string.
 */
export function slugToLabel(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Parsed shape for any markdown entry id in src/content/.
 */
export interface ParsedContentId {
  term: string;
  subject: string;
  unit: string;
  work: string;
  file: string;
  isSchedule: boolean;
}

/**
 * Parse a content-collection entry id into its constituent parts.
 *
 * Supported formats:
 * - "cuatrimestre-vii/horario"
 * - "cuatrimestre-vii/experiencia-de-usuario/unidad-1/investigacion-ux/index"
 * - "cuatrimestre-vii/arquitecturas-de-software/unidad-2/modelado/documento-tecnico"
 */
export function parseContentId(id: string): ParsedContentId {
  const parts = id.split("/");
  const term = parts[0] ?? "";
  const section = parts[1] ?? "";

  if (section === "horario" && parts.length === 2) {
    return {
      term,
      subject: "",
      unit: "",
      work: "",
      file: "horario",
      isSchedule: true,
    };
  }

  return {
    term,
    subject: section,
    unit: parts[2] ?? "",
    work: parts[3] ?? "",
    file: parts[4] ?? "index",
    isSchedule: false,
  };
}

/**
 * Parsed shape for work entries.
 */
export interface ParsedWorkId {
  term: string;
  subject: string;
  unit: string;
  work: string;
  file: string;
}

/**
 * Parse a work id (non-schedule content).
 */
export function parseWorkId(id: string): ParsedWorkId {
  const parsed = parseContentId(id);

  return {
    term: parsed.term,
    subject: parsed.subject,
    unit: parsed.unit,
    work: parsed.work,
    file: parsed.file,
  };
}

/**
 * Returns true when the id corresponds to a term schedule file.
 */
export function isScheduleEntryId(id: string): boolean {
  return parseContentId(id).isSchedule;
}

/**
 * Returns true when the id corresponds to a work file.
 */
export function isWorkEntryId(id: string): boolean {
  const parsed = parseContentId(id);

  return (
    !parsed.isSchedule &&
    parsed.term !== "" &&
    parsed.subject !== "" &&
    parsed.unit !== "" &&
    parsed.work !== "" &&
    parsed.file !== ""
  );
}

/**
 * Group an array of items by a key extracted via `keyFn`.
 * Returns a Map to preserve insertion order.
 */
export function groupBy<T>(
  items: T[],
  keyFn: (item: T) => string,
): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    const group = map.get(key);
    if (group) {
      group.push(item);
    } else {
      map.set(key, [item]);
    }
  }
  return map;
}

/**
 * Format a Date as a locale-friendly string (Spanish).
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Sort items by date descending (newest first).
 */
export function sortByDateDesc<T extends { data: { date: Date } }>(
  items: T[],
): T[] {
  return [...items].sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
}

/**
 * Sort items by optional order field, falling back to date.
 */
export function sortByOrder<T extends { data: { order?: number; date: Date } }>(
  items: T[],
): T[] {
  return [...items].sort((a, b) => {
    const orderA = a.data.order ?? Infinity;
    const orderB = b.data.order ?? Infinity;
    if (orderA !== orderB) return orderA - orderB;
    return a.data.date.valueOf() - b.data.date.valueOf();
  });
}
