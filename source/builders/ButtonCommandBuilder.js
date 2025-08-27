/**
 * @description Used for building button interactions for easy reusal
 * To use: Call `new ButtonCommandBuilder(name, description)` in the command file
 */
class ButtonCommandBuilder { 
    constructor(name='', description='', label='') {
        this.type = 'Button';
        if (name) {
            this.name = this.setName(name);
        }
        if (description) {
            this.description = this.setDescription(description);
        }
        if (label) {
            this.label = this.setLabel(label);
        }
    }

    /**
     * Set the name & customID of the button (used internally)
     * @param {string} description (max 100 char)
     * @returns this
     * @see {@link https://discord.com/developers/docs/components/reference#button}
    */
    setName(name) {
        this.stringValidation(name, 100);

        this.customID = this.name = name;
        return this;
    }

    /**
     * Set a description for the button: used internally in !help
     * @param {string} description 
     * @returns this
    */
    setDescription(description) {
        this.stringValidation(description)

        this.description = description;
        return this;
    }

    /**
     * Set a label for the button
     * @param {string} label - MAX 80 characters
     * @see {@link https://discord.com/developers/docs/components/reference#button}
     * @returns this
    */
    setLabel(label){
        this.stringValidation(label, 80)

        this.label = label;
        return this;
    }

    /**
     * Loads the button using ButtonBuilder for use in the data field of a command
     * @see {@link https://discord.js.org/docs/packages/builders/main/ButtonBuilder:TypeAlias}
     * @returns ButtonBuilder
     */
    static loadButton(client, customId){
        const data = client.buttons.get(customId).data;
        const { ButtonBuilder, ButtonStyle } = require('discord.js')

        try {
            const buttonData = new ButtonBuilder()
                .setCustomId(data.name)
                .setLabel(data.label)
                .setStyle(data.style || ButtonStyle.Primary)
                .setDisabled(data.disabled || false)

            if (data.emoji){
                buttonData.setEmoji(data.emoji);
            }

            return buttonData;
        } catch (e) {
            throw new Error(`[@data/button.js] Failed to load button: ${e.message}`)
        }
    }

    /**
     * Converts the button to a JSON object with data for client.commands
     * @returns {Object|null}
     */
    toJSON(){
        if (!this.requiredProps()) return null;
        return {
            ...this
        };
    }

    requiredProps(){
        const required = ['name', 'description', 'label']
        for (const prop of required) {
            if (!this.hasOwnProperty(prop))
                this.error(`Missing required property: ${prop}. Try using the 'set${prop}' method`)
        }
        return true;
    }

    error(text) {
        throw new Error(`[@data/button.js] ${text}`)
    }
    
    stringValidation(str, length = null) {
        if (typeof str !== 'string')
            this.error(`Expected a string, got a ${typeof str} for ${str}`);
        if (length && str.length > length)
            this.error(`String length exceeds ${length} characters: ${str}`);

        return str;
    }
}

module.exports = {
    ButtonCommandBuilder
}