import { Events, MessageFlags, InteractionType, type Interaction } from 'discord.js';
import { ownerId } from '@/constants.js';

import * as Interactions from '@/commands/interactions/interactions.js';



export default {
	name: Events.InteractionCreate,
	async execute(interaction: Interaction) {
		let command: unknown;
		switch (interaction.type) {
			case InteractionType.ApplicationCommand:
			case InteractionType.ApplicationCommandAutocomplete:
				command = Interactions[interaction.commandName as keyof typeof Interactions]?.default.data;
				break;
			case InteractionType.MessageComponent:
				command = Interactions[interaction.customId as keyof typeof Interactions]?.default.data;
				break;
			default:
				console.log(`Unhandled interaction:`);
				console.log(interaction);
				return;
		}
		
		if (!command || !(command instanceof Object) || !('execute' in command) || typeof command.execute !== 'function') {
			console.error(`No command matching ${'commandName' in interaction ? interaction.commandName : 'unknown'} was found.`);
			return;
		}

		if ('devonly' in command && interaction.user.id != ownerId) {
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
					// @ts-expect-error
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
