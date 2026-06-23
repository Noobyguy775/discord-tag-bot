import { type Client, type Collection, type APIButtonComponent } from 'discord.js'
import { type Message } from 'discord.js';

export interface BotClient extends Client {
    commands: Collection<string, {
        devonly?: boolean,
        execute: Promise<void>,
        autocomplete?: Promise<void>
    }>
}

export interface messageCommand extends Message {
    data: {
        name: string,
        description?: string
    },
    execute: (message: Message) => Promise<void>,
    args: string[],
}