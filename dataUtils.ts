import * as fs from "fs";
import {AppConfig, AppData} from "./config";

const folder = 'data';
const appData = folder + '/app_data.json';
const appConfig = folder + '/config.json';

export const getAppData = (): AppData => {
    return JSON.parse(fs.readFileSync(appData, {encoding: 'utf-8'}));
};

export const setAppData = (data: AppData): void => {
    fs.writeFileSync(appData, JSON.stringify(data));
};

export const getConfig = (): AppConfig => {
    return JSON.parse(fs.readFileSync(appConfig, {encoding: 'utf-8'}));
};
