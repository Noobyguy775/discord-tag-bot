const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { ownerId } = process.env;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('execute')
		.setDescription('[dev] execute js code')
		.addStringOption(option =>
			option.setName('code')
				.setDescription('Code to execute')
				.setRequired(true)
		),
	async execute(interaction) {
		if (interaction.member.id !== ownerId) {
			console.log(`${interaction.member.id} (${interaction.member.user.username}) attempted to execute code`);
			await interaction.reply({content: 'You are not allowed to run this command.', flags: MessageFlags.Ephemeral});
			return
		};

	try {
		await eval(interaction.options.getString('code'));
		await interaction.reply({ content: 'Executed.', flags: MessageFlags.Ephemeral });
	} catch (error) {
		console.error(`Eval error:\n${error}`);
		await interaction.reply({ content: `Error: ${error.message}`, flags: MessageFlags.Ephemeral });
	}
	},
};
