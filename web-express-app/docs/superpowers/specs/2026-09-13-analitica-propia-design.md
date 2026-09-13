# Analítica propia (self-hosted) — diseño

Fecha: 2026-09-13

## Contexto

El sitio ya tiene Google Analytics 4 instalado (`G-01NP1E5FQ9`, en `client/index.html`),
con un `page_view` manual en cada cambio de ruta (App.jsx) porque es una SPA. No hay
tracking de clics en botones/formularios, y no existe ningún dashboard propio: para ver
cualquier dato hay que entrar a analytics.google.com.

El usuario pidió analítica "completa": visitas detalladas por página, cuántas veces se
presionan botones de contacto/WhatsApp y formularios, desglosada por día/semana/mes/
trimestre/semestre, y (agregado durante brainstorming) de qué tipo de dispositivo
ingresan más.

Decisión tomada con el usuario: construir un sistema propio (guardado en la base de
datos actual, MySQL vía Prisma), visible dentro del panel admin ya existente — sin
depender de ninguna cuenta ni API externa (se descartó conectar con la API de datos de
GA4 porque requiere crear una cuenta de servicio de Google Cloud). GA4 queda como está,
en paralelo, sin tocarlo.

## Alcance

**Páginas trackeadas**: todo el sitio público — las ~118 páginas SEO locales
(`server/lib/seoLocalPages.js` / `getAllSeoRoutes()`), las landings principales
(`/marketing`, `/letreros`, `/publicidad-corporativa`, `/agencia`, `/web` y sus
variantes), el embudo `/sitio-web` completo, y el home (`/`).

**Excluido**: `/admin/*` y `/portal/*` (para no ensuciar los datos con el propio uso
del dueño del sitio ni con sesiones de clientes logueados).

**Eventos trackeados**:
- Cualquier clic en un link cuyo `href` contenga `wa.me` o `api.whatsapp.com`
  (cubre automáticamente los ~20 archivos que ya usan `WA_BASE` sin tener que
  instrumentarlos uno por uno).
- Cualquier `submit` de un `<form>` en el sitio.
- Botones clave del embudo `/sitio-web` con nombre explícito: elegir modalidad
  (online/WhatsApp), avanzar de paso, completar compra — vía un atributo
  `data-analytics-event="nombre"` opcional que el listener global respeta si existe
  (si no existe, cae al comportamiento genérico de arriba).

**Fuera de alcance (YAGNI, se puede pedir después)**:
- Reemplazar o desactivar GA4.
- Mapas geográficos, segmentación por navegador, retención/limpieza automática de datos.
- Rate limiting o CAPTCHA anti-bot en los endpoints de tracking (se mitiga con el
  filtro de User-Agent, ver abajo).

## Modelo de datos (Prisma, agregar a `server/prisma/schema.prisma`)

```prisma
model AnalyticsPageView {
  id         Int      @id @default(autoincrement())
  path       String   // ej. "/sitio-web", "/marketing/talca"
  visitorId  String   // uuid generado en el navegador (localStorage), no es PII
  device     String   // "mobile" | "tablet" | "desktop"
  referrer   String?  @db.Text
  createdAt  DateTime @default(now())

  @@index([path])
  @@index([visitorId])
  @@index([createdAt])
}

model AnalyticsEvent {
  id         Int      @id @default(autoincrement())
  eventName  String   // "whatsapp_click" | "form_submit" | nombre explícito
  path       String
  visitorId  String
  label      String?  // texto del botón / id del form, si está disponible
  createdAt  DateTime @default(now())

  @@index([eventName])
  @@index([path])
  @@index([createdAt])
}
```

Se agregan vía el patrón ya usado en este proyecto (`createTable` idempotente dentro
de `runMigrations()` en `server/index.js`), no vía `prisma migrate`.

## Backend — endpoints nuevos (`server/index.js` o un `server/routes/analytics.js` nuevo)

### Ingesta (públicos, sin auth — los llama cualquier visitante)

- `POST /api/analytics/pageview` — body `{ path, visitorId, referrer }`.
- `POST /api/analytics/event` — body `{ eventName, path, visitorId, label }`.

Ambos:
- Validan que `path` empiece con `/` y tenga largo razonable (evita basura).
- Ignoran la request silenciosamente (responden 204 igual, no bloquean nada) si el
  `User-Agent` matchea una lista corta de bots conocidos (`googlebot`, `bingbot`,
  `facebookexternalhit`, `slurp`, `bot`, `crawl`, `spider`, case-insensitive)
  — crítico porque las 118 páginas SEO son constantemente indexadas y si no se
  filtran, los números quedan inflados sin relación con visitas reales.
- Clasifican `device` en el pageview a partir del mismo User-Agent (`mobile` si
  matchea `Mobi|Android.*Mobile`, `tablet` si matchea `iPad|Android(?!.*Mobile)`,
  si no `desktop`).
- No requieren `Authorization` — son de escritura únicamente (no exponen datos).

### Lectura (protegido, `authenticateAdmin`)

- `GET /api/analytics/summary?granularity=day|week|month|quarter|semester&range=<n>`
  — devuelve:
  - `series`: `[{ bucket: '2026-09-01', pageviews: N, visitors: N }, ...]` agregado
    según `granularity` (día = últimos 30 buckets por defecto, semana = últimas 12,
    mes = últimos 12, trimestre = últimos 8, semestre = últimos 6 — configurable con
    `range`).
  - `topPages`: `[{ path, pageviews }, ...]` top 15 del rango.
  - `topEvents`: `[{ eventName, label, count }, ...]` top 15 del rango.
  - `devices`: `{ mobile: N, tablet: N, desktop: N }` (conteos y porcentaje) del rango.
  - `totals`: `{ pageviews, uniqueVisitors, whatsappClicks, formSubmits }` del rango.

  La agregación por bucket se hace con SQL crudo (`$queryRaw`) agrupando por
  `DATE()`/`YEARWEEK()`/`DATE_FORMAT(..., '%Y-%m')` según `granularity` — mismo
  patrón que el resto del proyecto usa para reportes (evita traer todas las filas a
  Node y agregarlas ahí).

## Frontend

### Tracking (nuevo `client/src/lib/analytics.js`)

- `getVisitorId()`: lee/crea un UUID en `localStorage` (`swl_visitor_id`), sin
  expiración — no es cookie, no es dato personal, coherente con que el aviso de
  cookies del sitio ya es informativo.
- `trackPageView(path)`: POST fire-and-forget a `/api/analytics/pageview`. Se llama
  desde el mismo `useEffect` de `App.jsx` que ya llama a `gtag('event','page_view',...)`
  en cada cambio de ruta — un solo punto central, sin tocar cada página.
- `trackEvent(eventName, { path, label })`: POST fire-and-forget a
  `/api/analytics/event`.
- Un listener global de `click` (montado una vez, en `App.jsx` o un componente
  `<Analytics/>` sin UI) que:
  - Si el elemento clickeado (o un ancestro) tiene `data-analytics-event`, dispara
    ese nombre con el texto del elemento como `label`.
  - Si no, pero es o está dentro de un `<a>` cuyo `href` contiene `wa.me` o
    `api.whatsapp.com`, dispara `whatsapp_click`.
- Un listener global de `submit` en `document` que dispara `form_submit` con el
  `id`/`name` del formulario si existe.
- Ambos requests van a `${import.meta.env.VITE_API_URL}` (mismo patrón que el resto
  del frontend, porque el dominio estático de Hostinger no sirve el API).
- Ninguna de las dos llamadas debe poder romper la navegación del usuario si falla
  (try/catch silencioso, sin reintentos, sin bloquear el hilo principal).

Instrumentación puntual con `data-analytics-event` (solo donde el nombre genérico
"whatsapp_click"/"form_submit" no alcanza): pasos y submit del wizard en
`SitioWebWizard.jsx`, selección de modalidad en `SitioWebLanding.jsx`.

### Dashboard (`/admin/analitica`, componente nuevo `AnalyticsDashboard.jsx`)

- Reutiliza el patrón de auth ya existente (`useAuth()` / `authFetch`, mismo gate de
  login que `AdminDashboard.jsx`).
- Selector de granularidad (Día/Semana/Mes/Trimestre/Semestre) que re-consulta
  `/api/analytics/summary`.
- Tarjetas de totales (visitas, visitantes únicos, clics WhatsApp, formularios).
- Gráfico de línea/área de la serie temporal (`recharts` — única librería nueva,
  cargada con `React.lazy()` solo en esta ruta para no afectar el bundle público que
  ven los visitantes de los anuncios de Meta).
- Tabla de páginas más visitadas.
- Tabla de eventos más frecuentes.
- Bloque de desglose de dispositivos (barras o dona simple: % Móvil / Tablet /
  Escritorio).
- Link de acceso agregado en el header de `AdminDashboard.jsx` existente.

## Manejo de errores / calidad de datos

- Filtro de bots por User-Agent (arriba) — mitiga la mayor distorsión esperada dado
  que hay ~118 páginas SEO indexadas activamente.
- Si `visitorId` falta o es inválido en el body, el endpoint genera uno de servidor
  en vez de rechazar la request (nunca se pierde el pageview por esto).
- Los endpoints de ingesta siempre responden rápido (sin awaits innecesarios) y no
  deben poder tumbar el request si la escritura a DB falla — se loggea y responde
  200 igual, para no generar reintentos ni afectar la experiencia del visitante.

## Testing

- Verificación manual post-deploy (mismo patrón ya usado en este proyecto): `curl`
  directo a `/api/analytics/pageview` y `/api/analytics/event` contra el dominio de
  Railway, confirmar filas nuevas, luego `curl` a `/api/analytics/summary` con un
  JWT admin y confirmar que los totales/series cuadran.
  - Confirmar visualmente en `/admin/analitica` que el gráfico y las tablas
    cargan con datos reales tras generar tráfico de prueba.
- No se agregan tests automatizados nuevos — este proyecto no tiene suite de tests
  existente para este tipo de features (se sigue el patrón ya usado en todo el resto
  del código de esta sesión).
