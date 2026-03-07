---
title: "Recomendaciones de un Compañero — El Roble Eventos"
description: "Evaluación heurística del sitio El Roble Eventos realizada por un compañero, con recomendaciones de mejora en diseño, interacciones y accesibilidad."
date: 2026-03-04
draft: false
order: 5
tags:
  ["UX", "Usabilidad", "Evaluación Heurística", "El Roble", "Recomendaciones"]
---

# Recomendaciones de un Compañero — El Roble Eventos

La siguiente sección documenta el resultado de compartir el sitio **El Roble Eventos** con un compañero para que evaluara el diseño y las interacciones.

**Fecha de revisión:** Marzo 2026  
**Compañero evaluador:** ********\*\*********\_********\*\********* (nombre y firma)  
**Instrumento usado:** Observación directa + formulario de UX heurístico

---

## 1. Recomendaciones Recibidas

| #   | Área                         | Recomendación                                                                                                                                                                                                                      |
| --- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Navegación móvil             | Los ítems "Inicio" y "Preguntas" en el menú móvil no tienen enlace (`href`). El usuario los toca esperando navegar pero no sucede nada. Se recomienda agregar `<Link href="/">` al "Inicio" e implementar o eliminar "Preguntas".  |
| 2   | Retorno desde catálogo       | El único punto de regreso desde el Catálogo es el pequeño breadcrumb "El Roble". No es intuitivo para usuarios nuevos. Se recomienda agregar un botón más prominente o un pie de página con navegación al Inicio.                  |
| 3   | Estado de carga en "Lugares" | Si el backend está caído, la sección "Lugares" aparece completamente vacía sin ningún mensaje. Se recomienda mostrar un estado de error o un placeholder (skeleton) para comunicarle al usuario que el contenido no pudo cargarse. |

---

## 2. Acuerdos y Próximos Pasos

| Recomendación                  | Aceptada  | Prioridad | Responsable |
| ------------------------------ | --------- | --------- | ----------- |
| Fix navegación móvil (1)       | Sí        | Alta      | Sebastián   |
| Botón regreso catálogo (2)     | Sí        | Media     | Sebastián   |
| Estado de error "Lugares" (3)  | Sí        | Alta      | Sebastián   |
| Eliminar Carrousel sin uso (4) | Pendiente | Baja      | Sebastián   |
| Limpiar logos duplicados (5)   | Sí        | Baja      | Sebastián   |
| Accesibilidad PlaceCard (6)    | Sí        | Media     | Sebastián   |

---
