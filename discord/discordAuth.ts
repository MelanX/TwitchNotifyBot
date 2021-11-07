import {Client as DiscordClient} from "discord.js";

export async function registerDiscord(): Promise<DiscordClient> {
    if (process.env.discord === undefined) {
        throw new Error("No discord token provided");
    }
    const client = new DiscordClient({
        intents: [
            'GUILDS',
            'GUILD_MEMBERS',
            'GUILD_BANS',
            'GUILD_EMOJIS_AND_STICKERS',
            'GUILD_INTEGRATIONS',
            'GUILD_WEBHOOKS',
            'GUILD_INVITES',
            'GUILD_VOICE_STATES',
            'GUILD_PRESENCES',
            'GUILD_MESSAGES',
            'GUILD_MESSAGE_REACTIONS',
            // 'GUILD_MESSAGE_TYPING',
            'DIRECT_MESSAGES',
            'DIRECT_MESSAGE_REACTIONS',
            // 'DIRECT_MESSAGE_TYPING'
        ],
        partials: ["CHANNEL", "MESSAGE", "REACTION", "GUILD_MEMBER", "USER"]
    });
    await client.once('ready', async () => {
        console.log("Discord is ready");
    });
    await client.login(process.env.discord);
    await client.user?.setStatus('dnd');
    console.log("Connected to discord");
    return client;
}
