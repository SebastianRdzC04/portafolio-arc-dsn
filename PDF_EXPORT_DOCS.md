# 📄 Funcionalidad de Exportación a PDF

## Descripción

Los trabajos académicos pueden descargarse como PDF directamente desde la interfaz. El PDF se genera en el navegador sin almacenar archivos en el servidor, garantizando privacidad y eficiencia.

## Características

- ✅ **Generación en Cliente**: Los PDFs se crean en el navegador del usuario, no en el servidor
- ✅ **Paginado Automático**: Contenido largo se distribuye automáticamente en múltiples páginas A4
- ✅ **Metadatos**: Cada página incluye pie de página con título, fecha y número de página
- ✅ **Alta Calidad**: Renderizado a 2x escala (retina) para mejor nitidez
- ✅ **Nombres Limpios**: Archivos se descargan con nombres descriptivos basados en el título del trabajo
- ✅ **Accesibilidad**: Botón con `aria-label` y feedback de estado en tiempo real
- ✅ **Robustez**: Manejo de imágenes y espera a que carguen antes de renderizar

## Archivos Implementados

### `src/lib/pdf-export.ts`
Módulo TypeScript con la lógica de exportación:

- `exportWorkToPdf(options)`: Función principal que genera y descarga el PDF
- `generatePdfFilename(title, date)`: Genera nombres de archivo limpios y consistentes
- `prepareContentForCapture(element)`: Clona el contenido y espera a que carguen las imágenes
- `captureContentAsCanvas(element)`: Captura el contenido como canvas de alta calidad
- `calculatePages(canvasHeight, pdfHeight)`: Calcula el número de páginas necesarias

### `src/components/PdfExportButton.astro`
Componente Astro que renderiza el botón de descarga:

- Botón con icono de archivo PDF
- Mensaje de estado dinámico (generando, éxito, error)
- Feedback visual con transiciones suaves
- Responsive: solo muestra texto en pantallas ≥ 768px
- Script cliente que maneja clicks y errores

### `src/layouts/WorkLayout.astro`
Cambios en el layout del trabajo:

- Integración del componente `PdfExportButton` en el encabezado
- Nuevo contenedor `.work__header-top` para alinear meta y botón lado a lado
- Responsive: botón se ajusta en móvil

## Uso

### Para el Usuario

1. Abre cualquier trabajo académico
2. Busca el botón **"Descargar PDF"** en el encabezado del trabajo
3. Haz clic en el botón
4. El navegador generará y descargará el PDF automáticamente

El PDF incluirá:
- Título del trabajo
- Fecha de creación
- Todo el contenido markdown renderizado (texto, imágenes, tablas, código)
- Paginación automática si es necesario
- Pie de página con metadatos

### Para el Desarrollador

Si necesitas modificar la funcionalidad:

```typescript
// Exportar un trabajo manualmente
import { exportWorkToPdf, generatePdfFilename } from '../lib/pdf-export';

await exportWorkToPdf({
  filename: generatePdfFilename('Mi Trabajo', new Date()),
  title: 'Mi Trabajo',
  date: new Date(),
  elementSelector: '.work__content', // Selector personalizado si es necesario
});
```

## Configuración

### Dimensiones PDF

Las dimensiones se pueden ajustar en `src/lib/pdf-export.ts`:

```typescript
const PDF_DIMENSIONS: PdfDimensions = {
  pageWidth: 210,      // mm (A4)
  pageHeight: 297,     // mm (A4)
  margins: { 
    top: 15,           // mm
    bottom: 15,        // mm
    left: 15,          // mm
    right: 15,         // mm
  },
};
```

### Captura de Canvas

Para ajustar la escala o formato:

```typescript
const canvas = await html2canvas(element, {
  scale: 2,            // 2x para retina (ajustable)
  backgroundColor: '#ffffff',
  width: 1000,         // Ancho en px
});
```

## Validación

El proyecto pasa validación de tipos sin errores:

```bash
npx astro check
# Result: 0 errors, 0 warnings, 0 hints
```

## Dependencias Agregadas

```json
{
  "jspdf": "^2.5.1",
  "html2canvas": "^1.4.1"
}
```

## Consideraciones Técnicas

### Performance

- Los PDFs se generan en el hilo del navegador, puede causar breve congelamiento en trabajos muy largos
- La captura de canvas requiere que todas las imágenes estén cargadas
- Para documentos > 10 páginas, considerar en futuro una generación serverless

### Limitaciones Actuales

- No se pueden editar los PDFs desde la interfaz (como mencionaste, es para futuras mejoras)
- Tablas muy anchas pueden requerir ajustes de tamaño de fuente
- Imágenes SVG pueden renderizarse ligeramente diferentes

### Mejoras Futuras

1. **Editor Visual de PDF**: Permitir personalizar márgenes, colores, fuentes antes de descargar
2. **Presets de Diseño**: Diferentes estilos de PDF (minimalista, colorido, etc.)
3. **Generación Serverless**: Opcional, para documentos muy grandes
4. **Exportar múltiples trabajos**: Combinar varios trabajos en un solo PDF

## Testing

Para verificar que funciona:

1. Inicia el servidor: `npm run dev`
2. Abre un trabajo: `http://localhost:4321/experiencia-de-usuario/unidad-1/investigacion-ux/`
3. Haz clic en "Descargar PDF"
4. El archivo debería descargarse con el nombre: `investigacion-ux-YYYY-MM-DD.pdf`

Prueba con diferentes trabajos:
- **Cortos** (1-2 páginas): Verificar que el PDF se vea bien
- **Largos** (10+ páginas): Verificar paginación automática
- **Con imágenes**: Verificar que se capturen correctamente
- **Con tablas y código**: Verificar renderizado

## Troubleshooting

### El botón no aparece
- Verifica que `PdfExportButton` esté importado en `WorkLayout.astro`
- Comprueba que estés en una página de trabajo (no en la lista)

### El PDF sale en blanco
- Las imágenes pueden no estar cargadas correctamente
- Revisa la consola del navegador para ver errores

### El PDF se corta o sale mal formateado
- Trabaja con los márgenes o ancho de canvas en `pdf-export.ts`
- Las tablas muy anchas pueden necesitar ajustes de CSS

### Lentitud al generar
- Reduce la escala en `html2canvas` de 2 a 1 (menos calidad pero más rápido)
- Considera limitar imágenes muy grandes en el markdown

---

**Autor**: Implementación automática con Astro + TypeScript + jsPDF + html2canvas  
**Fecha**: Marzo 2026
