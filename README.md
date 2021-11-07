# Twitch Notify Bot
A discord bot which notifies users on a server that specific streamers are live on Twitch.

Here you can find the server where this bot is running
![Discord Server](https://discord.com/widget?id=588791705101139979&theme=dark)

Requires a file `tokens.env` with the following data:

| Key       | Entry                  |
|-----------|------------------------|
| `twitch`  | OAuth token for twitch |
| `discord` | Bot secret key         |

---
The config in `data.config.json` should look like this:
```json
{
  "users": [
    "MelanX",
    "BTE_Germany",
    "CastCrafter",
    "Clym",
    "cpw",
    "derNiklaas",
    "RGBPixl",
    "Skate702",
    "Syncopsta",
    "Trojaner",
    "Zombey"
  ],
  "guildId": "418741548226838560",
  "categoryId": "906959168160825375",
  "channelId": "554216244438499350",
  "msgId": "596751004469428232"
}
```
| Key          | Entry                                                         |
|--------------|---------------------------------------------------------------|
| `users`      | An array with the name of the streamers                       |
| `guildId`    | The ID of the guild where the bot is active                   |
| `categoryId` | The ID of the category for the text channels                  |
| `channelId`  | The ID of the channel with the message to react for the roles |
| `msgId`      | The ID of the message with the reactions                      |
---
Before you start the bot, please create `data/app_data.json` if not existing. It should only contain this:
```json
{}
```
---
To add users for notification, you just have to add them to the `users` array in the `config.json`.
Roles, emotes, and channels will be created automatically.
