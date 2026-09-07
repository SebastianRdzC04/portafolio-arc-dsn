# AGENTS.md — Coding Agent Guidelines

## Project Overview

Academic portfolio for a Software Engineering student, built with **Astro 5** (SSR),
**TypeScript (strict)**, and **vanilla CSS** with design tokens. Served by the
`@astrojs/node` adapter in `standalone` mode. Optional PDF export uses
**Puppeteer + Chromium** (Alpine) for headless rendering.

> **Deployment reality (2026-09-06):** previously described as deployed to
> Cloudflare Pages, but `astro.config.mjs` uses `output: 'server'` with the
> Node adapter — this is **SSR**, not SSG. Cloudflare Pages cannot host this
> config as-is (would need the Cloudflare adapter). The current deploy target
> is the **Node standalone server** running in Docker on this devstation
> (port `50350` prod, slot reserved in `~/proyectos/PORTS.md`).

Content is authored in Markdown + JSON via Astro Content Collections and
organized by **cuatrimestre** (`cuatrimestre-vii`, `cuatrimestre-viii`, …).

## Build / Dev / Check Commands

```bash
npm run dev          # Start dev server (localhost:4321)
npm run build        # Build SSR server to ./dist/server/entry.mjs
npm run preview      # Preview the built SSR server locally
npx astro check      # Run Astro type-checking / diagnostics
```

There is **no linter, formatter, or test framework** configured. No ESLint,
Prettier, Vitest, or Jest. Use `npx astro check` as the primary validation
command. If you add a test framework, prefer Vitest with
`npm run test -- path/to/file.test.ts` for single-file execution.

## Tech Stack

| Layer        | Technology                                       |
|--------------|--------------------------------------------------|
| Framework    | Astro 5.17+ (SSR, `output: 'server'`)            |
| Adapter      | `@astrojs/node` (standalone)                     |
| Language     | TypeScript (strict mode)                         |
| Styling      | Vanilla CSS with custom properties               |
| Content      | Markdown + JSON via Astro Content Collections (glob loader, Zod schemas) |
| Fonts        | Archivo, Space Grotesk, JetBrains Mono (Google Fonts) |
| Syntax HL    | Shiki (`github-light` theme)                     |
| PDF export   | Puppeteer + Chromium (Alpine)                    |
| Package mgr  | npm                                              |
| Deploy       | Docker (Node 22 Alpine + Chromium)               |

## Project Structure

```
src/
├── components/        # Reusable .astro components (PascalCase)
├── content/
│   ├── cuatrimestre-vii/
│   │   ├── horario.md
│   │   ├── <materia>/index.json          # subject metadata
│   │   └── <materia>/unidad-N/<work>/index.md
│   └── cuatrimestre-viii/
│       └── ...
├── content.config.ts   # Two collections: `trabajos` (md) + `materias` (json)
├── data/               # Static data (subjects.ts, terms.ts)
├── layouts/            # Layout.astro (HTML shell), WorkLayout.astro (article chrome)
├── lib/                # Utility functions (utils.ts)
├── pages/
│   ├── index.astro
│   ├── 404.astro
│   ├── [term]/index.astro                          # cuatrimestre landing
│   ├── [term]/horario.astro                        # schedule table
│   ├── [term]/[subject]/index.astro                # subject overview
│   ├── [term]/[subject]/[...slug].astro            # work detail page
│   ├── [term]/[subject]/pdf.astro                  # PDF render trigger
│   └── api/pdf.ts                                  # Puppeteer-based PDF endpoint
└── styles/             # global.css (design tokens + reset)
```

### Images (public/)

```
public/
└── images/
    ├── experiencia-de-usuario/   # Images for UX subject markdown content
    ├── arquitecturas-de-software/
    ├── global/                   # Cross-cutting assets (logos, etc.)
    └── ...
```

- Store images in `public/images/<subject-slug>/` matching the `src/content/`
  folder names.
- Reference in markdown with absolute paths:
  `![alt text](/images/<subject-slug>/filename.jpeg)`.
- Images in `public/` are served as-is (no Astro optimization) — keep files
  reasonably sized.
- When adding a new subject, create a matching folder under `public/images/`.

## Code Style

### Imports

Follow this strict ordering (no blank lines between groups):

1. Layouts (`import Layout from '../../layouts/Layout.astro'`)
2. Components (`import Header from '../components/Header.astro'`)
3. Data modules (`import { subjects } from '../data/subjects'`)
4. Astro virtual modules (`import { getCollection } from 'astro:content'`)
5. Utility functions (`import { parseWorkId } from '../lib/utils'`)
6. Type-only imports last (`import type { GetStaticPaths } from 'astro'`)

- **No path aliases** — use relative paths (`../`, `../../`)
- Default imports for `.astro` components; named imports for functions/data
- Always use `import type` for type-only imports

### TypeScript

- Strict mode via `astro/tsconfigs/strict` — never weaken it
- **Use `interface`** for all object shapes (never `type` aliases for objects)
- Props are always typed as `interface Props { ... }` in Astro frontmatter
- Destructure props: `const { title, description } = Astro.props`
- Use default values via destructuring: `const { title = 'Default' } = Astro.props`
- Prefer `??` (nullish coalescing) over `||` for fallback values
- Use `?.` (optional chaining) for nullable access
- Zod is imported from `astro/zod` (not a separate dependency)
- Use bounded generics for utility functions: `<T extends { data: { ... } }>`
- Use `as const` for static constant objects

### Astro Components

Every `.astro` file follows this structure in order:

```astro
---
// 1. Imports
// 2. interface Props { ... }
// 3. Data fetching & transformation logic (SSR — runs on every request)
---

<!-- 4. HTML template -->

<script>
  // 5. Client-side JS (only when needed)
</script>

<style>
  /* 6. Scoped CSS (always last) */
</style>
```

- Use `<slot />` for content projection (default slot only)
- Layout composition: Page → WorkLayout → Layout
- **SSR note:** data fetching happens in frontmatter **on every request**
  (not at build time like SSG). Cache expensive lookups with ` Astro.cache`
  or external stores if traffic justifies it.
- Use `class:list` for conditional classes:
  `class:list={['base', { 'mod': bool }]}`
- Pass dynamic CSS values via inline style: `style={`--accent: ${color}`}`

### CSS

- **BEM naming**: `.block__element--modifier` with kebab-case block names
  - Examples: `.hero__title`, `.work-card__footer`, `.header__link--active`
- **100% design tokens** — never hardcode colors, spacing, fonts, shadows, or radii.
  Always reference `var(--token-name)` from `src/styles/global.css`
- Scoped `<style>` in every component; no `is:global` on style tags
- Use `:global()` only for styling rendered markdown content:
  ```css
  .work__content :global(h2) { ... }
  ```
- Mobile-first responsive design with `@media (min-width: ...)` breakpoints:
  - `640px` (sm), `768px` (md), `1024px` (lg)
- Respect `prefers-reduced-motion` for animations
- Only two global utility classes: `.container` (centered wrapper), `.sr-only` (a11y)

### Design Tokens (src/styles/global.css)

Organized in 8 sections on `:root`:

1. **Colors**: `--color-text`, `--color-bg`, `--color-accent`, `--color-border`, etc.
2. **Typography**: `--font-heading`, `--font-body`, `--font-mono`, `--text-sm`..`--text-4xl`
3. **Spacing**: `--space-1` (0.25rem) through `--space-24` (6rem), 4px base grid
4. **Shape**: `--radius-sm`..`--radius-full`
5. **Shadows**: `--shadow-sm`..`--shadow-xl`
6. **Layout**: `--max-width`, `--max-width-narrow`, `--max-width-prose`, `--header-height`
7. **Transitions**: `--transition-fast` (150ms), `--transition-normal`, `--transition-slow`
8. **Z-index**: `--z-base`..`--z-toast`

### Naming Conventions

| Entity               | Convention    | Example                        |
|----------------------|---------------|--------------------------------|
| `.astro` components  | PascalCase    | `SubjectCard.astro`            |
| `.ts` files          | kebab-case    | `subjects.ts`, `utils.ts`      |
| Content dirs         | kebab-case    | `experiencia-de-usuario/`      |
| CSS classes          | BEM/kebab     | `.unit-section__header`        |
| Variables/functions  | camelCase     | `parseWorkId`, `sortedUnits`   |
| Interfaces           | PascalCase    | `Subject`, `ParsedWorkId`      |
| Constants            | camelCase     | `subjects`, `student`          |

### Error Handling

- Dedicated `404.astro` page with Spanish messaging and link to home
- **Always filter drafts** in every `getCollection()` call:
  ```ts
  await getCollection('trabajos', ({ data }) => !data.draft)
  ```
- Render empty states explicitly when collections return no results
- Use `?.` and `??` for null safety — never assume values exist

### Accessibility

- Always provide `aria-label`, `aria-labelledby`, `aria-current` where applicable
- Use semantic HTML: `<nav>`, `<main>`, `<article>`, `<header>`, `<footer>`
- Include `role="list"` when styling removes default list semantics
- Support keyboard navigation with `:focus-visible` styles
- Use `.sr-only` class for screen-reader-only text

### Content Collections

- Two collections, both with `glob` loader and base `./src/content`:
  - `trabajos`: every `.md` under `src/content/`
  - `materias`: every `index.json` under each subject folder
- Entry IDs encode the path: `<term>/<subject>/<unit>/<work>/index`
- Parse IDs with `parseWorkId()` (in `src/lib/utils.ts`) to extract term,
  subject, unit, work slugs
- Subjects defined in `src/data/subjects.ts` (color, units)
- Cuatrimestres defined in `src/data/terms.ts` (name, description)
- Render markdown with `const { Content } = await render(entry)`

### Dynamic Routes (SSR)

The `[term]/[subject]/[...slug]` structure is generated **on every request**
(no `getStaticPaths` for those routes — they're fully dynamic). The
`[term]/[subject]/pdf.astro` page triggers the `api/pdf.ts` endpoint which
uses Puppeteer to render the same page server-side and return a PDF binary.

### PDF Export

- Endpoint: `src/pages/api/pdf.ts`
- Browser: system Chromium at `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser`
- Internal origin: read from `PDF_RENDER_ORIGIN` env var
  (default `http://127.0.0.1:${PORT}`) — **never** the public host, or
  Puppeteer would loop through cloudflared.

### Language

UI text and content are in **Spanish**. Keep all user-facing strings in Spanish.
Code (variables, functions, interfaces, comments) is in **English**.
