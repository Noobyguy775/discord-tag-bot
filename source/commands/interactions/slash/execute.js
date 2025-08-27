const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('execute')
		.setDescription('[dev] execute js code')
		.addStringOption(option =>
			option.setName('code')
				.setDescription('Code to execute')
				.setRequired(true)
		),
	devonly: true,
	async execute(interaction) {
		try {
			await eval(interaction.options.getString('code'));
			await interaction.reply({ content: 'Executed.', flags: MessageFlags.Ephemeral });
		} catch (error) {
			console.error(`Eval error:\n${error}`);
			await interaction.reply({ content: `Error: ${error.message}`, flags: MessageFlags.Ephemeral });
		}
	},
};
