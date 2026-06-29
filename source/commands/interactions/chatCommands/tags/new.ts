import '@/data/functions.js'
import { ChatInputCommandInteraction } from 'discord.js';
import showModal from '@/commands/interactions/modals/tags/newTag.js';

export default async function newTag(tagData: ChatInputCommandInteraction) {
    await showModal(tagData);
}