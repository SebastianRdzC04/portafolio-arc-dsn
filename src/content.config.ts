import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * Works stay in `trabajos`, while subject metadata now lives in `materias`.
 *
 * `trabajos` scans every .md file under src/content/.
 * `materias` scans every index.json file under each subject folder.
 * The generated `id` preserves the full relative path, e.g.:
 *   "cuatrimestre-vii/experiencia-de-usuario/unidad-1/investigacion-ux/index"
 *   "cuatrimestre-vii/experiencia-de-usuario/index"
 *   "cuatrimestre-vii/horario"
 *
 * This lets us parse term, subject, unit, and work slug from the id itself.
 */
const trabajos = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    image: z.string().optional(),
    draft: z.boolean().default(false),
    order: z.number().optional(),
    tags: z.array(z.string()).optional(),
    isSection: z.boolean().optional(),
  }),
});

const materias = defineCollection({
  loader: glob({
    pattern: "**/index.json",
    base: "./src/content",
    generateId: ({ entry }) => entry.replace(/\.json$/, ""),
  }),
  schema: z.object({
    name: z.string(),
    shortName: z.string(),
    description: z.string(),
    cuatrimestre: z.string(),
    color: z.string(),
    order: z.number().optional(),
  }),
});

export const collections = { trabajos, materias };
