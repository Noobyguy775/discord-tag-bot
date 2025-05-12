# unnamed tag bot

a simple, fast tag bot
> [!NOTE]
> This bot is still in development; there may be vulnerabilities or unpatched bugs

> [!WARNING]
> There are still a few issues if you host it yourself, you will need to manually edit these (application emojis, etc.)

## Customization

To edit tags, edit `data/tags.json`. You can use the tags already present in this repo as an example.

## Hosting

you can simply use the files in this repo for your own projects by doing the following:

- uploading the files in this repository to your host
- editing `data/tags.json` to include your tags
- adding a `config.json` like so:

```json
{
    "token": "BOT_TOKEN",
    "clientId": "APPLICATION_ID",
    "ownerId": "YOUR_ID"
}
```

- run `deploycommands.js`
- keep `index.js` alive and your bot should reply to messages
- make sure you have guild members and message intents set

### Debugging

You can also set these in `config.json` (for debugging)

- `debug=[boolean]` (uses the following instead of the defaults if true):
- `debugtoken=[DEBUG_BOT_TOKEN]`
- `debugclientId=[DEBUG_BOT_APPLICATION_ID]`

## Credits

The autocomplete system was inspired by https://github.com/discordjs/discord-utils-bot. Credits are in the files that the systems are used in.
