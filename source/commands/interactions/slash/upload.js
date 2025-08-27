const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const path = require('node:path');
const fs = require('node:fs/promises');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('upload')
		.setDescription('[dev] upload a file to discord')
		.addStringOption(option =>
			option.setName('path')
				.setDescription('path to file (from src)')
				.setRequired(true)
		),
	devonly: true,
    async execute(interaction){
        const filePath = interaction.options.getString('path');
        const fullPath = path.join(__dirname, '..', '..', '..', filePath);

        const filter = filePath.toLowerCase()
        if (filter.includes('config') || filter.includes('env')) {
            interaction.reply({content: 'Cannot upload that file.', flags: MessageFlags.Ephemeral});
            return
        }
        
        try {
            const fileBuffer = await fs.readFile(fullPath);
            await interaction.reply({ files: [{ attachment: fileBuffer, name: path.basename(fullPath) }] });
        } catch (error) {
            console.error(`Failed to upload file: ${error}`);
            await interaction.reply({ content: `Error uploading file: ${error.message}`, flags: MessageFlags.Ephemeral });
        }
    }
}