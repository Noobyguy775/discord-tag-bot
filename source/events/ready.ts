import type { Client } from "discord.js";

import { Events } from 'discord.js';

export default {
	name: Events.ClientReady,
	execute(client: Client<true>) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
