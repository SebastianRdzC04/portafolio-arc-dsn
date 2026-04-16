import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * Single collection for all academic works across all subjects.
 *
 * The glob loader scans every .md file under src/content/.
 * The generated `id` preserves the full relative path, e.g.:
 *   "cuatrimestre-vii/experiencia-de-usuario/unidad-1/investigacion-ux/index"
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

export const collections = { trabajos };
