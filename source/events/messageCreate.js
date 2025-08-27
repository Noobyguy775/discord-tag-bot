const commands = { // [name]: [triggers]
    'tag-chat': ['t', 'tag'],
    'mention': ['help']
}
const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return

        if (!message.guild) return;

        if (message.content.includes(message.client.user.toString())){
            message.name = 'mention';
            message.args = message.content.trim().split(" ")
            await executeCommand(message);
            return;
        }
        
        if (!message.content.startsWith('!')) return;

        message.args = message.content.slice(1).trim().split(" ")

        for (const [name, flags] of Object.entries(commands)) {
            if (flags.includes(message.args[0].toLowerCase())) {
                message.name = name
            }
        }

        if (!message.name) return;

        await executeCommand(message);
        
        async function executeCommand(message) {
            const chatCommand = message.client.commands.get(message.name)

            try {
                console.log(`Executing: ` + message.name)
                await chatCommand.execute(message)
            } catch (error){
                console.error(error)
            }
        }
    }
}
