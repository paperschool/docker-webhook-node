import Commander, { Command } from "commander";
import {
    updateTimeout
} from "../config";

const timeout: Commander.Command = new Command("timeout")
    .command("timeout")
    .requiredOption('-t, --timeout <timeout>', 'Timeout Value in ms')
    .description("Set New TTL on Recently Updated Projects.")
    .action(({ timeout: newTimeout }: any) => {
        updateTimeout(parseInt(newTimeout));
    })

export default timeout;