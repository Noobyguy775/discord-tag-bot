import('dotenv').then(dotenv => dotenv.config());
const { token } = process.env;

import { Client, GatewayIntentBits, ActivityType, Events } from 'discord.js';

const client = new Client({
	intents: [
		GatewayIntentBits.MessageContent
	],
	presence: {
		activities: [{
			type: ActivityType.Custom,
			name: "custom",
			state: `@me for help`
		}]
	}
});

import interactionCreate from '@/events/interactionCreate.js';
client.on(Events.InteractionCreate, interactionCreate.execute);

import messageCreate from '@/events/messageCreate.js';
client.on(Events.MessageCreate, messageCreate.execute);

import ready from '@/events/ready.js';
client.once(Events.ClientReady, ready.execute);


client.login(token).then(() => {
	console.log('Bot logged in successfully');
});