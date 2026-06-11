const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token, debug, debugtoken } = process.env;
const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent
]});

client.commands = new Collection();

const { setTagData } = require(path.join(__dirname, 'data', 'js', 'tags.js'));
setTagData()

const foldersPath = path.join(__dirname, 'commands'); // ./commands
const commandFolders = fs.readdirSync(foldersPath); // ./commands/*

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder); // ./command/*/
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // list of all @ ./commands/*/*.js
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file); // ./commands/*/*.js
		const command = require(filePath); // import file contents
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command); // add as a command
		} else {
			console.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`); // otherwise warn
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
