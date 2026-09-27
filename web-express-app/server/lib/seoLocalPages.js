// Mirrors the city data in client/src/App.jsx (CITIES) and the service data in
// client/src/components/seo/ServicioSEOLocal.jsx (SERVICIOS).
// Kept in sync manually — only slug -> display data is needed here.

const CITIES = {
  'talca': 'Talca', 'rancagua': 'Rancagua', 'santiago': 'Santiago', 'vina-del-mar': 'Viña del Mar',
  'pucon': 'Pucón', 'temuco': 'Temuco', 'las-condes': 'Las Condes',
  'concepcion': 'Concepción', 'antofagasta': 'Antofagasta', 'la-serena': 'La Serena',
  'valdivia': 'Valdivia', 'puerto-montt': 'Puerto Montt', 'iquique': 'Iquique',
  'providencia': 'Providencia', 'nunoa': 'Ñuñoa', 'vitacura': 'Vitacura', 'la-reina': 'La Reina',
  'maipu': 'Maipú', 'la-florida': 'La Florida', 'puente-alto': 'Puente Alto', 'san-miguel': 'San Miguel',
  'san-fernando': 'San Fernando', 'rengo': 'Rengo', 'machali': 'Machalí',
  'chillan': 'Chillán', 'los-angeles': 'Los Ángeles', 'osorno': 'Osorno', 'coyhaique': 'Coyhaique',
  'punta-arenas': 'Punta Arenas',
}

// slug -> { title, description } — debe calzar con SERVICIOS[slug].metaTitle/metaDescription
const SERVICES = {
  'sistemas-de-gestion': {
    title: 'Sistemas de Gestión a Medida Chile | AgenciaSI',
    description: 'Desarrollamos sistemas de gestión, caja e inventario a medida para empresas en Chile. Código propio, panel administrador y reportes en tiempo real.',
  },
  'plataformas': {
    title: 'Plataformas Web y Membresías a Medida Chile | AgenciaSI',
    description: 'Desarrollamos plataformas web a medida con login de usuarios, cursos, clases o contenido restringido. Código propio, sin comisiones de terceros.',
  },
  'ecosistemas-ia': {
    title: 'Automatización e IA para Empresas Chile | AgenciaSI',
    description: 'Integramos IA y automatizaciones a medida en sistemas y plataformas: chatbots, flujos automáticos y CRM inteligente para empresas en Chile.',
  },
  'ecommerce': {
    title: 'Tiendas Online / E-commerce a Medida Chile | AgenciaSI',
    description: 'Desarrollamos tiendas online a medida con catálogo, carrito de compras y Mercado Pago integrado. Código propio, panel de pedidos y diseño responsive.',
  },
}

const PAGE_TYPES = [
  {
    prefix: '/web/',
    cities: CITIES,
    title: name => `Desarrollo Web en ${name} | AgenciaSI Chile`,
    description: name => `Agencia de desarrollo web en ${name}. Creamos sitios web, tiendas online y sistemas a medida para pymes y profesionales de ${name}. Cotiza gratis.`,
  },
  {
    prefix: '/agencia/',
    cities: CITIES,
    title: name => `Agencia Digital en ${name} | AgenciaSI Chile`,
    description: name => `AgenciaSI — agencia digital en ${name}. Desarrollo web, e-commerce, sistemas a medida e integración con IA para pymes y empresas de ${name}. Cotiza gratis.`,
  },
  {
    prefix: '/servicios/',
    cities: SERVICES,
    title: data => data.title,
    description: data => data.description,
  },
]

// Returns { title, description, canonical } for a known SEO local page path, or null otherwise.
function getSeoMeta(pathname) {
  for (const type of PAGE_TYPES) {
    if (!pathname.startsWith(type.prefix)) continue
    const slug = pathname.slice(type.prefix.length).replace(/\/+$/, '')
    const name = type.cities[slug]
    if (!name) continue
    // Trailing slash: each of these is pre-rendered to dist/<prefix><slug>/index.html
    // (a real directory), so Apache 301-redirects the slash-less URL to add the
    // slash before serving it. Declaring canonical/sitemap URLs WITH the slash
    // means they point straight at the 200 response Apache actually serves,
    // instead of a URL that immediately redirects elsewhere.
    const canonical = `https://agenciasi.cl${type.prefix}${slug}/`
    return { title: type.title(name), description: type.description(name), canonical }
  }
  return null
}

// Returns every known SEO local page as { pathname, title, description, canonical }.
// pathname has no trailing slash (it's a filesystem path root, e.g. "/marketing/curico");
// canonical does (see the comment in getSeoMeta above).
function getAllSeoRoutes() {
  const routes = [];
  for (const type of PAGE_TYPES) {
    for (const [slug, name] of Object.entries(type.cities)) {
      const pathname = `${type.prefix}${slug}`;
      routes.push({
        pathname,
        title: type.title(name),
        description: type.description(name),
        canonical: `https://agenciasi.cl${pathname}/`,
      });
    }
  }
  return routes;
}

module.exports = { getSeoMeta, getAllSeoRoutes }
