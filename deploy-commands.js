/*
Some contents in this file were sourced from https://github.com/discordjs/guide, which is licensed under the MIT License, which you can find @ https://mit-license.org/
*/
const { REST, Routes } = require('discord.js');
const { clientId, token, debug, debugclientId, debugtoken, guildId } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);

		if (command.data.type == 'message') continue; // skip message commands

		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(debug ? debugtoken : token);

const deleteAll = false; // set to true to delete all commands!!
if (deleteAll == true) {
	rest.put(Routes.applicationCommands(debug ? debugclientId : clientId), { body: [] })
		.then(() => console.log('Successfully deleted all application commands.'))
		.catch(console.error);

	rest.put(Routes.applicationGuildCommands(debug ? debugclientId : clientId, guildId), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);
}

const deployCommands = true;
if (deployCommands) {
	(async () => {
		try {
			console.log(`Started refreshing ${commands.length} application (/) commands.`);

			// The put method is used to fully refresh all commands in the guild with the current set
			const data = await rest.put(
				Routes.applicationCommands(debug ? debugclientId : clientId),
				{ body: commands },
			);

			console.log(`Successfully reloaded ${data.length} application (/) commands.`);
		} catch (error) {
			// And of course, make sure you catch and log any errors!
			console.error(error);
		}
	})();
}
