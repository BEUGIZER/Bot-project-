// Auto-loads every command file from each category folder.
// To add command #66, #67, ... #200+: drop a new file into one of the
// category folders below, following the same { data, execute } shape as
// any existing command. No other code needs to change.

const fs = require('fs');
const path = require('path');

const categories = [
  'moderation',
  'servermanagement',
  'utility',
  'fun',
  'economy',
  'games',
  'info',
];

const commands = new Map(); // commandName -> definition
const commandsByCategory = new Map(); // category -> [commandName, ...]

function loadAll() {
  commands.clear();
  commandsByCategory.clear();
  for (const category of categories) {
    const dir = path.join(__dirname, category);
    if (!fs.existsSync(dir)) {
      commandsByCategory.set(category, []);
      continue;
    }
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.js'));
    const names = [];
    for (const file of files) {
      const def = require(path.join(dir, file));
      if (!def?.data?.name) continue;
      def.category = category;
      commands.set(def.data.name, def);
      names.push(def.data.name);
    }
    commandsByCategory.set(category, names);
  }
}

loadAll();

module.exports = { commands, commandsByCategory, categories, loadAll };
