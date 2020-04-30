import fs from "fs";
import path from "path";
import { get as getSetting } from "../settings";

import {
    emptyConfig,
} from "./generators";

export const print = () => {
    console.log(JSON.stringify(open(), null, 4));
}

export const getConfigPath = (configPath?: string): string =>
    path.join(configPath ? configPath : getSetting("configPath"), "config.json");


export const open = (): any => {

    if (!fs.existsSync(getConfigPath())) {
        reset()
    }
    return JSON.parse(fs.readFileSync(getConfigPath(), 'utf8'));
}

export const move = (newConfigLocation: string): boolean => {
    const oldConfigPath = getConfigPath()
    const newConfigPath = getConfigPath(newConfigLocation)

    try {
        if (!fs.existsSync(newConfigLocation)) {
            fs.mkdirSync(newConfigLocation)
        }
        fs.copyFileSync(oldConfigPath, newConfigPath)
        fs.unlinkSync(oldConfigPath)
        return true;
    } catch (e) {
        console.red(e)
        return false;
    }
}

export const reset = (): any => {
    console.green("Writing New Config...")
    write(emptyConfig())
}

export const write = (config: any): boolean => {
    try {
        fs.writeFileSync(getConfigPath(), JSON.stringify(config, null, 4), 'ascii')
        return true;
    } catch {
        return false;
    }
}