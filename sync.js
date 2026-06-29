const { getGuildSettings, isPremiumActive } = require('../db/queries/guild');
const { commands } = require('../commands/registry');
const config = require('../config');

// Pushes the correct set of per-guild slash commands to Discord:
// /customize plus whatever the owner has activated for that guild.
async function syncGuildCommands(client, guildId) {
  const customize = require('../commands/customize');
  const settings = await getGuildSettings(guildId);
  const body = [customize.data.toJSON()];
  for (const name of settings.active_commands) {
    const def = commands.get(name);
    if (def) body.push(def.data.toJSON());
  }
  await client.application.commands.set(body, guildId);
  return settings;
}

function getSlotLimit(settings) {
  return isPremiumActive(settings) ? config.premiumSlotLimit : config.freeSlotLimit;
}

module.exports = { syncGuildCommands, getSlotLimit };
