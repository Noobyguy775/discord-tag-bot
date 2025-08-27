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

const { SlashCommandBuilder,
    MessageFlags,
    inlineCode,
    heading,
    HeadingLevel,
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorSpacingSize,
    quote,
    chatInputApplicationCommandMention } = require('discord.js');
const { tagdata, FindTag, IncreaseTagUsage, GetTagRanking, TagEmbedBuilder } = require('@data/js/tags');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('tag-slash')
    .setDescription('Retrieve a tag')
    .addStringOption(option =>
		option.setName('query')
			.setDescription('Phrase to search for')
			.setAutocomplete(true)
            .setRequired(true))
    .addUserOption(option => 
        option.setName('mention')
            .setDescription('User to mention'))
    .addBooleanOption(option =>
        option.setName('private')
            .setDescription('Instead of sending the tag to the channel, view the tag privately'))
    .addBooleanOption(option =>
        option.setName('view-info')
            .setDescription('view various information about the tag, including regex, flags, content, and usage statistics')),
    
    async autocomplete(interaction) {
        const input = interaction.options.getFocused();
        const outputlist = [];
        if (input.length) {
            const cleaninput = input.replaceAll(/\s+/g, '-').toLowerCase();
            const namematches = [];
            const flagmatches = [];
            const regexmatches = [];

            for (const [name, tag] of tagdata.entries()) {
                if (name.toLowerCase() === cleaninput) {
                    namematches.push({ name: '✅｜' + name.replaceAll('-', ' '),  value: name })
                } else if (tag.flags.some((text) => text.toLowerCase().includes(cleaninput)) || name.toLowerCase().includes(cleaninput)) {
                    flagmatches.push({ name: '🚩｜' + name.replaceAll('-', ' '),  value: name })
                } else if (new RegExp(tag.regex, 'i').test(cleaninput)) {
                    regexmatches.push({ name: '🔍｜' + name.replaceAll('-', ' '),  value: name })
                }
            }
            outputlist.push(...namematches, ...flagmatches, ...regexmatches);
        } else {
            outputlist.push(
                ...tagdata.filter((tag) => tag.pinned)
                .map((_, key) => ({
                    name: '📌｜' + key.replaceAll('-', ' '),
                    value: key,
                })),
            )
        }
        await interaction.respond(outputlist.slice(0, 25))
    },
    async execute(interaction) {
        const tag = FindTag(interaction.options.getString('query').trim().toLowerCase())
        if (!tag)
            return await interaction.reply({content: 'Tag not found, make sure you used an autocomplete!',  flags: MessageFlags.Ephemeral})

        const fetchedmember = await interaction.guild.members.fetch(interaction.user.id)
        if (interaction.options.getBoolean('view-info') == true) {
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
        } else {
            tag.member = fetchedmember
            // tag
            const tagEmbed = TagEmbedBuilder(tag)
    
            const payload = {
                content: (interaction.options.getMember('mention') ? interaction.options.getMember('mention').toString() : null),
                embeds: [tagEmbed],
                flags: (interaction.options.getBoolean('private') ? MessageFlags.Ephemeral : null),
            };

            await interaction.reply(payload);

            IncreaseTagUsage(tag.key);
        }
    }
};
