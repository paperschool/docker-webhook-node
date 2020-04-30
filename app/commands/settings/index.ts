import Commander, { Command } from "commander";

import setConfigPath from "./setConfigPath";

const settings: Commander.Command = new Command("settings");

settings.addCommand(setConfigPath);

export default settings;