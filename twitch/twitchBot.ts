import {ApiClient, HelixPaginatedResult, HelixStream, HelixUser} from "@twurple/api";
import * as files from "../dataUtils";
import {editMessage, logMessage, removeMessage, sendMessage} from "../discord/discordUtil";
import axios from "axios";

export async function startTwitchBot(twitch: ApiClient): Promise<void> {
    console.log("Started twitch bot.");

    setInterval(async () => {
        await lookingForStreamers(twitch);
    }, 1000 * 20);
}

export async function getProfileImage(twitch: ApiClient, streamer: string): Promise<string | ArrayBuffer> {
    const user = await twitch.users.getUserByName(streamer);

    if (!(user instanceof HelixUser)) {
        return undefined;
    }

    const url = user.profilePictureUrl;
    const image = await axios.get(url, {responseType: 'arraybuffer'});
    return Buffer.from(image.data);
}

async function lookingForStreamers(twitch: ApiClient) {
    twitch.streams.getStreams({userName: files.getConfig().users}).then(async (streams: HelixPaginatedResult<HelixStream>) => {
        const appData = files.getAppData();
        const prevOnline = getPrevOnlinePlayers();
        for (const stream of streams.data) {
            for (let i = 0; i < appData.users.length; i++) {
                const user = appData.users[i];
                if (stream.userName.toLowerCase() === user.name.toLowerCase()) {
                    if (!user.isOnline) {
                        user.isOnline = true;
                        user.gameId = stream.gameId !== "" ? Number(stream.gameId) : null;
                        user.gameName = stream.gameName;
                        user.gameIcon = (await stream.getGame()).boxArtUrl
                            .replace('{width}', '138')
                            .replace('{height}', '190');
                        user.gameDate = new Date();
                        user.title = stream.title;
                        user.icon = (await stream.getUser()).profilePictureUrl;
                        user.msgId = await sendMessage(user);
                        user.startDate = stream.startDate;

                        await logMessage(`${user.name} is now online with ${stream.gameName}`)
                    } else {
                        if (String(user.gameId) !== stream.gameId) {
                            await logMessage(`${user.name} changed game from \`${user.gameName}\` to \`${stream.gameName}\``);
                            user.games.push(`${user.gameName}`);
                            user.gameId = stream.gameId !== "" ? Number(stream.gameId) : null;
                            user.gameName = stream.gameName;
                            user.gameIcon = (await stream.getGame()).boxArtUrl
                                .replace('{width}', '138')
                                .replace('{height}', '190');
                            user.gameDate = new Date();
                            await editMessage(user);
                        }

                        if (user.title !== stream.title) {
                            await logMessage(`${user.name} changed title from \`${user.title}\` to \`${stream.title}\``);
                            user.title = stream.title;
                            await editMessage(user);
                        }
                    }
                    appData.users[i] = user;
                    const index = prevOnline.indexOf(user.name.toLowerCase(), 0);
                    if (index > -1) {
                        prevOnline.splice(index, 1);
                    }
                }
            }
        }

        for (const prevOnlineUser of prevOnline) {
            if (prevOnlineUser !== undefined) {
                for (let i = 0; i < appData.users.length; i++) {
                    const user = appData.users[i];
                    if (prevOnlineUser.toLowerCase() === user.name.toLowerCase() && user.isOnline) {
                        user.isOnline = false;
                        user.games = [];
                        user.gameId = null;
                        user.gameName = null;
                        user.gameIcon = null;
                        user.gameDate = null;
                        user.title = null;
                        user.icon = null;
                        user.startDate = null;
                        await removeMessage(user);
                        user.msgId = null;
                        await logMessage(`${user.name} stopped streaming`);
                    }
                }
            }
        }
        files.setAppData(appData);
    });
}

function getPrevOnlinePlayers(): string[] {
    const players = [];
    for (const user of files.getAppData().users) {
        if (user.isOnline) {
            players.push(user.name.toLowerCase());
        }
    }

    return players;
}
