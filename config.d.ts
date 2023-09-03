export interface AppConfig {
    users: string[],
    guildId: string,
    categoryId: string,
    channelId: string,
    msgId: string,
    announcementChannelId: string,
    loggingChannelId: string
}

export interface AppData {
    users: User[]
}

interface User {
    name: string,
    isOnline: boolean,
    channelId?: string | null,
    msgId?: string | null,
    emoteId?: string | null,
    roleId?: string | null,
    games: string[],
    gameId?: number | null,
    gameName?: string | null,
    gameIcon?: string | null,
    gameDate?: Date | null,
    title?: string | null,
    icon?: string | null,
    startDate?: Date | null
}
