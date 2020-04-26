import fs from "fs";
import path from "path";

const settingsPath = path.resolve(__dirname, "settings.json");

type Settings = {
    configPath: string
}

export const find = (setting: string): boolean => {
    const settings = open();
    return typeof settings[setting] !== "undefined";
}

export const set = (setting: {}) => {
    const settings = open();

    const newSettings = {
        ...settings,
        ...setting
    }

    write(newSettings);
}

export const get = (setting: string): any => {
    const settings = open();

    return settings[setting];
}

const open = (): any => {
    if (!fs.existsSync(settingsPath)) {
        write({ configPath: undefined });
    }
    return JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
}

const write = (config: Settings): boolean => {
    try {
        fs.writeFileSync(settingsPath, JSON.stringify(config, null, 4), 'ascii')
        return true;
    } catch (e) {
        console.server(e)
        return false;
    }
}