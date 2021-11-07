import {getTokenInfo, StaticAuthProvider} from "@twurple/auth";
import {ApiClient} from "@twurple/api";

export async function registerTwitch(): Promise<ApiClient> {
    if (process.env.twitch === undefined) {
        throw new Error("No twitch token provided");
    }

    const tokenInfo = await getTokenInfo(process.env.twitch);
    const authProvider = new StaticAuthProvider(tokenInfo.clientId, process.env.twitch, tokenInfo.scopes);
    return new ApiClient({authProvider});
}
