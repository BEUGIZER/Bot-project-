require('dotenv').config();

module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  databaseUrl: process.env.DATABASE_URL,
  ownerIds: (process.env.OWNER_IDS || '').split(',').map((s) => s.trim()).filter(Boolean),
  freeSlotLimit: parseInt(process.env.FREE_SLOT_LIMIT || '5', 10),
  premiumSlotLimit: parseInt(process.env.PREMIUM_SLOT_LIMIT || '25', 10),
  klipyApiKey: process.env.KLIPY_API_KEY || null,
};
