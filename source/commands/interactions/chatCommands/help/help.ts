import helpBuilder from '@/builders/helpBuilder.js';
import { SlashCommandBuilder, type ChatInputCommandInteraction, MessageFlags } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
      .setName('help')
      .setDescription('Displays a list of commands and bot details.'),
    execute(interaction: ChatInputCommandInteraction) {
      interaction.reply({ components: [helpBuilder()], flags: MessageFlags.IsComponentsV2 });
    }
}
