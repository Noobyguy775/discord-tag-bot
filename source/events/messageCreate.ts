const commands = { // [name]: [triggers]
    'tag': ['t', 'tag'],
    'mention': ['help']
}
import { Events, type Message } from 'discord.js';

import { type messageCommandData } from '../types.ts';

import * as messageCommands from '@/commands/messages/messages.js';



export default {
    name: Events.MessageCreate,
    async execute(message: Message) {
        const commandMessage = Object.assign(message, {
            data: { name: '' },
            args: [] as string[]
        }) as messageCommandData;

        if (message.author.bot) return

        if (!message.guild) return;

        // bot mention
        if (message.content.includes(message.client.user.toString())){
            commandMessage.data.name = 'mention';
            commandMessage.args = message.content.trim().split(" ")
            await executeCommand(commandMessage);
            return;
        }
        
        if (!message.content.startsWith('!')) return;

        commandMessage.args = message.content.slice(1).trim().split(" ") ?? [""]

        if (!commandMessage.args[0]) return

        for (const [name, flags] of Object.entries(commands)) {
            if (flags.includes(commandMessage.args[0].toLowerCase())) {
                commandMessage.data.name = name
            }
        }

        if (!commandMessage.data.name)
            return
        


        await executeCommand(commandMessage);
        
        async function executeCommand(message: messageCommandData) {
            const chatCommand = messageCommands[message.data.name as keyof typeof messageCommands]?.default.data;

            if (!chatCommand || !(chatCommand instanceof Object) || !('execute' in chatCommand) || typeof chatCommand.execute !== 'function') {
                return;
		    }

            try {
                console.log(`Executing: ` + message.data.name)
                await chatCommand.execute(message)
            } catch (error){
                console.error(error)
            }
        }
    }
}
