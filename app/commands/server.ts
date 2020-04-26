import Commander, { Command } from "commander";
import webhookServer from "../webhook"

const server: Commander.Command = new Command("server")
    .command("server")
    .description("Start Docker Webhook Listening Server.")
    .action(() => {
        webhookServer();
    })

export default server;