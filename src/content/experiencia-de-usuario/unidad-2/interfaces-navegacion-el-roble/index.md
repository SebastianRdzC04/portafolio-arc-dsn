---
title: "Interacciones y Tipo de Navegación — El Roble Eventos"
description: "Mapa de navegación entre interfaces, propiedades que conectan las vistas y análisis del tipo de navegación del sitio web El Roble Eventos."
date: 2026-03-04
draft: false
order: 3
tags: ["Navegación", "UX", "Interfaces", "El Roble", "Interacción"]
---

# Interacciones y Tipo de Navegación — El Roble Eventos

**Proyecto:** El Roble Eventos — Sitio Web Público  
**Tecnología:** Next.js 16 · React 19 · Tailwind CSS v4 · TypeScript  
**Sitio desplegado:** https://elroble.devas.sbs/  
**Materia:** experiencia de usuario  
**Fecha:** Marzo 2026

---

## 1. Descripción General

**El Roble Eventos** es un sitio web público de marketing para un salón de eventos ubicado en Torreón, Coahuila, México. La aplicación consta de **dos interfaces (páginas) principales**:

| Interfaz                  | Ruta                | Descripción                                           |
| ------------------------- | ------------------- | ----------------------------------------------------- |
| **Inicio**                | `/`                 | Página principal: héroe, nosotros, lugares y contacto |
| **Catálogo de Servicios** | `/services-catalog` | Catálogo digital de precios y servicios 2025          |

> Las rutas `/api/places/*` son rutas internas de la capa BFF (Backend For Frontend) y no son visibles para el usuario final.

---

## 2. Interacciones entre Interfaces

### 2.1 Mapa de Navegación

```
┌──────────────────────────────────────────────────────┐
│                    NavBar (global)                    │
│  [Inicio]  ──────── href="/"                         │
│  [Catalogo de Servicios 2025]  ── href="/services-   │
│                                       catalog"        │
└──────────────────────────────────────────────────────┘
         │                               │
         ▼                               ▼
┌─────────────────┐             ┌──────────────────────┐
│   INTERFAZ 1    │             │     INTERFAZ 2        │
│   Inicio  (/)   │             │ Catálogo de Servicios │
│                 │             │  (/services-catalog)  │
│ • Landing       │◀────────────│                       │
│ • About Us      │  MainHero:  │ • MainHero            │
│ • Lugares       │  <Link      │ • IntroSection        │
│ • ContactLocate │  href="/">  │ • FrontPage (×3)      │
└─────────────────┘  "El Roble" │ • Menu + MenuItem     │
                                │ • SectionDivider      │
                                │ • ExtraServiceCard    │
                                └──────────────────────┘
```

### 2.2 Interfaz 1 → Interfaz 2: NavBar

**Componente:** `NavBar.tsx`  
**Propiedad:** `<Link href="/services-catalog">Catalogo de Servicios 2025</Link>`

La barra de navegación (visible únicamente en la Interfaz 1) contiene el enlace que dirige al usuario al catálogo:

```tsx
// NavBar.tsx — Desktop
<Link href="/services-catalog" className="...">
  Catalogo de Servicios 2025
</Link>

// NavBar.tsx — Mobile (menú hamburguesa)
<Link href="/services-catalog">
  Catalogo de Servicios 2025
</Link>
```

![NavBar en desktop — Inicio con los dos enlaces de navegación](/images/experiencia-de-usuario/elroble-navbar-desktop.png)

![NavBar en móvil — menú hamburguesa abierto](/images/experiencia-de-usuario/elroble-navbar-mobil.png)

**Comportamiento importante:** El `NavBar` se oculta completamente cuando la ruta activa es `/services-catalog`:

```tsx
// NavBar.tsx
const hideMenuIn = ["/login", "/services-catalog"];
if (hideMenuIn.includes(pathname)) return null;
```

Esto significa que **una vez en el Catálogo, la NavBar desaparece**. El catálogo funciona como una experiencia standalone, similar a un PDF imprimible.

---

### 2.3 Interfaz 2 → Interfaz 1: MainHero

**Componente:** `MainHero.tsx`  
**Propiedad:** `<Link href="/">El Roble</Link>`

En la parte superior del Catálogo, el componente `MainHero` renderiza un breadcrumb/pill de navegación que lleva de regreso al Inicio:

```tsx
// MainHero.tsx
<nav>
  <Link href="/" className="...">
    El Roble
  </Link>
</nav>
```

Este enlace aparece en la esquina superior izquierda del catálogo y es el **único punto de regreso** a la Interfaz 1, ya que la NavBar está oculta en esta ruta.

<!-- PENDIENTE: subir captura del encabezado del catálogo mostrando el botón "El Roble" en la esquina superior izquierda -->

![Breadcrumb "El Roble" en el catálogo — único punto de retorno a Inicio](/images/experiencia-de-usuario/elroble-services-catalog-mobile.png)

![Breadcrumb "El Roble" en el catálogo — único punto de retorno a Inicio](/images/experiencia-de-usuario/elroble-services-catalog.png)

---

### 2.4 Resumen de Interacciones

| Acción del usuario                             | Componente             | Propiedad                         | Resultado                        |
| ---------------------------------------------- | ---------------------- | --------------------------------- | -------------------------------- |
| Clic en "Catalogo de Servicios 2025" (desktop) | `NavBar`               | `<Link href="/services-catalog">` | Navega a Interfaz 2              |
| Clic en "Catalogo de Servicios 2025" (móvil)   | `NavBar` (hamburguesa) | `<Link href="/services-catalog">` | Navega a Interfaz 2              |
| Clic en "El Roble" (breadcrumb en catálogo)    | `MainHero`             | `<Link href="/">`                 | Regresa a Interfaz 1             |
| Clic en "Inicio" (NavBar desktop)              | `NavBar`               | `<Link href="/">`                 | Permanece / regresa a Interfaz 1 |

> **Nota:** En el menú móvil, los ítems "Inicio" y "Preguntas" **no tienen `href` funcional** — son elementos `<li>` planos. Solo el enlace al Catálogo en móvil está conectado correctamente.

---

### 2.5 Links Externos (Navegación Contextual)

Desde ambas interfaces existen enlaces a servicios externos que aparecen dentro del contenido donde tienen sentido semántico:

| Interfaz   | Sección       | Elemento            | Destino                       |
| ---------- | ------------- | ------------------- | ----------------------------- |
| Interfaz 1 | ContactLocate | "El Roble Eventos"  | Facebook — El Roble Eventos   |
| Interfaz 1 | ContactLocate | "@el_roble.eventos" | Instagram — @el_roble.eventos |
| Interfaz 1 | ContactLocate | Mapa embebido       | Google Maps iframe (Torreón)  |
| Interfaz 2 | MainHero      | Dirección física    | Google Maps — ubicación       |
| Interfaz 2 | Footer        | "SebasDevRC"        | Portafolio del desarrollador  |

---

## 3. Tipo de Navegación

### 3.1 Definición Conceptual

Existen cuatro tipos principales de navegación en aplicaciones web:

| Tipo           | Descripción                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------------- |
| **Jerárquica** | El usuario navega de niveles generales a específicos (padre → hijo). Estructura de árbol entre páginas. |
| **Lineal**     | El usuario avanza en una secuencia predefinida (paso 1 → 2 → 3). Sin posibilidad de saltar pasos.       |
| **Asociativa** | El usuario navega entre contenidos relacionados sin jerarquía fija (estilo Wikipedia).                  |
| **Contextual** | Los enlaces aparecen dentro del contenido, relacionados semánticamente con lo que el usuario lee.       |

---

### 3.2 Navegación Jerárquica (entre páginas)

La estructura de rutas sigue una jerarquía de **un nivel de profundidad**:

```
/  (Inicio — raíz)
└── /services-catalog  (hija)
```

El usuario parte de la raíz (Inicio) y puede descender a la página hija (Catálogo). El regreso se realiza con el breadcrumb "El Roble" en `MainHero`.

```
┌─────────────────────────────────────────┐
│              RAÍZ: Inicio (/)            │
│  ┌─────────────┐   ┌────────────────┐   │
│  │  NavBar     │──▶│  /services-    │   │
│  │  Link       │   │   catalog      │   │
│  └─────────────┘   │  (página hija) │   │
│                    └────────────────┘   │
│                           │             │
│                    MainHero Link (/)    │
│                    ◀──────────────────  │
└─────────────────────────────────────────┘
```

![Navegación jerárquica — NavBar con enlace a /services-catalog](/images/experiencia-de-usuario/navegacion-services-catalog.png)

> **¿Por qué es jerárquica?** El Inicio es el punto de entrada natural con la navegación principal. El Catálogo es un destino secundario accesible desde el Inicio. La profundidad es de 1 nivel.

---

### 3.3 Navegación Lineal (dentro de cada página — scroll)

Dentro de cada interfaz, el contenido se presenta en **orden lineal y fijo** que el usuario recorre de arriba hacia abajo con scroll. No existen anclas internas ni menú de secciones para saltar.

**Interfaz 1 — Inicio:**

```
[1] Landing (Héroe con fondo parallax)
        ↓ scroll
[2] About Us (Nosotros + slideshow)
        ↓ scroll
[3] Places (Tarjetas de espacios)
        ↓ scroll
[4] ContactLocate (Mapa + contacto)
        ↓ scroll
[5] Footer
```

**Interfaz 2 — Catálogo de Servicios:**

```
[1]  MainHero (Encabezado + logo)
        ↓ scroll
[2]  IntroSection (Fotos + bienvenida)
        ↓ scroll
[3]  FrontPage: Salón ($3,000)
        ↓ scroll
[4]  Menu: Detalle Salón El Roble
        ↓ scroll
[5]  FrontPage: Alberca ($2,500)
        ↓ scroll
[6]  Menu: Detalle Alberca
        ↓ scroll
[7]  FrontPage: Salón/Quinta ($4,500)
        ↓ scroll
[8]  Menu: Detalle Salón/Quinta
        ↓ scroll
[9]  SectionDivider: Servicios Adicionales
        ↓ scroll
[10] Menu: Salas Lounge
        ↓ scroll
[11] Menu: Mesa de Campo
        ↓ scroll
[12] Menu: Servicios Extra
        ↓ scroll
[13] Footer (créditos)
```

![Navegación lineal — secuencia de secciones en el catálogo de servicios](/images/experiencia-de-usuario/services-catalog.png)

> **¿Por qué es lineal?** El usuario no puede saltar entre secciones dentro de la misma página. El contenido está diseñado para consumirse en secuencia, como un folleto físico que se hojea de inicio a fin.

---

### 3.4 Navegación Contextual (links externos en contexto)

Los enlaces a redes sociales, Google Maps y recursos externos aparecen **dentro del contenido relacionado**, no en menús separados:

```
┌──────────────────────────────────────────────────┐
│  SECCIÓN: Contacto (ContactLocate.tsx)            │
│                                                  │
│  Redes Sociales:                                 │
│  • [El Roble Eventos] ──────────▶ facebook.com   │
│  • [@el_roble.eventos] ─────────▶ instagram.com  │
│                                                  │
│  [Mapa embebido de Google Maps]                  │
└──────────────────────────────────────────────────┘
```

<!-- PENDIENTE: subir captura de la sección Contacto con los íconos de redes sociales y el mapa embebido visibles -->

![Navegación contextual — links a redes sociales y mapa en la sección de contacto](/images/experiencia-de-usuario/nav-social-mobil.png)

![Navegación contextual — links a redes sociales y mapa en la sección de contacto](/images/experiencia-de-usuario/nav-social.png)

> **¿Por qué es contextual?** Los links no forman parte de un menú global; aparecen donde el contenido los hace relevantes. El usuario que llega a "Contacto" ya tiene contexto de dónde está y qué representan esos links.

---

### 3.5 Justificación y Conclusión

| Tipo           | Presente | Evidencia                                                                                                        |
| -------------- | -------- | ---------------------------------------------------------------------------------------------------------------- |
| **Jerárquica** | Sí       | Rutas `/ → /services-catalog`; `NavBar` con `<Link href="/services-catalog">` y `MainHero` con `<Link href="/">` |
| **Lineal**     | Sí       | Componentes renderizados secuencialmente en `page.tsx`; sin anclas o menú interno de secciones                   |
| **Contextual** | Sí       | Links a redes sociales en `ContactLocate`, link a Maps en `MainHero`, link al portafolio en el footer            |
| **Asociativa** | No       | No existe sistema de recomendaciones, tags cruzados ni enlaces entre contenidos relacionados                     |

**Conclusión:** Este proyecto utiliza principalmente **navegación lineal** (dentro de cada página) combinada con **navegación jerárquica** (entre las dos páginas). La navegación contextual complementa la experiencia con links externos relevantes. Este modelo es apropiado para un sitio de marketing de un solo servicio donde el objetivo es que el usuario consuma la información en orden y finalmente se contacte con el negocio.
