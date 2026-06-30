import { CheckboxBuilder, LabelBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

const nameInput = new TextInputBuilder()
    .setCustomId('tagName')
    .setMaxLength(25)
    .setMinLength(1)
    .setRequired(true)
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('!tag (name)')

export const nameLabel = new LabelBuilder()
    .setLabel('Name')
    .setDescription('The name of the tag. Will be used to view the tag.')
    .setTextInputComponent(nameInput)


const contentInput = new TextInputBuilder()
    .setCustomId('tagContent')
    .setMaxLength(3000)
    .setRequired(true)
    .setStyle(TextInputStyle.Paragraph)

export const contentLabel = new LabelBuilder()
    .setLabel('Content')
    .setDescription('The content of the tag. Will be sent when the tag is used.')
    .setTextInputComponent(contentInput)

const flagsInput = new TextInputBuilder()
    .setCustomId('tagFlags')
    .setMaxLength(1000)
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder('faq, help, info')

export const flagsLabel = new LabelBuilder()
    .setLabel('Flags')
    .setDescription('Categories for the tag that help users find it. Separate each flag with a comma.')
    .setTextInputComponent(flagsInput)

const regexInput = new TextInputBuilder()
    .setCustomId('tagRegex')
    .setMaxLength(1000)
    .setStyle(TextInputStyle.Paragraph)

export const regexLabel = new LabelBuilder()
    .setLabel('Regular expression')
    .setDescription('A regex pattern that will trigger the tag when sent with a chat message.')
    .setTextInputComponent(regexInput)

const pinnedInput = new CheckboxBuilder()
    .setCustomId('tagPinned')
    .setDefault(false)

export const pinnedLabel = new LabelBuilder()
    .setLabel('Pinned')
    .setDescription('Whether the tag should be pinned to the top of the list of tags.')
    .setCheckboxComponent(pinnedInput)
