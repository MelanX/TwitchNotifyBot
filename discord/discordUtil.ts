import {
    CategoryChannel,
    Client as DiscordClient, Guild, Permissions, Snowflake, TextChannel
} from "discord.js";
import * as files from "../dataUtils";
import {getProfileImage} from "../twitch/twitchBot";
import {discord, twitch as twitchClient} from "../index";
import {User} from "../config";

export async function refreshData(discord: DiscordClient) {
    const config = files.getConfig();
    const guild = await discord.guilds.fetch(config.guildId);
    const appData = files.getAppData();
    for (const user of appData.users) {
        console.log("Looking for " + user.name)
        if (user.roleId == null) {
            const role = await guild.roles.cache.find(r => r.name.toLowerCase() == user.name.toLowerCase());
            if (role != null) {
                user.roleId = role.id;
            } else {
                const newRole = await guild.roles.create({
                    name: user.name,
                    mentionable: true
                });
                user.roleId = newRole.id;
            }
        }

        if (user.emoteId == null) {
            const emote = await guild.emojis.cache.find(e => e.name.toLowerCase() == user.name.toLowerCase());
            if (emote != null) {
                user.emoteId = emote.id;
            } else {
                // @ts-ignore
                const image: string = await getProfileImage(twitchClient, user.name);
                if (image != null) {
                    const newEmote = await guild.emojis.create(image, user.name)
                    user.emoteId = newEmote.id;
                } else {
                    console.log('Could not find an image for ' + user.name);
                }
            }

            const channel = await textChannel(discord, config.channelId);
            const msg = await channel.messages.fetch(config.msgId);
            const reaction = await msg.reactions.cache.find(emote => emote.emoji.name.toLowerCase() == user.name.toLowerCase());
            if (reaction == null) {
                const emote = await guild.emojis.cache.find(e => e.name.toLowerCase() == user.name.toLowerCase());
                await msg.react(emote);
            }
        }

        if (user.channelId == null) {
            const channel = await guild.channels.cache.find(channel => channel.name.toLowerCase() == user.name.toLowerCase());
            if (channel != null) {
                user.channelId = channel.id;
            } else {
                const category = await guildCategory(discord, config.categoryId);
                const newChannel = await guild.channels.create(user.name, {
                    permissionOverwrites: [
                        {
                            deny: Permissions.ALL,
                            id: guild.roles.everyone
                        },
                        {
                            allow: [
                                Permissions.FLAGS.VIEW_CHANNEL
                            ],
                            deny: [
                                Permissions.FLAGS.SEND_MESSAGES
                            ],
                            id: user.roleId
                        }
                    ],
                    parent: category,
                    type: "GUILD_TEXT"
                });
                user.channelId = newChannel.id;
            }
        }
    }
    console.log('Writing new data');
    files.setAppData(appData);
}

export async function textChannel(discord: DiscordClient, id: Snowflake | undefined): Promise<TextChannel> {
    if (id === undefined) {
        throw new Error("No channel given");
    }

    const channel = await discord.channels.fetch(id);
    if (channel == null) {
        throw new Error("Discord channel not found: " + channel);
    }

    if (channel.type != "GUILD_TEXT") {
        throw new Error("Discord channel is not a text channel: " + channel);
    }

    return channel as TextChannel;
}

export async function guildCategory(discord: DiscordClient, id: Snowflake | undefined): Promise<CategoryChannel> {
    if (id === undefined) {
        throw new Error("No channel given");
    }

    const channel = await discord.channels.fetch(id);
    if (channel == null) {
        throw new Error("Discord channel not found: " + channel);
    }

    if (channel.type != "GUILD_CATEGORY") {
        throw new Error("Discord channel is not a guild category: " + channel);
    }

    return channel as CategoryChannel;
}

export async function sendMessage(user: User): Promise<Snowflake> {
    const guild = await discord.guilds.fetch(files.getConfig().guildId);
    const channel = await textChannel(discord, user.channelId);
    const s = await makeMessage(guild, user);
    const msg = await channel.send(s);

    return msg.id;
}

export async function editMessage(user: User): Promise<void> {
    const guild = await discord.guilds.fetch(files.getConfig().guildId);
    const channel = await textChannel(discord, user.channelId);
    const msg = await channel.messages.fetch(user.msgId);
    const s = await makeMessage(guild, user);
    await msg.edit(s);
}

export async function removeMessage(user: User): Promise<void> {
    const channel = await textChannel(discord, user.channelId);
    const msg = await channel.messages.fetch(user.msgId);
    await msg.delete();
}

export async function makeMessage(guild: Guild, user: User): Promise<string> {
    const role = await guild.roles.fetch(user.roleId);
    return `${role} ist nun online mit **${user.gameName}**!\nhttps://www.twitch.tv/${user.name}`;
}
