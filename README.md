# portafolio-arc-dsn

Portafolio académico de Sebastián Rodríguez Contreras — trabajos, materiales y
horarios de la carrera de Ingeniería en Desarrollo de Software.

**Stack:** Astro 5 SSR (Node standalone) · TypeScript strict · vanilla CSS con
design tokens · Puppeteer + Chromium para exportación PDF.

## Comandos

```bash
npm install            # Instalar dependencias
npm run dev            # Dev server (http://localhost:4321)
npm run build          # Build SSR → ./dist/server/entry.mjs
npm run preview        # Preview del build local
npx astro check        # Type-check + diagnostics
```

## Estructura del proyecto

```
src/
├── components/        # .astro reutilizables (PascalCase)
├── content/
│   ├── cuatrimestre-vii/
│   └── cuatrimestre-viii/
├── content.config.ts   # Colecciones: trabajos (md) + materias (json)
├── data/               # subjects.ts, terms.ts
├── layouts/            # Layout.astro, WorkLayout.astro
├── lib/                # utils.ts
├── pages/              # File-based routing (SSR)
└── styles/             # global.css (design tokens + reset)
```

## Agregar un trabajo nuevo

1. Crear archivo `.md` bajo la ruta correcta:
   `src/content/cuatrimestre-<N>/<materia>/unidad-<N>/<trabajo>/index.md`
2. Usar frontmatter con el schema Zod definido en `src/content.config.ts`:
   ```yaml
   ---
   title: "Título del trabajo"
   description: "Descripción corta"
   date: 2026-05-22
   draft: false
   ---
   ```
3. Las imágenes se referencian con rutas absolutas desde `/public/`:
   `![alt](/images/<materia>/archivo.png)`

## Agregar una materia nueva

1. Crear `src/content/cuatrimestre-<N>/<materia-slug>/index.json` con:
   ```json
   {
     "name": "Nombre completo",
     "shortName": "Nombre corto",
     "description": "Descripción",
     "cuatrimestre": "cuatrimestre-vii",
     "color": "#HEX"
   }
   ```
2. Registrar la materia en `src/data/subjects.ts`.

## Agregar un cuatrimestre nuevo

1. Crear `src/content/cuatrimestre-<IX>/horario.md`.
2. Registrar el cuatrimestre en `src/data/terms.ts`.

## Docker

```bash
docker compose up -d --build   # Build + arranca en puerto 50350 (prod slot)
docker compose down             # Detiene y elimina el contenedor
docker compose logs -f          # Sigue los logs
```

El `Dockerfile` está optimizado en 4 stages (deps → builder → prod-deps →
runtime), corre como usuario no-root y produce una imagen ~250 MB.

Variables de entorno reconocidas (todas opcionales con defaults sensatos):

| Variable             | Default                          | Descripción                                |
|----------------------|----------------------------------|--------------------------------------------|
| `HOST`               | `0.0.0.0`                        | Bind address del servidor                  |
| `PORT`               | `80`                             | Puerto interno del contenedor              |
| `PDF_RENDER_ORIGIN`  | `http://127.0.0.1:${PORT}`       | Origin usado por Puppeteer para fetch PDF  |

## Despliegue

El contenedor está mapeado al slot **50350** de la devstation (ver
`~/proyectos/PORTS.md` para la tabla completa de asignación). La URL pública
la expone cloudflared según el dominio configurado.

## Licencia

Uso personal/académico. No redistribuir.
