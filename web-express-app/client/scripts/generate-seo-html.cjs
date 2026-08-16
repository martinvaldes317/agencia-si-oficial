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
