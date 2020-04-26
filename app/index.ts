import Commander, { Command } from "commander";
import {
    setupCommands
} from "./commands";
import serverLogger from "./serverLogger";

serverLogger();

const app: Commander.Command = new Command()

app.version("0.0.1");

setupCommands(app);

app.parse(process.argv);