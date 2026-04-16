/**
 * Subject registry.
 *
 * Each subject's `slug` MUST match the folder name under src/content/.
 * To add a new subject: add an entry here and create the matching folder.
 */

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
  /** Academic semester */
  semester: string;
  /** Accent color for visual differentiation (CSS custom property value) */
  color: string;
}

export const subjects: Subject[] = [
  {
    termSlug: "cuatrimestre-vii",
    slug: "experiencia-de-usuario",
    name: "Experiencia de Usuario",
    shortName: "UX",
    description:
      "Diseño centrado en el usuario, prototipos, pruebas de usabilidad y arquitectura de información.",
    semester: "2026-1",
    color: "#2563eb",
  },
  {
    termSlug: "cuatrimestre-vii",
    slug: "arquitecturas-de-software",
    name: "Arquitecturas de Software",
    shortName: "Arq. SW",
    description:
      "Patrones arquitectónicos, microservicios, diseño de sistemas y calidad de software.",
    semester: "2026-1",
    color: "#7c3aed",
  },
  {
    termSlug: "cuatrimestre-vii",
    slug: "seguridad-informatica",
    name: "Seguridad Informática",
    shortName: "Seg. Inf.",
    description:
      "Criptografía, seguridad en redes, gestión de vulnerabilidades y políticas de seguridad.",
    semester: "2026-1",
    color: "#dc2626",
  },
];

/** Student info — shown in header / footer */
export const student = {
  name: "Sebastián Rodríguez Contreras",
  career: "Ingeniería en Desarrollo de Software",
  institution: "Universidad Tecnologica de Torreon",
} as const;

/** List all subjects for a given term */
export function getSubjectsByTerm(termSlug: string): Subject[] {
  return subjects.filter((subject) => subject.termSlug === termSlug);
}

/** Look up a subject by term slug and subject slug */
export function getSubjectByTermAndSlug(
  termSlug: string,
  subjectSlug: string,
): Subject | undefined {
  return subjects.find(
    (subject) => subject.termSlug === termSlug && subject.slug === subjectSlug,
  );
}
