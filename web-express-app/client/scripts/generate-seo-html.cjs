// Pre-renders one static index.html per local SEO page (dist/<route>/index.html)
// with the correct <title>/<meta description>/<link rel=canonical> baked in.
//
// Why: agenciasi.cl is served as static files (Hostinger + Apache), not by the
// Express app in server/. The SPA's root dist/index.html is identical for every
// route and only gets its title/canonical injected client-side via
// react-helmet-async — invisible to Googlebot's raw HTML fetch. That made Search
// Console flag every local SEO page as "Duplicada: el usuario no ha indicado
// ninguna versión canónica". Because dist/.htaccess only rewrites requests that
// don't already match a real file or directory, dropping a real
// dist/<route>/index.html on disk makes Apache serve that exact file instead of
// falling back to the generic shell — no server-side rendering needed.
//
// Run after `vite build` (wired into client/package.json's build script).

const fs = require('fs');
const path = require('path');
const { getAllSeoRoutes } = require('../../server/lib/seoLocalPages');

const distDir = path.join(__dirname, '../../dist');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('[generate-seo-html] dist/index.html not found — run `vite build` first.');
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf-8');
const routes = getAllSeoRoutes();

for (const route of routes) {
  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${route.description}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${route.title}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${route.description}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${route.canonical}" />`)
    .replace('</head>', `  <link rel="canonical" href="${route.canonical}" />\n</head>`);

  const outDir = path.join(distDir, route.pathname.replace(/^\//, ''));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
}

console.log(`[generate-seo-html] Generated ${routes.length} static SEO pages under dist/.`);

// ── /sitio-web funnel: bake in per-page meta + the Meta Pixel snippet ──────────
// Meta's own pixel installation checker fetches the raw HTML (no JS execution)
// and looks for the literal fbq('init', ...) snippet in <head> — the pixel that
// SitioWebLanding/Wizard/Confirmacion inject via react-helmet at runtime is
// invisible to it, same root cause as the canonical/title issue above. Baking
// the snippet into these 3 specific static files (not the shared root
// dist/index.html) keeps it scoped to just this funnel, matching the earlier
// decision not to load it site-wide.
const META_PIXEL_SITIO_WEB = '1383902153896953';
const META_PIXEL_SNIPPET = `  <!-- Meta Pixel Code -->
  <script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '${META_PIXEL_SITIO_WEB}');
  fbq('track', 'PageView');
  </script>
  <noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=${META_PIXEL_SITIO_WEB}&ev=PageView&noscript=1"
  /></noscript>
  <!-- End Meta Pixel Code -->
</head>`;

// Structured data for /sitio-web — kept in sync by hand with the Service/FAQPage
// JSON-LD built inline in SitioWebLanding.jsx (serviceJsonLd/faqJsonLd, from the
// same FAQS array). Baked into the static file for the same reason as the title/
// meta/pixel above: this is what a raw HTML fetch (crawlers, rich-result
// validators) actually sees before any React code runs.
const SITIO_WEB_JSON_LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Diseño y desarrollo de sitio web',
    name: 'Sitio Web Profesional AgenciaSI',
    description: 'Página web profesional para Pymes y profesionales: dominio .CL y hosting por 1 año, hasta 5 secciones, WhatsApp, Google Maps e indexación en Google.',
    provider: { '@type': 'Organization', name: 'AgenciaSI', url: 'https://agenciasi.cl' },
    areaServed: { '@type': 'Country', name: 'Chile' },
    offers: { '@type': 'Offer', price: 74990, priceCurrency: 'CLP', url: 'https://agenciasi.cl/sitio-web/', availability: 'https://schema.org/InStock' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      ['¿Cuál es el precio?', 'El sitio web profesional cuesta $74.990 + IVA, con dominio .CL y hosting por 1 año incluidos. Es un único valor, sin modalidades ni cobros ocultos.'],
      ['¿Cuánto debo pagar para comenzar?', 'Solo el 50% del valor total como abono para iniciar tu proyecto. El 50% restante se coordina con nuestro equipo durante el proceso.'],
      ['¿El dominio está incluido?', 'Sí. Incluye un dominio .CL durante el primer año.'],
      ['¿El hosting está incluido?', 'Sí. El hosting está incluido durante el primer año.'],
      ['¿Cuántas secciones puede tener mi sitio?', 'El servicio incluye hasta 5 secciones.'],
      ['¿Funcionará correctamente en celulares?', 'Sí. El sitio será diseñado para visualizarse correctamente en celulares, tablets y computadores.'],
      ['¿Puedo conectar mi WhatsApp?', 'Sí. Incluye un botón directo a WhatsApp.'],
      ['¿Mi página aparecerá en Google?', 'El sitio será configurado e indexado para que Google pueda reconocerlo. El posicionamiento en resultados dependerá posteriormente de múltiples factores y del trabajo SEO realizado.'],
      ['¿Puedo utilizar mi propio dominio?', 'Sí. Si ya tienes dominio puedes indicarlo durante la contratación.'],
      ['¿Necesito saber programación?', 'No. Nuestro equipo realiza la implementación.'],
      ['¿Puedo vender productos?', 'Sí. Puedes agregar el módulo de tienda online por $25.990 + IVA adicionales.'],
      ['¿Qué incluye la tienda online?', 'Incluye carro de compras, catálogo, carga inicial de hasta 25 productos e integración con Mercado Pago.'],
      ['¿Qué pasa si tengo más de 25 productos?', 'El adicional incluye la carga inicial de hasta 25 productos. Si necesitas cargar una cantidad mayor, podemos cotizar la carga adicional.'],
      ['¿Mercado Pago está incluido?', 'Sí. La integración y configuración inicial de Mercado Pago está incluida en el adicional de tienda online. El comercio debe disponer de su propia cuenta de Mercado Pago.'],
    ].map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  },
];

const SITIO_WEB_PAGES = [
  {
    pathname: '/sitio-web',
    title: 'Tu Sitio Web Profesional por $74.990 + IVA | AgenciaSI',
    description: 'Página web profesional, diseñada para tu negocio: dominio .CL y hosting por 1 año, hasta 5 secciones, WhatsApp, Google Maps e indexación en Google. Contrata online por $74.990 + IVA.',
    robots: 'index, follow',
    jsonLd: SITIO_WEB_JSON_LD,
  },
  {
    pathname: '/sitio-web/formulario',
    title: 'Configura tu página web — AgenciaSI',
    description: null,
    robots: 'noindex, nofollow',
  },
  {
    pathname: '/sitio-web/confirmacion',
    title: 'Confirmación de tu pedido — AgenciaSI',
    description: null,
    robots: 'noindex, nofollow',
  },
];

for (const page of SITIO_WEB_PAGES) {
  // Trailing slash: same reasoning as the SEO routes above — this is pre-rendered
  // to dist/<pathname>/index.html (a real directory), so Apache 301s the
  // slash-less URL. Canonical/og:url point straight at what actually returns 200.
  const canonical = `https://agenciasi.cl${page.pathname}/`;
  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${page.title}</title>`)
    .replace(/<meta name="robots" content="[^"]*"\s*\/>/, `<meta name="robots" content="${page.robots}" />`)
    .replace('</head>', `${META_PIXEL_SNIPPET}`);

  if (page.description) {
    html = html
      .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${page.description}" />`)
      .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${page.title}" />`)
      .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${page.description}" />`)
      .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
      .replace('</head>', `  <link rel="canonical" href="${canonical}" />\n</head>`);
  }

  if (page.jsonLd) {
    const scripts = page.jsonLd.map(obj => `  <script type="application/ld+json">${JSON.stringify(obj)}</script>`).join('\n');
    html = html.replace('</head>', `${scripts}\n</head>`);
  }

  const outDir = path.join(distDir, page.pathname.replace(/^\//, ''));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
}

console.log(`[generate-seo-html] Generated ${SITIO_WEB_PAGES.length} static /sitio-web pages with Meta Pixel baked in.`);

// ── Bare "parent" routes that have their own page AND generated sub-routes ──
// e.g. /web is LandingWebSistemas, while /web/talca, /web/santiago, etc. are
// separate SEO pages generated above as dist/web/<slug>/index.html. Once those
// subdirectories exist, dist/web itself becomes a real directory on disk — so
// Apache stops falling back to the SPA shell for a bare /web/ request and
// instead 403s (no index.html directly inside dist/web/). Every prefix with
// its own bare route needs an explicit dist/<prefix>/index.html here too.
const STANDALONE_PARENT_PAGES = [
  {
    pathname: '/web',
    title: 'Páginas Web y Sistemas a Medida desde $74.990 | AgenciaSI Chile',
    description: 'Creamos páginas web y sistemas a medida para tu negocio en Chile desde $74.990. Entrega en 5 días, dominio incluido, soporte post-entrega. Cotiza por WhatsApp.',
    robots: 'index, follow',
  },
];

for (const page of STANDALONE_PARENT_PAGES) {
  const canonical = `https://agenciasi.cl${page.pathname}/`;
  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${page.title}</title>`)
    .replace(/<meta name="robots" content="[^"]*"\s*\/>/, `<meta name="robots" content="${page.robots}" />`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${page.description}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${page.title}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${page.description}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace('</head>', `  <link rel="canonical" href="${canonical}" />\n</head>`);

  const outDir = path.join(distDir, page.pathname.replace(/^\//, ''));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
}

console.log(`[generate-seo-html] Generated ${STANDALONE_PARENT_PAGES.length} standalone parent page(s) (dist/web/ etc.) that were shadowed by their own sub-routes.`);
