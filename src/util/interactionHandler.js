const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { discordToken } = require("./../config.json");

module.exports = async (err, files, client) => {
  if (err) return console.error(err);

  client.interactionsArray = [];
  files.forEach((file) => {
    const interaction = require(`./../interactions/${file}`);
    client.interactions.set(interaction.data.name, interaction);
    client.interactionsArray.push(interaction.data.toJSON());
  });

  const rest = new REST({ version: "9" }).setToken(discordToken);

  (async () => {
    try {
      const guildIds = await client.guilds.cache.map((guild) => guild.id);
      const clientId = await client.user.id;
      guildIds.forEach(async (guildId) => {
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
          body: client.interactionsArray,
        });
      });
    } catch (error) {
      console.error(error);
    }
  })();
};