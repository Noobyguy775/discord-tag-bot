import helpBuilder from '@/builders/helpBuilder.js';
import { type Message, MessageFlags } from 'discord.js';

export default {
  data: {
    name: 'help-chat',
    type: 'message',
    description: 'Displays a list of commands and bot details.'
  },
  execute(message: Message){
    message.reply({ components: [helpBuilder()], flags: MessageFlags.IsComponentsV2 & MessageFlags.Ephemeral });
  }
}
