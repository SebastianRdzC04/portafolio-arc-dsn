# AGENTS.md — Coding Agent Guidelines

## Project Overview

Academic portfolio for a Software Engineering student, built with **Astro 5** (SSG),
**TypeScript (strict)**, and **vanilla CSS** with design tokens. Deployed to Cloudflare Pages.
Content is authored in Markdown via Astro Content Collections.

## Build / Dev / Check Commands

```bash
npm run dev          # Start dev server (localhost:4321)
npm run build        # Build static site to ./dist/
npm run preview      # Preview the built site locally
npx astro check      # Run Astro type-checking / diagnostics
```

There is **no linter, formatter, or test framework** configured. No ESLint, Prettier,
Vitest, or Jest. Use `npx astro check` as the primary validation command.
If you add a test framework, prefer Vitest with `npm run test -- path/to/file.test.ts`
for single-file execution.

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Framework    | Astro 5.17+ (static output)         |
| Language     | TypeScript (strict mode)            |
| Styling      | Vanilla CSS with custom properties  |
| Content      | Markdown via Astro Content Collections (Zod schemas) |
| Fonts        | Archivo, Space Grotesk, JetBrains Mono (Google Fonts) |
| Syntax HL    | Shiki (`github-light` theme)        |
| Package mgr  | npm                                 |
| Deploy       | Cloudflare Pages                    |

## Project Structure

```
src/
├── components/       # Reusable .astro components (PascalCase)
├── content/          # Markdown content organized: <subject>/<unit>/<work>/index.md
├── content.config.ts # Single "trabajos" collection with Zod schema + glob loader
├── data/             # Static data (subjects.ts)
├── layouts/          # Layout.astro (HTML shell), WorkLayout.astro (article chrome)
├── lib/              # Utility functions (utils.ts)
├── pages/            # File-based routing: index, 404, [subject]/, [...slug]
└── styles/           # global.css (design tokens + reset)
```

### Images (public/)

```
public/
└── images/
    ├── experiencia-de-usuario/   # Images for UX subject markdown content
    └── arquitecturas-de-software/ # Images for Arq. SW subject markdown content
```

- Store images in `public/images/<subject-slug>/` matching the `src/content/` folder names
- Reference in markdown with absolute paths: `![alt text](/images/<subject-slug>/filename.jpeg)`
- Images in `public/` are served as-is (no Astro optimization) — keep files reasonably sized
- When adding a new subject, create a matching folder under `public/images/`

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
// 3. Data fetching & transformation logic
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
- All data fetching happens in frontmatter (build-time SSG)
- Use `class:list` for conditional classes: `class:list={['base', { 'mod': bool }]}`
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

- Single collection: `trabajos` using `glob({ pattern: '**/*.md', base: './src/content' })`
- Entry IDs encode the path: `<subject>/<unit>/<work>/index`
- Parse IDs with `parseWorkId()` to extract subject, unit, work slugs
- Subjects defined in `src/data/subjects.ts` with slug, name, description, color, units
- Render markdown with `const { Content } = await render(entry)`

### Static Path Generation

```ts
export const getStaticPaths: GetStaticPaths = async () => {
  const works = await getCollection('trabajos', ({ data }) => !data.draft);
  return works.map((entry) => ({
    params: { slug: ... },
    props: { entry, ... },
  }));
};
```

- Always type as `GetStaticPaths`
- Pass needed data via `props` — don't re-fetch in frontmatter
- Use `async` consistently for all `getStaticPaths` functions

### Language

UI text and content are in **Spanish**. Keep all user-facing strings in Spanish.
Code (variables, functions, interfaces, comments) is in **English**.
