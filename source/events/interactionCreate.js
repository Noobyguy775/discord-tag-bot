const { Events, MessageFlags, InteractionType } = require('discord.js');
const { ownerId } = require('@config')

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		console.log(interaction)
		let command = null;
		switch (interaction.type) {
			case InteractionType.ApplicationCommand:
			case InteractionType.ApplicationCommandAutocomplete:
				command = interaction.client.commands.get(interaction.commandName);
				break;
			case InteractionType.MessageComponent:
				command = interaction.client.buttons.get(interaction.customId);
				break;
			default:
				console.log(`Unhandled interaction:`);
				console.log(interaction);
				return;
		}

		console.log(command)
		
		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		if ('devonly' in command && interaction.user != ownerId) {
			if ('reply' in interaction) {
				interaction.reply({ content: 'This is a dev only command; you do not have permission to use it', flags: MessageFlags.Ephemeral })
			} else if (interaction.isAutocomplete()) {
				interaction.respond([])
			}
			return;
		}
		try {
			switch (interaction.type) {
				case InteractionType.ApplicationCommand:
					console.log(`Executing: ${interaction.commandName}`);
					await command.execute(interaction);
					break;
				
				case InteractionType.ApplicationCommandAutocomplete:
					console.log(`Autocompleting for: ${interaction.commandName}`);
					await command.autocomplete(interaction)
					break;
				case InteractionType.MessageComponent:
					console.log(`Executing message component: ${interaction.customId}`)
					await command.execute(interaction);
					break;
				default:
					console.log(`Unhandled interaction:`);
					console.log(interaction);
					break;
			}
		} catch (error) {
			console.error(error);
				if (!interaction.isChatInputCommand()) {return};
				
				if (interaction.replied || interaction.deferred)
					await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
				else
					await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	},
};
