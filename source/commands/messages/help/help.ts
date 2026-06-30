import helpBuilder from '@/builders/helpBuilder.js';
import { type Message, MessageFlags } from 'discord.js';

export default {
  data: {
    name: 'help',
    type: 'message',
    triggers: ['help'],
    description: 'Displays a list of commands and bot details.'
  },
  async execute(message: Message){
    await message.reply({ components: [helpBuilder()], flags: MessageFlags.IsComponentsV2 });
  }
}
