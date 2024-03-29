# Twitch Notify Bot
A discord bot which notifies users on a server that specific streamers are live on Twitch.

Here you can find the server where this bot is running
[![CastCrafter Server](https://img.shields.io/discord/588791705101139979.svg?color=7289da&label=Twitch%20Notify%20Server&logo=discord&style=flat-square)](https://discord.gg/x45r3a9)

Requires a file `tokens.env` with the following data:

| Key       | Entry                  |
|-----------|------------------------|
| `twitch`  | OAuth token for twitch |
| `discord` | Bot secret key         |

---
The config in `data/config.json` should look like this:
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
  "msgId": "596751004469428232",
  "loggingChannelId": "1147943749008248902"
}
```
| Key                     | Entry                                                         |
|-------------------------|---------------------------------------------------------------|
| `users`                 | An array with the name of the streamers                       |
| `guildId`               | The ID of the guild where the bot is active                   |
| `categoryId`            | The ID of the category for the text channels                  |
| `channelId`             | The ID of the channel with the message to react for the roles |
| `msgId`                 | The ID of the message with the reactions                      |
| `announcementChannelId` | The ID of the announcement channel from the server            |
| `loggingChannelId`      | The ID of the logging channel from the server                 |
---
Before you start the bot, please create `data/app_data.json` if not existing. It should only contain this:
```json
{}
```
---
To add users for notification, you just have to add them to the `users` array in the `config.json`.
Roles, emotes, and channels will be created automatically.
