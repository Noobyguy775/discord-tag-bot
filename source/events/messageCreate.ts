import { Events, type Message } from 'discord.js';

import * as messageCommands from '@/commands/messages/index.js';

export default {
    name: Events.MessageCreate,
    async execute(message: Message) {
        if (message.author.bot) return;

        if (!message.guild) return;

        // bot mention
        if (message.content.includes(message.client.user.toString())){
            const args = message.content.slice(1).trim().split(" ") ?? [""]
            return await executeCommand(message, args, 'help');
        }

        if (!message.content.startsWith('!')) return;

        const args = message.content.slice(1).trim().split(" ") ?? [""]

        if (!args[0]) return

        return await executeCommand(message, args, args[0].toLowerCase());
        
        async function executeCommand(message: Message, args: string[], name: string) {
            let chatCommand;
            for (const [, command] of Object.entries(messageCommands)) {
                if (command.default.data.name === name) {
                    chatCommand = command.default;
                    break;
                }
            }

            if (
                !chatCommand 
                || !(chatCommand instanceof Object) 
                || !('execute' in chatCommand) 
                || typeof chatCommand.execute !== 'function'
            )
                return;

            try {
                console.log(`Executing: ` + chatCommand.data.name)
                await chatCommand.execute(Object.assign(message, { args: args }));
            } catch (error) {
                console.error(error)
            }
        }
    }
}
