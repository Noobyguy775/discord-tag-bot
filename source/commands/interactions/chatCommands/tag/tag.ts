/* 
Some contents of this file were converted from https://github.com/discordjs/discord-utils-bot, which is liscened under the Apache License 2.0, which you can find @ https://www.apache.org/licenses/LICENSE-2.0.txt.

Contents used:
* Autocomplete system (https://github.com/discordjs/discord-utils-bot/blob/main/src/functions/autocomplete/tagAutoComplete.ts)
* Tag system (https://github.com/discordjs/discord-utils-bot/blob/main/src/functions/tag.ts)

Changes:

# Autocomplete
* Converted to d.js;
* Changed emojis;

# Tag system
* Converted to d.js;
* Changed to .json;
* Adjusted FindTag function to include the key and return the whole obj;
* 
*/

import { SlashCommandBuilder, InteractionContextType } from 'discord.js';
import type { AutocompleteInteraction, ChatInputCommandInteraction } from 'discord.js';

import { findAllTags } from '@/data/database.js'

import { TagEmbedBuilder } from '@/commands/shared/tags/index.js'
import type { TagSchema } from '@/data/schemas.js';
import type { HydratedDocument } from 'mongoose';

export default {
    data: new SlashCommandBuilder()
    .setName('tag')
    .setDescription('Retrieve a tag')
    .addStringOption(option =>
		option.setName('query')
			.setDescription('Phrase to search for')
			.setAutocomplete(true)
            .setRequired(true)
    )
    .addUserOption(option => 
        option.setName('mention')
            .setDescription('User to mention')
    )
    .addBooleanOption(option =>
        option.setName('private')
            .setDescription('Instead of sending the tag to the channel, view the tag privately')
    )
    .setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel]),
    
    async autocomplete(interaction: AutocompleteInteraction<"cached">) {
        const input = interaction.options.getFocused().trim();
        const outputlist: Array<{ name: string; value: string }> = [];

        function appendChoice(value: typeof TagSchema, emoji: string) {
            if (!value) return;

            const entries: typeof TagSchema[] = Array.isArray(value) ? value : [value];
            for (const entry of entries) {
                entry.
                const tagName = entry.name;
                if (typeof tagName !== 'string' || tagName.length === 0) continue;

                outputlist.push({ name: `${emoji}|${tagName}`, value: entry.toObject()._id });
            }
        }

        if (input.length) {
            const cleaninput = input.replaceAll(/\s+/g, '-').toLowerCase();
            const tagdata = await findAllTags(interaction)

            // prioritize user tags first
            if (tagdata.user) {
                appendChoice(tagdata.user.FindByName(cleaninput), '✅')
                appendChoice(tagdata.user.FindByFlag(cleaninput), '🚩')
                appendChoice(tagdata.user.FindByRegex(cleaninput), '🔍')
            }

            // then server tags
            if (tagdata.server) {
                appendChoice(tagdata.server.FindByName(cleaninput), '✅')
                appendChoice(tagdata.server.FindByFlag(cleaninput), '🚩')
                appendChoice(tagdata.server.FindByRegex(cleaninput), '🔍')
            }
        } else {
            const tagdata = await findAllTags(interaction)
            if (tagdata.user)
                appendChoice(tagdata.user.GetPinned(), '📌')
            if (tagdata.server)
                appendChoice(tagdata.server.GetPinned(), '📌')
        }
        await interaction.respond(outputlist.slice(0, 25))
    },
    async execute(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        const query = interaction.options.getString('query', true).trim().toLowerCase();
        const tag = await findTagContent(interaction, query)
        if (!tag){
            await interaction.reply({ content: 'Tag not found, make sure you used an autocomplete!', ephemeral: true });
            return;
        }

        const fetchedmember = interaction.inGuild()
            ? await interaction.guild.members.fetch(interaction.user.id)
            : null;

        // tag
        const tagEmbed = TagEmbedBuilder(tag, fetchedmember?.displayColor, interaction.user.id)
    
        const mention = interaction.options.getMember('mention')?.toString();
        const payload = {
            embeds: [tagEmbed],
            ...(mention ? { content: mention } : {}),
            ...(interaction.options.getBoolean('private') ? { ephemeral: true } : {}),
        };

        await interaction.reply(payload);

        await tag.IncreaseUsage();
    }
};

/*if (interaction.options.getBoolean('view-info') == true) {
            // tag info
            const taginfo = new ContainerBuilder();
            taginfo.setAccentColor(fetchedmember.displayColor || 0x5C146C);
            tag.ranking = GetTagRanking(tag.key);

            overview = new TextDisplayBuilder().setContent(
                [
                    heading(tag.key.replaceAll('-', ' ')),
                    heading(`🚩 Flags (${chatInputApplicationCommandMention('tag', '1361918316423413832')})`, HeadingLevel.Three),
                    quote(inlineCode(tag.flags.join(', '))),
                    heading(`🔎 Regex (${inlineCode('!tag')})`, HeadingLevel.Three),
                    quote(inlineCode(tag.regex.replaceAll('-', ' ')))
                ].join('\n')
            );
            taginfo.addTextDisplayComponents(overview);

            taginfo.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Large))

            const tagcontent = new TextDisplayBuilder().setContent(
                [
                    heading('Content', HeadingLevel.Two),
                    tag.content.replaceAll('\\n', '\n')
                ].join('\n')
            )

            taginfo.addTextDisplayComponents(tagcontent);

            taginfo.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Small))

            const tagusage = new TextDisplayBuilder().setContent(
                [
                    heading('Additional Info', HeadingLevel.Two),
                    `This tag is ${!tag.pinned ? 'not ' : ''}pinned (it appears in the autocomplete list automatically)`,
                    heading('Usage', HeadingLevel.Three),
                    `This tag has been used ${tag.uses ?? 'unknown'} times, which makes it the #${tag.ranking ?? '?'} most used tag.`,
                ].join('\n')
            )

            taginfo.addTextDisplayComponents(tagusage);

            await interaction.reply({ components: [taginfo], flags: MessageFlags.Ephemeral+MessageFlags.IsComponentsV2 });
        }*/
