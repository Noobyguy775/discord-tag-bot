import { Events, MessageFlags, InteractionType, type Interaction } from 'discord.js';

import * as Interactions from '@/commands/interactions/interactions.js';

export default {
	name: Events.InteractionCreate,
	async execute(interaction: Interaction) {
		try {
			for (const [, cmd] of Object.entries(Interactions)) {
				switch (interaction.type) {
					case InteractionType.ApplicationCommandAutocomplete:
						if (
							'autocomplete' in cmd.default && typeof cmd.default.autocomplete === 'function' &&
							'customId' in cmd.default.data && interaction.commandName === cmd.default.data.customId
						) {
							console.log(`Executing: ${interaction.commandName}`);
							await cmd.default.autocomplete(interaction as any);
						}
						return;
					case InteractionType.ApplicationCommand:
						if ('execute' in cmd.default && typeof cmd.default.execute === 'function') {
							console.log(`Executing: ${interaction.commandName}`);
							await cmd.default.execute(interaction as any);
						}
						return;
					case InteractionType.MessageComponent:
						if ('execute' in cmd.default.data && typeof cmd.default.execute === 'function') {
							console.log(`Executing message component: ${interaction.customId}`)
							await cmd.default.execute(interaction as any);
						}
						return;
					case InteractionType.ModalSubmit:
						if ('execute' in cmd.default.data && typeof cmd.default.execute === 'function') {
							console.log(`Executing modal submit: ${interaction.customId}`)
							await cmd.default.execute(interaction as any);
						}
						return;
					default:
						console.log(`Unknown interaction`);
						console.log(interaction);
						return;
				}
			}
		} catch (error) {
			console.error(error);
				if (!interaction.isChatInputCommand()) return;
				
				if (interaction.replied || interaction.deferred)
					await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
				else
					await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	},
};
