import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';

import { type Scope } from '@/data/schemas.js';
type tagCommands = 'add' | 'delete' | 'edit' | 'export'

export default {
    data: new SlashCommandBuilder()
        .setName('tags')
        .setDescription('Manage server or user tags')
        .addSubcommand(addTags =>
            addTags
                .setName('add')
                .setDescription('Add a new tag')
                .addStringOption(ScopeChoice)
        )
        .addSubcommand(deleteTags =>
            deleteTags
                .setName('delete')
                .setDescription('Remove an existing tag')
                .addStringOption(ScopeChoice)
        )
        .addSubcommand(editTags =>
            editTags
                .setName('edit')
                .setDescription('Edit an existing tag')
                .addStringOption(ScopeChoice)
        )
        .addSubcommand(exportTags =>
            exportTags
                .setName('export')
                .setDescription('Export all tags to a file')
                .addStringOption(ScopeChoice)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const scope = interaction.options.getString('scope') as Scope;

        if (scope == "server") {
            if (!interaction.inGuild()) 
                return await interaction.reply({ content: 'You selected the `server` scope, but you are using this command outside of a server.\nPlease use this command within a server where you have the correct permissions to manage tags.', ephemeral: true });
            
            if (interaction.guild === null || interaction.guild.available === false)
                return await interaction.reply({ content: 'An error occurred while fetching the server information.', ephemeral: true });

            if (!interaction.memberPermissions.has('ManageGuild'))
                return await interaction.reply({ content: 'You must have the discord permission `ManageGuild` to use this command.', ephemeral: true });
        }

        const subcommand = interaction.options.getSubcommand() as tagCommands;
        switch (subcommand) {
            case 'add':
                import('./new.js').then(module => module.default(interaction))
        }
        return "";
    }

}

function ScopeChoice(option: SlashCommandStringOption) {
    return (
        option.setName('scope')
            .setDescription('The scope of the tag')
            .setChoices(
                { name: 'User', value: 'user' },
                { name: 'Server', value: 'server' }
            )
            .setRequired(true)
    )
                
}