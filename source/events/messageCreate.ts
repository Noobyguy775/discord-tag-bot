const commands = { // [name]: [triggers]
    'tag': ['t', 'tag'],
    'mention': ['help']
}
import { Events, type Message } from 'discord.js';

import { type messageCommand } from '../types.ts';



module.exports = {
    name: Events.MessageCreate,
    async execute(message: messageCommand) {
        if (message.author.bot) return

        if (!message.guild) return;

        // bot mention
        if (message.content.includes(message.client.user.toString())){
            message.data.name = 'mention';
            message.args = message.content.trim().split(" ")
            await executeCommand(message);
            return;
        }
        
        if (!message.content.startsWith('!')) return;

        message.args = message.content.slice(1).trim().split(" ") ?? [""]

        if (!message.args[0]) return

        for (const [name, flags] of Object.entries(commands)) {
            if (flags.includes(message.args[0].toLowerCase())) {
                message.data.name = name
            }
        }

        if (!message.data.name)
            return
        


        await executeCommand(message);
        
        async function executeCommand(message: Message) {
            const chatCommand = message.client.commands.get(message.data.name)

            if (!chatCommand) return

            try {
                console.log(`Executing: ` + message.data.name)
                await chatCommand.execute(message)
            } catch (error){
                console.error(error)
            }
        }
    }
}
