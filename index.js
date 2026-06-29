const { Client, GatewayIntentBits, Partials, Events, REST, Routes } = require('discord.js');
const config = require('./config');
const { commands } = require('./commands/registry');
const customize = require('./commands/customize');
const { getGuildSettings } = require('./db/queries/guild');
const { getPendingReminders, deleteReminder } = require('./db/queries/reminders');
const { syncGuildCommands } = require('./utils/sync');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  partials: [Partials.GuildMember],
});

async function rescheduleReminders() {
  const pending = await getPendingReminders();
  for (const r of pending) {
    const delay = new Date(r.remind_at).getTime() - Date.now();
    const fire = async () => {
      try {
        const channel = await client.channels.fetch(r.channel_id);
        await channel.send(`⏰ <@${r.user_id}>, reminder: ${r.message}`);
      } catch (err) {
        console.error('Failed to deliver reminder:', err.message);
      } finally {
        await deleteReminder(r.id).catch(() => {});
      }
    };
    if (delay <= 0) fire();
    else setTimeout(fire, delay);
  }
}

client.once(Events.ClientReady, async (c) => {
  console.log(`Logged in as ${c.user.tag}`);
  console.log(`Loaded ${commands.size} library commands across ${require('./commands/registry').categories.length} categories.`);

  // Self-register the single global slash command (/customize). Idempotent —
  // safe to call on every boot, so no separate "npm run deploy" step is
  // needed when hosting on Railway or similar.
  try {
    const rest = new REST({ version: '10' }).setToken(config.token);
    const appId = config.clientId || c.application.id;
    await rest.put(Routes.applicationCommands(appId), { body: [customize.data.toJSON()] });
    console.log('✅ Global /customize command registered.');
  } catch (err) {
    console.error('Failed to register global /customize command:', err.message);
  }

  for (const guild of c.guilds.cache.values()) {
    try {
      await syncGuildCommands(client, guild.id);
    } catch (err) {
      console.error(`Failed to sync commands for guild ${guild.id}:`, err.message);
    }
  }

  await rescheduleReminders().catch((err) => console.error('Reminder reschedule failed:', err.message));
});

client.on(Events.GuildCreate, async (guild) => {
  try {
    await getGuildSettings(guild.id); // ensures a settings row exists
    await syncGuildCommands(client, guild.id); // guild only has /customize until the owner activates more
  } catch (err) {
    console.error('Error on guildCreate:', err.message);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === 'customize') {
        await customize.execute(interaction);
        return;
      }

      const def = commands.get(interaction.commandName);
      if (!def) return;

      // Defense in depth: confirm the command is still active for this guild
      // (guards against stale Discord-side caches right after a /customize change).
      const settings = await getGuildSettings(interaction.guildId);
      if (!settings.active_commands.includes(interaction.commandName)) {
        await interaction.reply({ content: 'This command is not currently active in this server.', ephemeral: true });
        return;
      }
      await def.execute(interaction);
      return;
    }

    if (interaction.customId?.startsWith('customize:')) {
      await customize.handleComponent(interaction);
      return;
    }

    // Component interactions belonging to a specific command, e.g. "tictactoe:4", "poll:yes"
    if (interaction.customId?.includes(':')) {
      const [cmdName] = interaction.customId.split(':');
      const def = commands.get(cmdName);
      if (def?.handleComponent) {
        await def.handleComponent(interaction);
        return;
      }
    }
  } catch (err) {
    console.error('Interaction error:', err);
    if (interaction.isRepliable()) {
      interaction.reply({ content: '⚠️ Something went wrong running that.', ephemeral: true }).catch(() => {});
    }
  }
});

// Defense in depth: a bug anywhere else (a missed await in a future command,
// a library quirk, etc.) should never be able to take the whole bot down.
// Log it and keep running instead of letting Node's default behavior
// terminate the process on an unhandled rejection.
process.on('unhandledRejection', (err) => {
  console.error('Unhandled promise rejection:', err);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

client.login(config.token);
      
