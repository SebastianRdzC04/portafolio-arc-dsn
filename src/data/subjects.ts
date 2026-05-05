/**
 * Subject registry.
 *
 * Each subject entry lives in `src/content/<term>/<subject>/index.json`.
 * To add a new subject: create the matching folder and metadata file.
 */

import { getCollection } from "astro:content";
import { parseSubjectId } from "../lib/utils";

export interface Subject {
  /** Must match term folder name (e.g. "cuatrimestre-vii") */
  termSlug: string;
  /** Must match content folder name (e.g. "experiencia-de-usuario") */
  slug: string;
  /** Full display name */
  name: string;
  /** Short label for tags / badges */
  shortName: string;
  /** Brief description shown on the card */
  description: string;
  /** Academic cuatrimestre */
  cuatrimestre: string;
  /** Accent color for visual differentiation (CSS custom property value) */
  color: string;
  /** Optional display order within the term */
  order?: number;
}

let subjectsCache: Promise<Subject[]> | undefined;

async function loadSubjects(): Promise<Subject[]> {
  const entries = await getCollection("materias");

  return entries
    .map((entry) => {
      const parsed = parseSubjectId(entry.id);

      return {
        termSlug: parsed.term,
        slug: parsed.subject,
        ...entry.data,
      };
    })
    .sort((a, b) => {
      if (a.termSlug !== b.termSlug) {
        return a.termSlug.localeCompare(b.termSlug, undefined, { numeric: true });
      }

      const orderA = a.order ?? Number.POSITIVE_INFINITY;
      const orderB = b.order ?? Number.POSITIVE_INFINITY;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      return a.slug.localeCompare(b.slug, undefined, { numeric: true });
    });
}

export async function getSubjects(): Promise<Subject[]> {
  subjectsCache ??= loadSubjects();
  return subjectsCache;
}

/** Student info — shown in header / footer */
export const student = {
  name: "Sebastián Rodríguez Contreras",
  career: "Ingeniería en Desarrollo de Software",
  institution: "Universidad Tecnologica de Torreon",
} as const;

/** List all subjects for a given term */
export async function getSubjectsByTerm(termSlug: string): Promise<Subject[]> {
  const subjects = await getSubjects();
  return subjects.filter((subject) => subject.termSlug === termSlug);
}

/** Look up a subject by term slug and subject slug */
export async function getSubjectByTermAndSlug(
  termSlug: string,
  subjectSlug: string,
): Promise<Subject | undefined> {
  const subjects = await getSubjects();

  return subjects.find(
    (subject) => subject.termSlug === termSlug && subject.slug === subjectSlug,
  );
}
