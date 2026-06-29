// Run from the project root: node scripts/generate-key.js <duration> ["note"]
// Examples:
//   node scripts/generate-key.js month
//   node scripts/generate-key.js 3months "Discord: someuser#0 - PayPal $9"
//   node scripts/generate-key.js 45        (raw number of days)
require('dotenv').config();
const { createLicenseKey } = require('../src/db/queries/license');

const PRESETS = { month: 30, '1month': 30, '3months': 90, '6months': 180, year: 365, '1year': 365 };

async function main() {
  const arg = process.argv[2];
  const note = process.argv[3];
  if (!arg) {
    console.log('Usage: node scripts/generate-key.js <month|3months|6months|year|<days>> ["note"]');
    process.exit(1);
  }
  const days = PRESETS[arg] ?? parseInt(arg, 10);
  if (!days || Number.isNaN(days)) {
    console.log('Invalid duration. Use month, 3months, 6months, year, or a raw number of days.');
    process.exit(1);
  }
  const code = await createLicenseKey(days, note || null);
  console.log(`✅ Generated key (${days} days): ${code}`);
  console.log('Give this code to the customer — they redeem it in Discord via /customize → Redeem Premium Key.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Failed to generate key:', err);
  process.exit(1);
});
