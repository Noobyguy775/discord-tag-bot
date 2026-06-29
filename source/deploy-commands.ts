/*
Some contents in this file were sourced from https://github.com/discordjs/guide, which is licensed under the MIT License, which you can find @ https://mit-license.org/
*/
import { REST, Routes, type RESTPutAPIApplicationCommandsResult } from 'discord.js';
await import('dotenv').then(dotenv => dotenv.config());
const { clientId, token } = process.env;

if (!clientId || !token) {
	console.error('Missing clientId or token in environment variables.');
	process.exit(1);
}

import * as ChatCommandInteractions from '@/commands/interactions/chatCommands/index.js';

const commands = [];

for (const [name, command] of Object.entries(ChatCommandInteractions)) {
	if ('data' in command.default && 'execute' in command.default)
		commands.push(command.default.data.toJSON());
	else 
		console.info(`The command at ${name} is missing a required "data" or "execute" property.`);
	
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		) as RESTPutAPIApplicationCommandsResult;

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();
