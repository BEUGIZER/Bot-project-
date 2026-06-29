// Fetches a random GIF from Klipy for reaction commands (hug, slap, etc).
//
// Why Klipy and not Tenor: Google stopped accepting new Tenor API clients on
// Jan 13, 2026 and is fully shutting the Tenor API down on June 30, 2026.
// Klipy is the community-recommended drop-in replacement (Discord, WhatsApp,
// and others are migrating to it too) and offers a free tier with no
// expiry. Get a key at https://klipy.com/developers.
//
// Uses Node's built-in fetch (Node 18+, already required by package.json
// "engines") — no extra npm dependency needed.
//
// If KLIPY_API_KEY isn't set, getRandomGif() resolves to null and the
// calling command should fall back to a plain text reply. This means the
// bot still works with zero setup; GIFs are an opt-in upgrade.
const config = require('../config');

const KLIPY_BASE = 'https://api.klipy.com/api/v1';

// Klipy's exact nested shape for per-format GIF URLs isn't fully published
// in their public docs, so instead of hardcoding field names that might not
// match, this walks the response looking for any string that looks like a
// GIF URL. Robust to minor shape differences; returns null if nothing matches.
function findGifUrl(node) {
  if (!node || typeof node !== 'object') return null;
  for (const value of Object.values(node)) {
    if (typeof value === 'string' && /\.gif(\?|$)/i.test(value)) return value;
    if (typeof value === 'object') {
      const found = findGifUrl(value);
      if (found) return found;
    }
  }
  return null;
}

async function getRandomGif(searchTerm, customerId = 'discord-bot') {
  if (!config.klipyApiKey) return null;

  const url =
    `${KLIPY_BASE}/${config.klipyApiKey}/gifs/search` +
    `?q=${encodeURIComponent(searchTerm)}` +
    `&customer_id=${encodeURIComponent(customerId)}` +
    `&per_page=24&rating=g`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Klipy request failed: ${res.status} ${res.statusText}`);
      return null;
    }
    const body = await res.json();
    const items = body?.data?.data;
    if (!Array.isArray(items) || !items.length) return null;
    const choice = items[Math.floor(Math.random() * items.length)];
    return findGifUrl(choice.files || choice);
  } catch (err) {
    console.error('Klipy fetch failed:', err.message);
    return null;
  }
}

module.exports = { getRandomGif };
