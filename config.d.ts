export interface AppConfig {
    users: string[],
    guildId: string,
    categoryId: string,
    channelId: string,
    msgId: string,
    announcementChannelId: string
}

export interface AppData {
    users: User[]
}

interface User {
    name: string,
    isOnline: boolean,
    gameId?: number | null,
    gameName?: string | null,
    channelId?: string | null,
    msgId?: string | null,
    emoteId?: string | null,
    roleId?: string | null
}
