import {Client as DiscordClient, GatewayIntentBits, Partials} from "discord.js";

export async function registerDiscord(): Promise<DiscordClient> {
    if (process.env.discord === undefined) {
        throw new Error("No discord token provided");
    }
    const client = new DiscordClient({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildModeration,
            GatewayIntentBits.GuildEmojisAndStickers,
            GatewayIntentBits.GuildIntegrations,
            GatewayIntentBits.GuildWebhooks,
            GatewayIntentBits.GuildInvites,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            // GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.GuildMessageReactions
            // GatewayIntentBits.DirectMessageTyping
        ],
        partials: [Partials.User, Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction]
    });
    await client.once('ready', async () => {
        console.log("Discord is ready");
    });
    await client.login(process.env.discord);
    await client.user?.setStatus('dnd');
    console.log("Connected to discord");
    return client;
}
