import { SlashCommandBuilder, MessageFlags, type ChatInputCommandInteraction } from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('execute')
		.setDescription('[dev] execute js code')
		.addStringOption(option =>
			option.setName('code')
				.setDescription('Code to execute')
				.setRequired(true)
		),
	devonly: true,
	async execute(interaction: ChatInputCommandInteraction) {
		try {
			await eval(interaction.options.getString('code') || '');
			await interaction.reply({ content: 'Executed.', flags: MessageFlags.Ephemeral });
		} catch (error: any) {
			console.error(`Eval error:\n${error}`);
			await interaction.reply({ content: `Error: ${error.message}`, flags: MessageFlags.Ephemeral });
		}
	},
};
