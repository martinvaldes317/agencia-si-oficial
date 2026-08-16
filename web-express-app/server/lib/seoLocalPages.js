// Mirrors the comuna/city data in client/src/App.jsx (MAULE_COMUNAS, CITIES, CORPORATE_CITIES).
// Kept in sync manually — only slug -> display name is needed here.

const MAULE_COMUNAS = {
  'talca': 'Talca', 'constitucion': 'Constitución', 'curepto': 'Curepto', 'empedrado': 'Empedrado',
  'maule': 'Maule', 'pelarco': 'Pelarco', 'pencahue': 'Pencahue', 'rio-claro': 'Río Claro',
  'san-clemente': 'San Clemente', 'san-rafael': 'San Rafael',
  'curico': 'Curicó', 'hualane': 'Hualañé', 'licanten': 'Licantén', 'molina': 'Molina',
  'rauco': 'Rauco', 'romeral': 'Romeral', 'sagrada-familia': 'Sagrada Familia', 'teno': 'Teno', 'vichuquen': 'Vichuquén',
  'linares': 'Linares', 'colbun': 'Colbún', 'longavi': 'Longaví', 'parral': 'Parral', 'retiro': 'Retiro',
  'san-javier': 'San Javier', 'villa-alegre': 'Villa Alegre', 'yerbas-buenas': 'Yerbas Buenas',
  'cauquenes': 'Cauquenes', 'chanco': 'Chanco', 'pelluhue': 'Pelluhue',
  'las-rastras': 'Sector Las Rastras',
}

const CITIES = {
  'talca': 'Talca', 'rancagua': 'Rancagua', 'santiago': 'Santiago', 'vina-del-mar': 'Viña del Mar',
  'pucon': 'Pucón', 'temuco': 'Temuco', 'las-condes': 'Las Condes',
}

const MARKETING_CITIES = { ...MAULE_COMUNAS, rancagua: 'Rancagua' }

const CORPORATE_CITIES = {
  ...MAULE_COMUNAS,
  ...Object.fromEntries(Object.entries(CITIES).filter(([slug]) => !MAULE_COMUNAS[slug])),
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
    prefix: '/marketing/',
    cities: MARKETING_CITIES,
    title: name => `Agencia de Marketing Digital en ${name} | AgenciaSI Chile`,
    description: name => `Agencia de publicidad y marketing digital en ${name}. Meta Ads, SEO, Google Ads y sitios web para pymes de ${name}. Cotiza gratis — resultados reales.`,
  },
  {
    prefix: '/letreros/',
    cities: MAULE_COMUNAS,
    title: name => `Letreros Volumétricos en ${name} | AgenciaSI Gráficas · Región del Maule`,
    description: name => `Letreros volumétricos en ${name}: acrílico, PVC, LED, madera y foam. Fabricamos e instalamos en ${name} y toda la Región del Maule. Cotización gratis por WhatsApp.`,
  },
  {
    prefix: '/publicidad-corporativa/',
    cities: CORPORATE_CITIES,
    title: name => `Publicidad Corporativa en ${name} | Imprenta y Merchandising — AgenciaSI`,
    description: name => `Señalética, letreros, ropa corporativa, tarjetas, pendones, lanyards, bolsas TNT y trofeos en ${name}. Producción a volumen con cumplimiento de plazos y precios justos.`,
  },
]

// Returns { title, description, canonical } for a known SEO local page path, or null otherwise.
function getSeoMeta(pathname) {
  for (const type of PAGE_TYPES) {
    if (!pathname.startsWith(type.prefix)) continue
    const slug = pathname.slice(type.prefix.length).replace(/\/+$/, '')
    const name = type.cities[slug]
    if (!name) continue
    const canonical = `https://agenciasi.cl${type.prefix}${slug}`
    return { title: type.title(name), description: type.description(name), canonical }
  }
  return null
}

// Returns every known SEO local page as { pathname, title, description, canonical }.
// pathname has no trailing slash, e.g. "/marketing/curico".
function getAllSeoRoutes() {
  const routes = [];
  for (const type of PAGE_TYPES) {
    for (const [slug, name] of Object.entries(type.cities)) {
      const pathname = `${type.prefix}${slug}`;
      routes.push({
        pathname,
        title: type.title(name),
        description: type.description(name),
        canonical: `https://agenciasi.cl${pathname}`,
      });
    }
  }
  return routes;
}

module.exports = { getSeoMeta, getAllSeoRoutes }
