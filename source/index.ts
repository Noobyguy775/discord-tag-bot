import fs from 'node:fs';
import path from 'node:path';

import('dotenv').then(dotenv => dotenv.config());
const { token, debug, debugtoken } = process.env;

import { Client, Collection, GatewayIntentBits, ActivityType } from 'discord.js';

import { type BotClient } from './types.ts'

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	],
	presence: {
		activities: [{
			type: ActivityType.Custom,
			name: "custom",
			state: `@me for help`
		}]
	}
}) 	as BotClient;

client.commands = new Collection()

// log events to listen for
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = import(filePath);
	if (event.once)
		client.once(event.name, (...args) => event.execute(...args));
	else
		client.on(event.name, (...args) => event.execute(...args));
}

client.login(token).then(() => {
	console.log('Bot logged in successfully');
});