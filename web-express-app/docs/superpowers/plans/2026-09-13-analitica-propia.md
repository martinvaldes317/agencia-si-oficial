# Analítica propia (self-hosted) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a self-hosted analytics system (page views, WhatsApp/form/wizard events, device breakdown) stored in the project's own MySQL database, surfaced in a new `/admin/analitica` dashboard inside the existing admin panel, with day/week/month/quarter/semester granularity.

**Architecture:** Two new Prisma models (`AnalyticsPageView`, `AnalyticsEvent`) written via two new public, unauthenticated ingestion endpoints (`POST /api/analytics/pageview`, `POST /api/analytics/event`) called by a small client-side tracking module on every route change and on WhatsApp-link clicks / form submits (via a single global click/submit listener, no per-component wiring). A third, admin-authenticated endpoint (`GET /api/analytics/summary`) aggregates with raw SQL grouped by the requested granularity, and a new `AnalyticsDashboard.jsx` page (charted with `recharts`, lazy-loaded so it never touches the public bundle) renders it.

**Tech Stack:** Express 5, Prisma 6.19.3 / MySQL (raw SQL aggregation via `$queryRawUnsafe`), React 19 + react-router-dom v7, Tailwind (admin routes only), `recharts` (new dependency, admin-only).

**Spec:** `docs/superpowers/specs/2026-09-13-analitica-propia-design.md`

## Global Constraints

- No automated test suite exists in this repo (no jest/vitest/testing-library configured anywhere) — every "verify" step below uses the project's established pattern instead: `node -c <file>` for server syntax checks, `curl` against the running API for functional checks, and manual browser checks for UI. Do not introduce a test framework as part of this plan.
- This project does not use `prisma migrate` — schema changes ship via the `addCol`/`createTable` idempotent-SQL pattern already in `server/index.js`'s `runMigrations()`. Follow it exactly; do not add a migration file.
- `/admin/*` and `/portal/*` routes must never be tracked as page views (would pollute the data with the site owner's own usage).
- Ingestion endpoints (`/api/analytics/pageview`, `/api/analytics/event`) must never block or fail the visitor's navigation — respond fast, swallow all errors server-side, never throw client-side.
- `recharts` must only be imported by `AnalyticsDashboard.jsx`, and that component must be loaded via `React.lazy()` from `App.jsx` — it must never end up in the bundle served to public/ad-funnel pages.
- Commit after every task (small, working diffs). Do **not** run `npm run build` or `git push` until the final task — this repo commits the built `client/dist/` folder directly for Hostinger, and Railway auto-deploys on every push to `main`, so intermediate half-finished frontend work should stay local until it's whole.
- Attribute every commit with: `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`

---

### Task 1: Prisma schema + idempotent table creation

**Files:**
- Modify: `server/prisma/schema.prisma` (add two models, before `model Licitacion`)
- Modify: `server/index.js:118` (add two `createTable` calls right after the existing `WebOrderDraft` block, before the `// Licitacion table` comment)

**Interfaces:**
- Produces: Prisma Client accessors `prisma.analyticsPageView.create({ data })` and `prisma.analyticsEvent.create({ data })`, used by Task 2. Raw table names `AnalyticsPageView` / `AnalyticsEvent`, used by Task 2's raw SQL aggregation.

- [ ] **Step 1: Add the two models to the schema**

In `server/prisma/schema.prisma`, insert this immediately before `model Licitacion {`:

```prisma
// Analítica propia del sitio — visitas por página y eventos (clics WhatsApp,
// envíos de formulario, pasos del wizard /sitio-web). Ver docs/superpowers/specs/2026-09-13-analitica-propia-design.md
model AnalyticsPageView {
  id        Int      @id @default(autoincrement())
  path      String
  visitorId String
  device    String // "mobile" | "tablet" | "desktop"
  referrer  String?  @db.Text
  createdAt DateTime @default(now())

  @@index([path])
  @@index([visitorId])
  @@index([createdAt])
}

model AnalyticsEvent {
  id        Int      @id @default(autoincrement())
  eventName String // "whatsapp_click" | "form_submit" | "lead_click" | "wizard_step" | "checkout_iniciado"
  path      String
  visitorId String
  label     String?
  createdAt DateTime @default(now())

  @@index([eventName])
  @@index([path])
  @@index([createdAt])
}
```

- [ ] **Step 2: Regenerate the Prisma Client**

Run:
```bash
cd "/Users/martinvaldescerna/Documents/AGENCIA SI OFICIAL/web-express-app/server" && npx prisma generate
```
Expected: `✔ Generated Prisma Client` with no errors. This is required locally so `prisma.analyticsPageView` / `prisma.analyticsEvent` exist for Task 2 — Railway does this automatically on deploy via `server/package.json`'s `"build": "npx prisma generate"`, but Task 2 needs it now to write against.

- [ ] **Step 3: Add idempotent table creation to `runMigrations()`**

In `server/index.js`, right after the existing block (ends at line 118 with `)\`);` for `WebOrderDraft`) and before the `// Licitacion table` comment on line 120, insert:

```js
  // AnalyticsPageView / AnalyticsEvent tables — analítica propia del sitio
  await createTable(`CREATE TABLE IF NOT EXISTS AnalyticsPageView (
    id INT AUTO_INCREMENT PRIMARY KEY,
    path VARCHAR(191) NOT NULL,
    visitorId VARCHAR(64) NOT NULL,
    device VARCHAR(20) NOT NULL,
    referrer TEXT NULL,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    KEY AnalyticsPageView_path_idx (path),
    KEY AnalyticsPageView_visitorId_idx (visitorId),
    KEY AnalyticsPageView_createdAt_idx (createdAt)
  )`);

  await createTable(`CREATE TABLE IF NOT EXISTS AnalyticsEvent (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eventName VARCHAR(100) NOT NULL,
    path VARCHAR(191) NOT NULL,
    visitorId VARCHAR(64) NOT NULL,
    label VARCHAR(191) NULL,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    KEY AnalyticsEvent_eventName_idx (eventName),
    KEY AnalyticsEvent_path_idx (path),
    KEY AnalyticsEvent_createdAt_idx (createdAt)
  )`);
```

- [ ] **Step 4: Verify syntax**

Run:
```bash
cd "/Users/martinvaldescerna/Documents/AGENCIA SI OFICIAL/web-express-app/server" && node -c index.js
```
Expected: no output, exit code 0.

- [ ] **Step 5: Commit**

```bash
cd "/Users/martinvaldescerna/Documents/AGENCIA SI OFICIAL/web-express-app" && git add server/prisma/schema.prisma server/index.js && git commit -m "$(cat <<'EOF'
Feat: agrega tablas AnalyticsPageView/AnalyticsEvent para analítica propia

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Backend — ingestion + summary endpoints

**Files:**
- Create: `server/routes/analytics.js`
- Modify: `server/index.js:206` (mount the new router right after the existing `app.use('/api/portal', ...)` line)

**Interfaces:**
- Consumes: `prisma.analyticsPageView`, `prisma.analyticsEvent` (Task 1), `authenticateAdmin` from `../middleware/auth` (existing).
- Produces: `POST /api/analytics/pageview` (body `{ path, visitorId?, referrer? }`, no auth, responds `204`), `POST /api/analytics/event` (body `{ eventName, path, visitorId?, label? }`, no auth, responds `204`), `GET /api/analytics/summary?granularity=day|week|month|quarter|semester` (admin auth, JSON `{ success, granularity, series, topPages, topEvents, devices, totals }`) — all consumed by Task 3 (frontend lib) and Task 6 (dashboard).

- [ ] **Step 1: Write `server/routes/analytics.js`**

```js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const prisma = require('../lib/prisma');
const { authenticateAdmin } = require('../middleware/auth');

const BOT_UA_RE = /bot|crawl|spider|slurp|facebookexternalhit|googlebot|bingbot|applebot|bytespider|semrushbot|ahrefsbot|petalbot/i;

function isBotUserAgent(userAgent) {
  if (!userAgent) return true;
  return BOT_UA_RE.test(userAgent);
}

function classifyDevice(userAgent) {
  if (!userAgent) return 'desktop';
  if (/iPad|Android(?!.*Mobile)/i.test(userAgent)) return 'tablet';
  if (/Mobi|Android.*Mobile|iPhone|iPod/i.test(userAgent)) return 'mobile';
  return 'desktop';
}

function safeVisitorId(raw) {
  return typeof raw === 'string' && raw.length > 0 && raw.length <= 64 ? raw : crypto.randomUUID();
}

router.post('/pageview', async (req, res) => {
  res.status(204).end();
  try {
    const userAgent = req.headers['user-agent'] || '';
    if (isBotUserAgent(userAgent)) return;
    const { path, referrer } = req.body || {};
    if (typeof path !== 'string' || !path.startsWith('/') || path.length > 191) return;
    await prisma.analyticsPageView.create({
      data: {
        path,
        visitorId: safeVisitorId(req.body?.visitorId),
        device: classifyDevice(userAgent),
        referrer: referrer ? String(referrer).slice(0, 2000) : null,
      },
    });
  } catch (err) {
    console.error('[Analytics] pageview error:', err.message);
  }
});

router.post('/event', async (req, res) => {
  res.status(204).end();
  try {
    const userAgent = req.headers['user-agent'] || '';
    if (isBotUserAgent(userAgent)) return;
    const { eventName, path, label } = req.body || {};
    if (typeof eventName !== 'string' || !eventName || eventName.length > 100) return;
    if (typeof path !== 'string' || !path.startsWith('/') || path.length > 191) return;
    await prisma.analyticsEvent.create({
      data: {
        eventName,
        path,
        visitorId: safeVisitorId(req.body?.visitorId),
        label: label ? String(label).slice(0, 191) : null,
      },
    });
  } catch (err) {
    console.error('[Analytics] event error:', err.message);
  }
});

const GRANULARITY_CONFIG = {
  day: { bucketExpr: 'DATE(createdAt)', defaultRange: 30, rangeUnitDays: 1 },
  week: { bucketExpr: 'DATE(DATE_SUB(createdAt, INTERVAL WEEKDAY(createdAt) DAY))', defaultRange: 12, rangeUnitDays: 7 },
  month: { bucketExpr: "DATE_FORMAT(createdAt, '%Y-%m-01')", defaultRange: 12, rangeUnitDays: 31 },
  quarter: { bucketExpr: "CONCAT(YEAR(createdAt), '-', LPAD((QUARTER(createdAt)-1)*3+1, 2, '0'), '-01')", defaultRange: 8, rangeUnitDays: 92 },
  semester: { bucketExpr: "CONCAT(YEAR(createdAt), '-', IF(MONTH(createdAt) <= 6, '01', '07'), '-01')", defaultRange: 6, rangeUnitDays: 183 },
};

function sinceDateFor(granularity, range) {
  const cfg = GRANULARITY_CONFIG[granularity];
  const n = Number.isInteger(range) && range > 0 ? range : cfg.defaultRange;
  return new Date(Date.now() - n * cfg.rangeUnitDays * 24 * 60 * 60 * 1000);
}

router.get('/summary', authenticateAdmin, async (req, res) => {
  try {
    const granularity = ['day', 'week', 'month', 'quarter', 'semester'].includes(req.query.granularity)
      ? req.query.granularity
      : 'day';
    const range = parseInt(req.query.range, 10);
    const since = sinceDateFor(granularity, range);
    const bucketExpr = GRANULARITY_CONFIG[granularity].bucketExpr;

    const seriesRows = await prisma.$queryRawUnsafe(
      `SELECT ${bucketExpr} AS bucket, COUNT(*) AS pageviews, COUNT(DISTINCT visitorId) AS visitors
       FROM AnalyticsPageView WHERE createdAt >= ? GROUP BY bucket ORDER BY bucket ASC`,
      since
    );

    const topPages = await prisma.$queryRawUnsafe(
      `SELECT path, COUNT(*) AS pageviews FROM AnalyticsPageView
       WHERE createdAt >= ? GROUP BY path ORDER BY pageviews DESC LIMIT 15`,
      since
    );

    const topEvents = await prisma.$queryRawUnsafe(
      `SELECT eventName, label, COUNT(*) AS count FROM AnalyticsEvent
       WHERE createdAt >= ? GROUP BY eventName, label ORDER BY count DESC LIMIT 15`,
      since
    );

    const deviceRows = await prisma.$queryRawUnsafe(
      `SELECT device, COUNT(*) AS count FROM AnalyticsPageView
       WHERE createdAt >= ? GROUP BY device`,
      since
    );
    const devices = { mobile: 0, tablet: 0, desktop: 0 };
    deviceRows.forEach(r => { devices[r.device] = Number(r.count); });

    const totalsRows = await prisma.$queryRawUnsafe(
      `SELECT COUNT(*) AS pageviews, COUNT(DISTINCT visitorId) AS uniqueVisitors
       FROM AnalyticsPageView WHERE createdAt >= ?`,
      since
    );

    const eventTotals = await prisma.$queryRawUnsafe(
      `SELECT eventName, COUNT(*) AS count FROM AnalyticsEvent
       WHERE createdAt >= ? AND eventName IN ('whatsapp_click', 'form_submit') GROUP BY eventName`,
      since
    );
    const whatsappClicks = Number(eventTotals.find(e => e.eventName === 'whatsapp_click')?.count || 0);
    const formSubmits = Number(eventTotals.find(e => e.eventName === 'form_submit')?.count || 0);

    res.json({
      success: true,
      granularity,
      series: seriesRows.map(r => ({ bucket: String(r.bucket), pageviews: Number(r.pageviews), visitors: Number(r.visitors) })),
      topPages: topPages.map(r => ({ path: r.path, pageviews: Number(r.pageviews) })),
      topEvents: topEvents.map(r => ({ eventName: r.eventName, label: r.label, count: Number(r.count) })),
      devices,
      totals: {
        pageviews: Number(totalsRows[0].pageviews),
        uniqueVisitors: Number(totalsRows[0].uniqueVisitors),
        whatsappClicks,
        formSubmits,
      },
    });
  } catch (err) {
    console.error('[Analytics] summary error:', err.message);
    res.status(500).json({ success: false, message: 'Error al obtener analítica' });
  }
});

module.exports = router;
```

- [ ] **Step 2: Mount the router**

In `server/index.js`, right after `app.use('/api/portal', require('./routes/portal'));` (line 206), add:

```js
app.use('/api/analytics', require('./routes/analytics'));
```

- [ ] **Step 3: Verify syntax**

```bash
cd "/Users/martinvaldescerna/Documents/AGENCIA SI OFICIAL/web-express-app/server" && node -c index.js && node -c routes/analytics.js
```
Expected: no output, exit code 0.

- [ ] **Step 4: Verify locally against a running server**

```bash
cd "/Users/martinvaldescerna/Documents/AGENCIA SI OFICIAL/web-express-app/server" && node index.js &
sleep 2
curl -s -o /dev/null -w "pageview: %{http_code}\n" -X POST http://localhost:3000/api/analytics/pageview \
  -H "Content-Type: application/json" -H "User-Agent: Mozilla/5.0 (iPhone)" \
  -d '{"path":"/sitio-web","visitorId":"test-visitor-1"}'
curl -s -o /dev/null -w "event: %{http_code}\n" -X POST http://localhost:3000/api/analytics/event \
  -H "Content-Type: application/json" -H "User-Agent: Mozilla/5.0 (iPhone)" \
  -d '{"eventName":"whatsapp_click","path":"/sitio-web","visitorId":"test-visitor-1","label":"Hero CTA WhatsApp"}'
kill %1
```
Expected: both print `204`. (This requires a reachable `DATABASE_URL` in `server/.env` — if the local server can't reach the production DB, skip this step and rely on the post-deploy verification in Task 7 instead; do not block on it.)

- [ ] **Step 5: Commit**

```bash
cd "/Users/martinvaldescerna/Documents/AGENCIA SI OFICIAL/web-express-app" && git add server/routes/analytics.js server/index.js && git commit -m "$(cat <<'EOF'
Feat: agrega endpoints de ingesta y resumen de analítica propia

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Frontend tracking library

**Files:**
- Create: `client/src/lib/analytics.js`

**Interfaces:**
- Produces: `trackPageView(path, referrer?)`, `trackEvent(eventName, { path?, label? })`, `initGlobalTracking()` — all consumed by Task 4 (App.jsx) and Task 5 (named events).

- [ ] **Step 1: Write `client/src/lib/analytics.js`**

```js
const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const VISITOR_KEY = 'swl_visitor_id'

function getVisitorId() {
  try {
    let id = localStorage.getItem(VISITOR_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(VISITOR_KEY, id)
    }
    return id
  } catch {
    return 'no-storage'
  }
}

function post(path, body) {
  try {
    fetch(`${API}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {})
  } catch {
    // Never let a tracking failure affect navigation.
  }
}

export function trackPageView(path, referrer) {
  post('/api/analytics/pageview', {
    path,
    visitorId: getVisitorId(),
    referrer: referrer || (typeof document !== 'undefined' ? document.referrer : ''),
  })
}

export function trackEvent(eventName, { path, label } = {}) {
  post('/api/analytics/event', {
    eventName,
    path: path || window.location.pathname,
    visitorId: getVisitorId(),
    label,
  })
}

function findWhatsappLink(el) {
  const a = el.closest ? el.closest('a[href]') : null
  if (!a) return null
  const href = a.getAttribute('href') || ''
  return href.includes('wa.me') || href.includes('api.whatsapp.com') ? a : null
}

let initialized = false

export function initGlobalTracking() {
  if (initialized) return
  initialized = true

  document.addEventListener('click', (e) => {
    const target = e.target
    if (!target || !target.closest) return

    const tagged = target.closest('[data-analytics-event]')
    if (tagged) {
      trackEvent(tagged.getAttribute('data-analytics-event'), {
        label: (tagged.textContent || '').trim().slice(0, 191),
      })
      return
    }

    const waLink = findWhatsappLink(target)
    if (waLink) {
      trackEvent('whatsapp_click', { label: (waLink.textContent || '').trim().slice(0, 191) })
    }
  }, true)

  document.addEventListener('submit', (e) => {
    const form = e.target
    if (!(form instanceof HTMLFormElement)) return
    trackEvent('form_submit', { label: form.getAttribute('id') || form.getAttribute('name') || '' })
  }, true)
}
```

- [ ] **Step 2: Verify it builds**

```bash
cd "/Users/martinvaldescerna/Documents/AGENCIA SI OFICIAL/web-express-app/client" && node --experimental-vm-modules -e "console.log('syntax ok')" && npx vite build --mode development 2>&1 | tail -20
```
Expected: build completes without referencing errors about `analytics.js` (it isn't imported by anything yet, so this just confirms no stray syntax error breaks the existing build). It's fine if this step is skipped in favor of Task 4's build check, since this file isn't wired in until then — do not spend time debugging an isolated build here if Task 4's build passes.

- [ ] **Step 3: Commit**

```bash
cd "/Users/martinvaldescerna/Documents/AGENCIA SI OFICIAL/web-express-app" && git add client/src/lib/analytics.js && git commit -m "$(cat <<'EOF'
Feat: agrega librería de tracking cliente para analítica propia

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Wire tracking into `App.jsx`

**Files:**
- Modify: `client/src/App.jsx:1-2` (imports), `client/src/App.jsx:98-107` (`ScrollToTop`)

**Interfaces:**
- Consumes: `trackPageView`, `initGlobalTracking` from `./lib/analytics` (Task 3).

- [ ] **Step 1: Import the tracking lib and initialize the global listener**

In `client/src/App.jsx`, change line 1-2 from:
```js
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
```
to:
```js
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { trackPageView, initGlobalTracking } from './lib/analytics'
```

Then, right after the import block (after line 40, `import CookieConsent from './components/legal/CookieConsent'`), add:
```js

initGlobalTracking()
```

This runs once when the module is first imported by the browser bundle (this file is never imported by the Node-only `client/scripts/generate-seo-html.cjs`, which builds HTML by string templates rather than importing React components, so this has no effect on the static pre-render step).

- [ ] **Step 2: Track page views, excluding admin/portal**

Change `ScrollToTop` (currently):
```js
const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', { page_path: pathname, page_title: document.title })
    }
  }, [pathname])
  return null
}
```
to:
```js
const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', { page_path: pathname, page_title: document.title })
    }
    if (!pathname.startsWith('/admin') && !pathname.startsWith('/portal')) {
      trackPageView(pathname)
    }
  }, [pathname])
  return null
}
```

- [ ] **Step 3: Build and verify no errors**

```bash
cd "/Users/martinvaldescerna/Documents/AGENCIA SI OFICIAL/web-express-app/client" && npm run build 2>&1 | tail -30
```
Expected: build completes successfully (Vite build + `generate-seo-html.cjs` run), no errors mentioning `analytics.js` or `App.jsx`.

- [ ] **Step 4: Manual check in the browser**

```bash
cd "/Users/martinvaldescerna/Documents/AGENCIA SI OFICIAL/web-express-app/client" && npm run dev
```
Open `http://localhost:5173/` in a browser, open DevTools → Network, navigate to a couple of routes (e.g. `/`, `/sitio-web`), and confirm a `POST` request to `/api/analytics/pageview` fires on each navigation (it may show as failed/red if no local backend is running with `VITE_API_URL` pointed at it — that's fine, just confirm the request is attempted with the right `path`). Stop the dev server after checking.

- [ ] **Step 5: Commit**

```bash
cd "/Users/martinvaldescerna/Documents/AGENCIA SI OFICIAL/web-express-app" && git add client/src/App.jsx && git commit -m "$(cat <<'EOF'
Feat: trackea page views y clics/formularios globales en toda la SPA

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Named events on the `/sitio-web` funnel

**Files:**
- Modify: `client/src/components/landing/SitioWebLanding.jsx:136-139` (`trackLead`)
- Modify: `client/src/components/landing/SitioWebWizard.jsx:268-273` (`next`)
- Modify: `client/src/components/landing/SitioWebWizard.jsx:352-354` (inside `handleSubmit`, before the redirect)

**Interfaces:**
- Consumes: `trackEvent` from `../../lib/analytics` (Task 3).

- [ ] **Step 1: Import `trackEvent` in `SitioWebLanding.jsx`**

Find the existing import of shared helpers near the top of `client/src/components/landing/SitioWebLanding.jsx` and add a new import line right after the other local imports (top of file, alongside any `lucide-react` / other relative imports):
```js
import { trackEvent } from '../../lib/analytics'
```

- [ ] **Step 2: Track every landing CTA through the existing `trackLead` choke point**

Change (line 136-139):
```js
  const trackLead = (name, wa = false) => {
    px('Lead', { content_name: name }); ga('generate_lead', { item_name: name })
    if (wa) { px('Contact'); ga('contact', { method: 'whatsapp' }) }
  }
```
to:
```js
  const trackLead = (name, wa = false) => {
    px('Lead', { content_name: name }); ga('generate_lead', { item_name: name })
    trackEvent('lead_click', { label: name })
    if (wa) { px('Contact'); ga('contact', { method: 'whatsapp' }) }
  }
```
This covers all 11 existing `trackLead(...)` call sites (nav CTA, hero CTAs, pricing cards, "cómo funciona", upsell tienda, final CTA, sticky bar) with zero further edits, giving a per-position breakdown in the "botones más usados" table on the dashboard. The generic `wa.me` click detection from Task 3 additionally counts these under `whatsapp_click`.

- [ ] **Step 3: Import `trackEvent` in `SitioWebWizard.jsx`**

Add near the top of `client/src/components/landing/SitioWebWizard.jsx`, alongside its other relative imports:
```js
import { trackEvent } from '../../lib/analytics'
```

- [ ] **Step 4: Track wizard step progression**

Change (line 268-273):
```js
  function next() {
    const e = validateStep(step)
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setStep(s => Math.min(s + 1, 7))
  }
```
to:
```js
  function next() {
    const e = validateStep(step)
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    const target = Math.min(step + 1, 7)
    trackEvent('wizard_step', { label: `Paso ${target}` })
    setStep(target)
  }
```

- [ ] **Step 5: Track checkout start**

In `handleSubmit`, change (line 352-354):
```js
      px('Lead', { value: json.montoTotal, currency: 'CLP', content_name: 'Sitio Web Profesional' }, json.orderId)
      px('InitiateCheckout', { value: json.montoTotal, currency: 'CLP', content_name: 'Sitio Web Profesional' })
      ga('generate_lead', { value: json.montoTotal, currency: 'CLP', transaction_id: json.orderId })
```
to:
```js
      px('Lead', { value: json.montoTotal, currency: 'CLP', content_name: 'Sitio Web Profesional' }, json.orderId)
      px('InitiateCheckout', { value: json.montoTotal, currency: 'CLP', content_name: 'Sitio Web Profesional' })
      ga('generate_lead', { value: json.montoTotal, currency: 'CLP', transaction_id: json.orderId })
      trackEvent('checkout_iniciado', { label: 'sitio-web-online' })
```

- [ ] **Step 6: Build and verify**

```bash
cd "/Users/martinvaldescerna/Documents/AGENCIA SI OFICIAL/web-express-app/client" && npm run build 2>&1 | tail -30
```
Expected: build completes successfully, no import errors for `trackEvent`.

- [ ] **Step 7: Commit**

```bash
cd "/Users/martinvaldescerna/Documents/AGENCIA SI OFICIAL/web-express-app" && git add client/src/components/landing/SitioWebLanding.jsx client/src/components/landing/SitioWebWizard.jsx && git commit -m "$(cat <<'EOF'
Feat: nombra eventos clave del embudo /sitio-web (leads, pasos, checkout)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Analytics dashboard (`/admin/analitica`)

**Files:**
- Create: `client/src/components/AnalyticsDashboard.jsx`
- Modify: `client/src/App.jsx` (import + route)
- Modify: `client/src/components/AdminDashboard.jsx:3-8` (icon import), `client/src/components/AdminDashboard.jsx:129-140` (nav array)
- Modify: `client/package.json` (add `recharts` dependency)

**Interfaces:**
- Consumes: `GET /api/analytics/summary?granularity=...` (Task 2), `useAuth()` (existing `client/src/context/AuthContext.jsx`).

- [ ] **Step 1: Install `recharts`**

```bash
cd "/Users/martinvaldescerna/Documents/AGENCIA SI OFICIAL/web-express-app/client" && npm install recharts
```
Expected: installs successfully into `dependencies`; check the terminal output for any peer-dependency error mentioning React — if `recharts` warns about the React 19 peer range, confirm the installed version is `recharts@3.x` (it declares React 19 support) rather than forcing a downgrade; do not use `--legacy-peer-deps` to paper over a real incompatibility — if one appears, stop and report it instead of proceeding.

- [ ] **Step 2: Write `client/src/components/AnalyticsDashboard.jsx`**

```jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { Lock, Loader2, Smartphone, Tablet, Monitor, Eye, Users, MessageCircle, FileText } from 'lucide-react'

const GRANULARITIES = [
  { value: 'day', label: 'Día' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
  { value: 'quarter', label: 'Trimestre' },
  { value: 'semester', label: 'Semestre' },
]

const DEVICE_LABELS = { mobile: 'Móvil', tablet: 'Tablet', desktop: 'Escritorio' }
const DEVICE_ICONS = { mobile: Smartphone, tablet: Tablet, desktop: Monitor }

function formatBucket(bucket, granularity) {
  const d = new Date(bucket)
  if (Number.isNaN(d.getTime())) return bucket
  if (granularity === 'day') return d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' })
  if (granularity === 'week') return `Sem ${d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' })}`
  if (granularity === 'month') return d.toLocaleDateString('es-CL', { month: 'short', year: 'numeric' })
  if (granularity === 'quarter') return `Q${Math.floor(d.getMonth() / 3) + 1} ${d.getFullYear()}`
  return `S${d.getMonth() < 6 ? 1 : 2} ${d.getFullYear()}`
}

export default function AnalyticsDashboard() {
  const { adminToken, loginAdmin, authFetch } = useAuth()
  const [pwd, setPwd] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const [granularity, setGranularity] = useState('day')
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!adminToken) { setLoading(false); return }
    setLoading(true)
    authFetch(`/api/analytics/summary?granularity=${granularity}`)
      .then(r => r.json())
      .then(data => { if (data.success) setSummary(data) })
      .finally(() => setLoading(false))
  }, [adminToken, granularity])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoggingIn(true); setLoginError('')
    try { await loginAdmin(pwd) }
    catch (err) { setLoginError(err.message || 'Contraseña incorrecta') }
    finally { setLoggingIn(false) }
  }

  if (!adminToken) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-6 h-6 bg-white flex items-center justify-center rounded-sm">
              <span className="text-black font-bold text-sm italic">SI</span>
            </div>
            <span className="text-white font-bold tracking-tighter text-sm uppercase">Admin Panel</span>
          </div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Contraseña de administrador</label>
          <div className="relative mb-4">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="password" value={pwd} onChange={e => setPwd(e.target.value)} required autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/20"
            />
          </div>
          {loginError && <p className="text-red-400 text-xs mb-4">{loginError}</p>}
          <button type="submit" disabled={loggingIn}
            className="w-full bg-white text-black py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-200 disabled:opacity-50 transition-all">
            {loggingIn ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Ingresar'}
          </button>
        </form>
      </div>
    )
  }

  const totals = summary?.totals || { pageviews: 0, uniqueVisitors: 0, whatsappClicks: 0, formSubmits: 0 }
  const devices = summary?.devices || { mobile: 0, tablet: 0, desktop: 0 }
  const deviceTotal = devices.mobile + devices.tablet + devices.desktop || 1
  const series = (summary?.series || []).map(row => ({ ...row, label: formatBucket(row.bucket, granularity) }))

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans antialiased p-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="text-white font-bold uppercase tracking-widest text-sm">Analítica del sitio</h1>
        <div className="flex gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
          {GRANULARITIES.map(g => (
            <button key={g.value} onClick={() => setGranularity(g.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${granularity === g.value ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}>
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-zinc-500" /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Visitas', value: totals.pageviews, icon: Eye },
              { label: 'Visitantes únicos', value: totals.uniqueVisitors, icon: Users },
              { label: 'Clics WhatsApp', value: totals.whatsappClicks, icon: MessageCircle },
              { label: 'Formularios enviados', value: totals.formSubmits, icon: FileText },
            ].map(card => (
              <div key={card.label} className="bg-white/5 border border-white/10 rounded-xl p-5">
                <card.icon className="w-4 h-4 text-zinc-500 mb-3" />
                <div className="text-2xl font-bold text-white">{card.value.toLocaleString('es-CL')}</div>
                <div className="text-xs text-zinc-500 mt-1">{card.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
            <h2 className="text-sm font-bold text-white mb-4">Visitas y visitantes en el tiempo</h2>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <LineChart data={series}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="label" stroke="#71717a" fontSize={12} />
                  <YAxis stroke="#71717a" fontSize={12} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8 }} />
                  <Legend />
                  <Line type="monotone" dataKey="pageviews" name="Visitas" stroke="#22d3ee" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="visitors" name="Visitantes únicos" stroke="#a78bfa" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-sm font-bold text-white mb-4">Páginas más visitadas</h2>
              <div className="space-y-2">
                {(summary?.topPages || []).map(p => (
                  <div key={p.path} className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400 truncate pr-2">{p.path}</span>
                    <span className="text-white font-semibold">{p.pageviews}</span>
                  </div>
                ))}
                {(!summary?.topPages || summary.topPages.length === 0) && <p className="text-xs text-zinc-600">Sin datos en este período.</p>}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-sm font-bold text-white mb-4">Botones y formularios más usados</h2>
              <div className="space-y-2">
                {(summary?.topEvents || []).map((e, i) => (
                  <div key={`${e.eventName}-${e.label}-${i}`} className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400 truncate pr-2">{e.label || e.eventName}</span>
                    <span className="text-white font-semibold">{e.count}</span>
                  </div>
                ))}
                {(!summary?.topEvents || summary.topEvents.length === 0) && <p className="text-xs text-zinc-600">Sin datos en este período.</p>}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-sm font-bold text-white mb-4">Dispositivos</h2>
              <div className="space-y-3">
                {Object.entries(devices).map(([key, count]) => {
                  const Icon = DEVICE_ICONS[key]
                  const pct = Math.round((count / deviceTotal) * 100)
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="flex items-center gap-2 text-zinc-400"><Icon className="w-3.5 h-3.5" /> {DEVICE_LABELS[key]}</span>
                        <span className="text-white font-semibold">{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Lazy-load it and add the route in `App.jsx`**

Change the `import { useEffect } from 'react'` line (already touched in Task 4) to also bring in `lazy`/`Suspense`:
```js
import { useEffect, lazy, Suspense } from 'react'
```
Then, right after the last static import (`import CookieConsent from './components/legal/CookieConsent'`), add:
```js
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'))
```
Then, in the `{/* Admin */}` route block, right after `<Route path="/admin/reset-password" element={<ResetAdminPassword />} />`, add:
```jsx
          <Route path="/admin/analitica" element={
            <Suspense fallback={<div style={{ background: '#000', minHeight: '100vh' }} />}>
              <AnalyticsDashboard />
            </Suspense>
          } />
```

- [ ] **Step 4: Add the nav link in `AdminDashboard.jsx`**

Change the lucide-react import (line 3-8) from:
```js
import {
    LayoutDashboard, Users, Settings, Package,
    Search, Filter, ChevronRight, Clock,
    CheckCircle2, AlertCircle, FileText, Download,
    MoreVertical, LogOut, Lock, Loader2
} from 'lucide-react'
```
to:
```js
import {
    LayoutDashboard, Users, Settings, Package,
    Search, Filter, ChevronRight, Clock,
    CheckCircle2, AlertCircle, FileText, Download,
    MoreVertical, LogOut, Lock, Loader2, BarChart3
} from 'lucide-react'
```
Then change the nav array (line 130-135) from:
```js
                        {[
                            { icon: LayoutDashboard, label: 'Dashboard', active: true, action: null },
                            { icon: Package, label: 'Pedidos', action: null },
                            { icon: Users, label: 'Clientes', action: () => navigate('/admin/clientes') },
                            { icon: Settings, label: 'Configuración', action: null },
                        ].map((item, i) => (
```
to:
```js
                        {[
                            { icon: LayoutDashboard, label: 'Dashboard', active: true, action: null },
                            { icon: Package, label: 'Pedidos', action: null },
                            { icon: Users, label: 'Clientes', action: () => navigate('/admin/clientes') },
                            { icon: BarChart3, label: 'Analítica', action: () => navigate('/admin/analitica') },
                            { icon: Settings, label: 'Configuración', action: null },
                        ].map((item, i) => (
```

- [ ] **Step 5: Build and verify**

```bash
cd "/Users/martinvaldescerna/Documents/AGENCIA SI OFICIAL/web-express-app/client" && npm run build 2>&1 | tail -40
```
Expected: build succeeds; Vite's output should show a separate chunk for `AnalyticsDashboard` (confirming it's code-split, not bundled with the public pages) — look for a line like `AnalyticsDashboard-<hash>.js` distinct from the main `index-<hash>.js`.

- [ ] **Step 6: Manual check in the browser**

```bash
cd "/Users/martinvaldescerna/Documents/AGENCIA SI OFICIAL/web-express-app/client" && npm run dev
```
Open `http://localhost:5173/admin/si`, log in, click "Analítica" in the sidebar, confirm it navigates to `/admin/analitica` and renders the login-gated (or already-authed) dashboard shell without console errors (data will be empty/zero until Task 7's live traffic exists — that's expected). Stop the dev server after checking.

- [ ] **Step 7: Commit**

```bash
cd "/Users/martinvaldescerna/Documents/AGENCIA SI OFICIAL/web-express-app" && git add client/src/components/AnalyticsDashboard.jsx client/src/App.jsx client/src/components/AdminDashboard.jsx client/package.json client/package-lock.json && git commit -m "$(cat <<'EOF'
Feat: agrega dashboard de analítica en /admin/analitica

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Build, push, and verify live

**Files:** none (build artifacts + deploy verification only)

**Interfaces:** none — this task consumes everything built in Tasks 1-6 as a whole.

- [ ] **Step 1: Full production build (regenerates `client/dist/`)**

```bash
cd "/Users/martinvaldescerna/Documents/AGENCIA SI OFICIAL/web-express-app" && npm run build 2>&1 | tail -50
```
Expected: completes with no errors; `client/dist/` is updated with the new hashed asset filenames.

- [ ] **Step 2: Stage and commit the built `dist/`**

```bash
cd "/Users/martinvaldescerna/Documents/AGENCIA SI OFICIAL/web-express-app" && git add client/dist && git status
```
Review the `git status` output — it should show only `client/dist/*` changes. Then:
```bash
git commit -m "$(cat <<'EOF'
Build: rebuild dist con analítica propia (tracking + dashboard admin)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 3: Push**

```bash
cd "/Users/martinvaldescerna/Documents/AGENCIA SI OFICIAL/web-express-app" && git push origin main
```

- [ ] **Step 4: Verify Railway (backend) redeployed with the new endpoints**

```bash
railway logs --project 6f2e5416-c663-4565-8cdc-b4f8510deb7f --service 2be8ba4a-702d-4282-8f3d-98fdf9073366 --environment production --lines 30 2>&1 | tail -30
```
Expected: `[Migration] Done` with no errors about `AnalyticsPageView`/`AnalyticsEvent`, and `Server running on http://localhost:3000`. Then confirm the ingestion endpoint responds on the live domain:
```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://agencia-si-oficial-production.up.railway.app/api/analytics/pageview \
  -H "Content-Type: application/json" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)" \
  -d '{"path":"/sitio-web","visitorId":"deploy-check-1"}'
```
Expected: `204`.

- [ ] **Step 5: Verify Hostinger (frontend) redeployed with the new bundle**

Poll for the new asset hash (replace `<new-hash-fragment>` with whatever hash `npm run build` produced for the main entry, visible in the Step 1 output or in `client/dist/index.html`):
```bash
until curl -s https://agenciasi.cl/ | grep -q "$(grep -oE 'index-[a-zA-Z0-9_-]+\.js' client/dist/index.html)"; do sleep 15; done
echo "Hostinger deployed"
```

- [ ] **Step 6: End-to-end functional check**

```bash
curl -s -X POST https://agencia-si-oficial-production.up.railway.app/api/analytics/event \
  -H "Content-Type: application/json" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)" \
  -d '{"eventName":"whatsapp_click","path":"/sitio-web","visitorId":"deploy-check-1","label":"Deploy check"}'
```
Then, using the admin credentials, log into `https://agenciasi.cl/admin/si`, click "Analítica", switch through all five granularity tabs (Día/Semana/Mes/Trimestre/Semestre), and confirm: no console errors, the totals cards show at least the `deploy-check-1` pageview and event just sent, and the device breakdown shows 100% Escritorio for that test hit (since the `curl` User-Agent was a desktop one).

- [ ] **Step 7: Report to the user**

Summarize in chat: what shipped, the live `/admin/analitica` URL, and that data will start accumulating from real traffic going forward (the two test-only rows from Steps 4/6 can be ignored — they're harmless and will just look like one extra desktop visit to `/sitio-web`).
