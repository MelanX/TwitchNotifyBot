require('dotenv').config({path: 'tokens.env'});

import {ApiClient} from "@twurple/api";
import {Client as DiscordClient} from "discord.js";
import * as twitchBot from "./twitch/twitchBot";
import * as twitchAuth from "./twitch/twitchAuth";
import * as discordBot from "./discord/discordBot";
import * as discordAuth from "./discord/discordAuth";
import * as files from "./dataUtils";

export let twitch: ApiClient;
export let discord: DiscordClient;

(async () => {
    const appData = files.getAppData();
    if (appData.users === undefined) {
        appData.users = [];
    }

    const cachedUsers = appData.users;
    loop1: for (const user of files.getConfig().users) {
        for (const existingUser of cachedUsers) {
            if (existingUser.name !== undefined && user.toLowerCase() === existingUser.name.toLowerCase()) {
                continue loop1;
            }
        }
        appData.users.push({
            name: user,
            isOnline: false
        });
        console.log(`New user found: ${user}`);
    }
    files.setAppData(appData);

    discord = await discordAuth.registerDiscord();
    twitch = await twitchAuth.registerTwitch();

    while (true) {
        if (discord.isReady()) {
            await discordBot.startDiscordBot(discord);
            break;
        }
    }
    await twitchBot.startTwitchBot(twitch);
})();
