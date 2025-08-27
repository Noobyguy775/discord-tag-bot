const { helpBuilder } = require('@builders/helpBuilder');

module.exports = {
    data: {
      name: 'help-chat',
      type: 'message',
      description: 'Displays a list of commands and bot details.'
    },
    execute(message){
      message.reply(helpBuilder(message.client))
    }
}
