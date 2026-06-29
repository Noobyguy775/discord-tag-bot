import { ButtonStyle, SeparatorSpacingSize, ContainerBuilder, TextDisplayBuilder, ButtonBuilder } from 'discord.js'

import HelpButton from '@/commands/interactions/buttons/help/help.js'

export default function helpBuilder() {
    const Container = new ContainerBuilder().setAccentColor(0x9955fc)
    const IntroText = new TextDisplayBuilder().setContent(
        [
            '## unnamed tag bot',
            '**a simple and *fast* tag bot**',
            'developed by <@700425671146471435>'
        ].join('\n')
    )
    Container.addTextDisplayComponents(IntroText)

    const SourceCode = new ButtonBuilder()
        .setLabel('Source Code')
        .setStyle(ButtonStyle.Link)
        .setURL('https://github.com/Noobyguy775/discord-tag-bot')
    Container.addActionRowComponents(row => row.addComponents(SourceCode))

    Container.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Large));

    const CommandsText = new TextDisplayBuilder().setContent(
        [
            '### Commands',
            'To view a list of commands, press the button below.'
        ].join('\n')
    )
    Container.addTextDisplayComponents(CommandsText)


    const CommandsButton = ButtonBuilder.from(HelpButton.data)

    Container.addActionRowComponents(row => row.addComponents(CommandsButton))

    return Container.toJSON()
};