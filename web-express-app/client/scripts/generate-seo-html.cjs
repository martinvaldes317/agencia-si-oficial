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

const SITIO_WEB_PAGES = [
  {
    pathname: '/sitio-web',
    title: 'Tu Sitio Web Profesional por $49.990 + IVA | AgenciaSI',
    description: 'Página web profesional, diseñada para tu negocio: dominio .CL y hosting por 1 año, hasta 5 secciones, WhatsApp, Google Maps e indexación en Google. Contrata online desde $49.990 + IVA.',
    robots: 'index, follow',
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
  const canonical = `https://agenciasi.cl${page.pathname}`;
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

  const outDir = path.join(distDir, page.pathname.replace(/^\//, ''));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
}

console.log(`[generate-seo-html] Generated ${SITIO_WEB_PAGES.length} static /sitio-web pages with Meta Pixel baked in.`);
