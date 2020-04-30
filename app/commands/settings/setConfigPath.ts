import Commander, { Command } from "commander";
import sanitiseConfigPath from "./sanitiseConfigPath";
import inquirer from "inquirer";
import { set } from "../../settings";
import {
    move
} from "../../config";

const attempt: Commander.Command = new Command("config-path")
    .command("config-path")
    .description("Set Path for Config File")
    .action(() => {

        inquirer.prompt([
            {
                type: 'input',
                name: "configPath",
                message: "New Config Path (~/path/to/config) :"
            }
        ]).then(({ configPath }: any) => {
            if (configPath) {
                const sanitisedConfigPath = sanitiseConfigPath(configPath)
                if (move(sanitisedConfigPath)) {
                    set({ configPath: sanitisedConfigPath })
                }
            }
        })
    })

export default attempt;