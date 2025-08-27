require('module-alias/register');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, ActivityType } = require('discord.js');
const { token, debug, debugtoken, db_password } = require('@config');
const { MongoClient, ServerApiVersion } = require('mongodb');
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
});


client.commands = new Collection();
client.buttons = new Collection();

const { setTagData } = require('@data/js/tags');
setTagData()

const foldersPath = path.join(__dirname, 'commands'); // ./commands
const commandFolders = fs.readdirSync(foldersPath); // ./commands/*

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder); // ./command/*/
	
	
	function findJSFiles(dir) {
		let jsFiles = [];
		const items = fs.readdirSync(dir);
		
		for (const item of items) {
			const fullPath = path.join(dir, item);
			const stat = fs.statSync(fullPath);
			
			if (stat.isDirectory()) {
				// Recursively search subdirectories
				jsFiles = jsFiles.concat(findJSFiles(fullPath));
			} else if (item.endsWith('.js')) {
				jsFiles.push(fullPath);
			}
		}
		
		return jsFiles;
	}
	const commandFiles = findJSFiles(commandsPath); // list of all .js files recursively
	for (const filePath of commandFiles) {
		const command = require(filePath); // import file contents
		if ('data' in command && command.data.type == 'Button') {
			console.log(command.data)
			client.buttons.set(command.data.customID, command);
			console.log(`Button loaded: ${command.data.customID}`)
		} else {
			if ('data' in command && 'execute' in command) {
				client.commands.set(command.data.name, command); // add as a command
				console.log(`Command loaded: ${command.data.name}`);
			} else {
				console.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`); // otherwise warn
			}
		}
	}
}
console.log('Commands loaded!')

// log events to listen for
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once)
		client.once(event.name, (...args) => event.execute(...args));
	else
		client.on(event.name, (...args) => event.execute(...args));
}

client.login(debug ? debugtoken : token).then(debug ? console.log('Debug mode enabled...') : "");