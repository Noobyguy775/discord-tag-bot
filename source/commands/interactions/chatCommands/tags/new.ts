import '@/data/functions.js'
import { ChatInputCommandInteraction } from 'discord.js';
import newTags from '@/commands/interactions/modals/tags/newTag.js';

export default async function newTag(tagData: ChatInputCommandInteraction) {
    await newTags.showModal(tagData);
}