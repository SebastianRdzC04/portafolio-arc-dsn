---
title: "Mockups y Wireframes para 'El Roble'"
description: "Muestras de los mockups y wireframes de 2 vistas para el cliente"
date: 2026-02-25
draft: false
order: 2
tags: ["Wireframes", "Mockups", "Diseño"]
---

# Landing — El Roble

## Resumen

Este conjunto de wireframes y mockups documenta el diseño de la landing y la sección "Nosotros" para el proyecto "El Roble". Los artefactos explican la estructura de la información, la jerarquía visual y el comportamiento interactivo esperado (navegación, transición de la barra superior y carrusel de imágenes). El tono es técnico pero legible, pensado para desarrolladores y stakeholders.

## Wireframe — Hero / Landing

![Wireframe: estructura del hero y disposición del contenido](/images/experiencia-de-usuario/wireframe1.jpeg)

El wireframe muestra la distribución principal del hero: título centrado, subtítulo y CTA primario, con una imagen de fondo que marca el eje visual. Se documenta el flujo de información (headline → apoyo → CTA) y la relación espacial entre el hero y la navegación superior.

### Consideraciones funcionales

- El hero debe ser responsivo: en móviles el contenido se apila y la imagen de fondo se recorta con focal-point.
- La imagen de fondo puede servir para contexto visual; emplear un `srcset` o versiones optimizadas para móviles.

## Mockups — Aspecto visual y navegación

![Mockup: estado inicial de la landing](/images/experiencia-de-usuario/mockup1.jpeg)

![Mockup: estado con navegación fija](/images/experiencia-de-usuario/mockup1-1.jpeg)

Los mockups ilustran el comportamiento visual final: tipografías aplicadas, espaciados, paleta y la transición de la barra de navegación. La navbar cambia sutilmente su fondo y contraste al hacer scroll para mantener legibilidad sin restar protagonismo al contenido.

### Reglas de interacción

- La barra superior se transforma mediante una clase (`.scrolled`) activada con `IntersectionObserver` o escucha de `scroll` con throttling.
- Mantener contraste accesible (WCAG AA) entre texto y fondo en ambos estados.

## Wireframe — Sección "Nosotros"

![Wireframe: disposición de la sección "Nosotros"](/images/experiencia-de-usuario/wireframe2.jpeg)

El wireframe de "Nosotros" plantea una tarjeta central dividida en dos columnas: izquierda para un carrusel de imágenes y derecha para la biografía o manifiesto del cliente. La intención es equilibrar imagen y texto, con foco en la legibilidad.

## Mockups — Comportamiento del carrusel

![Mockup: vista del carrusel y contenido asociado](/images/experiencia-de-usuario/mockup2.jpeg)

![Mockup: interacción del carrusel](/images/experiencia-de-usuario/mockup2-1.jpeg)

Los mockups muestran la animación del carrusel y la persistencia del texto en la columna derecha. El carrusel cambia mediante un intervalo de tiempo

### Accesibilidad y rendimiento

- Proporcionar `alt` descriptivos para todas las imágenes; evitar dependencias puramente visuales.
- Cargar imágenes con `loading="lazy"` y servir versiones adecuadas por tamaño para reducir peso.
