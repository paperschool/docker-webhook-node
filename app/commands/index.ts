import Commander, { Command } from "commander";

import server from "./server";
import project from "./project";
import dependency from "./dependency";
import login from "./login";
import timeout from "./timeout";
import settings from "./settings";
import print from "./print";
import reset from "./reset";

export const setupCommands = (rootCommand: Commander.Command) => {
    [
        server,
        project,
        dependency,
        login,
        timeout,
        print,
        reset,
        settings
    ].map((newCommand: Command) => rootCommand.addCommand(newCommand))
}
