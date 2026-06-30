import { ChatInputCommandInteraction, ModalBuilder, type ModalSubmitInteraction } from 'discord.js';

import { contentLabel, nameLabel, regexLabel, pinnedLabel } from './shared.ts';

import { addTags } from '@/data/database.js';

import type { Scope } from '@/data/schemas.js';

export default {
    async showModal(interaction: ChatInputCommandInteraction) {
        const scope = interaction.options.getString('scope') as Scope;
        
        const modal = new ModalBuilder()
            .setCustomId('newTag')
            .setTitle('Creating a new tag')
            .addLabelComponents(nameLabel)
            .addLabelComponents(contentLabel)

        // message command is server-only
        if (scope == 'server') {
            modal.addLabelComponents(regexLabel);
        }

        modal.addLabelComponents(pinnedLabel)

        await interaction.showModal(modal);
    },
    async execute(interaction: ModalSubmitInteraction) {
        const scope = interaction.options.getString('scope') as Scope;

        const name = interaction.fields.getTextInputValue('name');
        const content = interaction.fields.getTextInputValue('content');
        const flags = interaction.fields.getTextInputValue('flags');
        const regex = interaction.fields.getTextInputValue('regex');
        const pinned = interaction.fields.getCheckbox('pinned');
    }
}
