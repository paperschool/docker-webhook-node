import Commander, { Command } from "commander";

import server from "./server";
import project from "./project";
import login from "./login";
import timeout from "./timeout";
import print from "./print";
import reset from "./reset";

export const setupCommands = (rootCommand: Commander.Command) => {
    [
        server,
        project,
        login,
        timeout,
        print,
        reset
    ].map((newCommand: Command) => rootCommand.addCommand(newCommand))
}
