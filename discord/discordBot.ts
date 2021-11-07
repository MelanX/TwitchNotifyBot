import {
    Client as DiscordClient,
    Guild,
    GuildMember,
    Message,
    MessageReaction,
    PartialUser,
    User
} from "discord.js";
import * as files from "../dataUtils";
import {refreshData, textChannel} from "./discordUtil";

export async function startDiscordBot(discord: DiscordClient) {
    await refreshData(discord);
    discord.setMaxListeners(0);

    const config = files.getConfig();
    const guild = await discord.guilds.fetch(config.guildId);
    const channel = await textChannel(discord, config.channelId);
    const message = await channel.messages.fetch(config.msgId);

    for (const emote of files.getAppData().users) {
        if (emote.emoteId != null) {
            await onReaction(discord, guild, message, emote.emoteId, emote.roleId);
        } else {
            console.warn(`Emote ID for ${emote.name} is ${emote.emoteId}`);
        }
    }
}

async function onReaction(discord: DiscordClient, guild: Guild, roleMessage: Message, emote: string, roleId: string) {
    const role = await guild.roles.fetch(roleId);

    if (role === undefined) {
        console.log("Role not found: " + roleId);
    } else {
        discord.on('messageReactionAdd', async (reaction: MessageReaction, user: User | PartialUser) => {
            if (emote === reaction.emoji.id && reaction.message.id === roleMessage.id && reaction.message.guild !== null) {
                let member: GuildMember = await reaction.message.guild.members.fetch(user.id);
                await member.roles.add(role.id);
            }
        });

        discord.on('messageReactionRemove', async (reaction: MessageReaction, user: User | PartialUser) => {
            if (emote === reaction.emoji.id && reaction.message.id === roleMessage.id && reaction.message.guild !== null) {
                let member: GuildMember = await reaction.message.guild.members.fetch(user.id);
                await member.roles.remove(role.id);
            }
        });
    }
}
