import { type Client, type Collection, type APIButtonComponent } from 'discord.js'

export interface BotClient extends Client {
    buttons: Collection<string, { 
        data: APIButtonComponent & { 
            description: string,
        },
        execute: Promise<void>, 
        devonly?: boolean
    }>,
    commands: Collection<string, {
        devonly?: boolean,
        execute: Promise<void>,
        autocomplete?: Promise<void>
    }>
}