// Meta Conversions API — server-side event delivery for the /sitio-web funnel.
// Complements (not replaces) the browser Pixel: same event_name + event_id as
// the client-side fbq('track', ...) call lets Meta deduplicate the two, so
// campaigns get resilient attribution even when the browser pixel is blocked.
// No-ops silently if META_PIXEL_ID / META_CAPI_ACCESS_TOKEN aren't configured.

const crypto = require('crypto');

const GRAPH_API_VERSION = 'v21.0';

function sha256(value) {
  if (!value) return null;
  return crypto.createHash('sha256').update(String(value).trim().toLowerCase()).digest('hex');
}

function hashPhone(phone) {
  if (!phone) return null;
  const digits = String(phone).replace(/\D/g, '');
  return digits ? sha256(digits) : null;
}

async function sendCapiEvent({ eventName, eventId, eventSourceUrl, email, phone, customData }) {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !accessToken) return;

  const user_data = {};
  const em = sha256(email);
  const ph = hashPhone(phone);
  if (em) user_data.em = [em];
  if (ph) user_data.ph = [ph];

  const body = {
    data: [{
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      event_source_url: eventSourceUrl,
      action_source: 'website',
      user_data,
      custom_data: customData || {},
    }],
  };

  // Set temporarily in Railway (META_CAPI_TEST_EVENT_CODE) while using Meta's
  // "Test Events" tool, then REMOVE it — events tagged with a test code never
  // count toward real campaign reporting, only show up in that test view.
  if (process.env.META_CAPI_TEST_EVENT_CODE) {
    body.test_event_code = process.env.META_CAPI_TEST_EVENT_CODE;
  }

  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${accessToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) console.error('[meta-capi]', eventName, JSON.stringify(json));
    else console.log('[meta-capi]', eventName, eventId, `received=${json.events_received}`, body.test_event_code ? '(test event)' : '');
  } catch (e) {
    console.error('[meta-capi]', eventName, e.message);
  }
}

module.exports = { sendCapiEvent };
