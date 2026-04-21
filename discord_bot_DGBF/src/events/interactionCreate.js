
module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction, client);
  } catch (err) {
    console.error(err);
    interaction.reply({ content: "Erreur", ephemeral: true });
  }
};
