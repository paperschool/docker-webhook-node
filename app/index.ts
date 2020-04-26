import Commander, { Command } from "commander";
import os from "os";
import {
    setupCommands
} from "./commands";
import { get, set } from "./settings";
import inquirer from "inquirer";
import serverLogger from "./serverLogger";

serverLogger();

const app: Commander.Command = new Command()

app.version("0.0.1");

if (!get("configPath")) {
    console.red("Config Location Not Set!")
    inquirer.prompt([
        {
            type: 'input',
            name: "configPath",
            message: "New Config Path (~/path/to/config) :"
        }
    ]).then(({ configPath }: any) => {

        let newConfigPath = configPath || process.cwd()

        set({ configPath: newConfigPath.replace("~", os.homedir()) })
        setupCommands(app);
        app.parse(process.argv);
    })
} else {
    setupCommands(app);
    app.parse(process.argv);
}
