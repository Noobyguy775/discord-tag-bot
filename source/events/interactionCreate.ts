import { Events, InteractionType, ComponentType, MessageFlags } from 'discord.js';
import type { Interaction, ChatInputCommandInteraction, AutocompleteInteraction, ModalSubmitInteraction } from 'discord.js';

import * as Interactions from '@/commands/interactions/interactions.js';
export default {
	name: Events.InteractionCreate,
	async execute(interaction: Interaction) { try {
		switch (interaction.type) {
			case InteractionType.ApplicationCommand:
				for (const [, cmd] of Object.entries(Interactions.ChatCommandInteractions))
					if (cmd.default.data.name === interaction.commandName) 
						await cmd.default.execute(interaction as ChatInputCommandInteraction);
			break;

			case InteractionType.MessageComponent:
				switch (interaction.componentType) {
					case (ComponentType.Button):
						for (const [, cmd] of Object.entries(Interactions.ButtonInteractions)) 
							if (getButtonCustomId(cmd.default.data) === interaction.customId) 
								await cmd.default.execute(interaction); 
					break;
					default:
						console.log(`Unknown message component type: ${interaction.componentType}`);
				}
			break;

			case InteractionType.ApplicationCommandAutocomplete:
				for (const [, cmd] of Object.entries(Interactions.ChatCommandInteractions)) 
					if (cmd.default.data.name === interaction.commandName && 'autocomplete' in cmd.default && typeof cmd.default.autocomplete === 'function') 
						await cmd.default.autocomplete(interaction as AutocompleteInteraction);
			break;

			case InteractionType.ModalSubmit:
				const internalId = interaction.customId.split("!")[0];
				const additionalParams: Array<string> = [];

				if (interaction.customId.includes("!")) {
					const params = interaction.customId.split("!")
					additionalParams.push(...params.slice(1));
				}

				for (const [, cmd] of Object.entries(Interactions.ModalInteractions))
					if (cmd.default.data.internal_id === internalId)
						await cmd.default.execute(interaction as ModalSubmitInteraction, additionalParams);
			break;
		}} catch (error) {
			console.error(error);

			if (interaction.isRepliable()) {
				if (interaction.deferred || interaction.replied) {
					await interaction.followUp({ content: 'There was an error while executing this interaction!', flags: MessageFlags.Ephemeral });
				} else {
					await interaction.reply({ content: 'There was an error while executing this interaction!', flags: MessageFlags.Ephemeral });
				}
			}
		}
	},
};

function getButtonCustomId(data: unknown): string | undefined {
	if (!data || typeof data !== 'object') return undefined;

	const builder = data as { toJSON: () => { custom_id?: string } };
	return builder.toJSON().custom_id;
}
