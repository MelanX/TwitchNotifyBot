import {Client as DiscordClient, Guild, GuildMember, Message, MessageReaction, PartialUser, User} from "discord.js";
import * as files from "../dataUtils";
import {refreshData, textChannel} from "./discordUtil";

export async function startDiscordBot(discord: DiscordClient, newUsersString: string[]) {
    await refreshData(discord);
    discord.setMaxListeners(0);

    const config = files.getConfig();
    const guild = await discord.guilds.fetch(config.guildId);
    const channel = await textChannel(discord, config.channelId);
    const message = await channel.messages.fetch(config.msgId);

    const formattedRolesPromises = [];
    const removedUsers = [];
    const existingUsers = files.getConfig().users;
    const cachedUsers = files.getAppData().users;
    for (const cachedUser of cachedUsers) {
        if (cachedUser.emoteId != null) {
            await onReaction(discord, guild, message, cachedUser.emoteId, cachedUser.roleId);
        } else {
            console.warn(`Emote ID for ${cachedUser.name} is ${cachedUser.emoteId}`);
        }

        if (newUsersString.length > 0) {
            const matchingUser = newUsersString.find(item => item.toLowerCase() === cachedUser.name.toLowerCase());
            if (matchingUser) {
                const role = await guild.roles.fetch(cachedUser.roleId);
                formattedRolesPromises.push(`- ${role}`);
            }
        }

        const removedUser = !existingUsers.some(item => item.toLowerCase() === cachedUser.name.toLowerCase());
        if (removedUser) {
            removedUsers.push(cachedUser.name);
        }
    }

    let announcement = "";
    if (newUsersString.length > 0) {
        const formattedRoles = await Promise.all(formattedRolesPromises);
        announcement += `### Neue StreamerInnen\n\n${formattedRoles.join('\n')}\n\n`;
    }

    if (removedUsers.length > 0) {
        announcement += `### Entfernte StreamerInnen\n\n${removedUsers.map(item => `- ${item}`).join('\n')}`
    }

    if (announcement != "") {
        const announcementChannel = await textChannel(discord, config.announcementChannelId);
        await announcementChannel.send(announcement);
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
