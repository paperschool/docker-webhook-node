import os from "os";

const sanitiseConfigPath = (configPath: string): string => {
    return configPath
        .replace("~", os.homedir())
        .replace("/config.json", "");
}

export default sanitiseConfigPath;