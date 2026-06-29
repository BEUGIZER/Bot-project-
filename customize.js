const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');
const { categories, commandsByCategory, commands } = require('./registry');
const { getGuildSettings, setActiveCommands, isPremiumActive } = require('../db/queries/guild');
const { redeemLicenseKey } = require('../db/queries/license');

const CATEGORY_LABELS = {
  moderation: '🛡️ Moderation',
  servermanagement: '⚙️ Server Management',
  utility: '🧰 Utility',
  fun: '🎉 Fun',
  economy: '💰 Economy',
  games: '🎮 Games',
  info: 'ℹ️ Info',
};

function isOwner(interaction) {
  return !!interaction.guild && interaction.guild.ownerId === interaction.user.id;
}

async function buildMessage(guildId, activeCategory = null) {
  // Lazy require avoids a circular require with utils/sync.js at module load time.
  const { getSlotLimit } = require('../utils/sync');

  const settings = await getGuildSettings(guildId);
  const limit = getSlotLimit(settings);
  const premium = isPremiumActive(settings);
  const active = settings.active_commands;

  const embed = new EmbedBuilder()
    .setTitle('🔧 Bot Customization')
    .setColor(premium ? 0xf5c518 : 0x5865f2)
    .setDescription('Pick which commands are active in this server. Only the server owner can change this.')
    .addFields(
      {
        name: `Active Commands (${active.length}/${limit})`,
        value: active.length ? active.map((c) => `\`/${c}\``).join(', ') : '*None selected yet*',
      },
      {
        name: 'Plan',
        value: premium
          ? `⭐ Premium — active until <t:${Math.floor(new Date(settings.premium_until).getTime() / 1000)}:D>`
          : `Free plan (${limit} slots). Use **Redeem Premium Key** below to unlock more.`,
      }
    );

  const categoryRow = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('customize:category')
      .setPlaceholder('➕ Choose a category to add commands from')
      .addOptions(
        categories.map((c) => ({
          label: CATEGORY_LABELS[c] || c,
          value: c,
          default: c === activeCategory,
        }))
      )
  );

  const rows = [categoryRow];

  if (activeCategory) {
    const remaining = Math.max(limit - active.length, 0);
    const names = (commandsByCategory.get(activeCategory) || []).filter((n) => !active.includes(n));

    if (remaining > 0 && names.length) {
      const options = names.slice(0, 25).map((n) => ({
        label: `/${n}`,
        description: (commands.get(n)?.data.description || '').slice(0, 100),
        value: n,
      }));
      rows.push(
        new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId(`customize:add:${activeCategory}`)
            .setPlaceholder(`Add up to ${Math.min(remaining, options.length)} command(s)`)
            .setMinValues(1)
            .setMaxValues(Math.min(remaining, options.length))
            .addOptions(options)
        )
      );
    } else if (!remaining) {
      embed.addFields({ name: '⚠️ Slot limit reached', value: 'Remove a command below or unlock more with a premium key.' });
    } else {
      embed.addFields({ name: 'Category', value: 'Every command in this category is already active.' });
    }
  }

  const buttonRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('customize:remove').setLabel('Remove Commands').setStyle(ButtonStyle.Secondary).setDisabled(!active.length),
    new ButtonBuilder().setCustomId('customize:clear').setLabel('Clear All').setStyle(ButtonStyle.Danger).setDisabled(!active.length),
    new ButtonBuilder().setCustomId('customize:redeem').setLabel('Redeem Premium Key').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('customize:refresh').setLabel('Refresh').setStyle(ButtonStyle.Primary)
  );
  rows.push(buttonRow);

  return { embeds: [embed], components: rows };
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('customize')
    .setDescription('Choose which commands are active in this server (server owner only)')
    .setDMPermission(false),

  async execute(interaction) {
    if (!isOwner(interaction)) {
      return interaction.reply({ content: '⛔ Only the server owner can use this command.', ephemeral: true });
    }
    const msg = await buildMessage(interaction.guildId);
    await interaction.reply(msg);
  },

  // Routed here from src/index.js for any interaction whose customId starts with "customize:"
  async handleComponent(interaction) {
    if (!isOwner(interaction)) {
      return interaction.reply({ content: '⛔ Only the server owner can do this.', ephemeral: true });
    }

    const { syncGuildCommands } = require('../utils/sync');
    const [, action, ...rest] = interaction.customId.split(':');

    if (action === 'category' && interaction.isStringSelectMenu()) {
      const category = interaction.values[0];
      return interaction.update(await buildMessage(interaction.guildId, category));
    }

    if (action === 'add' && interaction.isStringSelectMenu()) {
      const { getSlotLimit } = require('../utils/sync');
      const category = rest[0];
      const settings = await getGuildSettings(interaction.guildId);
      const limit = getSlotLimit(settings);
      const merged = Array.from(new Set([...settings.active_commands, ...interaction.values])).slice(0, limit);
      await setActiveCommands(interaction.guildId, merged);
      await syncGuildCommands(interaction.client, interaction.guildId);
      return interaction.update(await buildMessage(interaction.guildId));
    }

    if (action === 'remove' && interaction.isButton()) {
      const settings = await getGuildSettings(interaction.guildId);
      if (!settings.active_commands.length) {
        return interaction.reply({ content: 'No active commands to remove.', ephemeral: true });
      }
      const options = settings.active_commands.slice(0, 25).map((n) => ({ label: `/${n}`, value: n }));
      const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('customize:removeselect')
          .setPlaceholder('Select command(s) to deactivate')
          .setMinValues(1)
          .setMaxValues(options.length)
          .addOptions(options)
      );
      return interaction.reply({ components: [row], ephemeral: true });
    }

    if (action === 'removeselect' && interaction.isStringSelectMenu()) {
      const settings = await getGuildSettings(interaction.guildId);
      const updated = settings.active_commands.filter((n) => !interaction.values.includes(n));
      await setActiveCommands(interaction.guildId, updated);
      await syncGuildCommands(interaction.client, interaction.guildId);
      return interaction.update({
        content: `✅ Removed: ${interaction.values.map((v) => `\`/${v}\``).join(', ')}. Run /customize again to see the updated list.`,
        components: [],
      });
    }

    if (action === 'clear' && interaction.isButton()) {
      await setActiveCommands(interaction.guildId, []);
      await syncGuildCommands(interaction.client, interaction.guildId);
      return interaction.update(await buildMessage(interaction.guildId));
    }

    if (action === 'refresh' && interaction.isButton()) {
      return interaction.update(await buildMessage(interaction.guildId));
    }

    if (action === 'redeem' && interaction.isButton()) {
      const modal = new ModalBuilder()
        .setCustomId('customize:redeemmodal')
        .setTitle('Redeem Premium Key')
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('license_key')
              .setLabel('License key')
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
          )
        );
      return interaction.showModal(modal);
    }

    if (action === 'redeemmodal' && interaction.isModalSubmit()) {
      const code = interaction.fields.getTextInputValue('license_key').trim();
      const result = await redeemLicenseKey(code, interaction.guildId);
      if (!result.ok) {
        const reasonText = result.reason === 'already_used' ? 'That key has already been redeemed.' : 'That key was not found.';
        return interaction.reply({ content: `❌ ${reasonText}`, ephemeral: true });
      }
      return interaction.reply({
        content: `⭐ Premium activated! +${result.days} days, active until <t:${Math.floor(result.expiry.getTime() / 1000)}:D>. Run /customize again to see your new slot limit.`,
        ephemeral: true,
      });
    }
  },

  buildMessage,
};
