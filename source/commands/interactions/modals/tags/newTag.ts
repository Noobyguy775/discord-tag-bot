import { ChatInputCommandInteraction, ModalBuilder } from 'discord.js';

import { contentLabel, nameLabel, flagsLabel, regexLabel, pinnedLabel } from './shared.ts';
import type { Scope } from '@/data/schemas.js';

export default {
    async showModal(interaction: ChatInputCommandInteraction) {
        const scope = interaction.options.getString('scope') as Scope;
        
        const modal = new ModalBuilder()
            .setCustomId('newTag')
            .setTitle('Creating a new tag')
            
        modal.addLabelComponents(nameLabel)

        modal.addLabelComponents(contentLabel)

        modal.addLabelComponents(flagsLabel)

        // message command is server-only
        if (scope == 'server')
            modal.addLabelComponents(regexLabel);

        modal.addLabelComponents(pinnedLabel)

        await interaction.showModal(modal);
    },
    async execute(interaction: ChatInputCommandInteraction) {
        
    }
}
