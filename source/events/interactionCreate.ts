import { Events, MessageFlags, InteractionType, type Interaction } from 'discord.js';

import * as Interactions from '@/commands/interactions/interactions.js';
export default {
	name: Events.InteractionCreate,
	async execute(interaction: Interaction) {
		try {
			for (const [, cmd] of Object.entries(Interactions)) {
				const cmdData: any = cmd.default.data;

				switch (interaction.type) {
					case InteractionType.ApplicationCommandAutocomplete:
						if (
							'autocomplete' in cmd.default && typeof cmd.default.autocomplete === 'function' &&
							'name' in cmdData &&
							interaction.commandName === cmdData.name
						) {
							console.log(`Autocomplete: ${interaction.commandName}`);
							await cmd.default.autocomplete(interaction as any);
						}
						break;
					case InteractionType.ApplicationCommand:
						if (
							'execute' in cmd.default && typeof cmd.default.execute === 'function' &&
							'name' in cmdData && 
							interaction.commandName === cmdData.name
						) {
							console.log(`Executing: ${interaction.commandName}`);
							await cmd.default.execute(interaction as any);
						}
						break;
					case InteractionType.MessageComponent:
						if (
							'execute' in cmd.default && typeof cmd.default.execute === 'function' &&
							cmdData?.data?.custom_id &&
							interaction.customId === cmdData.data.custom_id
						) {
							console.log(`Executing message component: ${interaction.customId}`)
							await cmd.default.execute(interaction as any);
						}
						break;
					case InteractionType.ModalSubmit:
						if (
							'execute' in cmd.default && typeof cmd.default.execute === 'function' &&
							'custom_id' in cmdData &&
							interaction.customId === cmdData.custom_id
						) {
							console.log(`Executing modal submit: ${interaction.customId}`)
							await cmd.default.execute(interaction as any);
						}
						break;
					default:
						console.log(`Unknown interaction`);
						console.log(interaction);
						break;
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
