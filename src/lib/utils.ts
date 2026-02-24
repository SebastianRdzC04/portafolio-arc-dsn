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
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Parse a content-collection entry id into its constituent parts.
 *
 * Given an id like "experiencia-de-usuario/unidad-1/investigacion-ux/index"
 * returns:
 *   { subject: "experiencia-de-usuario", unit: "unidad-1", work: "investigacion-ux", file: "index" }
 */
export interface ParsedWorkId {
  subject: string;
  unit: string;
  work: string;
  file: string;
}

export function parseWorkId(id: string): ParsedWorkId {
  const parts = id.split('/');
  return {
    subject: parts[0] ?? '',
    unit: parts[1] ?? '',
    work: parts[2] ?? '',
    file: parts[3] ?? '',
  };
}

/**
 * Group an array of items by a key extracted via `keyFn`.
 * Returns a Map to preserve insertion order.
 */
export function groupBy<T>(items: T[], keyFn: (item: T) => string): Map<string, T[]> {
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
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Sort items by date descending (newest first).
 */
export function sortByDateDesc<T extends { data: { date: Date } }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/**
 * Sort items by optional order field, falling back to date.
 */
export function sortByOrder<T extends { data: { order?: number; date: Date } }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const orderA = a.data.order ?? Infinity;
    const orderB = b.data.order ?? Infinity;
    if (orderA !== orderB) return orderA - orderB;
    return a.data.date.valueOf() - b.data.date.valueOf();
  });
}
