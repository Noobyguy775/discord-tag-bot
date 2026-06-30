import { type Message } from 'discord.js';

export interface messageCommand extends Message {
    data: {
        name: string,
        description?: string,
        type: 'message',
        triggers: Array<string>
    },
    execute: (message: Message) => unknown,
}

export type messageCommandWithArgs = messageCommand & { args: Array<string> }