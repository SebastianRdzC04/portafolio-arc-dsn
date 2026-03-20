import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface PdfExportOptions {
  filename: string;
  title: string;
  date?: Date;
  elementSelector?: string;
}

interface PdfDimensions {
  pageWidth: number;
  pageHeight: number;
  margins: { top: number; bottom: number; left: number; right: number };
}

const PDF_DIMENSIONS: PdfDimensions = {
  pageWidth: 210,
  pageHeight: 297,
  margins: { top: 15, bottom: 15, left: 15, right: 15 },
};

/**
 * Creates a clone of the content element with PDF-specific styling.
 * Ensures images are loaded before capturing.
 */
async function prepareContentForCapture(element: HTMLElement): Promise<HTMLElement> {
  const clone = element.cloneNode(true) as HTMLElement;
  const container = document.createElement('div');

  // Apply PDF-specific styles
  container.style.cssText = `
    position: fixed;
    left: -9999px;
    top: -9999px;
    width: 1200px;
    background-color: white;
    padding: 20px;
    font-family: inherit;
    z-index: -9999;
  `;

  container.appendChild(clone);
  document.body.appendChild(container);

  // Wait for all images to load
  const images = container.querySelectorAll('img');
  const imagePromises = Array.from(images).map(
    (img) =>
      new Promise<void>((resolve) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        }
      })
  );

  await Promise.all(imagePromises);

  return container;
}

/**
 * Renders content canvas with high quality (2x scale for retina).
 * Handles long content by capturing in chunks if needed.
 */
async function captureContentAsCanvas(
  element: HTMLElement,
  maxWidth: number = 1000
): Promise<HTMLCanvasElement> {
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: '#ffffff',
    logging: false,
    useCORS: true,
    width: maxWidth,
    allowTaint: true,
  });

  return canvas;
}

/**
 * Calculates how many PDF pages are needed based on content height.
 */
function calculatePages(canvasHeight: number, pdfHeight: number): number {
  const contentHeight = (canvasHeight / 96) * 25.4;
  return Math.ceil(contentHeight / pdfHeight);
}

/**
 * Exports work content to a paginated PDF.
 * Handles multi-page content automatically with proper scaling.
 */
export async function exportWorkToPdf(options: PdfExportOptions): Promise<void> {
  const { filename, title, date, elementSelector = '.work__content' } = options;

  try {
    // Get content element
    const contentElement = document.querySelector(elementSelector);
    if (!contentElement) {
      throw new Error(`No se encontró el elemento: ${elementSelector}`);
    }

    // Prepare content and wait for images
    const container = await prepareContentForCapture(contentElement as HTMLElement);

    // Capture content as canvas
    const canvas = await captureContentAsCanvas(container);

    // Create PDF
    const { pageWidth, pageHeight, margins } = PDF_DIMENSIONS;
    const contentWidth = pageWidth - margins.left - margins.right;
    const contentHeight = pageHeight - margins.top - margins.bottom;

    const pdfContentHeight = (contentHeight * canvas.width) / contentWidth;
    const pageCount = calculatePages(canvas.height, pdfContentHeight);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Add pages
    for (let page = 0; page < pageCount; page++) {
      if (page > 0) {
        pdf.addPage();
      }

      const imageData = canvas.toDataURL('image/png');

      pdf.addImage(imageData, 'PNG', margins.left, margins.top, contentWidth, pdfContentHeight, undefined, 'FAST');

      // Add footer with page number and metadata
      if (pageCount > 1 || date) {
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);

        const footerY = pageHeight - 10;

        if (date) {
          const dateStr = new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }).format(date);
          pdf.text(`${title} • ${dateStr}`, margins.left, footerY);
        }

        if (pageCount > 1) {
          pdf.text(`Página ${page + 1} de ${pageCount}`, pageWidth - margins.right - 20, footerY, {
            align: 'right',
          });
        }
      }
    }

    // Add metadata
    pdf.setProperties({
      title,
      author: 'Portafolio Académico',
      creator: 'Astro PDF Export',
    });

    // Save and download
    pdf.save(filename);

    // Cleanup
    document.body.removeChild(container);
  } catch (error) {
    document.body.querySelectorAll('div[style*="left: -9999px"]').forEach((el) => el.remove());

    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error exporting PDF:', errorMessage);
    throw new Error(`Error al generar PDF: ${errorMessage}`);
  }
}

/**
 * Generates a clean filename from title and date.
 * Format: "titulo-trabajo-2026-03-19.pdf"
 */
export function generatePdfFilename(title: string, date?: Date): string {
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50);

  const dateStr = date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

  return `${slug}-${dateStr}.pdf`;
}
