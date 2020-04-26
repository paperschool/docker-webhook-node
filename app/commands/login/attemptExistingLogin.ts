import Commander, { Command } from "commander";
import {
    login as dockerLogin
} from "../../docker";
import { getCredentials } from "../../config";


const attemptExistingLogin: Commander.Command = new Command("try")
    .command("try")
    .description("Attempt Docker Login Using Stored Credentials")
    .action(() => {
        const { username, password } = getCredentials();
        console.log(getCredentials())
        if (dockerLogin(username, password)) {
            console.green("Stored Login Credentials Valid!")
        } else {
            console.red("Stored Login Credentials invalid...")
        }
    })

export default attemptExistingLogin;