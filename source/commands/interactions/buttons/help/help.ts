import { EmbedBuilder, MessageFlags, ButtonInteraction, ButtonStyle } from 'discord.js';
import { ButtonBuilder } from '@discordjs/builders';

export default {
    data: new ButtonBuilder()
        .setCustomId('commands')
        .setLabel('Commands')
        .setStyle(ButtonStyle.Primary)
        .setEmoji({ name: 'scroll'}),
    async execute(button: ButtonInteraction) {
        const embed = new EmbedBuilder()
            .setTitle('Commands')
            .setColor(0x9955fc)
        
        const fields = []
        const processedCommands = new Set(); // Track which commands we've already processed
        
        for (const [name, command] of commands) {
            // Skip if we've already processed this command name
            if (processedCommands.has(name.replace(/-(chat|slash)$/, ''))) {
                continue;
            }
            
            // Get the base command name (without -chat or -slash suffix)
            const baseName = name.replace(/-(chat|slash)$/, '');
            
            // Check if both slash and message versions exist
            const slashVersion = Array.from(commands.entries()).find(([cmdName, cmd]) => 
                (cmdName === baseName || cmdName === `${baseName}-slash`) && cmd.data?.type !== 'message'
            );
            const messageVersion = Array.from(commands.entries()).find(([cmdName, cmd]) => 
                (cmdName === baseName || cmdName === `${baseName}-chat`) && cmd.data?.type === 'message'
            );
            
            // Determine the display name based on availability
            let displayName;
            if (slashVersion && messageVersion) {
                displayName = `!${baseName} | /${baseName}`; // Both available
            } else if (messageVersion) {
                displayName = `!${baseName}`; // Only chat command
            } else {
                displayName = `/${baseName}`; // Only slash command
            }
            
            // Get description from the command data
            let description = 'No description available';
            if (command.data) {
                description = command.data.description;
            }
            
            // Only include non-dev commands
            if (baseName && description && !command.devonly) {
                fields.push({ 
                    name: displayName, 
                    value: description,
                    inline: false
                });
                processedCommands.add(baseName);
            }
        }
        
        embed.addFields(fields);

        button.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    }
}
