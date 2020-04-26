import Commander, { Command } from "commander";
import { resetCredentials } from "../../config";


const attemptExistingLogin: Commander.Command = new Command("reset")
    .command("reset")
    .description("Delete Login Credentials from Config File")
    .action(() => {
        resetCredentials();
        console.red("Stored Login Credentials Deleted.")

    })

export default attemptExistingLogin;