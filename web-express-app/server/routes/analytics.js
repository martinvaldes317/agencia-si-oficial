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
