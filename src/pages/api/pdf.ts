import puppeteer from 'puppeteer';
import type { APIRoute } from 'astro';

const pdfHeaderHeight = '36px';

function firstHeaderValue(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const first = value.split(',')[0]?.trim();
  return first || null;
}

function addHostVariants(hosts: Set<string>, value: string | null): void {
  if (!value) {
    return;
  }

  hosts.add(value);
  hosts.add(value.replace(/:\d+$/, ''));
}

function getInternalOrigin(): string {
  const customOrigin = process.env.PDF_RENDER_ORIGIN;
  if (customOrigin) {
    return customOrigin;
  }

  const port = process.env.PORT ?? '80';
  return `http://127.0.0.1:${port}`;
}

function getSafeFilename(urlValue: string): string {
  const pathname = new URL(urlValue).pathname;
  const raw = pathname.split('/').filter(Boolean).join('-') || 'documento';
  const safe = raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);

  return `${safe || 'documento'}.pdf`;
}

export const GET: APIRoute = async ({ request, site }) => {
  const requestUrl = new URL(request.url);
  const targetUrl = requestUrl.searchParams.get('url');

  if (!targetUrl) {
    return new Response('Falta el query param "url".', { status: 400 });
  }

  const forwardedProto = firstHeaderValue(request.headers.get('x-forwarded-proto'));
  const forwardedHost = firstHeaderValue(request.headers.get('x-forwarded-host'));
  const forwardedOrigin = firstHeaderValue(request.headers.get('x-forwarded-origin'));
  const hostHeader = firstHeaderValue(request.headers.get('host'));
  const siteOrigin = site ? new URL(site).origin : null;
  const forwardedComposedOrigin =
    forwardedProto && forwardedHost ? `${forwardedProto}://${forwardedHost}` : null;
  const publicOrigin = forwardedOrigin ?? forwardedComposedOrigin ?? siteOrigin ?? requestUrl.origin;

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(targetUrl, publicOrigin);
  } catch {
    return new Response('El query param "url" no es valido.', { status: 400 });
  }

  const allowedHosts = new Set<string>();
  addHostVariants(allowedHosts, requestUrl.host);
  addHostVariants(allowedHosts, requestUrl.hostname);
  addHostVariants(allowedHosts, hostHeader);
  addHostVariants(allowedHosts, forwardedHost);

  if (site) {
    const siteUrl = new URL(site);
    addHostVariants(allowedHosts, siteUrl.host);
    addHostVariants(allowedHosts, siteUrl.hostname);
  }

  try {
    const publicUrl = new URL(publicOrigin);
    addHostVariants(allowedHosts, publicUrl.host);
    addHostVariants(allowedHosts, publicUrl.hostname);
  } catch {
    // ignore malformed fallback origin
  }

  if (!allowedHosts.has(parsedUrl.host) && !allowedHosts.has(parsedUrl.hostname)) {
    return new Response('URL no permitida.', { status: 403 });
  }

  parsedUrl.searchParams.set('pdf', 'true');
  const internalOrigin = getInternalOrigin();
  const renderUrl = new URL(`${parsedUrl.pathname}${parsedUrl.search}`, internalOrigin);

  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | undefined;

  try {
    browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(45000);
    page.setDefaultTimeout(45000);
    await page.setViewport({ width: 1400, height: 1800, deviceScaleFactor: 2 });
    await page.goto(renderUrl.toString(), { waitUntil: 'domcontentloaded', timeout: 45000 });
    try {
      await page.waitForNetworkIdle({ idleTime: 500, timeout: 8000 });
    } catch {
      // Continue even if background requests keep running.
    }
    await page.emulateMediaType('print');
    await page.addStyleTag({
      content: `
        @page { size: A4; margin: 22mm 14mm 18mm 14mm; }
        body { margin: 0 !important; }
        main { padding-top: 0 !important; }
        .header, .footer, .pdf-export, .breadcrumbs { display: none !important; }
        .work { max-width: 840px !important; margin: 0 auto !important; padding-top: 0 !important; }
        .work__header { margin-top: 0 !important; }
        .work__content img,
        .work__content figure,
        .work__content pre,
        .work__content table,
        .work__content blockquote,
        .work__content .no-break {
          break-inside: avoid !important;
          page-break-inside: avoid !important;
        }
        .work__content h1,
        .work__content h2,
        .work__content h3 {
          page-break-after: avoid !important;
        }
        .work__content p {
          orphans: 3;
          widows: 3;
        }
      `,
    });
    await page.evaluate(async () => {
      if ('fonts' in document) {
        await (document as Document & { fonts: FontFaceSet }).fonts.ready;
      }
    });

    const title = await page.title();
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '26mm',
        right: '14mm',
        bottom: '18mm',
        left: '14mm',
      },
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="
          width: 100%;
          height: ${pdfHeaderHeight};
          font-size: 10px;
          color: #334155;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 14mm;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-sizing: border-box;
          font-family: Arial, sans-serif;
          background: #ffffff;
        ">
          <span style="font-weight: 700;">Sebastian Rodriguez</span>
          <span style="color: #64748b;">Portafolio Academico</span>
        </div>
      `,
      footerTemplate: `
        <div style="
          width: 100%;
          font-size: 9px;
          color: #64748b;
          padding: 0 14mm;
          display: flex;
          justify-content: space-between;
          box-sizing: border-box;
          font-family: Arial, sans-serif;
        ">
          <span>${title.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>
          <span><span class="pageNumber"></span>/<span class="totalPages"></span></span>
        </div>
      `,
    });

    const filename = getSafeFilename(parsedUrl.toString());

    return new Response(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return new Response(`No se pudo generar el PDF: ${message}`, { status: 500 });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
