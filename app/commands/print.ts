import Commander, { Command } from "commander";
import inquirer from "inquirer";
import { find, set } from "../settings";
import {
    print as configPrint
} from "../config";

const print: Commander.Command = new Command("print")
    .command("print")
    .description("Output Current Webhook Config File.")
    .action(() => {
        configPrint();
    })

export default print;