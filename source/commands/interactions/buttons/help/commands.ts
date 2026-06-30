// @ts-nocheck
import { EmbedBuilder, MessageFlags, ButtonInteraction, ButtonStyle } from 'discord.js';
import { ButtonBuilder } from '@discordjs/builders';

import * as ChatInputCommandInteractions from '@/commands/interactions/chatCommands/index.js';
import * as MessageCommandInteractions from '@/commands/messages/index.js';

export default {
    data: new ButtonBuilder()
        .setCustomId('ListCommands')
        .setLabel('Commands')
        .setStyle(ButtonStyle.Primary)
        .setEmoji({ name: '📜' }),
    async execute(button: ButtonInteraction) {
        const embed = new EmbedBuilder()
            .setTitle('Commands')
            .setColor(0x9955fc)
        
        const fields = []
        const processedCommands = new Set(); // Track which commands we've already processed

        const commands = {
            ...ChatInputCommandInteractions,
            ...MessageCommandInteractions
        }
        
        for (const [name, command] of Object.entries(commands)) {
            let commandName = '';
            if ('type' in command.default.data && command.default.data.type == 'message') {
                commandName = '!' + command.default.data.name;
            } else {
                commandName = '/' + command.default.data.name;
            }
            
            // Get description from the command data
            let description = 'No description available';
            if (command.default.data.description) {
                description = command.default.data.description;
            }
            
            // Only include non-dev commands
            fields.push({ 
                name: commandName, 
                value: description,
                inline: false
            });
        }
        
        embed.addFields(fields);

        button.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    }
}
