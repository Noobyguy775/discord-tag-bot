const { helpBuilder } = require('@builders/helpBuilder');
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
      .setName('help-slash')
      .setDescription('Displays a list of commands and bot details.'),
    execute(interaction){
      interaction.reply(helpBuilder(interaction.client))
    }
}
