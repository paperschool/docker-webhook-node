import Commander, { Command } from "commander";
import {
    reset as configReset
} from "../config";

const reset: Commander.Command = new Command("reset")
    .command("reset")
    .description("Reset Entire Webhook Config File.")
    .action(() => {
        configReset();
    })

export default reset;