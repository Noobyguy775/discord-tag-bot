import { type Message } from 'discord.js';

export interface messageCommand {
    data: {
        name: string,
        description?: string
    },
    execute: (message: Message) => Promise<void>,
    args: string[],
}

export type messageCommandData = Message & messageCommand