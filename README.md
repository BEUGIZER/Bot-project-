# Customizable Discord Bot

A Discord bot with **65 built-in commands** across 7 categories — but only **one**
slash command is ever visible by default: **`/customize`**.

The server **owner** uses `/customize` to activate **1–5 commands at a time** (free
plan). To run more commands simultaneously, they redeem a **premium license key**
(sold by you, outside Discord — see "Premium keys" below), which raises that
server's limit (default 25, configurable) for the length of the key (1 month,
3 months, 6 months, a year, etc).

## How it actually works

Discord lets a bot register a *different* set of slash commands per server. So:

- Globally, the bot only ever has `/customize` registered.
- When an owner picks commands in `/customize`, the bot calls Discord's API to
  set **that server's** command list to `/customize` + whatever they picked.
- Real `/ban`, `/poll`, `/balance`, etc. then appear as normal slash commands
  in that server only, with normal Discord permission checks (e.g. `/ban`
  still requires the *Ban Members* permission for whoever runs it).

## Project structure

```
src/
  index.js              bot entrypoint (login, event wiring, self-registers /customize)
  config.js             env var loader
  commands/
    registry.js         auto-loads every command file in the folders below
    customize.js        the only global command — owner UI, premium redeem
    moderation/          10 commands (ban, kick, warn, purge, ...)
    servermanagement/     6 commands (lock, addrole, createrole, ...)
    utility/             15 commands (userinfo, poll, remindme, ...)
    fun/                 15 commands (coinflip, rps, eightball, ...)
    economy/              8 commands (balance, daily, pay, leaderboard, ...)
    games/                6 commands (trivia, tictactoe, slotmachine, ...)
    info/                 5 commands (botinfo, uptime, invite, ...)
  db/
    schema.sql           Postgres tables
    pool.js              pg connection pool
    queries/             small query helpers per feature area
  utils/sync.js          pushes the right per-guild command list to Discord
scripts/
  migrate.js             applies schema.sql (runs automatically before start)
  generate-key.js         CLI you run yourself to mint premium license keys
```

### Adding command #66 and beyond (towards 200+)

Drop a new file into any folder under `src/commands/`, shaped like:

```js
const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('yourcommand').setDescription('...'),
  async execute(interaction) {
    await interaction.reply('Hello!');
  },
};
```

`registry.js` picks it up automatically — nothing else to wire up. If it needs
buttons/select menus, also export `handleComponent(interaction)` (see
`poll.js` or `tictactoe.js` for examples).

## Premium license keys

No payment processor is wired in (manual keys for now, as requested). The flow:

1. You sell access however you like (PayPal, bank transfer, etc.) outside Discord.
2. You run `node scripts/generate-key.js <duration> "optional note"` yourself
   — duration is `month`, `3months`, `6months`, `year`, or a raw number of days.
3. You hand the customer the printed code.
4. They open `/customize` in their server → **Redeem Premium Key** → paste the code.

Swap this out later for Stripe/Discord App Subscriptions if you want a live
checkout — `db/queries/license.js` is the only place that logic lives.

## Local setup

```bash
git clone <your-repo-url>
cd discord-bot
cp .env.example .env   # fill in DISCORD_TOKEN, CLIENT_ID, DATABASE_URL
npm install
npm run migrate         # creates tables
npm start                # also auto-registers /customize globally
```

Get `DISCORD_TOKEN` and `CLIENT_ID` from the [Discord Developer
Portal](https://discord.com/developers/applications). Under **Bot**, enable
the **Server Members Intent** (used by member-targeted commands). Invite the
bot with the `bot` + `applications.commands` scopes.

## Deploying on GitHub + Railway

**1. Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

**2. Create the Railway project**

- [railway.app](https://railway.app) → New Project → **Deploy from GitHub repo** → pick this repo.
- Add a **PostgreSQL** plugin to the project (Railway auto-injects `DATABASE_URL`
  into your bot service — no need to set it yourself).
- On the bot service, set these variables (Settings → Variables):
  - `DISCORD_TOKEN`
  - `CLIENT_ID`
  - `FREE_SLOT_LIMIT` (optional, default `5`)
  - `PREMIUM_SLOT_LIMIT` (optional, default `25`)
- Deploy. That's it — `npm start` runs `scripts/migrate.js` first (via the
  `prestart` hook) to create tables, then starts the bot, which registers
  `/customize` globally on its own. No manual `npm run deploy` step needed.

**3. Generate premium keys against the live Railway database**

Install the [Railway CLI](https://docs.railway.app/guides/cli), then from the
project folder:

```bash
railway link
railway run node scripts/generate-key.js month "customer note"
```

This runs the script with Railway's `DATABASE_URL` injected, so the key lands
in your production database.

## Optional: real GIFs on reaction commands

`hug` and `slap` use **Klipy** to show a real GIF. This is **fully optional**
— without `KLIPY_API_KEY` set, they fall back to a plain text reply, so the
bot works with zero setup either way.

> **Why Klipy and not Tenor?** Google stopped accepting new Tenor API clients
> on January 13, 2026 and fully shut the Tenor API down on June 30, 2026.
> Klipy is the community-recommended drop-in replacement — Discord itself,
> WhatsApp, and others have migrated their GIF pickers to it.

To enable it: get a free key at [klipy.com/developers](https://klipy.com/developers)
(a Test key works immediately at 100 req/min for development; request
Production access from the same Partner Panel once you're ready to go live
for unlimited calls) and set `KLIPY_API_KEY` in your `.env` (or Railway
variables). No extra npm package is needed — it uses Node's built-in `fetch`
(Node 18+). The helper lives in `src/utils/gifs.js`; reuse
`getRandomGif('search term', customerId)` in any other command the same way.
Klipy's exact response field names for media URLs aren't fully published, so
`gifs.js` walks the response defensively to find a usable GIF URL rather than
hardcoding field names that might not match — if Klipy ever returns nothing
where you'd expect a GIF, that's the first place to check.

## Notes / things to harden before going fully live

- `/customize` is restricted to the literal server **owner** (`guild.ownerId`).
  Loosen this in `isOwner()` in `src/commands/customize.js` if you'd rather
  allow Administrators too.
- `remindme` only survives a bot restart for reminders due within 24h
  (`getPendingReminders` in `db/queries/reminders.js`) — fine for short
  reminders, extend the window if you need longer ones to survive restarts.
- `purge`/`ban`/`kick`/etc. set sensible `setDefaultMemberPermissions()` so
  Discord itself hides them from members without the right permission — but
  always double-check role hierarchy in your own server before activating
  destructive commands.
