import { Events, MessageFlags, InteractionType, type Interaction } from 'discord.js';

import * as Interactions from '@/commands/interactions/interactions.js';

export default {
	name: Events.InteractionCreate,
	async execute(interaction: Interaction) {
		let command: unknown;
		for (const [_, cmd] of Object.entries(Interactions)) {
			switch (interaction.type) {
				case InteractionType.ApplicationCommandAutocomplete:
				case InteractionType.ApplicationCommand:
					if ('name' in cmd.default.data && cmd.default.data.name === interaction.commandName) {
						command = cmd.default;
						break;
					}
				break;
				case InteractionType.ModalSubmit:
				case InteractionType.MessageComponent:
					if ('customId' in cmd.default.data && cmd.default.data.customId === interaction.customId) {
						command = cmd.default;
						break;
					}
				break;
			}
			if (command) break;
		}
		
		if (!command || !(command instanceof Object) || !('execute' in command) || typeof command.execute !== 'function') {
			console.error(`No command matching ${'commandName' in interaction ? interaction.commandName : 'unknown'} was found.`);
			return;
		}

		try {
			switch (interaction.type) {
				case InteractionType.ApplicationCommand:
					console.log(`Executing: ${interaction.commandName}`);
					await command.execute(interaction);
					break;
				
				case InteractionType.ApplicationCommandAutocomplete:
					if ('autocomplete' in command && typeof command.autocomplete === 'function') {
						console.log(`Autocompleting for: ${interaction.commandName}`);
						await command.autocomplete(interaction);
					}
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
