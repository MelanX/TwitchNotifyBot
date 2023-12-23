import * as fs from "fs";
import {AppConfig, AppData, User} from "./config";

const folder = 'data';
const appData = folder + '/app_data.json';
const appConfig = folder + '/config.json';

export const createMissingFiles = (): void => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }

    if (!fs.existsSync(appData)) {
        fs.writeFileSync(appData, '{}')
    }

    if (!fs.existsSync(appConfig)) {
        fs.writeFileSync(appConfig, '{"users": ["MelanX", "BTE_Germany", "CastCrafter", "Clym", "cpw", "derNiklaas", "RGBPixl", "Skate702", "Syncopsta", "Trojaner", "Zombey"], "guildId": "418741548226838560", "categoryId": "906959168160825375", "channelId": "554216244438499350", "msgId": "596751004469428232"}')
    }
};

export const getAppData = (): AppData => {
    let parsedData = JSON.parse(fs.readFileSync(appData, {encoding: 'utf-8'}));

    if (parsedData.users) {
        parsedData.users.forEach((user: User) => {
            if (user.gameDate) {
                user.gameDate = new Date(user.gameDate);
            }
            if (user.startDate) {
                user.startDate = new Date(user.startDate);
            }
        });
    }

    return parsedData;
};

export const setAppData = (data: AppData): void => {
    fs.writeFileSync(appData, JSON.stringify(data));
};

export const getConfig = (): AppConfig => {
    return JSON.parse(fs.readFileSync(appConfig, {encoding: 'utf-8'}));
};
