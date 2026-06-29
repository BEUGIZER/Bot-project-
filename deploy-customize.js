// Run this once (and again any time customize.js's definition changes) to register
// the single global slash command. Usage: npm run deploy
const { REST, Routes } = require('discord.js');
const config = require('./config');
const customize = require('./commands/customize');

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
  await rest.put(Routes.applicationCommands(config.clientId), {
    body: [customize.data.toJSON()],
  });
  console.log('✅ Registered global /customize command.');
})();
