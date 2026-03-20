export interface PdfExportOptions {
  filename: string;
  title: string;
  description: string;
  subject: string;
  unit: string;
  tags: string[];
  date?: Date;
}

function formatDate(date?: Date): string {
  if (!date) {
    return 'Sin fecha';
  }

  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function generatePdfFilename(title: string, date?: Date): string {
  const safeTitle = title;
  const slug = safeTitle
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60);

  const datePart = (date ?? new Date()).toISOString().split('T')[0];
  return `${slug}-${datePart}.pdf`;
}

function createCoverPage(options: PdfExportOptions): HTMLDivElement {
  const coverPage = document.createElement('div');
  coverPage.className = 'pdf-cover-page';
  
  const tagsHtml = options.tags.length > 0
    ? `<div class="pdf-cover-tags">${options.tags.join(' | ')}</div>`
    : '';

  coverPage.innerHTML = `
    <div class="pdf-cover-header">PORTAFOLIO ACADÉMICO</div>
    <div class="pdf-cover-title-container">
      <h1 class="pdf-cover-title">${options.title}</h1>
      <p class="pdf-cover-description">${options.description}</p>
    </div>
    <div class="pdf-cover-meta">
      <div class="pdf-cover-meta-item"><strong>Materia:</strong> ${options.subject}</div>
      <div class="pdf-cover-meta-item"><strong>Unidad:</strong> ${options.unit}</div>
      <div class="pdf-cover-meta-item"><strong>Fecha:</strong> ${formatDate(options.date)}</div>
      ${tagsHtml}
    </div>
  `;
  return coverPage;
}

export async function exportWorkToPdf(options: PdfExportOptions): Promise<void> {
  try {
    // Dynamically import html2pdf
    // @ts-ignore
    const html2pdfModule = await import('html2pdf.js');
    const html2pdf = html2pdfModule.default || html2pdfModule;

    // Find the rendered markdown content
    const contentEl = document.querySelector('.work__content');
    if (!contentEl) {
      throw new Error('No se encontró el contenido del trabajo para exportar.');
    }

    // Clone the content so we don't mess up the live DOM
    const clone = contentEl.cloneNode(true) as HTMLElement;
    
    // Create a container for the PDF
    const container = document.createElement('div');
    container.className = 'pdf-export-container work'; // Include 'work' to inherit any .work styles if needed
    
    // Inject print-specific styles
    const style = document.createElement('style');
    style.innerHTML = `
      .pdf-export-container {
        font-family: Arial, sans-serif;
        color: #0f172a;
        background: white;
        padding: 0;
      }
      .pdf-cover-page {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 250mm; /* approximate A4 height minus margins to center content */
        text-align: left;
      }
      .pdf-cover-header {
        font-size: 14px;
        font-weight: bold;
        color: #1d4ed8;
        margin-bottom: 40px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .pdf-cover-title {
        font-size: 32px;
        font-weight: bold;
        margin-bottom: 16px;
        line-height: 1.2;
      }
      .pdf-cover-description {
        font-size: 18px;
        color: #475569;
        margin-bottom: 60px;
        line-height: 1.5;
        max-width: 600px;
      }
      .pdf-cover-meta {
        border-top: 2px solid #e2e8f0;
        padding-top: 30px;
      }
      .pdf-cover-meta-item {
        font-size: 14px;
        margin-bottom: 8px;
        color: #334155;
      }
      .pdf-cover-tags {
        margin-top: 20px;
        font-size: 12px;
        color: #64748b;
      }
      
      /* Ensure images fit and code blocks wrap */
      .pdf-export-container img {
        max-width: 100% !important;
        height: auto !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        display: block !important;
        margin: 20px auto !important;
      }
      /* Prevent the paragraph containing the image from breaking */
      .pdf-export-container p:has(img) {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      .pdf-export-container pre {
        white-space: pre-wrap !important;
        word-break: break-word !important;
        page-break-inside: avoid;
        background: #f8fafc;
        padding: 16px;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
      }
      .pdf-export-container code {
        font-family: monospace;
      }
      .pdf-export-container h1, .pdf-export-container h2, .pdf-export-container h3 {
        page-break-after: avoid;
        page-break-inside: avoid;
      }
      .pdf-export-container blockquote {
        page-break-inside: avoid;
      }
      .pdf-export-container table {
        page-break-inside: avoid;
      }
      .pdf-export-container tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
    `;
    container.appendChild(style);
    
    // Add cover page
    container.appendChild(createCoverPage(options));
    
    // Add page break before content
    const pageBreak = document.createElement('div');
    pageBreak.className = 'html2pdf__page-break';
    container.appendChild(pageBreak);

    // Add actual content
    container.appendChild(clone);

    // Temporarily attach to DOM to render properly without clipping bugs
    const wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    wrapper.style.left = '0';
    wrapper.style.top = '0';
    wrapper.style.width = '100%';
    wrapper.style.zIndex = '-9999';
    wrapper.style.pointerEvents = 'none';

    container.style.width = '800px'; 
    container.style.backgroundColor = '#ffffff'; // Force white background for the PDF
    container.style.color = '#0f172a'; // Force dark text
    
    wrapper.appendChild(container);
    document.body.appendChild(wrapper);

    // Configure html2pdf
    const opt = {
      margin: [20, 20, 20, 20] as [number, number, number, number], // 20mm margin
      filename: options.filename,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        letterRendering: true,
        windowWidth: 800,
        backgroundColor: '#ffffff'
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
      pagebreak: { 
        mode: ['css', 'legacy'],
        avoid: ['img', 'pre', 'blockquote', 'table', 'h1', 'h2', 'h3', '.pdf-no-break']
      }
    };

    // Generate PDF
    await html2pdf().set(opt).from(container).save();

    // Cleanup
    document.body.removeChild(wrapper);
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al exportar PDF:', errorMessage);
    throw new Error(`Error al generar PDF: ${errorMessage}`);
  }
}
