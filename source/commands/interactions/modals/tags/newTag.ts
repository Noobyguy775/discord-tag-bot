import { ChatInputCommandInteraction, MessageFlags, ModalBuilder, type ModalSubmitInteraction } from 'discord.js';

import { contentLabel, nameLabel, regexLabel, pinnedLabel, flagsLabel } from './shared.ts';

import { addTags } from '@/data/database.js';

import type { Scope, TagSchema } from '@/data/schemas.js';

export default {
    data: {
        internal_id: 'newtag'
    },
    async showModal(interaction: ChatInputCommandInteraction) {
        const scope = interaction.options.getString('scope') as Scope;

        const snowflake = (scope == 'server') ? interaction.guildId : interaction.user.id;
        
        const modal = new ModalBuilder()
            .setCustomId(`newtag!${scope}!${snowflake}`)
            .setTitle('Creating a new tag')
            .addLabelComponents(nameLabel)
            .addLabelComponents(contentLabel)
            .addLabelComponents(flagsLabel)
        // message command is server-only
        if (scope == 'server') {
            modal.addLabelComponents(regexLabel);
        }

        modal.addLabelComponents(pinnedLabel)

        await interaction.showModal(modal);
        return modal;
    },
    async execute(interaction: ModalSubmitInteraction, additionalParams: Array<string>) {
        const scope = additionalParams.at(0) as Scope;
        const snowflake = additionalParams.at(1) as string;

        const name = interaction.fields.getTextInputValue('tagName');
        const content = interaction.fields.getTextInputValue('tagContent');
        const flags = interaction.fields.getTextInputValue('tagFlags').split(',').map(flag => flag.trim()).filter(flag => flag.length > 0);
        const regex = (scope == 'server') ? interaction.fields.getTextInputValue('tagRegex') ?? "" : "";
        const pinned = interaction.fields.getCheckbox('tagPinned') ?? false;

        await interaction.reply({ content: `Creating your ${scope} tag...`, flags: MessageFlags.Ephemeral });

        const tagData = {
            name,
            content,
            flags,
            pinned,
            uses: 0,
            regex
        }

        await addTags([tagData], snowflake, scope);

        await interaction.editReply({ content: `Successfully created the ${scope} tag \`${name}\`!` });
    }
}
